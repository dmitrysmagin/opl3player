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

    #samplesBuffer: Float32Array | null = null;
    sampleRate: number | null = null;
    #chunkSize = 0;

    #registerBank0: Uint8Array | null = null;
    #registerBank1: Uint8Array | null = null;
    postMessage: (msg: any) => void;

    #elapsedFrames = 0;

    get elapsedSeconds(): number {
        return this.#elapsedFrames / (this.sampleRate || 48000);
    }

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
                this.postMessage?.({ cmd: "metadata", value: {
                    type: this.format.gettype(),
                    title: this.format.gettitle(),
                    author: this.format.getauthor(),
                    desc: this.format.getdesc(),
                }});

                opl.init();
            }

            this.#samplesBuffer = new Float32Array(2);
            this.sampleRate = this.#options.sampleRate || 48000;
            this.#chunkSize = 0;
            this.#elapsedFrames = 0;

            // Kick off duration calculation asynchronously so it doesn't block the first audio block
            this.#calcDuration(FormatType, buffer);
        } catch(error) {
            this.format = null;
        }
    }

    #calcDuration(FormatType: any, buffer: Uint8Array) {
        try {
            const nullOpl = { write: () => {}, init: () => {}, read: () => {} };
            const probe = new FormatType(nullOpl, this.#options);
            probe.load(buffer);
            let total = 0;
            let guard = 0;
            const limit = 2_000_000;
            while (guard < limit) {
                const alive = probe.update();
                total += 1 / (probe.getrefresh() || 50);
                guard++;
                if (!alive) break;
            }
            const duration = guard < limit ? total : null;
            this.postMessage?.({ cmd: "duration", value: duration });
        } catch (_) {
            this.postMessage?.({ cmd: "duration", value: null });
        }
    }

    seek(targetSeconds: number) {
        if (!this.format) return;
        this.format.rewind(0);
        let elapsed = 0;
        let guard = 0;
        const limit = 10_000_000;
        while (elapsed < targetSeconds && guard < limit) {
            const alive = this.format.update();
            elapsed += 1 / (this.format.getrefresh() || 50);
            guard++;
            if (!alive) break;
        }
        this.#elapsedFrames = Math.round(elapsed * (this.sampleRate || 48000));
        this.#chunkSize = 0;
    }

    update(outputs) {
        if (!this.format)
            return;

        const blockLength = outputs[0].length;

        // Track where in the block a song loop/end occurred (-1 = no reset this block).
        // Using the frame index lets us count only the frames AFTER the reset,
        // rather than erroneously adding a full blockLength after zeroing mid-loop.
        let resetAtFrame = -1;

        for (let i = 0; i < blockLength; i++) {
            if (this.#chunkSize <= 0) {
                const alive = this.format.update();
                if (!alive) {
                    // Song ended / looped — note the frame index of the reset
                    resetAtFrame = i;
                }
                this.#chunkSize = 2 * ((this.sampleRate / this.format.getrefresh()) | 0);
            }

            this.format.opl.read(this.#samplesBuffer);

            outputs[0][i] = this.#samplesBuffer[0];
            outputs[1][i] = this.#samplesBuffer[1];

            this.#chunkSize -= 2;
        }

        if (resetAtFrame >= 0) {
            // Elapsed restarts from the exact frame where the loop fired
            this.#elapsedFrames = blockLength - resetAtFrame;
        } else {
            this.#elapsedFrames += blockLength;
        }
    }
}

export default WorkletPlayer;
