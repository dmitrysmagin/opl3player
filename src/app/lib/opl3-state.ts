export interface OperatorState {
  tremolo: boolean;
  vibrato: boolean;
  sustain: boolean;
  ksr: boolean;
  multiplier: number;
  ksl: number;
  outputLevel: number;
  attackRate: number;
  decayRate: number;
  sustainLevel: number;
  releaseRate: number;
  waveform: number;
}

export interface ChannelState {
  channel: number;
  frequency: number;
  block: number;
  keyOn: boolean;
  panning: number;
  feedback: number;
  synthesisType: number;
  flag4Op: boolean;
  operators: [OperatorState, OperatorState];
}

export interface Opl3State {
  channels: ChannelState[];
  opl3Mode: boolean;
  rhythmMode: boolean;
  tremoloDepth: boolean;
  vibratoDepth: boolean;
  percussionData: number;
}

// Register offset -> operator index within a channel
// OPL3 has a non-linear mapping between register addresses and channel/operator pairs
const OPERATOR_OFFSETS = [
  0, 3, 1, 4, 2, 5,
  0 + 6, 3 + 6, 1 + 6, 4 + 6, 2 + 6, 5 + 6,
  0 + 12, 3 + 12, 1 + 12, 4 + 12, 2 + 12, 5 + 12,
];

function r(bank: Uint8Array, regBase: number, ch: number): number {
  return bank[regBase + ch];
}

function op(bank: Uint8Array, regBase: number, opIdx: number): number {
  return bank[regBase + opIdx];
}

function decodeOperator(bank: Uint8Array, opBase: number): OperatorState {
  const b20 = op(bank, 0x20, opBase);
  const b40 = op(bank, 0x40, opBase);
  const b60 = op(bank, 0x60, opBase);
  const b80 = op(bank, 0x80, opBase);
  const be0 = op(bank, 0xE0, opBase);

  return {
    tremolo: !!(b20 & 0x80),
    vibrato: !!(b20 & 0x40),
    sustain: !!(b20 & 0x20),
    ksr: !!(b20 & 0x10),
    multiplier: b20 & 0x0F,
    ksl: (b40 >> 6) & 0x03,
    outputLevel: b40 & 0x3F,
    attackRate: (b60 >> 4) & 0x0F,
    decayRate: b60 & 0x0F,
    sustainLevel: (b80 >> 4) & 0x0F,
    releaseRate: b80 & 0x0F,
    waveform: be0 & 0x07,
  };
}

function decodeChannel(bank: Uint8Array, chIdx: number, chNum: number): ChannelState {
  const a0 = r(bank, 0xA0, chIdx);
  const b0 = r(bank, 0xB0, chIdx);
  const c0 = r(bank, 0xC0, chIdx);

  const frequency = a0 | ((b0 & 0x03) << 8);
  const block = (b0 >> 2) & 0x07;
  const keyOn = !!(b0 & 0x20);
  const panning = (c0 >> 4) & 0x03;
  const feedback = (c0 >> 1) & 0x07;
  const synthesisType = c0 & 0x01;

  const op0Base = OPERATOR_OFFSETS[chIdx];
  const op1Base = OPERATOR_OFFSETS[chIdx] + 3;

  return {
    channel: chNum,
    frequency,
    block,
    keyOn,
    panning,
    feedback,
    synthesisType,
    flag4Op: false,
    operators: [
      decodeOperator(bank, op0Base),
      decodeOperator(bank, op1Base),
    ],
  };
}

export function decodeOpl3State(bank0: Uint8Array, bank1: Uint8Array): Opl3State {
  const opl3Mode = !!(bank1[0x05] & 0x01);
  const connectionsel = bank1[0x04];
  const bdReg = bank0[0xBD];

  const channels: ChannelState[] = [];

  for (let i = 0; i < 18; i++) {
    const bank = i < 9 ? bank0 : bank1;
    const chIdx = i % 9;
    const ch = decodeChannel(bank, chIdx, i);

    if (opl3Mode && chIdx < 3) {
      ch.flag4Op = !!(connectionsel & (1 << chIdx));
    }

    channels.push(ch);
  }

  return {
    channels,
    opl3Mode,
    rhythmMode: !!(bdReg & 0x20),
    tremoloDepth: !!(bdReg & 0x80),
    vibratoDepth: !!(bdReg & 0x40),
    percussionData: bdReg & 0x1F,
  };
}
