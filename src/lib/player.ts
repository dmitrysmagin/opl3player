//
// The main thread part of the Player running in a browser context
//

// included as text string with rollup-plugin-string
import processor from "./opl3-worklet.js?raw";

class Player extends EventTarget {
    #options: Record<string, any> = {};

    opl3module = null; // source of opl3.js
    audioContext: AudioContext | null = null;
    worklet: AudioWorkletNode | null = null;

    registerBank0: Uint8Array | null = null;
    registerBank1: Uint8Array | null = null;

    #initBusy = false;

    constructor(options: Record<string, any>) {
        super();

        this.#options = options || {};
    }

    #wrappedCallbacks = new Map<(...args: any[]) => void, (e: Event) => void>();

    on(event: string, callback: (...args: any[]) => void) {
        const wrapped = (e: Event) => callback((e as CustomEvent).detail);
        this.#wrappedCallbacks.set(callback, wrapped);
        this.addEventListener(event, wrapped);
    }

    off(event: string, callback: (...args: any[]) => void) {
        const wrapped = this.#wrappedCallbacks.get(callback);
        if (wrapped) {
            this.removeEventListener(event, wrapped);
            this.#wrappedCallbacks.delete(callback);
        }
    }

    #emit(event, value) {
        this.dispatchEvent(new CustomEvent(event, { detail: value }));
    }

    async initContext() {
        if (this.#initBusy) return;
        this.#initBusy = true;

        try {
            const blob = new Blob([processor], { type: 'application/javascript' });
            const objectURL = URL.createObjectURL(blob);

            this.audioContext = new AudioContext({
                sampleRate: this.#options.sampleRate || 48000,
            });
            await this.audioContext.audioWorklet.addModule(objectURL);
            URL.revokeObjectURL(objectURL);

            this.worklet = new AudioWorkletNode(this.audioContext, "opl3-generator", {
                numberOfOutputs: 1,
                outputChannelCount : [2]
            });

            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = 4;
            gainNode.connect(this.audioContext.destination);

            const regsAB0 = new SharedArrayBuffer(256);
            const regsAB1 = new SharedArrayBuffer(256);
            this.registerBank0 = new Uint8Array(regsAB0);
            this.registerBank1 = new Uint8Array(regsAB1);

            this.worklet.port.postMessage({
                cmd: 'init',
                value: null,
                options: this.#options,
                registerBank0: regsAB0,
                registerBank1: regsAB1,
            });

            this.worklet.port.onmessage = (e) => {
                this.#emit(e.data.cmd, e.data.value);
                // Also emit under a specific name for metadata
                if (e.data.cmd === 'metadata') {
                    this.#emit('load', e.data.value);
                }
            };
            this.worklet.connect(gainNode);
        } finally {
            this.#initBusy = false;
        }
    }

    play(buffer: ArrayBuffer | Uint8Array) {
        this.load(buffer);
    }

    pause() {
        this.audioContext?.suspend();
    }

    resume() {
        this.audioContext?.resume();
    }

    stop() {
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        this.worklet = null;
        this.registerBank0 = null;
        this.registerBank1 = null;
    }

    async load(buffer: ArrayBuffer | Uint8Array) {
        if (!this.audioContext || !this.worklet) {
            await this.initContext();
        }

        this.worklet?.port.postMessage({ cmd: 'load', value: buffer });
    }
}

export default Player;
