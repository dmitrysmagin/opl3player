// To be executed inside AudioWorklet in AudioWorkletGlobalScope

import OPL3 from "./opl3";

class WorkletPlayer {
    #options: Record<string, any> = {};
    format: any = null;
    #formats: any[] = [];

    #samplesBuffer: Float32Array | null = null;
    sampleRate: number | null = null; // 48000 for audio worklet
    #chunkSize = 0;

    postMessage: ((msg: any) => void) | null = null;

    #registerBank0: Uint8Array | null = null;
    #registerBank1: Uint8Array | null = null;

    constructor(formats: any[], options: Record<string, any>, postMessage: (msg: any) => void) {
        this.#formats = formats;
        this.postMessage = postMessage;
        this.#options = options || {};
    }

    setRegisterBuffers(bank0: SharedArrayBuffer, bank1: SharedArrayBuffer) {
        this.#registerBank0 = new Uint8Array(bank0);
        this.#registerBank1 = new Uint8Array(bank1);
    }

    detectFormat(buffer /*: ArrayBuffer | Buffer */) {
        for (let format of this.#formats) {
            if (format.probe && format.probe(buffer)) {
                return format;
            }
        }

        return false;
    };

    play() {}
    pause() {}

    load(buffer) { // ArrayBuffer | Uint8Array
        try {
            if (buffer instanceof ArrayBuffer)
                buffer = new Uint8Array(buffer);

            if (!(buffer instanceof Uint8Array))
                throw new Error("Buffer must be either ArrayBuffer or Uint8Buffer");

            const FormatType = this.detectFormat(buffer);
            if (!FormatType)
                throw 'File format not detected';

            const opl = new OPL3();
            if (this.#registerBank0 && this.#registerBank1) {
                const origWrite = opl.write.bind(opl);
                opl.write = (array, address, data) => {
                    origWrite(array, address, data);
                    if (array === 0) {
                        this.#registerBank0![address] = data;
                    } else {
                        this.#registerBank1![address] = data;
                    }
                };
            }
            this.format = new FormatType(opl, this.#options);
            this.format.load(buffer);

            // buffer for 1 frame, L/R
            this.#samplesBuffer = new Float32Array(2);
            this.sampleRate = this.#options.sampleRate || 48000;
            this.#chunkSize = 0;
        } catch(error) {
            this.format = null;
            console.error(error);
        }
    }

    update(outputs: Float32Array[]) {
        if (!this.format || !outputs)
            return;

        for (let i = 0; i < outputs[0].length; i++) {
            if (this.#chunkSize <= 0) {
                this.format.update();
                this.format.getContext && this.postMessage?.({ cmd: "context", value: this.format?.getContext() || 0 })
                this.#chunkSize = 2 * ((this.sampleRate * this.format.refresh()) | 0);

                // Dump OPL3 registers into shared buffers (2 banks × 256 bytes)
                if (this.#registerBank0 && this.#registerBank1) {
                    const regs = this.format.opl.registers;
                    for (let j = 0; j < 256; j++) {
                        this.#registerBank0[j] = regs[j];
                        this.#registerBank1[j] = regs[j + 256];
                    }
                }
            }

            // Read one frame
            this.format.opl.read(this.#samplesBuffer);

            outputs[0][i] = this.#samplesBuffer[0];
            outputs[1][i] = this.#samplesBuffer[1];

            this.#chunkSize -= 2;
        }
    }
}

export default WorkletPlayer;
