// To be executed inside AudioWorklet in AudioWorkletGlobalScope

import OPL3 from "./opl3";

// Operator offset mapping: register offset -> operator index within a channel
// OPL3 has a non-linear mapping between register addresses and channel/operator pairs
const OPERATOR_OFFSETS = [
    // Bank 0, group 0 (offsets 0x00-0x05) -> channels 0-2 (operators 0,1)
    0, 3, 1, 4, 2, 5,
    // Bank 0, group 8 (offsets 0x08-0x0D) -> channels 3-5 (operators 0,1)
    0 + 6, 3 + 6, 1 + 6, 4 + 6, 2 + 6, 5 + 6,
    // Bank 0, group 0x10 (offsets 0x10-0x15) -> channels 6-8 (operators 0,1)
    0 + 12, 3 + 12, 1 + 12, 4 + 12, 2 + 12, 5 + 12,
];

function regOff(regBase: number, channel: number, bank: number): number {
    return (bank << 8) | regBase + channel;
}

function opRegOff(regBase: number, opIndex: number, bank: number): number {
    return (bank << 8) | regBase + opIndex;
}

class WorkletPlayer {
    #options: Record<string, any> = {};
    format: any = null;
    #formats: any[] = [];

    #samplesBuffer: Float32Array | null = null;
    sampleRate: number | null = null;
    #chunkSize = 0;

    #registerBank0: Uint8Array | null = null;
    #registerBank1: Uint8Array | null = null;
    postMessage: (msg: any) => void;

    #stateCounter = 0;
    #stateEveryN = 0;

    constructor(formats: any[], options: Record<string, any>, postMessage: (msg: any) => void) {
        this.#formats = formats;
        this.postMessage = postMessage;
        this.#options = options || {};
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

            const opl = new OPL3();
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
            }

            this.#samplesBuffer = new Float32Array(2);
            this.sampleRate = this.#options.sampleRate || 48000;
            this.#chunkSize = 0;

            // Post state every ~3 frames (at 48000 Hz, that's roughly 60fps)
            this.#stateEveryN = Math.max(1, Math.round(48000 / (this.sampleRate || 48000) / 3));
            this.#stateCounter = 0;
        } catch(error) {
            this.format = null;
        }
    }

    #decodeChannelState(ch: number) {
        const bank = ch < 9 ? 0 : 1;
        const chIdx = ch % 9;
        const r0 = bank === 0 ? this.#registerBank0 : this.#registerBank1;

        if (!r0) return null;

        // Channel registers
        const a0 = r0[regOff(0xA0, chIdx, bank)];
        const b0 = r0[regOff(0xB0, chIdx, bank)];
        const c0 = r0[regOff(0xC0, chIdx, bank)];

        // Frequency: 10-bit number from A0 (low 8) + B0 bits 0-1 (high 2)
        const frequency = (a0) | ((b0 & 0x03) << 8);
        const block = (b0 >> 2) & 0x07;
        const keyOn = !!(b0 & 0x20);

        // Panning (OPL3 only): C0 bits 4-5
        const panning = (c0 >> 4) & 0x03;
        const feedback = (c0 >> 1) & 0x07;
        const synthesisType = c0 & 0x01;

        // Operator offsets for this channel
        const op0Offset = OPERATOR_OFFSETS[chIdx];          // Modulator
        const op1Offset = OPERATOR_OFFSETS[chIdx] + 3;       // Carrier

        // Read operator 0 (modulator) state
        const op0Base = op0Offset;
        const b20_0 = r0[opRegOff(0x20, op0Base, bank)];
        const b40_0 = r0[opRegOff(0x40, op0Base, bank)];
        const b60_0 = r0[opRegOff(0x60, op0Base, bank)];
        const b80_0 = r0[opRegOff(0x80, op0Base, bank)];
        const be0_0 = r0[opRegOff(0xE0, op0Base, bank)];

        // Read operator 1 (carrier) state
        const op1Base = op1Offset;
        const b20_1 = r0[opRegOff(0x20, op1Base, bank)];
        const b40_1 = r0[opRegOff(0x40, op1Base, bank)];
        const b60_1 = r0[opRegOff(0x60, op1Base, bank)];
        const b80_1 = r0[opRegOff(0x80, op1Base, bank)];
        const be0_1 = r0[opRegOff(0xE0, op1Base, bank)];

        return {
            channel: ch,
            frequency,
            block,
            keyOn,
            panning,
            feedback,
            synthesisType,
            flag4Op: false,
            operators: [
                {
                    tremolo: !!(b20_0 & 0x80),
                    vibrato: !!(b20_0 & 0x40),
                    sustain: !!(b20_0 & 0x20),
                    ksr: !!(b20_0 & 0x10),
                    multiplier: b20_0 & 0x0F,
                    ksl: (b40_0 >> 6) & 0x03,
                    outputLevel: b40_0 & 0x3F,
                    attackRate: (b60_0 >> 4) & 0x0F,
                    decayRate: b60_0 & 0x0F,
                    sustainLevel: (b80_0 >> 4) & 0x0F,
                    releaseRate: b80_0 & 0x0F,
                    waveform: be0_0 & 0x07,
                },
                {
                    tremolo: !!(b20_1 & 0x80),
                    vibrato: !!(b20_1 & 0x40),
                    sustain: !!(b20_1 & 0x20),
                    ksr: !!(b20_1 & 0x10),
                    multiplier: b20_1 & 0x0F,
                    ksl: (b40_1 >> 6) & 0x03,
                    outputLevel: b40_1 & 0x3F,
                    attackRate: (b60_1 >> 4) & 0x0F,
                    decayRate: b60_1 & 0x0F,
                    sustainLevel: (b80_1 >> 4) & 0x0F,
                    releaseRate: b80_1 & 0x0F,
                    waveform: be0_1 & 0x07,
                },
            ],
        };
    }

    #decodeState(): any {
        if (!this.#registerBank0) return null;

        const bdReg = this.#registerBank0[0xBD];
        const opl3ModeReg = this.#registerBank1 ? this.#registerBank1[0x105] : 0;
        const connectionsel = this.#registerBank1 ? this.#registerBank1[0x104] : 0;

        const maxChannels = (opl3ModeReg & 0x01) ? 18 : 9;
        const channels = [];
        for (let i = 0; i < maxChannels; i++) {
            const ch = this.#decodeChannelState(i);
            if (ch) {
                // Add 4-op flag if OPL3 mode
                if (maxChannels === 18) {
                    const chIdx = i % 9;
                    const bank = i < 9 ? 0 : 1;
                    if (chIdx < 3) {
                        ch.flag4Op = !!(connectionsel & (1 << chIdx));
                    } else if (chIdx >= 3 && chIdx < 6) {
                        ch.flag4Op = false; // 4-op only possible in channels 1-6 (index 0-2 in each bank)
                    } else {
                        ch.flag4Op = false;
                    }
                } else {
                    ch.flag4Op = false;
                }
                channels.push(ch);
            }
        }

        return {
            channels,
            opl3Mode: !!(opl3ModeReg & 0x01),
            rhythmMode: !!(bdReg & 0x20),
            tremoloDepth: !!(bdReg & 0x80),
            vibratoDepth: !!(bdReg & 0x40),
            percussionData: bdReg & 0x1F,
        };
    }

    update(outputs) {
        if (!this.format)
            return;

        for (let i = 0; i < outputs[0].length; i++) {
            if (this.#chunkSize <= 0) {
                this.format.update();
                this.#chunkSize = 2 * ((this.sampleRate / this.format.getrefresh()) | 0);
            }

            this.format.opl.read(this.#samplesBuffer);

            outputs[0][i] = this.#samplesBuffer[0];
            outputs[1][i] = this.#samplesBuffer[1];

            this.#chunkSize -= 2;
        }

        // Decode and post state at throttled rate
        this.#stateCounter++;
        if (this.#stateCounter >= this.#stateEveryN) {
            this.#stateCounter = 0;
            const state = this.#decodeState();
            if (state) {
                this.postMessage?.({ cmd: "state", value: state });
            }
        }
    }
}

export default WorkletPlayer;
