import { formats } from "./format/registry";
import WorkletPlayer from "./worklet-player";

class WorkletProcessor extends AudioWorkletProcessor {
    player: any = null;
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
                        this.player.setRegisterBuffers(e.data.registerBank0, e.data.registerBank1);
                    }
                    break;
                }
                case "load": {
                    this.player.load(e.data.value);
                    break;
                }
                case "seek": {
                    this.player?.seek(e.data.value);
                    break;
                }
            }
        }
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
        if (this.player) {
            this.player.update(outputs[0]);
        }

        // Throttle currentTime messages to ~23 Hz (every 2048 frames at 48 kHz)
        const blockLength = outputs[0]?.[0]?.length ?? 128;
        this.#framesSinceReport += blockLength;
        if (this.#framesSinceReport >= 2048) {
            this.#framesSinceReport = 0;
            this.port.postMessage({
                cmd: "currentTime",
                value: {
                    currentFrame,
                    currentTime,
                    elapsed: this.player?.elapsedSeconds ?? 0,
                },
            });
        }

        return true;
    }
}

registerProcessor("opl3-generator", WorkletProcessor);
