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
                    break;
                }
                case "seek": {
                    this.player?.seek(e.data.value);
                    this.#totalFrames = e.data.value;
                    break;
                }
            }
        }
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
        if (this.player) {
            this.player.update(outputs[0]);
        }

        const blockLength = outputs[0]?.[0]?.length ?? 128;
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
