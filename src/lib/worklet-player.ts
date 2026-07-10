// To be executed inside AudioWorklet in AudioWorkletGlobalScope

import OPL3Legacy from "./opl3";
import NukedOPL3 from "./nukedopl";

export interface PlayerOptions {
    /** Audio sample rate in Hz (default: 48000) */
    sampleRate?: number;
    /** OPL3 emulator to use: 'legacy' (faster) or 'nuked' (more accurate) (default: 'nuked') */
    emulator?: 'legacy' | 'nuked';
    /** Prebuffer size in milliseconds (default: 3000) */
    prebuffer?: number;
    /** Additional format-specific options */
    [key: string]: any;
}

class WorkletPlayer {
    #options: PlayerOptions = {};
    format: any = null;
    #formats: any[] = [];
    #formatType: any = null;
    #buffer: Uint8Array | null = null;

    #samplesBuffer: Float32Array | null = null;
    sampleRate: number | null = null;
    #chunkSize = 0;

    #registerBank0: Uint8Array | null = null;
    #registerBank1: Uint8Array | null = null;
    postMessage: (msg: any) => void;

    constructor(formats: any[], options: PlayerOptions = {}, postMessage: (msg: any) => void) {
        this.#formats = formats;
        this.postMessage = postMessage;
        this.#options = options;
    }

    setRegisterBuffers(bank0: SharedArrayBuffer, bank1: SharedArrayBuffer) {
        this.#registerBank0 = new Uint8Array(bank0);
        this.#registerBank1 = new Uint8Array(bank1);
    }

    detectFormat(buffer) {
        for (let format of this.#formats) {
            if (format.probe && format.probe(buffer)) {
                return format;
            }
        }
        return false;
    };

    play() {}
    pause() {}

    load(buffer) {
        try {
            if (buffer instanceof ArrayBuffer)
                buffer = new Uint8Array(buffer);

            if (!(buffer instanceof Uint8Array))
                throw new Error("Buffer must be either ArrayBuffer or Uint8Buffer");

            const FormatType = this.detectFormat(buffer);
            if (!FormatType)
                throw 'File format not detected';

            const sampleRate = this.#options.sampleRate || 48000;
            const opl = (this.#options.emulator === 'legacy')
                ? new OPL3Legacy()
                : new NukedOPL3(sampleRate);
            if (this.#registerBank0 && this.#registerBank1) {
                // Clear the shared register banks so a module loaded into an
                // already-running worklet doesn't display stale OPL register
                // values from the previously played module (opl.init() resets
                // the emulator internally but does not go through the wrapped
                // write() that mirrors registers into these banks).
                this.#registerBank0.fill(0);
                this.#registerBank1.fill(0);
                const origWrite = opl.write.bind(opl);
                opl.write = (array, address, data) => {
                    origWrite(array, address, data);
                    if (array === 0) {
                        this.#registerBank0[address] = data;
                    } else {
                        this.#registerBank1[address] = data;
                    }
                };
            }
            this.format = new FormatType(opl, this.#options);
            const loadOk = this.format.load(buffer);

            if (loadOk) {
                // Build metadata with instrument names
                const metadata: Record<string, any> = {
                    type: this.format.gettype(),
                    title: this.format.gettitle(),
                    author: this.format.getauthor(),
                    desc: this.format.getdesc(),
                };

                // Fetch instrument names if available
                const instrumentCount = this.format.getinstruments ? this.format.getinstruments() : 0;
                if (instrumentCount > 0) {
                    metadata.instruments = instrumentCount;
                    for (let i = 0; i < instrumentCount; i++) {
                        const name = this.format.getinstrument(i);
                        if (name) {
                            metadata[`instrument${i}`] = name;
                        }
                    }
                }

                this.postMessage?.({ cmd: "metadata", value: metadata });

                opl.init();
            }

            this.#samplesBuffer = new Float32Array(2);
            this.sampleRate = this.#options.sampleRate || 48000;
            this.#chunkSize = 0;

            // Store format type and buffer for duration calculation by processor
            this.#formatType = FormatType;
            this.#buffer = buffer;
        } catch(error) {
            this.format = null;
        }
    }

    rewind() {
        if (!this.format) return;
        this.format.rewind(0);
        this.#chunkSize = 0;
    }

    getrefresh(): number {
        return this.format?.getrefresh() || 50;
    }

    getloop(): { loopStart: boolean; loopEnd: boolean } {
        return this.format?.getloop() ?? { loopStart: false, loopEnd: false };
    }

    getFormatInfo(): { formatType: any; buffer: Uint8Array | null; options: PlayerOptions } {
        return { formatType: this.#formatType, buffer: this.#buffer, options: this.#options };
    }

    /**
     * Set which OPL3 channels are enabled using a bit mask.
     * @param mask - 18-bit mask where bit N = 1 means channel N is enabled
     */
    setChannelMask(mask: number): void {
        this.format?.opl?.setChannelMask?.(mask);
    }

    updateFormat(): boolean {
        if (!this.format) return false;
        return this.format.update();
    }

    // Returns true if the song looped/ended during this block
    update(outputs): boolean {
        if (!this.format)
            return false;

        const blockLength = outputs[0].length;
        let songEnded = false;

        for (let i = 0; i < blockLength; i++) {
            if (this.#chunkSize <= 0) {
                const alive = this.format.update();
                if (!alive) songEnded = true;
                this.#chunkSize = 2 * ((this.sampleRate / this.format.getrefresh()) | 0);
            }

            this.format.opl.read(this.#samplesBuffer);

            outputs[0][i] = this.#samplesBuffer[0];
            outputs[1][i] = this.#samplesBuffer[1];

            this.#chunkSize -= 2;
        }

        return songEnded;
    }
}

export default WorkletPlayer;
