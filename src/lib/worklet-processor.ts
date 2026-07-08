import { formats } from "./format/registry";
import WorkletPlayer from "./worklet-player";

class WorkletProcessor extends AudioWorkletProcessor {
    player: WorkletPlayer | null = null;
    #totalFrames = 0;
    #framesSinceReport = 0;

    constructor() {
        super();
        this.port.onmessage = (e: MessageEvent) => {
            switch (e.data.cmd) {
                case "init": {
                    this.player = new WorkletPlayer(
                        formats,
                        e.data.options || {},
                        (message) => this.port.postMessage(message)
                    );
                    if (e.data.registerBank0 && e.data.registerBank1) {
                        (this.player as any).setRegisterBuffers?.(e.data.registerBank0, e.data.registerBank1);
                    }
                    break;
                }
                case "load": {
                    this.player?.load(e.data.value);
                    // Calculate duration asynchronously after load
                    this.#calcDuration();
                    break;
                }
                case "seek": {
                    if (this.player) {
                        this.player.rewind();

                        const targetSeconds = e.data.value;
                        let elapsed = 0;
                        let guard = 0;
                        const limit = 10_000_000;

                        while (elapsed < targetSeconds && guard < limit) {
                            const alive = this.player.updateFormat();
                            // Read refresh rate AFTER each update — it changes per tick
                            elapsed += 1 / (this.player.getrefresh() || 50);
                            guard++;
                            if (!alive) break;
                        }

                        this.#totalFrames = Math.round(elapsed * (this.player.sampleRate || 48000));
                    }
                    break;
                }
            }
        }
    }

    #calcDuration() {
        if (!this.player) return;

        try {
            // Use a null-OPL copy so the real OPL chip and SharedArrayBuffer
            // register banks are untouched, and NukedOPL3 write cost is avoided.
            const { formatType: FormatType, buffer, options } = this.player.getFormatInfo();
            if (!FormatType || !buffer) {
                this.port.postMessage({ cmd: "duration", value: null });
                return;
            }

            const nullOpl = { write: () => {}, init: () => {}, read: () => {} };
            const probe = new FormatType(nullOpl, options);
            probe.load(buffer);

            let total = 0;
            let guard = 0;
            const limit = 2_000_000;

            while (guard < limit) {
                const alive = probe.update();
                // Read refresh rate AFTER each update — it changes per tick
                total += 1 / (probe.getrefresh() || 50);
                guard++;
                if (!alive) break;
            }

            const duration = guard < limit ? total : null;
            this.port.postMessage({ cmd: "duration", value: duration });
        } catch (_) {
            this.port.postMessage({ cmd: "duration", value: null });
        }
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
        const blockLength = outputs[0]?.[0]?.length ?? 128;

        if (this.player) {
            const songEnded = this.player.update(outputs[0]);
            if (songEnded) {
                // Song looped back to the start — reset elapsed counter and
                // explicitly rewind so OPL registers are in a clean state.
                this.#totalFrames = 0;
                this.player.rewind();
            }
        }

        this.#totalFrames += blockLength;
        this.#framesSinceReport += blockLength;

        if (this.#framesSinceReport >= 2048) {
            this.#framesSinceReport = 0;
            const currentTime = this.#totalFrames / (this.player?.sampleRate || 48000);
            this.port.postMessage({
                cmd: "currentTime",
                value: {
                    currentFrame: this.#totalFrames,
                    currentTime,
                    elapsed: currentTime,
                },
            });
        }

        return true;
    }
}

registerProcessor("opl3-generator", WorkletProcessor);
