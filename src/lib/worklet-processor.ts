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
                        // Rewind the format to the beginning
                        this.player.rewind();
                        
                        // Seek to target time by updating the format without generating audio
                        const targetSeconds = e.data.value;
                        let elapsed = 0;
                        let guard = 0;
                        const limit = 10_000_000;
                        const refreshRate = this.player.getrefresh();
                        
                        while (elapsed < targetSeconds && guard < limit) {
                            const alive = this.player.updateFormat();
                            elapsed += 1 / refreshRate;
                            guard++;
                            if (!alive) break;
                        }
                        
                        // Update frame counters to match the seek position
                        const sampleRate = this.player.sampleRate || 48000;
                        const elapsedFrames = Math.round(elapsed * sampleRate);
                        this.#totalFrames = elapsedFrames;
                    }
                    break;
                }
            }
        }
    }

    #calcDuration() {
        if (!this.player) return;
        
        const info = this.player.getFormatInfo?.();
        if (!info || !info.formatType || !info.buffer) return;
        
        try {
            const nullOpl = { write: () => {}, init: () => {}, read: () => {} };
            const probe = new info.formatType(nullOpl, info.options);
            probe.load(info.buffer);
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
            this.port.postMessage({ cmd: "duration", value: duration });
        } catch (_) {
            this.port.postMessage({ cmd: "duration", value: null });
        }
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
        const blockLength = outputs[0]?.[0]?.length ?? 128;
        
        if (this.player) {
            this.player.update(outputs[0]);
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
