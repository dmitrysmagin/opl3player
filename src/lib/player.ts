//
// The main thread part of the Player running in a browser context
//

// included as text string with rollup-plugin-string
import processor from "./opl3-worklet.js?raw";

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

class Player extends EventTarget {
    #options: PlayerOptions = {};

    opl3module = null; // source of opl3.js
    audioContext: AudioContext | null = null;
    worklet: AudioWorkletNode | null = null;

    registerBank0: Uint8Array | null = null;
    registerBank1: Uint8Array | null = null;

    duration: number | null = null;

    #initBusy = false;

    constructor(options: PlayerOptions = {}) {
        super();

        this.#options = options;
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
                if (e.data.cmd === 'duration') {
                    this.duration = e.data.value;
                }
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

    async play(buffer: ArrayBuffer | Uint8Array) {
        this.duration = null;
        return this.load(buffer);
    }

    async pause() {
        await this.audioContext?.suspend();
    }

    async resume() {
        await this.audioContext?.resume();
    }

    stop() {
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        this.worklet = null;
        this.registerBank0 = null;
        this.registerBank1 = null;
        this.duration = null;
    }

    seek(seconds: number) {
        this.worklet?.port.postMessage({ cmd: 'seek', value: seconds });
    }

    async load(buffer: ArrayBuffer | Uint8Array) {
        if (!this.audioContext || !this.worklet) {
            await this.initContext();
        }

        this.worklet?.port.postMessage({ cmd: 'load', value: buffer });
    }
}

export default Player;
