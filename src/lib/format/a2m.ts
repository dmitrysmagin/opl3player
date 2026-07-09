// @ts-nocheck
import { FormatPlayer } from "./player";
import { a2t_depack } from "./a2m-depack";

// ---- Effect constants ----
export const ef_Arpeggio = 0x80;
export const ef_FSlideUp = 1;
export const ef_FSlideDown = 2;
export const ef_TonePortamento = 3;
export const ef_Vibrato = 4;
export const ef_TPortamVolSlide = 5;
export const ef_VibratoVolSlide = 6;
export const ef_FSlideUpFine = 7;
export const ef_FSlideDownFine = 8;
export const ef_SetModulatorVol = 9;
export const ef_VolSlide = 10;
export const ef_PositionJump = 11;
export const ef_SetInsVolume = 12;
export const ef_PatternBreak = 13;
export const ef_SetTempo = 14;
export const ef_SetSpeed = 15;
export const ef_TPortamVSlideFine = 16;
export const ef_VibratoVSlideFine = 17;
export const ef_SetCarrierVol = 18;
export const ef_SetWaveform = 19;
export const ef_VolSlideFine = 20;
export const ef_RetrigNote = 21;
export const ef_Tremolo = 22;
export const ef_Tremor = 23;
export const ef_ArpggVSlide = 24;
export const ef_ArpggVSlideFine = 25;
export const ef_MultiRetrigNote = 26;
export const ef_FSlideUpVSlide = 27;
export const ef_FSlideDownVSlide = 28;
export const ef_FSlUpFineVSlide = 29;
export const ef_FSlDownFineVSlide = 30;
export const ef_FSlUpVSlF = 31;
export const ef_FSlDownVSlF = 32;
export const ef_FSlUpFineVSlF = 33;
export const ef_FSlDownFineVSlF = 34;
export const ef_Extended = 35;
export const ef_Extended2 = 36;
export const ef_SetGlobalVolume = 37;
export const ef_SwapArpeggio = 38;
export const ef_SwapVibrato = 39;
export const ef_ForceInsVolume = 40;
export const ef_Extended3 = 41;
export const ef_ExtraFineArpeggio = 42;
export const ef_ExtraFineVibrato = 43;
export const ef_ExtraFineTremolo = 44;
export const ef_SetCustomSpeedTab = 45;
export const ef_GlobalFSlideUp = 46;
export const ef_GlobalFSlideDown = 47;
export const ef_GlobalFreqSlideUpXF = 48;
export const ef_GlobalFreqSlideDnXF = 49;

export const ef_ex_SetTremDepth = 0;
export const ef_ex_SetVibDepth = 1;
export const ef_ex_SetAttckRateM = 2;
export const ef_ex_SetDecayRateM = 3;
export const ef_ex_SetSustnLevelM = 4;
export const ef_ex_SetRelRateM = 5;
export const ef_ex_SetAttckRateC = 6;
export const ef_ex_SetDecayRateC = 7;
export const ef_ex_SetSustnLevelC = 8;
export const ef_ex_SetRelRateC = 9;
export const ef_ex_SetFeedback = 10;
export const ef_ex_SetPanningPos = 11;
export const ef_ex_PatternLoop = 12;
export const ef_ex_PatternLoopRec = 13;
export const ef_ex_ExtendedCmd = 14;
export const ef_ex_ExtendedCmd2 = 15;

export const ef_ex_cmd_MKOffLoopDi = 0;
export const ef_ex_cmd_MKOffLoopEn = 1;
export const ef_ex_cmd_TPortaFKdis = 2;
export const ef_ex_cmd_TPortaFKenb = 3;
export const ef_ex_cmd_RestartEnv = 4;
export const ef_ex_cmd_4opVlockOff = 5;
export const ef_ex_cmd_4opVlockOn = 6;
export const ef_ex_cmd_ForceBpmSld = 7;

export const ef_ex_cmd2_RSS = 0;
export const ef_ex_cmd2_ResetVol = 1;
export const ef_ex_cmd2_LockVol = 2;
export const ef_ex_cmd2_UnlockVol = 3;
export const ef_ex_cmd2_LockVP = 4;
export const ef_ex_cmd2_UnlockVP = 5;
export const ef_ex_cmd2_VSlide_mod = 6;
export const ef_ex_cmd2_VSlide_car = 7;
export const ef_ex_cmd2_VSlide_def = 8;
export const ef_ex_cmd2_LockPan = 9;
export const ef_ex_cmd2_UnlockPan = 10;
export const ef_ex_cmd2_VibrOff = 11;
export const ef_ex_cmd2_TremOff = 12;
export const ef_ex_cmd2_FVib_FGFS = 13;
export const ef_ex_cmd2_FTrm_XFGFS = 14;
export const ef_ex_cmd2_NoRestart = 15;

export const ef_ex2_PatDelayFrame = 0;
export const ef_ex2_PatDelayRow = 1;
export const ef_ex2_NoteDelay = 2;
export const ef_ex2_NoteCut = 3;
export const ef_ex2_FineTuneUp = 4;
export const ef_ex2_FineTuneDown = 5;
export const ef_ex2_GlVolSlideUp = 6;
export const ef_ex2_GlVolSlideDn = 7;
export const ef_ex2_GlVolSlideUpF = 8;
export const ef_ex2_GlVolSlideDnF = 9;
export const ef_ex2_GlVolSldUpXF = 10;
export const ef_ex2_GlVolSldDnXF = 11;
export const ef_ex2_VolSlideUpXF = 12;
export const ef_ex2_VolSlideDnXF = 13;
export const ef_ex2_FreqSlideUpXF = 14;
export const ef_ex2_FreqSlideDnXF = 15;

export const ef_ex3_SetConnection = 0;
export const ef_ex3_SetMultipM = 1;
export const ef_ex3_SetKslM = 2;
export const ef_ex3_SetTremoloM = 3;
export const ef_ex3_SetVibratoM = 4;
export const ef_ex3_SetKsrM = 5;
export const ef_ex3_SetSustainM = 6;
export const ef_ex3_SetMultipC = 7;
export const ef_ex3_SetKslC = 8;
export const ef_ex3_SetTremoloC = 9;
export const ef_ex3_SetVibratoC = 10;
export const ef_ex3_SetKsrC = 11;
export const ef_ex3_SetSustainC = 12;

export const EFGR_ARPVOLSLIDE = 1;
export const EFGR_FSLIDEVOLSLIDE = 2;
export const EFGR_TONEPORTAMENTO = 3;
export const EFGR_VIBRATO = 4;
export const EFGR_TREMOLO = 5;
export const EFGR_VIBRATOVOLSLIDE = 6;
export const EFGR_PORTAVOLSLIDE = 7;
export const EFGR_RETRIGNOTE = 8;

export const keyoff_flag = 0x80;
export const fixed_note_flag = 0x90;
export const pattern_loop_flag = 0xe0;
export const pattern_break_flag = 0xf0;

export const BYTE_NULL = 0xff;

export const MIN_IRQ_FREQ = 50;
export const MAX_IRQ_FREQ = 1000;

export const FreqStart = 0x156;
export const FreqEnd = 0x2ae;
export const FreqRange = FreqEnd - FreqStart;

export const MAX_INSTRUMENTS = 255;
export const MAX_FMREG_TABLES = 255;
export const MAX_ARPVIB_TABLES = 255;
export const MAX_PATTERNS = 128;
export const MAX_CHANNELS = 20;
export const MAX_ROWS = 256;

export const FM_INST_SIZE = 11;
export const INSTR_SIZE = 14;
export const INSTR_V1_8_SIZE = 13;
export const REGTABLE_CELL_SIZE = 15;
export const FMREG_TABLE_SIZE = 6 + 255 * REGTABLE_CELL_SIZE; // 3831
export const ARPVIB_TABLE_SIZE = 521;
export const MACRO_TABLE_STRIDE = 17;
export const EVENT_V1_8_SIZE = 4;
export const EVENT_V9_14_SIZE = 6;

// ========================================================================
//  Static lookup tables
// ========================================================================

export const _panning = new Uint8Array([0x30, 0x10, 0x20]);

export const def_vibtrem_table = new Uint8Array([
    0, 24, 49, 74, 97, 120, 141, 161, 180, 197, 212, 224, 235, 244, 250, 253, 255, 253, 250, 244, 235, 224, 212, 197,
    180, 161, 141, 120, 97, 74, 49, 24, 0, 24, 49, 74, 97, 120, 141, 161, 180, 197, 212, 224, 235, 244, 250, 253, 255,
    253, 250, 244, 235, 224, 212, 197, 180, 161, 141, 120, 97, 74, 49, 24, 0, 24, 49, 74, 97, 120, 141, 161, 180, 197,
    212, 224, 235, 244, 250, 253, 255, 253, 250, 244, 235, 224, 212, 197, 180, 161, 141, 120, 97, 74, 49, 24, 0, 24, 49,
    74, 97, 120, 141, 161, 180, 197, 212, 224, 235, 244, 250, 253, 255, 253, 250, 244, 235, 224, 212, 197, 180, 161,
    141, 120, 97, 74, 49, 24, 0, 24, 49, 74, 97, 120, 141, 161, 180, 197, 212, 224, 235, 244, 250, 253, 255, 253, 250,
    244, 235, 224, 212, 197, 180, 161, 141, 120, 97, 74, 49, 24, 0, 24, 49, 74, 97, 120, 141, 161, 180, 197, 212, 224,
    235, 244, 250, 253, 255, 253, 250, 244, 235, 224, 212, 197, 180, 161, 141, 120, 97, 74, 49, 24, 0, 24, 49, 74, 97,
    120, 141, 161, 180, 197, 212, 224, 235, 244, 250, 253, 255, 253, 250, 244, 235, 224, 212, 197, 180, 161, 141, 120,
    97, 74, 49, 24, 0, 24, 49, 74, 97, 120, 141, 161, 180, 197, 212, 224, 235, 244, 250, 253, 255, 253, 250, 244, 235,
    224, 212, 197, 180, 161, 141, 120, 97, 74, 49, 24,
]);

const Fnum = new Uint16Array([0x157, 0x16b, 0x181, 0x198, 0x1b0, 0x1ca, 0x1e5, 0x202, 0x220, 0x241, 0x263, 0x287]);

export function nFreq(note: number): number {
    if (note >= 12 * 8) return (7 << 10) | FreqEnd;
    return ((note / 12) << 10) | Fnum[note % 12];
}

export const ch_n = [
    new Uint16Array([
        0x003, 0x000, 0x004, 0x001, 0x005, 0x002, 0x006, 0x007, 0x008, 0x103, 0x100, 0x104, 0x101, 0x105, 0x102, 0x106,
        0x107, 0x108, 0xfff, 0xfff,
    ]),
    new Uint16Array([
        0x003, 0x000, 0x004, 0x001, 0x005, 0x002, 0x106, 0x107, 0x108, 0x103, 0x100, 0x104, 0x101, 0x105, 0x102, 0x006,
        0x007, 0x008, 0x008, 0x007,
    ]),
];

export const ch_m = [
    new Uint16Array([
        0x008, 0x000, 0x009, 0x001, 0x00a, 0x002, 0x010, 0x011, 0x012, 0x108, 0x100, 0x109, 0x101, 0x10a, 0x102, 0x110,
        0x111, 0x112, 0xfff, 0xfff,
    ]),
    new Uint16Array([
        0x008, 0x000, 0x009, 0x001, 0x00a, 0x002, 0x110, 0x111, 0x112, 0x108, 0x100, 0x109, 0x101, 0x10a, 0x102, 0x010,
        0x014, 0x012, 0x015, 0x011,
    ]),
];

export const ch_c = [
    new Uint16Array([
        0x00b, 0x003, 0x00c, 0x004, 0x00d, 0x005, 0x013, 0x014, 0x015, 0x10b, 0x103, 0x10c, 0x104, 0x10d, 0x105, 0x113,
        0x114, 0x115, 0xfff, 0xfff,
    ]),
    new Uint16Array([
        0x00b, 0x003, 0x00c, 0x004, 0x00d, 0x005, 0x113, 0x114, 0x115, 0x10b, 0x103, 0x10c, 0x104, 0x10d, 0x105, 0x013,
        0xff, 0xff, 0xff, 0xff,
    ]),
];

export const _4op_main_chan = new Uint8Array([1, 3, 5, 10, 12, 14]);

// ========================================================================
//  Bitfield helper classes  (step 5 — view objects over Uint8Array pools)
// ========================================================================

// ---- FMInstData: 11-byte OPL register block ----

export class FMInstData {
    private d: Uint8Array;

    constructor(buf: Uint8Array, offset: number) {
        this.d = buf.subarray(offset, offset + FM_INST_SIZE);
    }

    get raw(): Uint8Array {
        return this.d;
    }

    // byte 0: 0x20 modulator (trem|vibr|sust|ksr|multip)
    get multipM() {
        return this.d[0] & 0x0f;
    }
    set multipM(v) {
        this.d[0] = (this.d[0] & 0xf0) | (v & 0x0f);
    }
    get ksrM() {
        return (this.d[0] >> 4) & 1;
    }
    set ksrM(v) {
        this.d[0] ^= (this.d[0] ^ ((v & 1) << 4)) & 0x10;
    }
    get sustM() {
        return (this.d[0] >> 5) & 1;
    }
    set sustM(v) {
        this.d[0] ^= (this.d[0] ^ ((v & 1) << 5)) & 0x20;
    }
    get vibrM() {
        return (this.d[0] >> 6) & 1;
    }
    set vibrM(v) {
        this.d[0] ^= (this.d[0] ^ ((v & 1) << 6)) & 0x40;
    }
    get tremM() {
        return (this.d[0] >> 7) & 1;
    }
    set tremM(v) {
        this.d[0] ^= (this.d[0] ^ ((v & 1) << 7)) & 0x80;
    }

    // byte 1: 0x20 carrier
    get multipC() {
        return this.d[1] & 0x0f;
    }
    set multipC(v) {
        this.d[1] = (this.d[1] & 0xf0) | (v & 0x0f);
    }
    get ksrC() {
        return (this.d[1] >> 4) & 1;
    }
    set ksrC(v) {
        this.d[1] ^= (this.d[1] ^ ((v & 1) << 4)) & 0x10;
    }
    get sustC() {
        return (this.d[1] >> 5) & 1;
    }
    set sustC(v) {
        this.d[1] ^= (this.d[1] ^ ((v & 1) << 5)) & 0x20;
    }
    get vibrC() {
        return (this.d[1] >> 6) & 1;
    }
    set vibrC(v) {
        this.d[1] ^= (this.d[1] ^ ((v & 1) << 6)) & 0x40;
    }
    get tremC() {
        return (this.d[1] >> 7) & 1;
    }
    set tremC(v) {
        this.d[1] ^= (this.d[1] ^ ((v & 1) << 7)) & 0x80;
    }

    // byte 2: 0x40 modulator (ksl|vol)
    get volM() {
        return this.d[2] & 0x3f;
    }
    set volM(v) {
        this.d[2] = (this.d[2] & 0xc0) | (v & 0x3f);
    }
    get kslM() {
        return this.d[2] >> 6;
    }
    set kslM(v) {
        this.d[2] = (this.d[2] & 0x3f) | ((v & 3) << 6);
    }

    // byte 3: 0x40 carrier
    get volC() {
        return this.d[3] & 0x3f;
    }
    set volC(v) {
        this.d[3] = (this.d[3] & 0xc0) | (v & 0x3f);
    }
    get kslC() {
        return this.d[3] >> 6;
    }
    set kslC(v) {
        this.d[3] = (this.d[3] & 0x3f) | ((v & 3) << 6);
    }

    // byte 4: 0x60 modulator (attck|dec)
    get attckM() {
        return this.d[4] >> 4;
    }
    set attckM(v) {
        this.d[4] = (this.d[4] & 0x0f) | ((v & 0x0f) << 4);
    }
    get decM() {
        return this.d[4] & 0x0f;
    }
    set decM(v) {
        this.d[4] = (this.d[4] & 0xf0) | (v & 0x0f);
    }

    // byte 5: 0x60 carrier
    get attckC() {
        return this.d[5] >> 4;
    }
    set attckC(v) {
        this.d[5] = (this.d[5] & 0x0f) | ((v & 0x0f) << 4);
    }
    get decC() {
        return this.d[5] & 0x0f;
    }
    set decC(v) {
        this.d[5] = (this.d[5] & 0xf0) | (v & 0x0f);
    }

    // byte 6: 0x80 modulator (sustn|rel)
    get sustnM() {
        return this.d[6] >> 4;
    }
    set sustnM(v) {
        this.d[6] = (this.d[6] & 0x0f) | ((v & 0x0f) << 4);
    }
    get relM() {
        return this.d[6] & 0x0f;
    }
    set relM(v) {
        this.d[6] = (this.d[6] & 0xf0) | (v & 0x0f);
    }

    // byte 7: 0x80 carrier
    get sustnC() {
        return this.d[7] >> 4;
    }
    set sustnC(v) {
        this.d[7] = (this.d[7] & 0x0f) | ((v & 0x0f) << 4);
    }
    get relC() {
        return this.d[7] & 0x0f;
    }
    set relC(v) {
        this.d[7] = (this.d[7] & 0xf0) | (v & 0x0f);
    }

    // byte 8: 0xE0 modulator (waveform)
    get wformM() {
        return this.d[8] & 7;
    }
    set wformM(v) {
        this.d[8] = (this.d[8] & ~7) | (v & 7);
    }

    // byte 9: 0xE0 carrier
    get wformC() {
        return this.d[9] & 7;
    }
    set wformC(v) {
        this.d[9] = (this.d[9] & ~7) | (v & 7);
    }

    // byte 10: 0xC0 connector (feedb|connect)
    get connect() {
        return this.d[10] & 1;
    }
    set connect(v) {
        this.d[10] ^= (this.d[10] ^ (v & 1)) & 1;
    }
    get feedb() {
        return (this.d[10] >> 1) & 7;
    }
    set feedb(v) {
        this.d[10] ^= (this.d[10] ^ ((v & 7) << 1)) & 0x0e;
    }
}

// ---- InstrData: 14-byte instrument entry (fm + panning + fine_tune + perc_voice) ----

export class InstrData {
    private d: Uint8Array;

    constructor(buf: Uint8Array, offset: number) {
        this.d = buf.subarray(offset, offset + INSTR_SIZE);
    }

    get fm(): FMInstData {
        return new FMInstData(this.d, 0);
    }
    get panning() {
        return this.d[11] & 3;
    }
    set panning(v) {
        this.d[11] = (this.d[11] & ~3) | (v & 3);
    }
    get fine_tune() {
        return (this.d[12] << 24) >> 24;
    }
    set fine_tune(v) {
        this.d[12] = v & 0xff;
    }
    get perc_voice() {
        return this.d[13];
    }
    set perc_voice(v) {
        this.d[13] = v;
    }
}

// ---- RegTableDef: 15-byte macro cell (fm + freq_slide + panning + duration) ----

export class RegTableDef {
    private d: Uint8Array;

    constructor(buf: Uint8Array, offset: number) {
        this.d = buf.subarray(offset, offset + REGTABLE_CELL_SIZE);
    }

    get fm(): FMInstData {
        return new FMInstData(this.d, 0);
    }
    get freq_slide() {
        return ((this.d[11] | (this.d[12] << 8)) << 16) >> 16;
    }
    set freq_slide(v) {
        this.d[11] = v & 0xff;
        this.d[12] = (v >> 8) & 0xff;
    }
    get panning() {
        return this.d[13] & 3;
    }
    set panning(v) {
        this.d[13] = (this.d[13] & ~3) | (v & 3);
    }
    get duration() {
        return this.d[14];
    }
    set duration(v) {
        this.d[14] = v;
    }
    get macro_flags() {
        return this.d[10] & 0xf0;
    }
    set macro_flags(v) {
        this.d[10] = (this.d[10] & 0x0f) | (v & 0xf0);
    }
}

// ---- Per-channel view classes ----

export class PortaTable {
    private d: Uint8Array;
    private offset: number;

    constructor(buf: Uint8Array, offset: number) {
        this.d = buf;
        this.offset = offset;
    }

    get freq() {
        return this.d[this.offset] | (this.d[this.offset + 1] << 8);
    }
    set freq(v) {
        this.d[this.offset] = v & 0xff;
        this.d[this.offset + 1] = (v >> 8) & 0xff;
    }
    get speed() {
        return this.d[this.offset + 2];
    }
    set speed(v) {
        this.d[this.offset + 2] = v;
    }
}

export class EffectEntry {
    private d: Uint8Array;
    private offset: number;

    constructor(buf: Uint8Array, offset: number) {
        this.d = buf;
        this.offset = offset;
    }

    get def() {
        return this.d[this.offset];
    }
    set def(v) {
        this.d[this.offset] = v;
    }
    get val() {
        return this.d[this.offset + 1];
    }
    set val(v) {
        this.d[this.offset + 1] = v;
    }
}

export class ArpggTable {
    private d: Uint8Array;
    private offset: number;

    constructor(buf: Uint8Array, offset: number) {
        this.d = buf;
        this.offset = offset;
    }

    get state() {
        return this.d[this.offset];
    }
    set state(v) {
        this.d[this.offset] = v;
    }
    get note() {
        return this.d[this.offset + 1];
    }
    set note(v) {
        this.d[this.offset + 1] = v;
    }
    get add1() {
        return this.d[this.offset + 2];
    }
    set add1(v) {
        this.d[this.offset + 2] = v;
    }
    get add2() {
        return this.d[this.offset + 3];
    }
    set add2(v) {
        this.d[this.offset + 3] = v;
    }
}

export class VibrTable {
    private d: Uint8Array;
    private offset: number;

    constructor(buf: Uint8Array, offset: number) {
        this.d = buf;
        this.offset = offset;
    }

    get pos() {
        return this.d[this.offset];
    }
    set pos(v) {
        this.d[this.offset] = v;
    }
    get dir() {
        return this.d[this.offset + 1];
    }
    set dir(v) {
        this.d[this.offset + 1] = v;
    }
    get speed() {
        return this.d[this.offset + 2];
    }
    set speed(v) {
        this.d[this.offset + 2] = v;
    }
    get depth() {
        return this.d[this.offset + 3];
    }
    set depth(v) {
        this.d[this.offset + 3] = v;
    }
    get fine() {
        return this.d[this.offset + 4];
    }
    set fine(v) {
        this.d[this.offset + 4] = v & 1;
    }
}

export class TremTable {
    private d: Uint8Array;
    private offset: number;

    constructor(buf: Uint8Array, offset: number) {
        this.d = buf;
        this.offset = offset;
    }

    get pos() {
        return this.d[this.offset];
    }
    set pos(v) {
        this.d[this.offset] = v;
    }
    get dir() {
        return this.d[this.offset + 1];
    }
    set dir(v) {
        this.d[this.offset + 1] = v;
    }
    get speed() {
        return this.d[this.offset + 2];
    }
    set speed(v) {
        this.d[this.offset + 2] = v;
    }
    get depth() {
        return this.d[this.offset + 3];
    }
    set depth(v) {
        this.d[this.offset + 3] = v;
    }
    get fine() {
        return this.d[this.offset + 4];
    }
    set fine(v) {
        this.d[this.offset + 4] = v & 1;
    }
}

export class MacroTable {
    private d: Uint8Array;
    private offset: number;

    constructor(buf: Uint8Array, offset: number) {
        this.d = buf;
        this.offset = offset;
    }

    // Each macro table entry is 14 bytes
    get fmreg_pos() {
        return this.d[this.offset] | (this.d[this.offset + 1] << 8);
    }
    set fmreg_pos(v) {
        this.d[this.offset] = v & 0xff;
        this.d[this.offset + 1] = (v >> 8) & 0xff;
    }
    get arpg_pos() {
        return this.d[this.offset + 2] | (this.d[this.offset + 3] << 8);
    }
    set arpg_pos(v) {
        this.d[this.offset + 2] = v & 0xff;
        this.d[this.offset + 3] = (v >> 8) & 0xff;
    }
    get vib_pos() {
        return this.d[this.offset + 4] | (this.d[this.offset + 5] << 8);
    }
    set vib_pos(v) {
        this.d[this.offset + 4] = v & 0xff;
        this.d[this.offset + 5] = (v >> 8) & 0xff;
    }
    get fmreg_duration() {
        return this.d[this.offset + 6];
    }
    set fmreg_duration(v) {
        this.d[this.offset + 6] = v;
    }
    get arpg_count() {
        return this.d[this.offset + 7];
    }
    set arpg_count(v) {
        this.d[this.offset + 7] = v;
    }
    get vib_count() {
        return this.d[this.offset + 8];
    }
    set vib_count(v) {
        this.d[this.offset + 8] = v;
    }
    get vib_delay() {
        return this.d[this.offset + 9];
    }
    set vib_delay(v) {
        this.d[this.offset + 9] = v;
    }
    get fmreg_ins() {
        return this.d[this.offset + 10];
    }
    set fmreg_ins(v) {
        this.d[this.offset + 10] = v;
    }
    get arpg_table() {
        return this.d[this.offset + 11];
    }
    set arpg_table(v) {
        this.d[this.offset + 11] = v;
    }
    get vib_table() {
        return this.d[this.offset + 12];
    }
    set vib_table(v) {
        this.d[this.offset + 12] = v;
    }
    get arpg_note() {
        return this.d[this.offset + 13];
    }
    set arpg_note(v) {
        this.d[this.offset + 13] = v;
    }
    get vib_paused() {
        return false;
    }
    set vib_paused(v) {
        /* not stored in pool, handled by callers */
    }
    get vib_freq() {
        return 0;
    }
    set vib_freq(v) {
        /* not stored in pool, handled by callers */
    }
}

export class TremorTable {
    private d: Uint8Array;
    private offset: number;

    constructor(buf: Uint8Array, offset: number) {
        this.d = buf;
        this.offset = offset;
    }

    get pos() {
        return this.d[this.offset];
    }
    set pos(v) {
        this.d[this.offset] = v;
    }
    get volM() {
        return this.d[this.offset + 1];
    }
    set volM(v) {
        this.d[this.offset + 1] = v;
    }
    get volC() {
        return this.d[this.offset + 2];
    }
    set volC(v) {
        this.d[this.offset + 2] = v;
    }
}

// ========================================================================
//  Main player class
// ========================================================================

export default class A2M extends FormatPlayer {
    // ---- type / version ----
    type: number = 0; // 0 = a2m, 1 = a2t
    ffver: number = 1;
    len: number[] = [];
    adsr_carrier: boolean[] = [];

    // ---- playback state ----
    current_order: number = 0;
    current_pattern: number = 0;
    current_line: number = 0;
    tempo: number = 50;
    speed: number = 6;
    macro_speedup: number = 1;
    irq_mode: boolean = false;
    IRQ_freq: number = 50;
    irq_initialized: boolean = false;
    timer_fix: boolean = true;
    pattern_break: boolean = false;
    pattern_break_from_bxx: boolean = false;
    pattern_delay: boolean = false;
    next_line: number = 0;
    playback_speed_shift: number = 0;
    play_status: number = 0; // 0=isPlaying, 1=isPaused, 2=isStopped
    overall_volume: number = 63;
    global_volume: number = 63;
    fade_out_volume: number = 63;
    vibtrem_speed_factor: number = 1;
    vibtrem_table_size: number = 32;
    vibtrem_table: Uint8Array;
    misc_register: number = 0;
    current_tremolo_depth: number = 0;
    current_vibrato_depth: number = 0;
    speed_update: boolean = false;
    lockvol: boolean = false;
    panlock: boolean = false;
    lockVP: boolean = false;
    tremolo_depth: number = 0;
    vibrato_depth: number = 0;
    volume_scaling: boolean = false;
    percussion_mode: boolean = false;
    editor_mode: boolean = true;

    // ---- timer ----
    ticks: number = 0;
    tick0: number = 0;
    tickD: number = 0;
    tickXF: number = 0;
    ticklooper: number = 0;
    macro_ticklooper: number = 0;

    chip: number = 0;
    songend: boolean = false;
    loopOrder: number = -1;  // Pattern index where loop starts (-1 = no loop detected)

    // ---- song info ----
    songinfo: Record<string, any>;
    instrInfo: { count: number; size: number; ext: any[] };
    arpvib_count: number = 0;

    // ---- Uint8Array pools ----
    private instrPool: Uint8Array;
    private fmregPool: Uint8Array;
    private arpvibPool: Uint8Array;
    private patternPool: Uint8Array;
    private num_patterns = 0;   // allocation dims (C++ eventsinfo->patterns)
    private ev_channels = 0;    // C++ eventsinfo->channels
    private ev_rows = 0;        // C++ eventsinfo->rows
    private instrExt: any[];

    // ---- Per-channel state (flat typed arrays, length = MAX_CHANNELS) ----
    private chEventTable: Uint8Array;
    private chVoiceTable: Uint8Array;
    private chFreqTable: Uint16Array;
    private chZeroFqTable: Uint16Array;
    private chModulatorVol: Uint8Array;
    private chCarrierVol: Uint8Array;
    private chVolumeLock: Uint8Array;
    private chVol4opLock: Uint8Array;
    private chPeakLock: Uint8Array;
    private chPanLock: Uint8Array;
    private chPanningTable: Uint8Array;
    private chKeyoffLoop: Uint8Array;
    private chPortaFK: Uint8Array;
    private chResetChan: Uint8Array;
    private chLoopbckTable: Uint8Array;
    private chLoopTable: Uint8Array;
    private chNotedelTable: Uint8Array;
    private chNotecutTable: Uint8Array;
    private chFtuneTable: Int8Array;
    private chVolslideType: Uint8Array;

    // effect tables [2][20] stored as flat: slot*20 + chan
    private chEffectTable: Uint8Array; // [2][20][2] = 80 bytes, access: (slot*20 + chan)*2
    private chFslideTable: Uint8Array; // [2][20]
    private chGlfsldTable: Uint8Array; // [2][20][2] = 80 bytes
    private chLastEffect: Uint8Array; // [2][20][2] = 80 bytes
    private chPortaTable: Uint8Array; // [2][20][3] = 120 bytes, access: (slot*20 + chan)*3
    private chArpggTable: Uint8Array; // [2][20][4] = 160 bytes
    private chVibrTable: Uint8Array; // [2][20][5] = 200 bytes
    private chTremTable: Uint8Array; // [2][20][5] = 200 bytes
    private chRetrigTable: Uint8Array; // [2][20]
    private chTremorTable: Uint8Array; // [2][20][3] = 120 bytes
    private chMacroTable: Uint8Array; // [20][14] = 280 bytes
    private chFmparTable: any[]; // [20] plain objects, FM par struct

    constructor(opl, options) {
        super(opl, options);

        this.vibtrem_table = new Uint8Array(def_vibtrem_table);

        // ---- allocate pools ----
        this.instrPool = new Uint8Array(MAX_INSTRUMENTS * INSTR_SIZE);
        this.fmregPool = new Uint8Array(MAX_FMREG_TABLES * FMREG_TABLE_SIZE);
        this.arpvibPool = new Uint8Array(MAX_ARPVIB_TABLES * ARPVIB_TABLE_SIZE);
        this.patternPool = new Uint8Array(MAX_PATTERNS * MAX_CHANNELS * MAX_ROWS * EVENT_V9_14_SIZE);
        this.instrExt = [];

        this.instrInfo = { count: 0, size: 0, ext: this.instrExt };

        // ---- allocate per-channel state ----
        const C = MAX_CHANNELS;

        // Simple per-channel arrays
        this.chEventTable = new Uint8Array(C * EVENT_V9_14_SIZE);
        this.chVoiceTable = new Uint8Array(C);
        this.chFreqTable = new Uint16Array(C);
        this.chZeroFqTable = new Uint16Array(C);
        this.chModulatorVol = new Uint8Array(C);
        this.chCarrierVol = new Uint8Array(C);
        this.chVolumeLock = new Uint8Array(C);
        this.chVol4opLock = new Uint8Array(C);
        this.chPeakLock = new Uint8Array(C);
        this.chPanLock = new Uint8Array(C);
        this.chPanningTable = new Uint8Array(C);
        this.chKeyoffLoop = new Uint8Array(C);
        this.chPortaFK = new Uint8Array(C);
        this.chResetChan = new Uint8Array(C);
        this.chLoopbckTable = new Uint8Array(C);
        this.chLoopTable = new Uint8Array(C * 256);
        this.chNotedelTable = new Uint8Array(C);
        this.chNotecutTable = new Uint8Array(C);
        this.chFtuneTable = new Int8Array(C);
        this.chVolslideType = new Uint8Array(C);

        // Slot-indexed arrays [2][C]
        this.chEffectTable = new Uint8Array(2 * C * 2);
        this.chFslideTable = new Uint8Array(2 * C);
        this.chGlfsldTable = new Uint8Array(2 * C * 2);
        this.chLastEffect = new Uint8Array(2 * C * 2);
        this.chPortaTable = new Uint8Array(2 * C * 3);
        this.chArpggTable = new Uint8Array(2 * C * 4);
        this.chVibrTable = new Uint8Array(2 * C * 5);
        this.chTremTable = new Uint8Array(2 * C * 5);
        this.chRetrigTable = new Uint8Array(2 * C);
        this.chTremorTable = new Uint8Array(2 * C * 3);
        this.chMacroTable = new Uint8Array(C * MACRO_TABLE_STRIDE);

        // FM par table (plain object array, mirrors tFM_INST_DATA[20])
        this.chFmparTable = new Array(C);
        for (let i = 0; i < C; i++) {
            this.chFmparTable[i] = {
                attckM: 0,
                decM: 0,
                sustnM: 0,
                relM: 0,
                wformM: 0,
                kslM: 0,
                multipM: 0,
                tremM: 0,
                vibrM: 0,
                ksrM: 0,
                sustM: 0,
                attckC: 0,
                decC: 0,
                sustnC: 0,
                relC: 0,
                wformC: 0,
                kslC: 0,
                multipC: 0,
                tremC: 0,
                vibrC: 0,
                ksrC: 0,
                sustC: 0,
                connect: 0,
                feedb: 0,
                volM: 0,
                volC: 0,
            };
        }
    }

    // ====================================================================
    //  OPL helpers (step 3)
    // ====================================================================

    opl2out(reg: number, data: number) {
        this.opl.write(reg < 0x100 ? 0 : 1, reg & 0xff, data);
    }

    opl3out(reg: number, data: number) {
        this.opl.write(reg < 0x100 ? 0 : 1, reg & 0xff, data);
    }

    opl3exp(data: number) {
        this.opl.write(1, data & 0xff, (data >> 8) & 0xff);
    }

    // ====================================================================
    //  Pool accessors (step 4)
    // ====================================================================

    // ---- Instrument helpers ----

    get_instr(ins: number): InstrData | null {
        if (ins === 0 || ins > this.instrInfo.count) return null;
        return new InstrData(this.instrPool, (ins - 1) * INSTR_SIZE);
    }

    get_instr_ext(ins: number): any {
        if (ins === 0 || ins > this.instrExt.length) return null;
        return this.instrExt[ins - 1];
    }

    get_instr_data(ins: number): InstrData | null {
        return this.get_instr(ins);
    }

    get_instr_data_by_ch(chan: number): InstrData | null {
        // C uses ch->voice_table[chan] (init to chan+1), NOT event_table.instr_def.
        return this.get_instr(this.chVoiceTable[chan]);
    }

    get_instr_fine_tune(ins: number): number {
        const instr = this.get_instr(ins);
        return instr ? instr.fine_tune : 0;
    }

    // ---- FM register macro helpers ----

    get_fmreg_table(index: number): Uint8Array | null {
        if (index === 0 || index > MAX_FMREG_TABLES) return null;
        return this.fmregPool.subarray((index - 1) * FMREG_TABLE_SIZE, index * FMREG_TABLE_SIZE);
    }

    // ---- Arpeggio / vibrato helpers ----

    get_arpeggio_table(arp_table: number): Uint8Array | null {
        if (arp_table === 0 || arp_table > MAX_ARPVIB_TABLES) return null;
        return this.arpvibPool.subarray((arp_table - 1) * ARPVIB_TABLE_SIZE, (arp_table - 1) * ARPVIB_TABLE_SIZE + 260);
    }

    get_vibrato_table(vib_table: number): Uint8Array | null {
        if (vib_table === 0 || vib_table > MAX_ARPVIB_TABLES) return null;
        const base = (vib_table - 1) * ARPVIB_TABLE_SIZE;
        return this.arpvibPool.subarray(base + 260, base + 521);
    }

    // ---- Pattern event helpers ----

    get_event_p(pattern: number, channel: number, row: number): Uint8Array {
        const idx = (pattern * MAX_CHANNELS + channel) * MAX_ROWS * EVENT_V9_14_SIZE + row * EVENT_V9_14_SIZE;
        return this.patternPool.subarray(idx, idx + EVENT_V9_14_SIZE);
    }

    // ---- Register offset helpers ----

    regoffs_n(chan: number): number {
        return ch_n[this.percussion_mode ? 1 : 0][chan];
    }

    regoffs_m(chan: number): number {
        return ch_m[this.percussion_mode ? 1 : 0][chan];
    }

    regoffs_c(chan: number): number {
        return ch_c[this.percussion_mode ? 1 : 0][chan];
    }

    // ---- Depack dispatch ----

    depack(source: Uint8Array, srcsize: number, dest: Uint8Array, dstsize: number): number {
        return a2t_depack(this.ffver, source, srcsize, dest, dstsize);
    }

    // ---- Per-channel state view helpers ----

    private effSlot(slot: number, chan: number): number {
        return slot * MAX_CHANNELS + chan;
    }
    private effSlot3(slot: number, chan: number): number {
        return (slot * MAX_CHANNELS + chan) * 3;
    }
    private effSlot4(slot: number, chan: number): number {
        return (slot * MAX_CHANNELS + chan) * 4;
    }
    private effSlot5(slot: number, chan: number): number {
        return (slot * MAX_CHANNELS + chan) * 5;
    }
    private effSlot2(slot: number, chan: number): number {
        return (slot * MAX_CHANNELS + chan) * 2;
    }

    ch_event(chan: number): Uint8Array {
        return this.chEventTable.subarray(chan * EVENT_V9_14_SIZE, (chan + 1) * EVENT_V9_14_SIZE);
    }

    ch_effect(slot: number, chan: number): EffectEntry {
        return new EffectEntry(this.chEffectTable, this.effSlot2(slot, chan));
    }

    ch_last_effect(slot: number, chan: number): EffectEntry {
        return new EffectEntry(this.chLastEffect, this.effSlot2(slot, chan));
    }

    ch_glfsld(slot: number, chan: number): EffectEntry {
        return new EffectEntry(this.chGlfsldTable, this.effSlot2(slot, chan));
    }

    ch_porta(slot: number, chan: number): PortaTable {
        return new PortaTable(this.chPortaTable, this.effSlot3(slot, chan));
    }

    ch_arpgg(slot: number, chan: number): ArpggTable {
        return new ArpggTable(this.chArpggTable, this.effSlot4(slot, chan));
    }

    ch_vibr(slot: number, chan: number): VibrTable {
        return new VibrTable(this.chVibrTable, this.effSlot5(slot, chan));
    }

    ch_trem(slot: number, chan: number): TremTable {
        return new TremTable(this.chTremTable, this.effSlot5(slot, chan));
    }

    ch_macro(chan: number): MacroTable {
        return new MacroTable(this.chMacroTable, chan * MACRO_TABLE_STRIDE);
    }

    ch_tremor(slot: number, chan: number): TremorTable {
        return new TremorTable(this.chTremorTable, this.effSlot3(slot, chan));
    }

    ch_fslide(slot: number, chan: number): number {
        return this.chFslideTable[this.effSlot(slot, chan)];
    }

    set_ch_fslide(slot: number, chan: number, v: number) {
        this.chFslideTable[this.effSlot(slot, chan)] = v;
    }

    ch_retrig(slot: number, chan: number): number {
        return this.chRetrigTable[this.effSlot(slot, chan)];
    }

    set_ch_retrig(slot: number, chan: number, v: number) {
        this.chRetrigTable[this.effSlot(slot, chan)] = v;
    }

    ch_loop(chan: number, row: number): number {
        return this.chLoopTable[chan * 256 + row];
    }

    set_ch_loop(chan: number, row: number, v: number) {
        this.chLoopTable[chan * 256 + row] = v;
    }

    // ====================================================================
    //  FormatPlayer interface
    // ====================================================================

    static probe(buffer) {
        if (buffer.length < 10) return false;
        const header = String.fromCharCode.apply(null, buffer.slice(0, 10));
        if (header === "_A2module_") return true;
        if (buffer.length >= 15) {
            const tiny = String.fromCharCode.apply(null, buffer.slice(0, 15));
            if (tiny === "_A2tiny_module_") return true;
        }
        return false;
    }

    // ====================================================================
    //  Loader — a2_import / a2m_import / a2t_import
    // ====================================================================

    load(buffer: Uint8Array): boolean {
        const ok = this.a2_import(buffer);
        if (ok) {
            // Detect loop target pattern from pattern_order
            // pattern_order entries >= 0x80 are loop markers (0x80 + target_pattern)
            this.loopOrder = -1;
            for (let i = 0; i < 128; i++) {
                const entry = this.songinfo.pattern_order[i];
                if (entry >= 0x80) {
                    this.loopOrder = entry - 0x80;
                    break;
                }
            }
            this.rewind(0);
        }
        return ok;
    }

    // ---- helpers ----

    private is_data_empty(data: Uint8Array, size: number): boolean {
        for (let i = 0; i < size; i++) if (data[i]) return false;
        return true;
    }

    private init_songdata(): void {
        this.songinfo = {
            songname: "",
            composer: "",
            instr_names: [],
            pattern_order: new Uint8Array(128).fill(0x80),
            tempo: this.tempo,
            speed: this.speed,
            common_flag: 0,
            patt_len: 64,
            nm_tracks: 18,
            macro_speedup: 1,
            flag_4op: 0,
            lock_flags: new Uint8Array(20),
            bpm_rows_per_beat: 0,
            bpm_tempo_finetune: 0,
        };
        this.playback_speed_shift = 0;
        this.speed_update = false;
        this.lockvol = false;
        this.panlock = false;
        this.lockVP = false;
        this.tremolo_depth = 0;
        this.vibrato_depth = 0;
        this.volume_scaling = false;
        this.percussion_mode = false;
        // adsr_carrier for v1-4 effect conversion (up to 20 channels in editor mode)
        this.adsr_carrier = [];
        for (let i = 0; i < 20; i++) this.adsr_carrier[i] = false;
    }

    private instruments_allocate(number: number): void {
        if (this.editor_mode) number = 255;
        // Pool already allocated in constructor; just set count
        this.instrInfo.count = number;
        this.instrInfo.size = number;
        // Reset instrExt
        this.instrExt = [];
        for (let i = 0; i < number; i++) this.instrExt.push({ fmreg: 0, arpeggio: 0, vibrato: 0, dis_fmreg_cols: 0 });
    }

    private fmdata_fill_from_raw(dst_offset: number, src: Uint8Array, src_offset: number): void {
        for (let i = 0; i < 11; i++) this.instrPool[dst_offset + i] = src[src_offset + i];
    }

    private instrument_import(ins: number, srci: Uint8Array, srcoff: number): void {
        const off = (ins - 1) * INSTR_SIZE;
        this.fmdata_fill_from_raw(off, srci, srcoff);
        this.instrPool[off + 11] = srci[srcoff + 11] & 3; // panning
        this.instrPool[off + 12] = srci[srcoff + 12]; // fine_tune
        this.instrPool[off + 13] = this.ffver >= 9 ? srci[srcoff + 13] : 0; // perc_voice
        if ((this.instrPool[off + 11] & 3) >= 3) this.instrPool[off + 11] = 0;
    }

    private parse_common_flag(cf: number): void {
        this.speed_update = (cf >> 0) & 1;
        this.lockvol = (cf >> 1) & 1;
        this.lockVP = (cf >> 2) & 1;
        this.tremolo_depth = (cf >> 3) & 1;
        this.vibrato_depth = (cf >> 4) & 1;
        this.panlock = (cf >> 5) & 1;
        this.percussion_mode = (cf >> 6) & 1;
        this.volume_scaling = (cf >> 7) & 1;
    }

    // ---- a2m_import (module format) ----

    private a2_import(buf: Uint8Array): boolean {
        if (buf.length > 10) {
            const magic = String.fromCharCode(
                buf[0],
                buf[1],
                buf[2],
                buf[3],
                buf[4],
                buf[5],
                buf[6],
                buf[7],
                buf[8],
                buf[9],
            );
            if (magic === "_A2module_") return this.a2m_import(buf);
        }
        if (buf.length > 15) {
            const tiny = String.fromCharCode(
                buf[0],
                buf[1],
                buf[2],
                buf[3],
                buf[4],
                buf[5],
                buf[6],
                buf[7],
                buf[8],
                buf[9],
                buf[10],
                buf[11],
                buf[12],
                buf[13],
                buf[14],
            );
            if (tiny === "_A2tiny_module_") return this.a2t_import(buf);
        }
        return false;
    }

    private a2m_import(buf: Uint8Array): boolean {
        if (buf.length < 16) return false;
        this.init_songdata();
        this.len = [];
        this.ffver = buf[14];
        this.type = 0;
        if (!this.ffver || this.ffver > 14) return false;
        const npatt = buf[15];
        let offset = 16;

        // Read varheader (len[])
        const vresult = this.a2m_read_varheader(buf, offset, npatt, buf.length - offset);
        if (vresult === -1) return false;
        offset += vresult;

        // Read songdata
        const sdresult = this.a2m_read_songdata(buf, offset, buf.length - offset);
        if (sdresult === -1) return false;
        offset += sdresult;

        // Decode common_flag into percussion_mode / depths / lock flags etc.
        // (C a2t_load module path does this right after reading the songinfo.)
        this.parse_common_flag(this.songinfo.common_flag);

        // Allocate patterns
        this.patterns_allocate(npatt, this.songinfo.nm_tracks, this.songinfo.patt_len);

        // Read patterns
        const presult = this.a2m_read_patterns(buf, offset, buf.length - offset);
        if (presult === -1) return false;

        return true;
    }

    private a2m_read_varheader(buf: Uint8Array, off: number, npatt: number, size: number): number {
        let lensize: number;
        const maxblock = this.ffver < 5 ? ((npatt / 16) | 0) + 1 : ((npatt / 8) | 0) + 1;
        if (this.ffver < 5) lensize = 5;
        else if (this.ffver < 9) lensize = 9;
        else lensize = 17;

        if (this.ffver >= 1 && this.ffver <= 8) {
            if (lensize * 2 > size) return -1;
            for (let i = 0; i < lensize && i <= maxblock; i++)
                this.len[i] = buf[off + i * 2] | (buf[off + i * 2 + 1] << 8);
            return lensize * 2;
        } else if (this.ffver >= 9) {
            if (lensize * 4 > size) return -1;
            for (let i = 0; i < lensize; i++)
                this.len[i] =
                    (buf[off + i * 4] |
                        (buf[off + i * 4 + 1] << 8) |
                        (buf[off + i * 4 + 2] << 16) |
                        (buf[off + i * 4 + 3] << 24)) >>>
                    0;
            return lensize * 4;
        }
        return -1;
    }

    private a2m_read_songdata(buf: Uint8Array, off: number, size: number): number {
        if (this.ffver < 9) {
            if (this.len[0] > size) return -1;
            const unpacked = new Uint8Array(11717);
            this.depack(buf.subarray(off, off + this.len[0]), this.len[0], unpacked, 11717);

            // Song name (Pascal string: skip length byte)
            let s = "";
            const snlen = Math.min(unpacked[0], 42);
            for (let i = 0; i < snlen; i++) s += String.fromCharCode(unpacked[1 + i]);
            this.songinfo.songname = s;

            // Composer
            s = "";
            const clen = Math.min(unpacked[43], 42);
            for (let i = 0; i < clen; i++) s += String.fromCharCode(unpacked[44 + i]);
            this.songinfo.composer = s;

            // Count instruments
            let count = 250;
            while (count && this.is_data_empty(unpacked.subarray(8336 + (count - 1) * 13, 8336 + count * 13), 13))
                count--;

            this.instruments_allocate(count);
            for (let i = 0; i < count; i++) this.instrument_import(i + 1, unpacked, 8336 + i * 13);

            // Instrument names
            for (let i = 0; i < 250; i++) {
                const nlen = Math.min(unpacked[86 + i * 33], 32);
                s = "";
                for (let j = 0; j < nlen; j++) s += String.fromCharCode(unpacked[87 + i * 33 + j]);
                this.songinfo.instr_names[i] = s;
            }

            // Pattern order
            for (let i = 0; i < 128; i++) this.songinfo.pattern_order[i] = unpacked[11586 + i];

            this.songinfo.tempo = unpacked[11714];
            this.songinfo.speed = unpacked[11715];
            if (this.ffver > 4) this.songinfo.common_flag = unpacked[11716];

            return this.len[0];
        } else {
            if (this.len[0] > size) return -1;
            const unpacked = new Uint8Array(1138338);
            // aPlib (v9-11) streams have no embedded EOS and the C++ implementation reads
            // past len[0] into subsequent blocks to find the EOS. Pass the full remaining
            // buffer to replicate that behaviour. v12-14 use LZH which has an embedded size.
            const aplib = this.ffver <= 11;
            this.depack(aplib ? buf.subarray(off) : buf.subarray(off, off + this.len[0]),
                        aplib ? size : this.len[0], unpacked, 1138338);

            // Song name
            let s = "";
            const snlen = Math.min(unpacked[0], 42);
            for (let i = 0; i < snlen; i++) s += String.fromCharCode(unpacked[1 + i]);
            this.songinfo.songname = s;

            // Composer
            s = "";
            const clen = Math.min(unpacked[43], 42);
            for (let i = 0; i < clen; i++) s += String.fromCharCode(unpacked[44 + i]);
            this.songinfo.composer = s;

            // Count instruments
            let count = 255;
            while (count && this.is_data_empty(unpacked.subarray(11051 + (count - 1) * 14, 11051 + count * 14), 14))
                count--;

            this.instruments_allocate(count);
            for (let i = 0; i < count; i++) this.instrument_import(i + 1, unpacked, 11051 + i * 14);

            // Instrument names
            for (let i = 0; i < 255; i++) {
                const nlen = Math.min(unpacked[86 + i * 43], 42);
                s = "";
                for (let j = 0; j < nlen; j++) s += String.fromCharCode(unpacked[87 + i * 43 + j]);
                this.songinfo.instr_names[i] = s;
            }

            // FM register tables
            this.fmreg_table_allocate(count, unpacked, 14621);

            // Copy arpeggio/vibrato refs from fmreg headers
            for (let i = 0; i < count; i++) {
                const ext = this.instrExt[i];
                if (!ext.fmreg) continue;
                const fmoff = (ext.fmreg - 1) * FMREG_TABLE_SIZE;
                ext.arpeggio = this.fmregPool[fmoff + 4];
                ext.vibrato = this.fmregPool[fmoff + 5];
            }

            // Arpeggio/vibrato tables
            this.arpvib_tables_allocate(255, unpacked, 991526);

            // Pattern order
            for (let i = 0; i < 128; i++) this.songinfo.pattern_order[i] = unpacked[1124381 + i];
            this.songinfo.tempo = unpacked[1124509];
            this.songinfo.speed = unpacked[1124510];
            this.songinfo.common_flag = unpacked[1124511];
            this.songinfo.patt_len = unpacked[1124512] | (unpacked[1124513] << 8);
            this.songinfo.nm_tracks = unpacked[1124514];
            this.songinfo.macro_speedup = unpacked[1124515] | (unpacked[1124516] << 8);
            this.songinfo.flag_4op = unpacked[1124517];
            for (let i = 0; i < 20; i++) this.songinfo.lock_flags[i] = unpacked[1124518 + i];

            // Disabled FM regs
            this.disabled_fmregs_import(count, unpacked, 1130042);

            // BPM data
            this.songinfo.bpm_rows_per_beat = unpacked[1138335];
            this.songinfo.bpm_tempo_finetune = ((unpacked[1138336] | (unpacked[1138337] << 8)) << 16) >> 16;

            return this.len[0];
        }
    }

    // ---- a2t_import (tiny module format) ----

    private a2t_import(buf: Uint8Array): boolean {
        if (buf.length < 23) return false;
        this.init_songdata();
        this.len = [];
        this.ffver = buf[19];
        this.type = 1;
        if (!this.ffver || this.ffver > 14) return false;
        this.songinfo.tempo = buf[21];
        this.songinfo.speed = buf[22];
        let offset = 23;

        // Read varheader
        const vresult = this.a2t_read_varheader(buf, offset, buf.length - offset);
        if (vresult === -1) return false;
        offset += vresult;

        // Common flag
        this.parse_common_flag(this.songinfo.common_flag);

        // Instruments
        const iresult = this.a2t_read_instruments(buf, offset, buf.length - offset);
        if (iresult === -1) return false;
        offset += iresult;

        // FM reg tables
        const fresult = this.a2t_read_fmregtable(buf, offset, buf.length - offset);
        if (fresult === -1) return false;
        offset += fresult;

        // Arpeggio/vibrato tables
        const aresult = this.a2t_read_arpvibtable(buf, offset, buf.length - offset);
        if (aresult === -1) return false;
        offset += aresult;

        // Disabled FM regs
        const dresult = this.a2t_read_disabled_fmregs(buf, offset, buf.length - offset);
        if (dresult === -1) return false;
        offset += dresult;

        // Pattern order
        const oresult = this.a2t_read_order(buf, offset, buf.length - offset);
        if (oresult === -1) return false;
        offset += oresult;

        // Allocate patterns
        this.patterns_allocate(buf[20], this.songinfo.nm_tracks, this.songinfo.patt_len);

        // Read patterns
        const presult = this.a2t_read_patterns(buf, offset, buf.length - offset);
        if (presult === -1) return false;

        return true;
    }

    private a2t_read_varheader(buf: Uint8Array, off: number, size: number): number {
        switch (this.ffver) {
            case 1:
            case 2:
            case 3:
            case 4:
                if (12 > size) return -1;
                for (let i = 0; i < 6; i++) this.len[i] = buf[off + i * 2] | (buf[off + i * 2 + 1] << 8);
                return 12;
            case 5:
            case 6:
            case 7:
            case 8:
                if (21 > size) return -1;
                this.songinfo.common_flag = buf[off];
                for (let i = 0; i < 10; i++) this.len[i] = buf[off + 1 + i * 2] | (buf[off + 1 + i * 2 + 1] << 8);
                return 21;
            case 9:
                if (86 > size) return -1;
                this.songinfo.common_flag = buf[off];
                this.songinfo.patt_len = buf[off + 1] | (buf[off + 2] << 8);
                this.songinfo.nm_tracks = buf[off + 3];
                this.songinfo.macro_speedup = buf[off + 4] | (buf[off + 5] << 8);
                for (let i = 0; i < 20; i++)
                    this.len[i] =
                        (buf[off + 6 + i * 4] |
                            (buf[off + 6 + i * 4 + 1] << 8) |
                            (buf[off + 6 + i * 4 + 2] << 16) |
                            (buf[off + 6 + i * 4 + 3] << 24)) >>>
                        0;
                return 86;
            case 10:
                if (107 > size) return -1;
                this.songinfo.common_flag = buf[off];
                this.songinfo.patt_len = buf[off + 1] | (buf[off + 2] << 8);
                this.songinfo.nm_tracks = buf[off + 3];
                this.songinfo.macro_speedup = buf[off + 4] | (buf[off + 5] << 8);
                this.songinfo.flag_4op = buf[off + 6];
                for (let i = 0; i < 20; i++) this.songinfo.lock_flags[i] = buf[off + 7 + i];
                for (let i = 0; i < 20; i++)
                    this.len[i] =
                        (buf[off + 27 + i * 4] |
                            (buf[off + 27 + i * 4 + 1] << 8) |
                            (buf[off + 27 + i * 4 + 2] << 16) |
                            (buf[off + 27 + i * 4 + 3] << 24)) >>>
                        0;
                return 107;
            case 11:
            case 12:
            case 13:
            case 14:
                if (111 > size) return -1;
                this.songinfo.common_flag = buf[off];
                this.songinfo.patt_len = buf[off + 1] | (buf[off + 2] << 8);
                this.songinfo.nm_tracks = buf[off + 3];
                this.songinfo.macro_speedup = buf[off + 4] | (buf[off + 5] << 8);
                this.songinfo.flag_4op = buf[off + 6];
                for (let i = 0; i < 20; i++) this.songinfo.lock_flags[i] = buf[off + 7 + i];
                for (let i = 0; i < 21; i++)
                    this.len[i] =
                        (buf[off + 27 + i * 4] |
                            (buf[off + 27 + i * 4 + 1] << 8) |
                            (buf[off + 27 + i * 4 + 2] << 16) |
                            (buf[off + 27 + i * 4 + 3] << 24)) >>>
                        0;
                return 111;
        }
        return -1;
    }

    private a2t_read_instruments(buf: Uint8Array, off: number, size: number): number {
        if (this.len[0] > size) return -1;
        const instnum = this.ffver < 9 ? 250 : 255;
        const instsize = this.ffver < 9 ? 13 : 14;
        let unpackedsize = instnum * instsize;
        if (this.ffver >= 12 && this.ffver <= 14) unpackedsize += 3 + 129 + 1024;
        if (this.ffver === 14) unpackedsize += 3; // BPM_DATA_SIZE
        const unpacked = new Uint8Array(unpackedsize);

        const aplib = this.ffver >= 9 && this.ffver <= 11;
        this.depack(aplib ? buf.subarray(off) : buf.subarray(off, off + this.len[0]),
                    aplib ? size : this.len[0], unpacked, unpackedsize);

        let p = 0;
        // Skip BPM data (v14), ins_4op_flags (v12+), reserved (v12+)
        if (this.ffver === 14) p += 3;
        if (this.ffver >= 12 && this.ffver <= 14) p += 129 + 1024;

        // Count actual instruments
        let count = instnum;
        while (
            count &&
            this.is_data_empty(unpacked.subarray(p + (count - 1) * instsize, p + count * instsize), instsize)
        )
            count--;

        this.instruments_allocate(count);
        for (let i = 0; i < count; i++, p += instsize) this.instrument_import(i + 1, unpacked, p);

        return this.len[0];
    }

    private a2t_read_fmregtable(buf: Uint8Array, off: number, size: number): number {
        if (this.ffver < 9) return 0;
        if (this.len[1] > size) return -1;

        const unpacked = new Uint8Array(255 * 3831);
        const aplib = this.ffver <= 11;
        this.depack(aplib ? buf.subarray(off) : buf.subarray(off, off + this.len[1]),
                    aplib ? size : this.len[1], unpacked, 255 * 3831);

        this.fmreg_table_allocate(this.instrInfo.count, unpacked, 0);

        // Copy arpeggio/vibrato refs
        for (let i = 0; i < this.instrInfo.count; i++) {
            const ext = this.instrExt[i];
            if (!ext.fmreg) continue;
            const fmoff = (ext.fmreg - 1) * FMREG_TABLE_SIZE;
            ext.arpeggio = this.fmregPool[fmoff + 4];
            ext.vibrato = this.fmregPool[fmoff + 5];
        }

        return this.len[1];
    }

    private a2t_read_arpvibtable(buf: Uint8Array, off: number, size: number): number {
        if (this.ffver < 9) return 0;
        if (this.len[2] > size) return -1;

        const unpacked = new Uint8Array(255 * 521);
        const aplib = this.ffver <= 11;
        this.depack(aplib ? buf.subarray(off) : buf.subarray(off, off + this.len[2]),
                    aplib ? size : this.len[2], unpacked, 255 * 521);

        this.arpvib_tables_allocate(255, unpacked, 0);

        return this.len[2];
    }

    private a2t_read_disabled_fmregs(buf: Uint8Array, off: number, size: number): number {
        if (this.ffver < 11) return 0;
        if (this.len[3] > size) return -1;

        const unpacked = new Uint8Array(255 * 28);
        const aplib = this.ffver <= 11;
        this.depack(aplib ? buf.subarray(off) : buf.subarray(off, off + this.len[3]),
                    aplib ? size : this.len[3], unpacked, 255 * 28);

        this.disabled_fmregs_import(this.instrInfo.count, unpacked, 0);

        return this.len[3];
    }

    private a2t_read_order(buf: Uint8Array, off: number, size: number): number {
        const blocknum = [1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 4, 4, 4, 4];
        const i = blocknum[this.ffver - 1];
        if (this.len[i] > size) return -1;

        const tmp = new Uint8Array(128);
        const aplib = this.ffver >= 9 && this.ffver <= 11;
        this.depack(aplib ? buf.subarray(off) : buf.subarray(off, off + this.len[i]),
                    aplib ? size : this.len[i], tmp, 128);
        this.songinfo.pattern_order.set(tmp);

        return this.len[i];
    }

    // ---- patterns (common for a2m/a2t) ----

    private patterns_allocate(patterns: number, channels: number, rows: number): void {
        if (this.editor_mode) {
            patterns = 128;
            channels = 20;
            rows = 256;
        }
        // Store allocation dimensions only (C++ eventsinfo). These drive pool
        // addressing and the pattern-read loop. They must NOT overwrite the
        // musical values in songinfo (patt_len/nm_tracks) which are read from the
        // file and drive playback — in editor_mode rows/channels are forced to
        // 256/20, so clobbering songinfo makes every pattern wrap at 256 rows.
        this.num_patterns = patterns;   // C++ eventsinfo->patterns
        this.ev_channels = channels;    // C++ eventsinfo->channels
        this.ev_rows = rows;            // C++ eventsinfo->rows
        // re-allocate pool if needed
        const needed = patterns * MAX_CHANNELS * MAX_ROWS * EVENT_V9_14_SIZE;
        if (this.patternPool.length < needed) this.patternPool = new Uint8Array(needed);
    }

    private a2_read_patterns(src: Uint8Array, s: number, size: number): number {
        let retval = 0;
        let srcOff = 0;

        switch (this.ffver) {
            case 1:
            case 2:
            case 3:
            case 4: {
                const old = new Uint8Array(16 * 2304);
                for (let i = 0; i < 4; i++) {
                    if (!this.len[i + s]) continue;
                    if (this.len[i + s] > size) return -1;

                    this.depack(src.subarray(srcOff, srcOff + this.len[i + s]), this.len[i + s], old, 16 * 2304);

                    for (let p = 0; p < 16; p++) {
                        if (i * 8 + p >= this.num_patterns) break;
                        for (let r = 0; r < 64; r++)
                            for (let c = 0; c < 9; c++) {
                                const evOff = p * 2304 + r * 9 * 4 + c * 4;
                                const ev = this.get_event_p(i * 16 + p, c, r);
                                ev[0] = old[evOff];
                                ev[1] = old[evOff + 1];
                                ev[2] = old[evOff + 2];
                                ev[3] = old[evOff + 3];
                                this.convert_v1234_effects(ev, c);
                            }
                    }
                    srcOff += this.len[i + s];
                    size -= this.len[i + s];
                    retval += this.len[i + s];
                }
                break;
            }
            case 5:
            case 6:
            case 7:
            case 8: {
                const old = new Uint8Array(8 * 4608);
                for (let i = 0; i < 8; i++) {
                    if (!this.len[i + s]) continue;
                    if (this.len[i + s] > size) return -1;

                    this.depack(src.subarray(srcOff, srcOff + this.len[i + s]), this.len[i + s], old, 8 * 4608);

                    for (let p = 0; p < 8; p++) {
                        if (i * 8 + p >= this.num_patterns) break;
                        for (let c = 0; c < 18; c++)
                            for (let r = 0; r < 64; r++) {
                                const evOff = p * 4608 + c * 64 * 4 + r * 4;
                                const ev = this.get_event_p(i * 8 + p, c, r);
                                ev[0] = old[evOff];
                                ev[1] = old[evOff + 1];
                                const eDef = old[evOff + 2];
                                const eVal = old[evOff + 3];
                                if (eDef === 22) {
                                    if (((eVal >> 4) | 0) !== 0) {
                                        ev[2] = ef_Extended2;
                                        ev[3] = (ef_ex2_FineTuneUp << 4) | ((eVal >> 4) | 0);
                                    } else {
                                        ev[2] = ef_Extended2;
                                        ev[3] = (ef_ex2_FineTuneDown << 4) | (eVal & 0xf);
                                    }
                                } else {
                                    ev[2] = eDef;
                                    ev[3] = eVal;
                                }
                            }
                    }
                    srcOff += this.len[i + s];
                    size -= this.len[i + s];
                    retval += this.len[i + s];
                }
                break;
            }
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14: {
                const old = new Uint8Array(8 * 30720);
                const aplib = this.ffver <= 11;
                for (let i = 0; i < 16; i++) {
                    if (!this.len[i + s]) continue;
                    if (this.len[i + s] > size) return -1;

                    this.depack(aplib ? src.subarray(srcOff) : src.subarray(srcOff, srcOff + this.len[i + s]),
                                aplib ? size : this.len[i + s], old, 8 * 30720);
                    srcOff += this.len[i + s];
                    size -= this.len[i + s];
                    retval += this.len[i + s];

                    for (let p = 0; p < 8; p++) {
                        if (i * 8 + p >= this.num_patterns) break;
                        for (let c = 0; c < this.ev_channels; c++)          // C++ eventsinfo->channels
                            for (let r = 0; r < this.ev_rows; r++) {         // C++ eventsinfo->rows
                                const evOff = p * 30720 + c * 256 * 6 + r * 6;
                                const ev = this.get_event_p(i * 8 + p, c, r);
                                ev[0] = old[evOff];
                                ev[1] = old[evOff + 1];
                                ev[2] = old[evOff + 2];
                                ev[3] = old[evOff + 3];
                                ev[4] = old[evOff + 4];
                                ev[5] = old[evOff + 5];
                            }
                    }
                }
                break;
            }
        }
        return retval;
    }

    private a2t_read_patterns(buf: Uint8Array, off: number, size: number): number {
        const blockstart = [2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 5, 5, 5, 5];
        const s = blockstart[this.ffver - 1];
        return this.a2_read_patterns(buf.subarray(off), s, size);
    }

    private a2m_read_patterns(buf: Uint8Array, off: number, size: number): number {
        return this.a2_read_patterns(buf.subarray(off), 1, size);
    }

    private convert_v1234_effects(ev: Uint8Array, chan: number): void {
        const def = ev[2];
        const val = ev[3];
        switch (def) {
            case 0x00:
                ev[2] = 0;
                break; // Arpeggio → ef_Arpeggio (0x80 in new format, but stored as 0 during conversion)
            case 0x01:
                ev[2] = ef_FSlideUp;
                break;
            case 0x02:
                ev[2] = ef_FSlideDown;
                break;
            case 0x03:
                ev[2] = ef_FSlideUpFine;
                break;
            case 0x04:
                ev[2] = ef_FSlideDownFine;
                break;
            case 0x05:
                ev[2] = ef_TonePortamento;
                break;
            case 0x06:
                ev[2] = ef_TPortamVolSlide;
                break;
            case 0x07:
                ev[2] = ef_Vibrato;
                break;
            case 0x08:
                ev[2] = ef_VibratoVolSlide;
                break;
            case 0x09: // SetOpIntensity
                if (val & 0xf0) {
                    ev[2] = ef_SetCarrierVol;
                    ev[3] = ((val >> 4) * 4 + 3) & 0xff;
                } else if (val & 0x0f) {
                    ev[2] = ef_SetModulatorVol;
                    ev[3] = ((val & 0x0f) * 4 + 3) & 0xff;
                } else ev[2] = 0;
                break;
            case 0x0a:
                ev[2] = ef_SetInsVolume;
                break;
            case 0x0b:
                ev[2] = ef_PatternBreak;
                break;
            case 0x0c:
                ev[2] = ef_PositionJump;
                break;
            case 0x0d:
                ev[2] = ef_SetSpeed;
                break;
            case 0x0e:
                ev[2] = ef_SetTempo;
                break;
            case 0x0f: {
                // Extended
                const sub = val >> 4;
                const lo = val & 0x0f;
                switch (sub) {
                    case 0x00:
                        ev[2] = ef_Extended;
                        ev[3] = (ef_ex_SetTremDepth << 4) | lo;
                        break;
                    case 0x01:
                        ev[2] = ef_Extended;
                        ev[3] = (ef_ex_SetVibDepth << 4) | lo;
                        break;
                    case 0x02: // DefWaveform
                        ev[2] = ef_SetWaveform;
                        ev[3] = lo < 4 ? (lo << 4) | 0x0f : (lo - 4) | 0xf0;
                        break;
                    case 0x03:
                        ev[2] = ef_Extended2;
                        ev[3] = (ef_ex2_FineTuneUp << 4) | lo;
                        break;
                    case 0x04:
                        ev[2] = ef_Extended2;
                        ev[3] = (ef_ex2_FineTuneDown << 4) | lo;
                        break;
                    case 0x05:
                        ev[2] = ef_VolSlide;
                        ev[3] = lo << 4;
                        break;
                    case 0x06:
                        ev[2] = ef_VolSlide;
                        ev[3] = lo;
                        break;
                    case 0x07:
                        ev[2] = ef_VolSlideFine;
                        ev[3] = lo << 4;
                        break;
                    case 0x08:
                        ev[2] = ef_VolSlideFine;
                        ev[3] = lo;
                        break;
                    case 0x09:
                        ev[2] = ef_RetrigNote;
                        ev[3] = lo + 1;
                        break;
                    case 0x0a:
                        ev[2] = ef_Extended;
                        ev[3] = ((this.adsr_carrier[chan] ? ef_ex_SetAttckRateC : ef_ex_SetAttckRateM) << 4) | lo;
                        break;
                    case 0x0b:
                        ev[2] = ef_Extended;
                        ev[3] = ((this.adsr_carrier[chan] ? ef_ex_SetDecayRateC : ef_ex_SetDecayRateM) << 4) | lo;
                        break;
                    case 0x0c:
                        ev[2] = ef_Extended;
                        ev[3] = ((this.adsr_carrier[chan] ? ef_ex_SetSustnLevelC : ef_ex_SetSustnLevelM) << 4) | lo;
                        break;
                    case 0x0d:
                        ev[2] = ef_Extended;
                        ev[3] = ((this.adsr_carrier[chan] ? ef_ex_SetRelRateC : ef_ex_SetRelRateM) << 4) | lo;
                        break;
                    case 0x0e:
                        ev[2] = ef_Extended;
                        ev[3] = (ef_ex_SetFeedback << 4) | lo;
                        break;
                    case 0x0f: // ExtendedCmd
                        ev[2] = ef_Extended;
                        ev[3] = ef_ex_ExtendedCmd2 << 4;
                        if (lo < 10) {
                            const cmds = [
                                ef_ex_cmd2_RSS,
                                ef_ex_cmd2_LockVol,
                                ef_ex_cmd2_UnlockVol,
                                ef_ex_cmd2_LockVP,
                                ef_ex_cmd2_UnlockVP,
                                0,
                                0,
                                ef_ex_cmd2_VSlide_car,
                                ef_ex_cmd2_VSlide_mod,
                                ef_ex_cmd2_VSlide_def,
                            ];
                            if (lo === 5) {
                                ev[2] = 0;
                                ev[3] = 0;
                                this.adsr_carrier[chan] = true;
                            } else if (lo === 6) {
                                ev[2] = 0;
                                ev[3] = 0;
                                this.adsr_carrier[chan] = false;
                            } else ev[3] |= cmds[lo];
                        } else {
                            ev[2] = 0;
                            ev[3] = 0;
                        }
                        break;
                }
                break;
            }
            default:
                ev[2] = 0;
                ev[3] = 0;
        }
    }

    // ---- FM register macro table allocation ----

    private fmreg_table_allocate(n: number, src: Uint8Array, srcoff: number): void {
        if (this.editor_mode) n = 255;
        for (let i = 0; i < n; i++, srcoff += FMREG_TABLE_SIZE) {
            const ext = this.instrExt[i];
            // Always store data in pool (editor_mode)
            for (let j = 0; j < FMREG_TABLE_SIZE; j++) this.fmregPool[i * FMREG_TABLE_SIZE + j] = src[srcoff + j];
            const headerLinks = src[srcoff + 1] | src[srcoff + 2] | src[srcoff + 3] | src[srcoff + 4] | src[srcoff + 5];
            if (this.editor_mode || src[srcoff] || headerLinks) ext.fmreg = i + 1;
        }
    }

    // ---- Arpeggio/vibrato table allocation ----

    private arpvib_tables_allocate(n: number, src: Uint8Array, srcoff: number): void {
        if (this.editor_mode) n = 255;
        for (let i = 0; i < n; i++, srcoff += 521) {
            // Arpeggio part (260 bytes)
            for (let j = 0; j < 260; j++) this.arpvibPool[i * 521 + j] = src[srcoff + j];
            // Vibrato part (261 bytes)
            for (let j = 0; j < 261; j++) this.arpvibPool[i * 521 + 260 + j] = src[srcoff + 260 + j];
        }
    }

    // ---- Disabled FM regs import ----

    private disabled_fmregs_import(n: number, src: Uint8Array, srcoff: number): void {
        if (this.editor_mode) n = 255;
        for (let i = 0; i < n; i++) {
            let result = 0;
            for (let bit = 0; bit < 28; bit++) result |= (src[srcoff + i * 28 + bit] & 1) << bit;
            this.instrExt[i].dis_fmreg_cols = result;
        }
    }

    // ====================================================================
    //  Playback engine
    // ====================================================================

    update(): boolean {
        this.newtimer();
        return !this.songend;
    }

    rewind(subsong: number): void {
        this.chip = 0;
        this.opl.init();
        // C a2t_play() calls a2t_stop() before init_player(). a2t_stop() runs
        // release_sustaining_sound() over all 20 channels, which writes the
        // 0x40+m/c=0x3f, 0x60=0xff, 0x80=0xff release pattern into the shadow
        // registers. init_player() does NOT touch 0x40/0x60, so those writes
        // persist into frame 0 — matching the C reference dump.
        this.a2t_stop();
        // a2t_stop() resets lockvol/panlock/lockVP to false. In C these are
        // re-established by a2_import() which runs *between* a2t_stop() and
        // init_player() inside a2t_play(). Here import already happened at file
        // load, so re-derive the lock flags from the stored common_flag before
        // init_player()/init_buffers() consumes them.
        this.parse_common_flag(this.songinfo.common_flag);
        this.init_player();
        this.songend = false;
        // Don't reset order - it's already set to loop target by update_song_position()
        if (this.songinfo.pattern_order[this.current_order] > 0x7f) return;
        this.current_pattern = this.songinfo.pattern_order[this.current_order];
        this.current_line = 0;
        this.pattern_break = false;
        this.pattern_break_from_bxx = false;
        this.pattern_delay = false;
        this.tickXF = 0;
        this.ticks = 0;
        // tick0 / tickD MUST be reset too. poll_proc() gates row advancement on
        // `ticks - tick0 + 1 >= speed`; if tick0 keeps a stale value from before
        // the rewind (while ticks is zeroed), the delta goes negative and no rows
        // play until ticks slowly climbs back past tick0 — causing the A2M
        // "silence after loop" gap and wrong seek landing position.
        this.tick0 = 0;
        this.tickD = 0;
        this.next_line = 0;
        this.irq_mode = true;
        this.play_status = 0;
        this.ticklooper = 0;
        this.macro_ticklooper = 0;
        this.speed = this.songinfo.speed;
        this.macro_speedup = this.songinfo.macro_speedup;
        this.update_timer(this.songinfo.tempo);
    }

    getrefresh(): number {
        return this.tempo * (this.macro_speedup || 1);
    }

    gettype(): string {
        return "Adlib Tracker 2" + (this.type === 1 ? " (tiny module " : " (v") + this.ffver + ")";
    }

    gettitle(): string {
        return this.songinfo ? this.songinfo.songname || "" : "";
    }

    getauthor(): string {
        return this.songinfo ? this.songinfo.composer || "" : "";
    }

    getinstruments(): number {
        return this.instrInfo.count;
    }

    getinstrument(n: number): string {
        return n < this.instrInfo.count ? this.songinfo.instr_names[n] || "" : "";
    }

    // ---- Player init ----

    private init_player(): void {
        this.opl2out(0x01, 0);
        for (let i = 0; i < 18; i++) this.opl2out(0xb0 + this.regoffs_n(i), 0);
        for (let i = 0x80; i <= 0x8d; i++) this.opl2out(i, 0xff);
        for (let i = 0x90; i <= 0x95; i++) this.opl2out(i, 0xff);
        this.misc_register = (this.tremolo_depth << 7) + (this.vibrato_depth << 6) + (this.percussion_mode << 5);
        this.opl2out(0x01, 0x20);
        this.opl2out(0x08, 0x40);
        this.opl3exp(0x0105);
        this.opl3exp(0x04 + (this.songinfo.flag_4op << 8));
        this.init_buffers();
        this.key_off(16);
        this.key_off(17);
        this.opl2out(0xbd, this.misc_register);
        this.current_tremolo_depth = this.tremolo_depth;
        this.current_vibrato_depth = this.vibrato_depth;
        this.global_volume = 63;
        this.vibtrem_speed_factor = 1;
        this.vibtrem_table_size = 32;
        this.vibtrem_table.set(def_vibtrem_table);
        for (let i = 0; i < 20; i++) {
            this.chArpggTable[i * 4 + 0] = 1;
            this.chArpggTable[20 * 4 + i * 4 + 0] = 1;
            this.chVoiceTable[i] = i + 1;
        }
    }

    private init_buffers(): void {
        this.chEventTable.fill(0);
        this.chVoiceTable.fill(0);
        this.chFreqTable.fill(0);
        this.chZeroFqTable.fill(0);
        this.chModulatorVol.fill(0);
        this.chCarrierVol.fill(0);
        this.chVolumeLock.fill(0);
        this.chVol4opLock.fill(0);
        this.chPeakLock.fill(0);
        this.chPanLock.fill(0);
        this.chPanningTable.fill(0);
        this.chKeyoffLoop.fill(0);
        this.chPortaFK.fill(0);
        this.chResetChan.fill(0);
        this.chLoopbckTable.fill(0);
        this.chLoopTable.fill(0);
        this.chNotedelTable.fill(0);
        this.chNotecutTable.fill(0);
        this.chFtuneTable.fill(0);
        this.chVolslideType.fill(0);
        this.chEffectTable.fill(0);
        this.chFslideTable.fill(0);
        this.chGlfsldTable.fill(0);
        this.chLastEffect.fill(0);
        this.chPortaTable.fill(0);
        this.chArpggTable.fill(0);
        this.chVibrTable.fill(0);
        this.chTremTable.fill(0);
        this.chRetrigTable.fill(0);
        this.chTremorTable.fill(0);
        this.chMacroTable.fill(0);

        if (!this.lockvol) {
            this.chVolumeLock.fill(0);
        } else {
            for (let i = 0; i < 20; i++) this.chVolumeLock[i] = (this.songinfo.lock_flags[i] >> 4) & 1;
        }
        if (!this.panlock) {
            this.chPanningTable.fill(0);
            this.chPanLock.fill(0);
        } else {
            for (let i = 0; i < 20; i++) {
                this.chPanningTable[i] = this.songinfo.lock_flags[i] & 3;
                this.chPanLock[i] = 1;
            }
        }
        if (!this.lockVP) {
            this.chPeakLock.fill(0);
        } else {
            for (let i = 0; i < 20; i++) this.chPeakLock[i] = (this.songinfo.lock_flags[i] >> 5) & 1;
        }
        const _4op_main_chan = [1, 3, 5, 10, 12, 14];
        for (let i = 0; i < 6; i++) {
            this.chVol4opLock[_4op_main_chan[i]] =
                (this.songinfo.lock_flags[_4op_main_chan[i]] | 0x40) === this.songinfo.lock_flags[_4op_main_chan[i]]
                    ? 1
                    : 0;
            this.chVol4opLock[_4op_main_chan[i] - 1] =
                (this.songinfo.lock_flags[_4op_main_chan[i] - 1] | 0x40) ===
                this.songinfo.lock_flags[_4op_main_chan[i] - 1]
                    ? 1
                    : 0;
        }
        for (let i = 0; i < 20; i++) this.chVolslideType[i] = (this.songinfo.lock_flags[i] >> 2) & 3;
        this.chNotedelTable.fill(0xff);
        this.chNotecutTable.fill(0xff);
        this.chLoopbckTable.fill(0xff);
        this.chLoopTable.fill(0xff);
    }

    a2t_stop(): void {
        this.irq_mode = false;
        this.play_status = 2;
        this.global_volume = 63;
        this.current_tremolo_depth = this.tremolo_depth;
        this.current_vibrato_depth = this.vibrato_depth;
        this.pattern_break = false;
        this.current_order = 0;
        this.current_pattern = 0;
        this.current_line = 0;
        this.playback_speed_shift = 0;
        for (let i = 0; i < 20; i++) this.release_sustaining_sound(i);
        this.opl2out(0xbd, 0);
        this.opl3exp(0x0004);
        this.opl3exp(0x0005);
        this.lockvol = false;
        this.panlock = false;
        this.lockVP = false;
        this.init_buffers();
        this.speed = 4;
        this.update_timer(50);
    }

    // ---- Timer ----

    private set_clock_rate(clock_rate: number): void {}
    private _macro_speedup(): number {
        return this.macro_speedup || 1;
    }

    private update_timer(Hz: number): void {
        if (Hz === 0) {
            this.set_clock_rate(0);
            return;
        }
        this.tempo = Hz;
        if (this.tempo === 18 && this.timer_fix) this.IRQ_freq = Math.round((this.tempo + 0.2) * 20.0);
        else this.IRQ_freq = 250;
        while (this.IRQ_freq % (this.tempo * this._macro_speedup()) !== 0) this.IRQ_freq++;
        if (this.IRQ_freq > 1000) this.IRQ_freq = 1000;
        while (this.IRQ_freq + this.playback_speed_shift > 1000 && this.playback_speed_shift > 0)
            this.playback_speed_shift--;
        this.set_clock_rate(1193180 / Math.max(this.IRQ_freq + this.playback_speed_shift, 1000));
    }

    private update_playback_speed(speed_shift: number): void {
        if (!speed_shift) return;
        if (speed_shift > 0 && this.IRQ_freq + this.playback_speed_shift + speed_shift > 1000)
            while (this.IRQ_freq + this.playback_speed_shift + speed_shift > 1000) speed_shift--;
        else if (speed_shift < 0 && this.IRQ_freq + this.playback_speed_shift + speed_shift < 50)
            while (this.IRQ_freq + this.playback_speed_shift + speed_shift < 50) speed_shift++;
        this.playback_speed_shift += speed_shift;
        this.update_timer(this.tempo);
    }

    private init_irq(): void {
        if (this.irq_initialized) return;
        this.irq_initialized = true;
        this.update_timer(50);
    }

    private done_irq(): void {
        if (!this.irq_initialized) return;
        this.irq_initialized = false;
        this.irq_mode = true;
        this.update_timer(0);
        this.irq_mode = false;
    }

    // ---- newtimer / poll_proc / macro_poll_proc ----

    private newtimer(): void {
        if (this.ticklooper === 0 && this.irq_mode) {
            this.poll_proc();
            if (this.IRQ_freq !== this.tempo * this._macro_speedup())
                this.IRQ_freq = (this.tempo < 18 ? 18 : this.tempo) * this._macro_speedup();
        }
        if (this.macro_ticklooper === 0 && this.irq_mode) this.macro_poll_proc();
        this.ticklooper++;
        if (this.ticklooper >= this.IRQ_freq / this.tempo) this.ticklooper = 0;
        this.macro_ticklooper++;
        if (this.macro_ticklooper >= this.IRQ_freq / (this.tempo * this._macro_speedup())) this.macro_ticklooper = 0;
    }

    private poll_proc(): void {
        if (this.pattern_delay) {
            this.update_effects();
            this.ticks++;
            if (this.tickD > 1) {
                this.tickD--;
            } else {
                this.tick0 = this.ticks;
                this.update_song_position();
                this.pattern_delay = false;
            }
        } else {
            if (this.ticks - this.tick0 + 1 >= this.speed) {
                this.play_line();
                this.update_effects();
                if (!this.pattern_delay) this.update_song_position();
                this.tick0 = this.ticks;
            } else {
                this.update_effects();
                this.ticks++;
            }
        }

        // Check if we've reached the loop target pattern (after position update)
        if (this.current_order === this.loopOrder) {
            this._loopStart = true;
        }

        this.tickXF++;
        if (this.tickXF % 4 === 0) {
            this.update_extra_fine_effects();
            this.tickXF -= 4;
        }
    }

    private macro_poll_proc(): void {
        const IDLE = 0xfff,
            FINISHED = 0xffff;
        for (let c = 0; c < this.songinfo.nm_tracks; c++) {
            const ff = this.chKeyoffLoop[c] ? IDLE : FINISHED;
            const mo = c * MACRO_TABLE_STRIDE;
            let fp = this.chMacroTable[mo] | (this.chMacroTable[mo + 1] << 8);
            let fd = this.chMacroTable[mo + 2];
            const fi = this.chMacroTable[mo + 8];
            if (fi) {
                const ext = this.get_instr_ext(fi);
                const rt = ext?.fmreg ? this.get_fmreg_table(ext.fmreg) : null;
                if (!rt || rt[0] === 0) fp = FINISHED;
                if (rt && rt[0] && this.speed) {
                    if (fd > 1) {
                        fd--;
                    } else {
                        const len = rt[0],
                            lb = rt[1],
                            ll = rt[2],
                            kp = rt[3];
                        if (fp <= len) {
                            if (lb && ll) {
                                if (fp === lb + ll - 1) fp = lb;
                                else if (fp < len) fp++;
                                else fp = FINISHED;
                            } else {
                                if (fp < len) fp++;
                                else fp = FINISHED;
                            }
                        } else fp = FINISHED;
                        if ((this.chFreqTable[c] | 0x2000) === this.chFreqTable[c] && kp && fp >= kp) fp = IDLE;
                        else if (
                            (this.chFreqTable[c] | 0x2000) !== this.chFreqTable[c] &&
                            fp &&
                            kp &&
                            (fp < kp || fp === IDLE)
                        )
                            fp = kp;
                        if (fp && fp !== IDLE && fp !== FINISHED) {
                            const co = (ext.fmreg - 1) * FMREG_TABLE_SIZE + 6 + (fp - 1) * 15;
                            const cell = this.fmregPool.subarray(co, co + 15);
                            fd = cell[14];
                            if (fd) {
                                const dis = this.instrExt[fi - 1].dis_fmreg_cols;
                                let fmk = false;
                                if (fp === 1) {
                                    const ad = dis & 0xff0f;
                                    if (this.is_ins_adsr_data_empty(this.chVoiceTable[c]) && !ad) fmk = true;
                                }
                                for (let b = 0; b < 28; b++) {
                                    if (dis & (1 << b)) continue;
                                    const fm = new FMInstData(cell, 0);
                                    if (b === 0) this.chFmparTable[c].attckM = fm.attckM;
                                    else if (b === 1) this.chFmparTable[c].decM = fm.decM;
                                    else if (b === 2) this.chFmparTable[c].sustnM = fm.sustnM;
                                    else if (b === 3) this.chFmparTable[c].relM = fm.relM;
                                    else if (b === 4) this.chFmparTable[c].wformM = fm.wformM;
                                    else if (b === 5) this.set_ins_volume(63 - fm.volM, 0xff, c);
                                    else if (b === 6) this.chFmparTable[c].kslM = fm.kslM;
                                    else if (b === 7) this.chFmparTable[c].multipM = fm.multipM;
                                    else if (b === 8) this.chFmparTable[c].tremM = fm.tremM;
                                    else if (b === 9) this.chFmparTable[c].vibrM = fm.vibrM;
                                    else if (b === 10) this.chFmparTable[c].ksrM = fm.ksrM;
                                    else if (b === 11) this.chFmparTable[c].sustM = fm.sustM;
                                    else if (b === 12) this.chFmparTable[c].attckC = fm.attckC;
                                    else if (b === 13) this.chFmparTable[c].decC = fm.decC;
                                    else if (b === 14) this.chFmparTable[c].sustnC = fm.sustnC;
                                    else if (b === 15) this.chFmparTable[c].relC = fm.relC;
                                    else if (b === 16) this.chFmparTable[c].wformC = fm.wformC;
                                    else if (b === 17) this.set_ins_volume(0xff, 63 - fm.volC, c);
                                    else if (b === 18) this.chFmparTable[c].kslC = fm.kslC;
                                    else if (b === 19) this.chFmparTable[c].multipC = fm.multipC;
                                    else if (b === 20) this.chFmparTable[c].tremC = fm.tremC;
                                    else if (b === 21) this.chFmparTable[c].vibrC = fm.vibrC;
                                    else if (b === 22) this.chFmparTable[c].ksrC = fm.ksrC;
                                    else if (b === 23) this.chFmparTable[c].sustC = fm.sustC;
                                    else if (b === 24) this.chFmparTable[c].connect = fm.connect;
                                    else if (b === 25) this.chFmparTable[c].feedb = fm.feedb;
                                    else if (b === 27 && !this.chPanLock[c]) {
                                        this.chPanningTable[c] = cell[13];
                                    }
                                }
                                this.update_modulator_adsrw(c);
                                this.update_carrier_adsrw(c);
                                this.update_fmpar(c);
                                const mf = cell[10] & 0xf0;
                                if (fmk || mf & 0x80) {
                                    if (!(this.is_4op_chan(c) && this.is_4op_chan_hi(c))) {
                                        this.output_note(
                                            this.chEventTable[c * 6],
                                            this.chEventTable[c * 6 + 1],
                                            c,
                                            false,
                                            true,
                                        );
                                        if (this.is_4op_chan(c) && this.is_4op_chan_lo(c))
                                            this.init_macro_table(c - 1, 0, this.chVoiceTable[c - 1], 0);
                                    }
                                } else if (mf & 0x40) {
                                    this.key_on(c);
                                    this.change_freq(c, this.chFreqTable[c]);
                                } else if (mf & 0x20) {
                                    if (this.chFreqTable[c]) {
                                        this.chZeroFqTable[c] = this.chFreqTable[c];
                                        this.chFreqTable[c] &= ~0x1fff;
                                        this.change_freq(c, this.chFreqTable[c]);
                                    }
                                } else if (this.chZeroFqTable[c]) {
                                    this.chFreqTable[c] = this.chZeroFqTable[c];
                                    this.chZeroFqTable[c] = 0;
                                    this.change_freq(c, this.chFreqTable[c]);
                                }
                                const fs = ((cell[11] | (cell[12] << 8)) << 16) >> 16;
                                if (!(dis & (1 << 26))) {
                                    if (fs > 0) this.portamento_up(c, fs, nFreq(12 * 8 + 1));
                                    else if (fs < 0) this.portamento_down(c, Math.abs(fs), nFreq(0));
                                }
                            }
                        }
                    }
                }
            }
            this.chMacroTable[mo] = fp & 0xff;
            this.chMacroTable[mo + 1] = (fp >> 8) & 0xff;
            this.chMacroTable[mo + 2] = fd;

            // Arpeggio macro
            const at = this.chMacroTable[mo + 9];
            const arp = this.get_arpeggio_table(at);
            let ap = this.chMacroTable[mo + 4] | (this.chMacroTable[mo + 5] << 8);
            let ac = this.chMacroTable[mo + 3];
            if (arp && arp[0] && arp[1]) {
                if (ac === arp[1]) {
                    ac = 1;
                    const al = arp[0],
                        alb = arp[2],
                        all = arp[3],
                        akp = arp[4];
                    if (ap <= al) {
                        if (alb && all) {
                            if (ap === alb + all - 1) ap = alb;
                            else if (ap < al) ap++;
                            else ap = FINISHED;
                        } else {
                            if (ap < al) ap++;
                            else ap = FINISHED;
                        }
                    } else ap = FINISHED;
                    if ((this.chFreqTable[c] | 0x2000) === this.chFreqTable[c] && akp && ap >= akp) ap = IDLE;
                    else if (
                        (this.chFreqTable[c] | 0x2000) !== this.chFreqTable[c] &&
                        ap &&
                        akp &&
                        (ap < akp || ap === IDLE)
                    )
                        ap = akp;
                    if (ap && ap !== IDLE && ap !== FINISHED) {
                        const ft = this.get_instr_fine_tune(this.chEventTable[c * 6 + 1]);
                        const d = arp[4 + ap];
                        const an = this.chMacroTable[mo + 10];
                        if (d === 0) this.change_frequency(c, nFreq(an - 1) + ft);
                        else if (d <= 96) this.change_frequency(c, nFreq(Math.min(an + d, 97) - 1) + ft);
                        else if (d >= 0x80 && d <= 0x80 + 12 * 8 + 1)
                            this.change_frequency(c, nFreq(d - 0x80 - 1) + ft);
                    }
                } else ac++;
            }
            this.chMacroTable[mo + 3] = ac;
            this.chMacroTable[mo + 4] = ap & 0xff;
            this.chMacroTable[mo + 5] = (ap >> 8) & 0xff;

            // Vibrato macro
            const vt = this.chMacroTable[mo + 11];
            const vib = this.get_vibrato_table(vt);
            let vp = this.chMacroTable[mo + 6] | (this.chMacroTable[mo + 7] << 8);
            let vc = this.chMacroTable[mo + 12];
            let vd = this.chMacroTable[mo + 16];
            const vf = this.chMacroTable[mo + 14] | (this.chMacroTable[mo + 15] << 8);
            if (vib && vib[0] && vib[1] && !this.chMacroTable[mo + 13]) {
                if (vc === vib[1]) {
                    if (vd !== 0) {
                        vd--;
                    } else {
                        vc = 1;
                        const vl = vib[0],
                            vlb = vib[3],
                            vll = vib[4],
                            vkp = vib[5];
                        if (vp <= vl) {
                            if (vlb && vll) {
                                if (vp === vlb + vll - 1) vp = vlb;
                                else if (vp < vl) vp++;
                                else vp = FINISHED;
                            } else {
                                if (vp < vl) vp++;
                                else vp = FINISHED;
                            }
                        } else vp = FINISHED;
                        if ((this.chFreqTable[c] | 0x2000) === this.chFreqTable[c] && vkp && vp >= vkp) vp = IDLE;
                        else if (
                            (this.chFreqTable[c] | 0x2000) !== this.chFreqTable[c] &&
                            vp &&
                            vkp &&
                            (vp < vkp || vp === IDLE)
                        )
                            vp = vkp;
                        if (vp && vp !== IDLE && vp !== FINISHED) {
                            const d = (vib[5 + vp] << 24) >> 24; // int8_t: sign-extend
                            if (d > 0) this.macro_vibrato__porta_up(c, d);
                            else if (d < 0) this.macro_vibrato__porta_down(c, Math.abs(d));
                            else this.change_freq(c, vf);
                        }
                    }
                } else vc++;
            }
            this.chMacroTable[mo + 6] = vp & 0xff;
            this.chMacroTable[mo + 7] = (vp >> 8) & 0xff;
            this.chMacroTable[mo + 12] = vc;
            this.chMacroTable[mo + 16] = vd;
        }
    }

    // ---- Song position ----

    private set_current_order(new_order: number): void {
        if (new_order >= 0x80) new_order = 0;
        this.current_order = new_order;
        if (this.songinfo.pattern_order[this.current_order] < 0x80) return;
        let i = 0;
        do {
            if (this.songinfo.pattern_order[this.current_order] > 0x7f) {
                const oo = this.current_order;
                this.current_order = this.songinfo.pattern_order[this.current_order] - 0x80;
                if (this.current_order <= oo) {
                    this.songend = true;
                    this._loopEnd = true;
                }
            }
            i++;
        } while (i < 128 && this.songinfo.pattern_order[this.current_order] > 0x7f);
        if (i >= 128) {
            this.songend = true;
            this._loopEnd = true;
            this.a2t_stop();
        }
    }

    private calc_following_order(order: number): number {
        let r = -1,
            idx = order,
            jc = 0;
        do {
            if (this.songinfo.pattern_order[idx] < 0x80) r = idx;
            else idx = this.songinfo.pattern_order[idx] - 0x80;
            jc++;
        } while (!(jc > 0x7f || r !== -1));
        return r;
    }

    private update_song_position(): void {
        if (this.current_line < this.songinfo.patt_len - 1 && !this.pattern_break) {
            this.current_line++;
        } else {
            const dpl = this.pattern_break && (this.next_line & 0xf0) === 0xe0;
            const dpj = this.pattern_break && this.pattern_break_from_bxx && (this.next_line & 0xf0) === 0xf0;
            if (dpl) {
                const xc = this.next_line - 0xe0;
                this.next_line = this.chLoopbckTable[xc];
                if (this.chLoopTable[xc * 256 + this.current_line]) this.chLoopTable[xc * 256 + this.current_line]--;
            } else {
                this.chLoopbckTable.fill(0xff);
                this.chLoopTable.fill(0xff);
                if (dpj) {
                    const oo = this.current_order,
                        xc = this.next_line - 0xf0;
                    const sl = this.chEventTable[xc * 6 + 2] === ef_PositionJump ? 0 : 1;
                    const vl = this.chEventTable[xc * 6 + 3 + sl * 2];
                    this.set_current_order(vl);
                    if (this.current_order <= oo) {
                        this.songend = true;
                        this._loopEnd = true;
                    }
                    if (vl === 0 && oo) {
                        this.global_volume = 63;
                        this.set_global_volume();
                    }
                    this.pattern_break = false;
                } else {
                    const no = this.current_order < 0x7f ? this.current_order + 1 : 0,
                        oo = this.current_order;
                    this.set_current_order(no);
                    if (this.current_order === 0 && oo) {
                        this.global_volume = 63;
                        this.set_global_volume();
                    }
                }
            }
            if (this.songinfo.pattern_order[this.current_order] > 0x7f) return;
            this.current_pattern = this.songinfo.pattern_order[this.current_order];

            if (!this.pattern_break) this.current_line = 0;
            else {
                this.pattern_break = false;
                this.current_line = this.next_line;
            }
        }
        for (let c = 0; c < this.songinfo.nm_tracks; c++) {
            this.chGlfsldTable[c * 2] = 0;
            this.chGlfsldTable[c * 2 + 1] = 0;
            this.chGlfsldTable[40 + c * 2] = 0;
            this.chGlfsldTable[40 + c * 2 + 1] = 0;
        }
        if (this.speed_update && this.current_line === 0 && this.current_order === this.calc_following_order(0)) {
            this.tempo = this.songinfo.tempo;
            this.speed = this.songinfo.speed;
            this.update_timer(this.tempo);
        }
    }

    // ---- play_line ----

    private play_line(): void {
        const events: number[][] = [];
        for (let c = 0; c < this.songinfo.nm_tracks; c++) {
            for (let s = 0; s < 2; s++) {
                const ei = s * 40 + c * 2;
                if (this.chEffectTable[ei] | this.chEffectTable[ei + 1]) {
                    this.chLastEffect[ei] = this.chEffectTable[ei];
                    this.chLastEffect[ei + 1] = this.chEffectTable[ei + 1];
                }
                if (this.chGlfsldTable[ei] | this.chGlfsldTable[ei + 1]) {
                    this.chEffectTable[ei] = this.chGlfsldTable[ei];
                    this.chEffectTable[ei + 1] = this.chGlfsldTable[ei + 1];
                } else this.chEffectTable[ei] = 0;
            }
            this.chFtuneTable[c] = 0;
            const ev = this.get_event_p(this.current_pattern, c, this.current_line);
            const e = [ev[0], ev[1], ev[2], ev[3], ev[4], ev[5]];
            events[c] = e;
            if (e[0] === 0xff) e[0] = this.chEventTable[c * 6] | 0x80;
            else if (e[0] >= 0x91 && e[0] <= 0x91 + 97) e[0] -= 0x90;
            for (let s = 0; s < 2; s++) if (e[2 + s * 2] === 0 && e[3 + s * 2]) e[2 + s * 2] = 0x80;
            if (e[0] || e[1] || e[2] | e[3] || e[4] | e[5]) {
                this.chEventTable[c * 6 + 2] = e[2];
                this.chEventTable[c * 6 + 3] = e[3];
                this.chEventTable[c * 6 + 4] = e[4];
                this.chEventTable[c * 6 + 5] = e[5];
            }
            this.set_ins_data(e[1], c);
            this.process_effects_prepare(e, 0, c);
            this.process_effects_prepare(e, 1, c);
            this.play_line_arpgg_cleanup(e, c);
            this.play_line_apply_global_fslide_row(e, c);
            this.play_line_tremor_row_reset(e, c);
        }
        for (let c = 0; c < this.songinfo.nm_tracks; c++) this.process_effects(events[c], 0, c);
        for (let c = 0; c < this.songinfo.nm_tracks; c++) this.process_effects(events[c], 1, c);
        for (let c = 0; c < this.songinfo.nm_tracks; c++) {
            for (let s = 0; s < 2; s++) {
                const ei = s * 40 + c * 2;
                if (!events[c][2 + s * 2] && !events[c][3 + s * 2]) {
                    if (!this.chGlfsldTable[ei] && !this.chGlfsldTable[ei + 1]) {
                        this.chEffectTable[ei] = 0;
                        this.chEffectTable[ei + 1] = 0;
                    }
                } else {
                    this.chEventTable[c * 6 + 2 + s * 2] = events[c][2 + s * 2];
                    this.chEventTable[c * 6 + 3 + s * 2] = events[c][3 + s * 2];
                }
            }
        }
        for (let c = 0; c < this.songinfo.nm_tracks; c++) {
            this.new_process_note(events[c], c);
            this.check_swap_arp_vibr(events[c], 0, c);
            this.check_swap_arp_vibr(events[c], 1, c);
            this.update_fine_effects(0, c);
            this.update_fine_effects(1, c);
        }
    }

    // ---- Effect helpers ----

    private no_loop(current_chan: number, cl: number): boolean {
        for (let c = 0; c < current_chan; c++)
            if (this.chLoopTable[c * 256 + cl] && this.chLoopTable[c * 256 + cl] !== 0xff) return false;
        return true;
    }

    private get_effect_group(def: number): number {
        if (def === ef_ArpggVSlide || def === ef_ArpggVSlideFine) return 1;
        if (def >= ef_FSlideUpVSlide && def <= ef_FSlDownFineVSlF) return 2;
        if (def === ef_TonePortamento) return 3;
        if (def === ef_Vibrato || def === ef_ExtraFineVibrato) return 4;
        if (def === ef_Tremolo || def === ef_ExtraFineTremolo) return 5;
        if (def === ef_TPortamVolSlide || def === ef_TPortamVSlideFine) return 6;
        if (def === ef_VibratoVolSlide || def === ef_VibratoVSlideFine) return 7;
        if (def === ef_RetrigNote || def === ef_MultiRetrigNote) return 8;
        return -1;
    }

    private update_effect_table(slot: number, chan: number, eg: number, def: number, val: number): void {
        const ei = slot * 40 + chan * 2;
        this.chEffectTable[ei] = def;
        if (val) this.chEffectTable[ei + 1] = val;
        else if (this.get_effect_group(this.chLastEffect[ei]) === eg && this.chLastEffect[ei + 1])
            this.chEffectTable[ei + 1] = this.chLastEffect[ei + 1];
        else this.chEffectTable[ei + 1] = 0;
    }

    private play_line_arpgg_cleanup(event: number[], chan: number): void {
        for (let s = 0; s < 2; s++) {
            const def = event[2 + s * 2],
                val = event[3 + s * 2];
            const arp = (def === ef_Arpeggio && val) || def === ef_ExtraFineArpeggio;
            const ai = s * 80 + chan * 4;
            if (!arp && this.chArpggTable[ai + 1] && this.chArpggTable[ai] !== 1) {
                this.chArpggTable[ai] = 1;
                this.change_frequency(
                    chan,
                    nFreq(this.chArpggTable[ai + 1] - 1) + this.get_instr_fine_tune(this.chEventTable[chan * 6 + 1]),
                );
            }
        }
    }

    private play_line_apply_global_fslide_row(event: number[], chan: number): void {
        for (let s = 0; s < 2; s++) {
            const def = event[2 + s * 2],
                val = event[3 + s * 2];
            if (def !== ef_GlobalFSlideUp && def !== ef_GlobalFSlideDown) continue;
            const os = s ^ 1,
                od = event[2 + os * 2],
                ov = event[3 + os * 2];
            if (od === ef_Extended && ov === ef_ex_ExtendedCmd * 16 + ef_ex_cmd_ForceBpmSld) {
                if (def === ef_GlobalFSlideUp) this.update_playback_speed(val);
                else this.update_playback_speed(-val);
            } else {
                let eff: number;
                if (def === ef_GlobalFSlideUp) {
                    eff = ef_FSlideUp;
                    if (od === ef_Extended && ov === ef_ex_ExtendedCmd2 * 16 + ef_ex_cmd2_FTrm_XFGFS)
                        eff = ef_GlobalFreqSlideUpXF;
                    if (od === ef_Extended && ov === ef_ex_ExtendedCmd2 * 16 + ef_ex_cmd2_FVib_FGFS)
                        eff = ef_FSlideUpFine;
                } else {
                    eff = ef_FSlideDown;
                    if (od === ef_Extended && ov === ef_ex_ExtendedCmd2 * 16 + ef_ex_cmd2_FTrm_XFGFS)
                        eff = ef_GlobalFreqSlideDnXF;
                    if (od === ef_Extended && ov === ef_ex_ExtendedCmd2 * 16 + ef_ex_cmd2_FVib_FGFS)
                        eff = ef_FSlideDownFine;
                }
                this.chEffectTable[s * 40 + chan * 2] = eff;
                this.chEffectTable[s * 40 + chan * 2 + 1] = val;
                for (let c = chan; c < this.songinfo.nm_tracks; c++) {
                    this.chFslideTable[s * 20 + c] = val;
                    this.chGlfsldTable[s * 40 + c * 2] = eff;
                    this.chGlfsldTable[s * 40 + c * 2 + 1] = val;
                }
            }
        }
    }

    private play_line_tremor_row_reset(event: number[], chan: number): void {
        for (let s = 0; s < 2; s++) {
            const ti = s * 60 + chan * 3;
            if (this.chTremorTable[ti] && event[2 + s * 2] !== ef_Tremor) {
                this.chTremorTable[ti] = 0;
                this.set_ins_volume(this.chTremorTable[ti + 1], this.chTremorTable[ti + 2], chan);
            }
        }
    }

    // ---- Process effects ----

    private process_effects_prepare(event: number[], slot: number, chan: number): void {
        const def = event[2 + slot * 2];
        if (
            def !== ef_Vibrato &&
            def !== ef_ExtraFineVibrato &&
            def !== ef_VibratoVolSlide &&
            def !== ef_VibratoVSlideFine
        ) {
            const vi = slot * 100 + chan * 5;
            for (let i = 0; i < 5; i++) this.chVibrTable[vi + i] = 0;
        }
        if (def !== ef_RetrigNote && def !== ef_MultiRetrigNote) this.chRetrigTable[slot * 20 + chan] = 0;
        if (def !== ef_Tremolo && def !== ef_ExtraFineTremolo) {
            const ti = slot * 100 + chan * 5;
            for (let i = 0; i < 5; i++) this.chTremTable[ti + i] = 0;
        }
    }

    private process_effects(event: number[], slot: number, chan: number): void {
        const def = event[2 + slot * 2],
            val = event[3 + slot * 2];
        const ei = slot * 40 + chan * 2;
        switch (def) {
            case ef_Arpeggio:
            case ef_ExtraFineArpeggio:
            case ef_ArpggVSlide:
            case ef_ArpggVSlideFine: {
                if (def === ef_Arpeggio && !val) break;
                if (def === ef_Arpeggio) {
                    this.chEffectTable[ei] = ef_Arpeggio;
                    this.chEffectTable[ei + 1] = val;
                } else if (def === ef_ExtraFineArpeggio) {
                    this.chEffectTable[ei] = ef_ExtraFineArpeggio;
                    this.chEffectTable[ei + 1] = val;
                } else this.update_effect_table(slot, chan, 1, def, val);
                const rn = event[0] & 0x7f;
                const hn = rn >= 1 && rn <= 97;
                const cn = hn
                    ? rn
                    : (this.chEventTable[chan * 6] & 0x7f) >= 1 && (this.chEventTable[chan * 6] & 0x7f) <= 97
                      ? this.chEventTable[chan * 6] & 0x7f
                      : 0;
                const pd = this.chLastEffect[ei];
                const pa =
                    pd === ef_Arpeggio ||
                    pd === ef_ExtraFineArpeggio ||
                    pd === ef_ArpggVSlide ||
                    pd === ef_ArpggVSlideFine;
                if (cn) {
                    if (hn || !pa) {
                        this.chArpggTable[slot * 80 + chan * 4] = 0;
                    }
                    this.chArpggTable[slot * 80 + chan * 4 + 1] = cn;
                    if (def === ef_Arpeggio || def === ef_ExtraFineArpeggio) {
                        this.chArpggTable[slot * 80 + chan * 4 + 2] = (val >> 4) & 0xf;
                        this.chArpggTable[slot * 80 + chan * 4 + 3] = val & 0xf;
                    }
                } else {
                    this.chEffectTable[ei] = 0;
                    this.chEffectTable[ei + 1] = 0;
                }
                break;
            }
            case ef_FSlideUp:
            case ef_FSlideDown:
            case ef_FSlideUpFine:
            case ef_FSlideDownFine:
                this.chEffectTable[ei] = def;
                this.chEffectTable[ei + 1] = val;
                this.chFslideTable[slot * 20 + chan] = val;
                break;
            case ef_FSlideUpVSlide:
            case ef_FSlUpFineVSlide:
            case ef_FSlideDownVSlide:
            case ef_FSlDownFineVSlide:
            case ef_FSlUpVSlF:
            case ef_FSlDownVSlF:
            case ef_FSlUpFineVSlF:
            case ef_FSlDownFineVSlF:
                this.update_effect_table(slot, chan, 2, def, val);
                break;
            case ef_TonePortamento: {
                const hn = event[0] >= 1 && event[0] <= 97;
                const hc = this.chLastEffect[ei] === ef_TonePortamento;
                if (hn || hc) {
                    if (event[3 + slot * 2]) {
                        this.chEffectTable[ei] = ef_TonePortamento;
                        this.chEffectTable[ei + 1] = val;
                    } else if (hc && this.chLastEffect[ei + 1]) {
                        this.chEffectTable[ei] = ef_TonePortamento;
                        this.chEffectTable[ei + 1] = this.chLastEffect[ei + 1];
                    } else {
                        this.chEffectTable[ei] = ef_TonePortamento;
                        this.chEffectTable[ei + 1] = 0;
                    }
                    this.chPortaTable[slot * 60 + chan * 3 + 2] = this.chEffectTable[ei + 1];
                    if (hn) {
                        const pf = nFreq(event[0] - 1) + this.get_instr_fine_tune(this.chEventTable[chan * 6 + 1]);
                        this.chPortaTable[slot * 60 + chan * 3] = pf & 0xff;
                        this.chPortaTable[slot * 60 + chan * 3 + 1] = (pf >> 8) & 0xff;
                    }
                }
                break;
            }
            case ef_TPortamVolSlide:
            case ef_TPortamVSlideFine:
                this.update_effect_table(slot, chan, 6, def, val);
                break;
            case ef_Vibrato:
            case ef_ExtraFineVibrato: {
                this.update_effect_table(slot, chan, 4, def, val);
                if (
                    event[4 - slot * 2] === ef_Extended &&
                    event[5 - slot * 2] === ef_ex_ExtendedCmd2 * 16 + ef_ex_cmd2_FVib_FGFS
                )
                    this.chVibrTable[slot * 100 + chan * 5 + 4] = 1;
                const m = this.chEffectTable[ei + 1];
                this.chVibrTable[slot * 100 + chan * 5 + 1] = (m / 16) & 0xff;
                this.chVibrTable[slot * 100 + chan * 5 + 2] = m % 16;
                break;
            }
            case ef_Tremolo:
            case ef_ExtraFineTremolo: {
                this.update_effect_table(slot, chan, 5, def, val);
                if (
                    event[4 - slot * 2] === ef_Extended &&
                    event[5 - slot * 2] === ef_ex_ExtendedCmd2 * 16 + ef_ex_cmd2_FTrm_XFGFS
                )
                    this.chTremTable[slot * 100 + chan * 5 + 4] = 1;
                const m = this.chEffectTable[ei + 1];
                this.chTremTable[slot * 100 + chan * 5 + 1] = (m / 16) & 0xff;
                this.chTremTable[slot * 100 + chan * 5 + 2] = m % 16;
                break;
            }
            case ef_VibratoVolSlide:
            case ef_VibratoVSlideFine: {
                this.update_effect_table(slot, chan, 7, def, val);
                if (
                    event[4 - slot * 2] === ef_Extended &&
                    event[5 - slot * 2] === ef_ex_ExtendedCmd2 * 16 + ef_ex_cmd2_FVib_FGFS
                )
                    this.chVibrTable[slot * 100 + chan * 5 + 4] = 1;
                break;
            }
            case ef_SetCarrierVol:
                this.set_ins_volume(0xff, 63 - val, chan);
                this.chEffectTable[ei] = 0;
                break;
            case ef_SetModulatorVol:
                this.set_ins_volume(63 - val, 0xff, chan);
                this.chEffectTable[ei] = 0;
                break;
            case ef_SetInsVolume: {
                const ins = this.get_instr_data_by_ch(chan);
                if (!ins || this.is_data_empty2(ins)) {
                    this.chEffectTable[ei] = 0;
                    break;
                }
                if (this._4op_vol_valid_chan(chan)) this.set_ins_volume_4op(63 - val, chan);
                else if (this.percussion_mode && chan >= 16 && chan <= 19) this.set_ins_volume(63 - val, 0xff, chan);
                else if (!ins.fm.connect) this.set_ins_volume(0xff, 63 - val, chan);
                else this.set_ins_volume(63 - val, 63 - val, chan);
                this.chEffectTable[ei] = 0;
                break;
            }
            case ef_ForceInsVolume: {
                const ins = this.get_instr_data_by_ch(chan);
                if (!ins || this.is_data_empty2(ins)) {
                    this.chEffectTable[ei] = 0;
                    break;
                }
                if (this.percussion_mode && chan >= 16 && chan <= 19) this.set_ins_volume(63 - val, 0xff, chan);
                else if (!ins.fm.connect) this.set_ins_volume(this.scale_volume(ins.fm.volM, 63 - val), 63 - val, chan);
                else this.set_ins_volume(63 - val, 63 - val, chan);
                this.chEffectTable[ei] = 0;
                break;
            }
            case ef_PositionJump:
                if (this.no_loop(chan, this.current_line)) {
                    this.pattern_break = true;
                    this.pattern_break_from_bxx = true;
                    this.next_line = 0xf0 + chan;
                }
                this.chEffectTable[ei] = 0;
                break;
            case ef_PatternBreak:
                if (this.no_loop(chan, this.current_line)) {
                    this.pattern_break = true;
                    this.pattern_break_from_bxx = false;
                    this.next_line = Math.min(val, this.songinfo.patt_len - 1);
                }
                this.chEffectTable[ei] = 0;
                break;
            case ef_SetSpeed:
                this.speed = val;
                this.chEffectTable[ei] = 0;
                break;
            case ef_SetTempo:
                this.update_timer(val);
                this.chEffectTable[ei] = 0;
                break;
            case ef_SetWaveform:
                if (val >> 4 <= 7) {
                    this.chFmparTable[chan].wformC = (val >> 4) & 0xf;
                    this.update_carrier_adsrw(chan);
                }
                if ((val & 0xf) <= 7) {
                    this.chFmparTable[chan].wformM = val & 0xf;
                    this.update_modulator_adsrw(chan);
                }
                this.chEffectTable[ei] = 0;
                break;
            case ef_VolSlide:
            case ef_VolSlideFine:
                this.chEffectTable[ei] = def;
                this.chEffectTable[ei + 1] = val;
                break;
            case ef_RetrigNote:
                if (val) {
                    if (this.get_effect_group(this.chLastEffect[ei]) !== 8) this.chRetrigTable[slot * 20 + chan] = 1;
                    this.chEffectTable[ei] = def;
                    this.chEffectTable[ei + 1] = val;
                }
                break;
            case ef_MultiRetrigNote:
                if (val >> 4) {
                    if (this.get_effect_group(this.chLastEffect[ei]) !== 8) this.chRetrigTable[slot * 20 + chan] = 1;
                    this.chEffectTable[ei] = def;
                    this.chEffectTable[ei + 1] = val;
                }
                break;
            case ef_SetGlobalVolume:
                this.global_volume = val;
                this.set_global_volume();
                this.chEffectTable[ei] = 0;
                break;
            case ef_Tremor:
                if (val) {
                    if (this.chLastEffect[ei] !== 23) {
                        this.chTremorTable[slot * 60 + chan * 3] = 0;
                        this.chTremorTable[slot * 60 + chan * 3 + 1] = this.chFmparTable[chan].volM;
                        this.chTremorTable[slot * 60 + chan * 3 + 2] = this.chFmparTable[chan].volC;
                    }
                    this.chEffectTable[ei] = def;
                    this.chEffectTable[ei + 1] = val;
                }
                break;
            case ef_Extended:
                switch (val >> 4) {
                    case ef_ex_SetTremDepth:
                        if (val & 0xf) {
                            this.opl3out(0xbd, this.misc_register | 0x80);
                            this.current_tremolo_depth = 1;
                        } else {
                            this.opl3out(0xbd, this.misc_register & 0x7f);
                            this.current_tremolo_depth = 0;
                        }
                        break;
                    case ef_ex_SetVibDepth:
                        if (val & 0xf) {
                            this.opl3out(0xbd, this.misc_register | 0x40);
                            this.current_vibrato_depth = 1;
                        } else {
                            this.opl3out(0xbd, this.misc_register & 0xbf);
                            this.current_vibrato_depth = 0;
                        }
                        break;
                    case ef_ex_SetAttckRateM:
                        this.chFmparTable[chan].attckM = val & 0xf;
                        this.update_modulator_adsrw(chan);
                        break;
                    case ef_ex_SetDecayRateM:
                        this.chFmparTable[chan].decM = val & 0xf;
                        this.update_modulator_adsrw(chan);
                        break;
                    case ef_ex_SetSustnLevelM:
                        this.chFmparTable[chan].sustnM = val & 0xf;
                        this.update_modulator_adsrw(chan);
                        break;
                    case ef_ex_SetRelRateM:
                        this.chFmparTable[chan].relM = val & 0xf;
                        this.update_modulator_adsrw(chan);
                        break;
                    case ef_ex_SetAttckRateC:
                        this.chFmparTable[chan].attckC = val & 0xf;
                        this.update_carrier_adsrw(chan);
                        break;
                    case ef_ex_SetDecayRateC:
                        this.chFmparTable[chan].decC = val & 0xf;
                        this.update_carrier_adsrw(chan);
                        break;
                    case ef_ex_SetSustnLevelC:
                        this.chFmparTable[chan].sustnC = val & 0xf;
                        this.update_carrier_adsrw(chan);
                        break;
                    case ef_ex_SetRelRateC:
                        this.chFmparTable[chan].relC = val & 0xf;
                        this.update_carrier_adsrw(chan);
                        break;
                    case ef_ex_SetFeedback:
                        this.chFmparTable[chan].feedb = val & 0xf;
                        this.update_fmpar(chan);
                        break;
                    case ef_ex_SetPanningPos:
                        this.chPanningTable[chan] = val & 0xf;
                        this.update_fmpar(chan);
                        break;
                    case ef_ex_PatternLoop:
                    case ef_ex_PatternLoopRec:
                        if (!(val & 0xf)) this.chLoopbckTable[chan] = this.current_line;
                        else if (this.chLoopbckTable[chan] !== 0xff) {
                            if (this.chLoopTable[chan * 256 + this.current_line] === 0xff)
                                this.chLoopTable[chan * 256 + this.current_line] = val & 0xf;
                            if (this.chLoopTable[chan * 256 + this.current_line]) {
                                this.pattern_break = true;
                                this.pattern_break_from_bxx = false;
                                this.next_line = 0xe0 + chan;
                            } else if (val >> 4 === ef_ex_PatternLoopRec)
                                this.chLoopTable[chan * 256 + this.current_line] = 0xff;
                        }
                        break;
                    case ef_ex_ExtendedCmd:
                        switch (val & 0xf) {
                            case ef_ex_cmd_MKOffLoopDi:
                                this.chKeyoffLoop[chan] = 0;
                                break;
                            case ef_ex_cmd_MKOffLoopEn:
                                this.chKeyoffLoop[chan] = 1;
                                break;
                            case ef_ex_cmd_TPortaFKdis:
                                this.chPortaFK[chan] = 0;
                                break;
                            case ef_ex_cmd_TPortaFKenb:
                                this.chPortaFK[chan] = 1;
                                break;
                            case ef_ex_cmd_RestartEnv:
                                this.key_on(chan);
                                this.change_freq(chan, this.chFreqTable[chan]);
                                break;
                            case ef_ex_cmd_4opVlockOff:
                                if (this.is_4op_chan(chan)) {
                                    this.chVol4opLock[chan] = 0;
                                    const i = this.is_4op_chan_hi(chan) ? 1 : -1;
                                    this.chVol4opLock[chan + i] = 0;
                                }
                                break;
                            case ef_ex_cmd_4opVlockOn:
                                if (this.is_4op_chan(chan)) {
                                    this.chVol4opLock[chan] = 1;
                                    const i = this.is_4op_chan_hi(chan) ? 1 : -1;
                                    this.chVol4opLock[chan + i] = 1;
                                }
                                break;
                        }
                        break;
                    case ef_ex_ExtendedCmd2:
                        switch (val & 0xf) {
                            case ef_ex_cmd2_RSS:
                                this.release_sustaining_sound(chan);
                                break;
                            case ef_ex_cmd2_ResetVol:
                                this.reset_ins_volume(chan);
                                break;
                            case ef_ex_cmd2_LockVol:
                                this.chVolumeLock[chan] = 1;
                                break;
                            case ef_ex_cmd2_UnlockVol:
                                this.chVolumeLock[chan] = 0;
                                break;
                            case ef_ex_cmd2_LockVP:
                                this.chPeakLock[chan] = 1;
                                break;
                            case ef_ex_cmd2_UnlockVP:
                                this.chPeakLock[chan] = 0;
                                break;
                            case ef_ex_cmd2_VSlide_mod:
                                this.chVolslideType[chan] = 0;
                                break;
                            case ef_ex_cmd2_LockPan:
                                this.chPanLock[chan] = 1;
                                break;
                            case ef_ex_cmd2_UnlockPan:
                                this.chPanLock[chan] = 0;
                                break;
                            case ef_ex_cmd2_VibrOff:
                                this.change_frequency(chan, this.chFreqTable[chan]);
                                break;
                            case ef_ex_cmd2_TremOff:
                                if (this.is_4op_chan(chan)) this.set_ins_volume_4op(0xff, chan);
                                else
                                    this.set_ins_volume(
                                        this.chFmparTable[chan].volM,
                                        this.chFmparTable[chan].volC,
                                        chan,
                                    );
                                break;
                            case ef_ex_cmd2_VSlide_car:
                                this.chVolslideType[chan] =
                                    event[4 - slot * 2] === ef_Extended &&
                                    event[5 - slot * 2] === ef_ex_ExtendedCmd2 * 16 + ef_ex_cmd2_VSlide_def
                                        ? 3
                                        : 1;
                                break;
                            case ef_ex_cmd2_VSlide_def:
                                this.chVolslideType[chan] =
                                    event[4 - slot * 2] === ef_Extended &&
                                    event[5 - slot * 2] === ef_ex_ExtendedCmd2 * 16 + ef_ex_cmd2_VSlide_car
                                        ? 3
                                        : 2;
                                break;
                        }
                        break;
                }
                break;
            case ef_Extended2:
                switch (val >> 4) {
                    case ef_ex2_PatDelayFrame:
                        this.pattern_delay = true;
                        this.tickD = val & 0xf;
                        break;
                    case ef_ex2_PatDelayRow:
                        this.pattern_delay = true;
                        this.tickD = this.speed * (val & 0xf);
                        break;
                    case ef_ex2_NoteDelay:
                        this.chEffectTable[ei] = ef_Extended2;
                        this.chEffectTable[ei + 1] = val;
                        this.chNotedelTable[chan] = val & 0xf;
                        break;
                    case ef_ex2_NoteCut:
                        this.chEffectTable[ei] = ef_Extended2;
                        this.chEffectTable[ei + 1] = val;
                        this.chNotecutTable[chan] = val & 0xf;
                        break;
                    case ef_ex2_FineTuneUp:
                        this.chFtuneTable[chan] += val & 0xf;
                        break;
                    case ef_ex2_FineTuneDown:
                        this.chFtuneTable[chan] -= val & 0xf;
                        break;
                    default:
                        this.chEffectTable[ei] = ef_Extended2;
                        this.chEffectTable[ei + 1] = val;
                        break;
                }
                break;
            case ef_Extended3:
                switch (val >> 4) {
                    case ef_ex3_SetConnection:
                        this.chFmparTable[chan].connect = val & 0xf;
                        this.update_fmpar(chan);
                        break;
                    case ef_ex3_SetMultipM:
                        this.chFmparTable[chan].multipM = val & 0xf;
                        this.update_fmpar(chan);
                        break;
                    case ef_ex3_SetKslM:
                        this.chFmparTable[chan].kslM = val & 0xf;
                        this.update_fmpar(chan);
                        break;
                    case ef_ex3_SetTremoloM:
                        this.chFmparTable[chan].tremM = val & 0xf;
                        this.update_fmpar(chan);
                        break;
                    case ef_ex3_SetVibratoM:
                        this.chFmparTable[chan].vibrM = val & 0xf;
                        this.update_fmpar(chan);
                        break;
                    case ef_ex3_SetKsrM:
                        this.chFmparTable[chan].ksrM = val & 0xf;
                        this.update_fmpar(chan);
                        break;
                    case ef_ex3_SetSustainM:
                        this.chFmparTable[chan].sustM = val & 0xf;
                        this.update_fmpar(chan);
                        break;
                    case ef_ex3_SetMultipC:
                        this.chFmparTable[chan].multipC = val & 0xf;
                        this.update_fmpar(chan);
                        break;
                    case ef_ex3_SetKslC:
                        this.chFmparTable[chan].kslC = val & 0xf;
                        this.update_fmpar(chan);
                        break;
                    case ef_ex3_SetTremoloC:
                        this.chFmparTable[chan].tremC = val & 0xf;
                        this.update_fmpar(chan);
                        break;
                    case ef_ex3_SetVibratoC:
                        this.chFmparTable[chan].vibrC = val & 0xf;
                        this.update_fmpar(chan);
                        break;
                    case ef_ex3_SetKsrC:
                        this.chFmparTable[chan].ksrC = val & 0xf;
                        this.update_fmpar(chan);
                        break;
                    case ef_ex3_SetSustainC:
                        this.chFmparTable[chan].sustC = val & 0xf;
                        this.update_fmpar(chan);
                        break;
                }
                break;
        }
    }

    private new_process_note(event: number[], chan: number): void {
        const tp =
            event[2] === ef_TonePortamento ||
            event[2] === ef_TPortamVolSlide ||
            event[2] === ef_TPortamVSlideFine ||
            event[4] === ef_TonePortamento ||
            event[4] === ef_TPortamVolSlide ||
            event[4] === ef_TPortamVSlideFine;
        const nd =
            (event[2] === ef_Extended2 && event[3] / 16 === ef_ex2_NoteDelay) ||
            (event[4] === ef_Extended2 && event[5] / 16 === ef_ex2_NoteDelay);
        const dn = tp || nd;
        if (!event[0]) {
            if (this.chFtuneTable[chan]) this.output_note(0, this.chVoiceTable[chan], chan, true, true);
            return;
        }
        if (event[0] & 0x80) {
            this.key_off(chan);
            return;
        }
        if (!dn) {
            this.output_note(event[0], this.chVoiceTable[chan], chan, true, no_swap_and_restart(event));
            return;
        }
        if (event[0] && tp && this.chEventTable[chan * 6] & 0x80) {
            this.output_note(this.chEventTable[chan * 6] & 0x7f, this.chVoiceTable[chan], chan, false, true);
            return;
        }
        if (event[0]) {
            if (this.chPortaFK[chan] && tp) this.output_note(event[0], event[1], chan, false, true);
            else this.chEventTable[chan * 6] = event[0];
        }
    }

    // ---- Output note ----

    private output_note(note: number, ins: number, chan: number, rm: boolean, ra: boolean): void {
        if (!note && !this.chFtuneTable[chan]) return;
        let freq: number;
        if (note & 0x80 || !(note >= 1 && note <= 97)) {
            freq = this.chFreqTable[chan];
        } else {
            freq = nFreq(note - 1) + this.get_instr_fine_tune(ins);
            if (ra) this.key_on(chan);
            this.chFreqTable[chan] |= 0x2000;
        }
        if (this.chFtuneTable[chan] === -127) this.chFtuneTable[chan] = 0;
        freq += this.chFtuneTable[chan];
        this.change_frequency(chan, freq);
        if (note) {
            this.chEventTable[chan * 6] = note;
            if (this.is_4op_chan(chan) && chan >= 1) this.chEventTable[(chan - 1) * 6] = note;
            if (rm) {
                const fnr =
                    (this.chEventTable[chan * 6 + 2] === ef_Extended &&
                        this.chEventTable[chan * 6 + 3] === ef_ex_ExtendedCmd2 * 16 + ef_ex_cmd2_NoRestart) ||
                    (this.chEventTable[chan * 6 + 4] === ef_Extended &&
                        this.chEventTable[chan * 6 + 5] === ef_ex_ExtendedCmd2 * 16 + ef_ex_cmd2_NoRestart);
                if (!fnr) this.init_macro_table(chan, note, ins, freq);
                else this.chMacroTable[chan * MACRO_TABLE_STRIDE + 10] = note;
            }
        }
    }

    // ---- Key on/off ----

    key_on(chan: number): void {
        this.opl3out(0xb0 + this.regoffs_n(chan + (this.is_4op_chan(chan) && this.is_4op_chan_hi(chan) ? 1 : 0)), 0);
    }

    key_off(chan: number): void {
        this.chFreqTable[chan] &= ~0x2000;
        this.change_frequency(chan, this.chFreqTable[chan]);
        this.chEventTable[chan * 6] |= 0x80;
    }

    release_sustaining_sound(chan: number): void {
        const m = this.regoffs_m(chan),
            c = this.regoffs_c(chan);
        this.opl3out(0x40 + m, 63);
        this.opl3out(0x40 + c, 63);
        const p = this.chFmparTable[chan];
        p.decM = 0;
        p.attckM = 0;
        p.relM = 0;
        p.sustnM = 0;
        p.wformM = 0;
        p.decC = 0;
        p.attckC = 0;
        p.relC = 0;
        p.sustnC = 0;
        p.wformC = 0;
        this.key_on(chan);
        this.opl3out(0x60 + m, 0xff);
        this.opl3out(0x60 + c, 0xff);
        this.opl3out(0x80 + m, 0xff);
        this.opl3out(0x80 + c, 0xff);
        this.key_off(chan);
        this.chEventTable[chan * 6 + 1] = 0;
        this.chResetChan[chan] = 1;
    }

    // ---- Frequency ----

    private change_freq(chan: number, freq: number): void {
        if (this.is_4op_chan(chan) && this.is_4op_chan_hi(chan)) {
            this.chFreqTable[chan + 1] = this.chFreqTable[chan];
            chan++;
        }
        this.chFreqTable[chan] &= ~0x1fff;
        this.chFreqTable[chan] |= freq & 0x1fff;
        const n = this.regoffs_n(chan);
        this.opl3out(0xa0 + n, this.chFreqTable[chan] & 0xff);
        this.opl3out(0xb0 + n, (this.chFreqTable[chan] >> 8) & 0xff);
        if (this.is_4op_chan(chan) && this.is_4op_chan_lo(chan)) this.chFreqTable[chan - 1] = this.chFreqTable[chan];
    }

    private change_frequency(chan: number, freq: number): void {
        this.chMacroTable[chan * MACRO_TABLE_STRIDE + 13] = 1;
        this.change_freq(chan, freq);
        if (this.is_4op_chan(chan)) {
            const i = this.is_4op_chan_hi(chan) ? 1 : -1;
            this.chMacroTable[(chan + i) * MACRO_TABLE_STRIDE + 12] = 1;
            this.chMacroTable[(chan + i) * MACRO_TABLE_STRIDE + 6] = 0;
            this.chMacroTable[(chan + i) * MACRO_TABLE_STRIDE + 7] = 0;
            this.chMacroTable[(chan + i) * MACRO_TABLE_STRIDE + 14] = freq & 0xff;
            this.chMacroTable[(chan + i) * MACRO_TABLE_STRIDE + 15] = (freq >> 8) & 0xff;
            this.chMacroTable[(chan + i) * MACRO_TABLE_STRIDE + 13] = 0;
        }
        this.chMacroTable[chan * MACRO_TABLE_STRIDE + 12] = 1;
        this.chMacroTable[chan * MACRO_TABLE_STRIDE + 6] = 0;
        this.chMacroTable[chan * MACRO_TABLE_STRIDE + 7] = 0;
        this.chMacroTable[chan * MACRO_TABLE_STRIDE + 14] = freq & 0xff;
        this.chMacroTable[chan * MACRO_TABLE_STRIDE + 15] = (freq >> 8) & 0xff;
        this.chMacroTable[chan * MACRO_TABLE_STRIDE + 13] = 0;
    }

    // ---- Volume ----

    private scale_volume(volume: number, sf: number): number {
        return 63 - ((((63 - volume) * (63 - sf) + 31) / 63) | 0);
    }

    private set_ins_volume(modulator: number, carrier: number, chan: number): void {
        const ins = this.get_instr_data_by_ch(chan);
        const vM = ins ? ins.fm.volM : 0,
            vC = ins ? ins.fm.volC : 0,
            conn = ins ? ins.fm.connect : 0;
        const m = this.regoffs_m(chan),
            c = this.regoffs_c(chan);
        if (modulator !== 0xff) {
            const ipc = conn || (this.percussion_mode && chan >= 16);
            this.chFmparTable[chan].volM = modulator;
            let rm: number;
            if (ipc) {
                if (this.volume_scaling) modulator = this.scale_volume(vM, modulator);
                modulator = this.scale_volume(
                    modulator,
                    this.scale_volume(63 - this.global_volume, 63 - this.fade_out_volume),
                );
                rm = this.scale_volume(modulator, 63 - this.overall_volume) + (this.chFmparTable[chan].kslM << 6);
            } else rm = modulator + (this.chFmparTable[chan].kslM << 6);
            this.opl3out(0x40 + m, rm);
            this.chModulatorVol[chan] = 63 - modulator;
        }
        if (carrier !== 0xff) {
            this.chFmparTable[chan].volC = carrier;
            if (this.volume_scaling) carrier = this.scale_volume(vC, carrier);
            carrier = this.scale_volume(carrier, this.scale_volume(63 - this.global_volume, 63 - this.fade_out_volume));
            const rc = this.scale_volume(carrier, 63 - this.overall_volume) + (this.chFmparTable[chan].kslC << 6);
            this.opl3out(0x40 + c, rc);
            this.chCarrierVol[chan] = 63 - carrier;
        }
    }

    private set_volume(mod: number, car: number, chan: number): void {
        const ins = this.get_instr_data_by_ch(chan);
        const vM = ins ? ins.fm.volM : 0,
            vC = ins ? ins.fm.volC : 0;
        const m = this.regoffs_m(chan),
            c = this.regoffs_c(chan);
        if (mod !== 0xff) {
            this.chFmparTable[chan].volM = mod;
            mod = this.scale_volume(vM, mod);
            mod = this.scale_volume(mod, this.scale_volume(63 - this.global_volume, 63 - this.fade_out_volume));
            const rm = this.scale_volume(mod, 63 - this.overall_volume) + (this.chFmparTable[chan].kslM << 6);
            this.opl3out(0x40 + m, rm);
            this.chModulatorVol[chan] = 63 - mod;
        }
        if (car !== 0xff) {
            this.chFmparTable[chan].volC = car;
            car = this.scale_volume(vC, car);
            car = this.scale_volume(car, this.scale_volume(63 - this.global_volume, 63 - this.fade_out_volume));
            const rc = this.scale_volume(car, 63 - this.overall_volume) + (this.chFmparTable[chan].kslC << 6);
            this.opl3out(0x40 + c, rc);
            this.chCarrierVol[chan] = 63 - car;
        }
    }

    private set_ins_volume_4op(volume: number, chan: number): void {
        const d = this.get_4op_data(chan);
        if (!this._4op_vol_valid_chan(chan)) return;
        let m1 = 0xff,
            c1 = 0xff,
            m2 = 0xff,
            c2 = 0xff;
        c1 = volume === 0xff ? this.chFmparTable[d.ch1].volC : volume;
        switch (d.conn) {
            case 0:
                break;
            case 1:
                m2 = volume === 0xff ? this.chFmparTable[d.ch2].volM : volume;
                break;
            case 2:
                c2 = volume === 0xff ? this.chFmparTable[d.ch2].volC : volume;
                break;
            case 3:
                m1 = volume === 0xff ? this.chFmparTable[d.ch1].volM : volume;
                m2 = volume === 0xff ? this.chFmparTable[d.ch2].volM : volume;
                break;
        }
        this.set_volume(m1, c1, d.ch1);
        this.set_volume(m2, c2, d.ch2);
    }

    private reset_ins_volume(chan: number): void {
        const ins = this.get_instr_data_by_ch(chan);
        if (!ins) {
            this.set_ins_volume(0, 0, chan);
            return;
        }
        let vm = ins.fm.volM,
            vc = ins.fm.volC;
        if (this.volume_scaling) {
            vm = ins.fm.connect ? 0 : vm;
            vc = 0;
        }
        this.set_ins_volume(vm, vc, chan);
    }

    private set_global_volume(): void {
        for (let c = 0; c < this.songinfo.nm_tracks; c++) {
            if (this._4op_vol_valid_chan(c)) this.set_ins_volume_4op(0xff, c);
            else if (this.chCarrierVol[c] || this.chModulatorVol[c]) {
                const conn = this.get_instr_data_by_ch(c);
                this.set_ins_volume(
                    conn && conn.fm.connect ? this.chFmparTable[c].volM : 0xff,
                    this.chFmparTable[c].volC,
                    c,
                );
            }
        }
    }

    set_overall_volume(level: number): void {
        this.overall_volume = Math.min(level, 63);
        this.set_global_volume();
    }

    // ---- Instrument macros ----

    private init_macro_table(chan: number, note: number, ins: number, freq: number): void {
        const ext = this.get_instr_ext(ins);
        const at = ext ? ext.arpeggio : 0;
        const mo = chan * MACRO_TABLE_STRIDE;
        this.chMacroTable[mo] = 0;
        this.chMacroTable[mo + 1] = 0;
        this.chMacroTable[mo + 2] = 0;
        this.chMacroTable[mo + 8] = ins;
        this.chMacroTable[mo + 3] = 1;
        this.chMacroTable[mo + 4] = 0;
        this.chMacroTable[mo + 5] = 0;
        this.chMacroTable[mo + 9] = at;
        this.chMacroTable[mo + 10] = note;
        const vt = ext ? ext.vibrato : 0;
        this.chMacroTable[mo + 12] = 1;
        this.chMacroTable[mo + 13] = 0;
        this.chMacroTable[mo + 6] = 0;
        this.chMacroTable[mo + 7] = 0;
        this.chMacroTable[mo + 11] = vt;
        this.chMacroTable[mo + 14] = freq & 0xff;
        this.chMacroTable[mo + 15] = (freq >> 8) & 0xff;
        const vib = vt ? this.get_vibrato_table(vt) : null;
        this.chMacroTable[mo + 16] = vib ? vib[2] : 0;
        this.chZeroFqTable[chan] = 0;
    }

    private set_ins_data(ins: number, chan: number): void {
        if (!ins) return;
        const i = this.get_instr_data(ins);
        if (!i) return;
        if (this.is_data_empty2(i)) {
            this.release_sustaining_sound(chan);
        }
        if (ins !== this.chEventTable[chan * 6 + 1] || this.chResetChan[chan]) {
            this.chPanningTable[chan] = !this.chPanLock[chan] ? (i as any).panning : this.songinfo.lock_flags[chan] & 3;
            if (this.chPanningTable[chan] >= 3) this.chPanningTable[chan] = 0;
            const m = this.regoffs_m(chan),
                c = this.regoffs_c(chan),
                n = this.regoffs_n(chan);
            const fm = i.fm.raw;
            this.opl3out(0x20 + m, fm[0]);
            this.opl3out(0x20 + c, fm[1]);
            this.opl3out(0x40 + m, (fm[2] & 0xc0) | 63);
            this.opl3out(0x40 + c, (fm[3] & 0xc0) | 63);
            this.opl3out(0x60 + m, fm[4]);
            this.opl3out(0x60 + c, fm[5]);
            this.opl3out(0x80 + m, fm[6]);
            this.opl3out(0x80 + c, fm[7]);
            this.opl3out(0xe0 + m, fm[8]);
            this.opl3out(0xe0 + c, fm[9]);
            this.opl3out(0xc0 + n, fm[10] | _panning[this.chPanningTable[chan]]);
            this.copy_fmpar_from_instr(i, chan);
            if (!this.chResetChan[chan]) this.chKeyoffLoop[chan] = 0;
            if (this.chResetChan[chan]) {
                this.chVoiceTable[chan] = ins;
                this.reset_ins_volume(chan);
                this.chResetChan[chan] = 0;
            }
            const nn = this.chEventTable[chan * 6] & 0x7f;
            this.init_macro_table(chan, nn >= 1 && nn <= 97 ? nn : 0, ins, this.chFreqTable[chan]);
        }
        this.chVoiceTable[chan] = ins;
        const oi = this.chEventTable[chan * 6 + 1];
        this.chEventTable[chan * 6 + 1] = ins;
        if (!this.chVolumeLock[chan] || ins !== oi) this.reset_ins_volume(chan);
    }

    private copy_fmpar_from_instr(i: any, chan: number): void {
        const p = this.chFmparTable[chan];
        p.multipM = i.fm.multipM;
        p.ksrM = i.fm.ksrM;
        p.sustM = i.fm.sustM;
        p.vibrM = i.fm.vibrM;
        p.tremM = i.fm.tremM;
        p.multipC = i.fm.multipC;
        p.ksrC = i.fm.ksrC;
        p.sustC = i.fm.sustC;
        p.vibrC = i.fm.vibrC;
        p.tremC = i.fm.tremC;
        p.volM = i.fm.volM;
        p.kslM = i.fm.kslM;
        p.volC = i.fm.volC;
        p.kslC = i.fm.kslC;
        p.decM = i.fm.decM;
        p.attckM = i.fm.attckM;
        p.decC = i.fm.decC;
        p.attckC = i.fm.attckC;
        p.relM = i.fm.relM;
        p.sustnM = i.fm.sustnM;
        p.relC = i.fm.relC;
        p.sustnC = i.fm.sustnC;
        p.wformM = i.fm.wformM;
        p.wformC = i.fm.wformC;
        p.connect = i.fm.connect;
        p.feedb = i.fm.feedb;
    }

    private update_modulator_adsrw(chan: number): void {
        const p = this.chFmparTable[chan],
            m = this.regoffs_m(chan);
        this.opl3out(0x60 + m, (p.decM & 0xf) | ((p.attckM & 0xf) << 4));
        this.opl3out(0x80 + m, (p.relM & 0xf) | ((p.sustnM & 0xf) << 4));
        this.opl3out(0xe0 + m, p.wformM & 7);
    }

    private update_carrier_adsrw(chan: number): void {
        const p = this.chFmparTable[chan],
            c = this.regoffs_c(chan);
        this.opl3out(0x60 + c, (p.decC & 0xf) | ((p.attckC & 0xf) << 4));
        this.opl3out(0x80 + c, (p.relC & 0xf) | ((p.sustnC & 0xf) << 4));
        this.opl3out(0xe0 + c, p.wformC & 7);
    }

    private update_fmpar(chan: number): void {
        const p = this.chFmparTable[chan];
        this.opl3out(
            0x20 + this.regoffs_m(chan),
            (p.multipM & 0xf) | (p.ksrM << 4) | (p.sustM << 5) | (p.vibrM << 6) | (p.tremM << 7),
        );
        this.opl3out(
            0x20 + this.regoffs_c(chan),
            (p.multipC & 0xf) | (p.ksrC << 4) | (p.sustC << 5) | (p.vibrC << 6) | (p.tremC << 7),
        );
        this.opl3out(
            0xc0 + this.regoffs_n(chan),
            (p.connect & 1) | ((p.feedb & 7) << 1) | _panning[this.chPanningTable[chan]],
        );
        this.set_ins_volume(p.volM, p.volC, chan);
    }

    // ---- 4-op helpers ----

    private is_4op_chan(chan: number): boolean {
        const mask = [1, 1, 2, 2, 4, 4, 0, 0, 0, 8, 8, 16, 16, 32, 32, 0, 0, 0, 0, 0];
        return chan <= 14 && !!(this.songinfo.flag_4op & mask[chan]);
    }

    private is_4op_chan_hi(chan: number): boolean {
        return [
            true,
            false,
            true,
            false,
            true,
            false,
            false,
            false,
            false,
            true,
            false,
            true,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
        ][chan];
    }

    private is_4op_chan_lo(chan: number): boolean {
        return [
            false,
            true,
            false,
            true,
            false,
            true,
            false,
            false,
            false,
            false,
            true,
            false,
            true,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
        ][chan];
    }

    private get_4op_data(chan: number): {
        mode: boolean;
        conn: number;
        ch1: number;
        ch2: number;
        ins1: number;
        ins2: number;
    } {
        const d = { mode: false, conn: 0, ch1: 0, ch2: 0, ins1: 0, ins2: 0 };
        if (!this.is_4op_chan(chan)) return d;
        d.mode = true;
        if (this.is_4op_chan_hi(chan)) {
            d.ch1 = chan;
            d.ch2 = chan + 1;
        } else {
            d.ch1 = chan - 1;
            d.ch2 = chan;
        }
        d.ins1 = this.chEventTable[d.ch1 * 6 + 1] || this.chVoiceTable[d.ch1];
        d.ins2 = this.chEventTable[d.ch2 * 6 + 1] || this.chVoiceTable[d.ch2];
        if (d.ins1 && d.ins2) {
            const i1 = this.get_instr_data(d.ins1),
                i2 = this.get_instr_data(d.ins2);
            if (i1 && i2) d.conn = (i1.fm.connect << 1) | i2.fm.connect;
        }
        return d;
    }

    private _4op_vol_valid_chan(chan: number): boolean {
        const d = this.get_4op_data(chan);
        return d.mode && !!this.chVol4opLock[chan] && !!d.ins1 && !!d.ins2;
    }

    // ---- Portamento / slides ----

    private portamento_up(chan: number, slide: number, limit: number): void {
        if (!(this.chFreqTable[chan] & 0x1fff)) return;
        const f = calc_freq_shift_up(this.chFreqTable[chan] & 0x1fff, slide);
        this.change_frequency(chan, f <= limit ? f : limit);
    }

    private portamento_down(chan: number, slide: number, limit: number): void {
        if (!(this.chFreqTable[chan] & 0x1fff)) return;
        const f = calc_freq_shift_down(this.chFreqTable[chan] & 0x1fff, slide);
        this.change_frequency(chan, f >= limit ? f : limit);
    }

    private macro_vibrato__porta_up(chan: number, depth: number): void {
        const vf =
            this.chMacroTable[chan * MACRO_TABLE_STRIDE + 14] |
            (this.chMacroTable[chan * MACRO_TABLE_STRIDE + 15] << 8);
        const f = calc_freq_shift_up(vf & 0x1fff, depth);
        this.change_freq(chan, f <= nFreq(96) ? f : nFreq(96));
    }

    private macro_vibrato__porta_down(chan: number, depth: number): void {
        const vf =
            this.chMacroTable[chan * MACRO_TABLE_STRIDE + 14] |
            (this.chMacroTable[chan * MACRO_TABLE_STRIDE + 15] << 8);
        const f = calc_freq_shift_down(vf & 0x1fff, depth);
        this.change_freq(chan, f >= nFreq(0) ? f : nFreq(0));
    }

    private tone_portamento(slot: number, chan: number): void {
        const f = this.chFreqTable[chan] & 0x1fff;
        const pf = this.chPortaTable[slot * 60 + chan * 3] | (this.chPortaTable[slot * 60 + chan * 3 + 1] << 8);
        if (f > pf) this.portamento_down(chan, this.chPortaTable[slot * 60 + chan * 3 + 2], pf);
        else if (f < pf) this.portamento_up(chan, this.chPortaTable[slot * 60 + chan * 3 + 2], pf);
    }

    private slide_carrier_volume_up(chan: number, slide: number, limit: number): void {
        const v = this.chFmparTable[chan].volC;
        this.set_ins_volume(0xff, v - slide >= limit ? v - slide : limit, chan);
    }

    private slide_modulator_volume_up(chan: number, slide: number, limit: number): void {
        const v = this.chFmparTable[chan].volM;
        this.set_ins_volume(v - slide >= limit ? v - slide : limit, 0xff, chan);
    }

    private slide_volume_up(chan: number, slide: number): void {
        let l1 = 0,
            l2 = 0;
        const d = this.get_4op_data(chan);
        if (!this._4op_vol_valid_chan(chan)) {
            const ins = this.get_instr_data(this.chEventTable[chan * 6 + 1]);
            l1 = this.chPeakLock[chan] && ins ? ins.fm.volC : 0;
            l2 = this.chPeakLock[chan] && ins ? ins.fm.volM : 0;
        }
        const vt = this.chVolslideType[chan];
        if (vt === 0) {
            if (!this._4op_vol_valid_chan(chan)) {
                this.slide_carrier_volume_up(chan, slide, l1);
                const i = this.get_instr_data_by_ch(chan);
                if (i && (i.fm.connect || (this.percussion_mode && chan >= 16)))
                    this.slide_modulator_volume_up(chan, slide, l2);
            } else {
                const i1 = this.get_instr_data(d.ins1),
                    i2 = this.get_instr_data(d.ins2);
                const c1c = this.chPeakLock[d.ch1] && i1 ? i1.fm.volC : 0,
                    c1m = this.chPeakLock[d.ch1] && i1 ? i1.fm.volM : 0;
                const c2c = this.chPeakLock[d.ch2] && i2 ? i2.fm.volC : 0,
                    c2m = this.chPeakLock[d.ch2] && i2 ? i2.fm.volM : 0;
                switch (d.conn) {
                    case 0:
                        this.slide_carrier_volume_up(d.ch1, slide, c1c);
                        break;
                    case 1:
                        this.slide_carrier_volume_up(d.ch1, slide, c1c);
                        this.slide_modulator_volume_up(d.ch2, slide, c2m);
                        break;
                    case 2:
                        this.slide_carrier_volume_up(d.ch1, slide, c1c);
                        this.slide_carrier_volume_up(d.ch2, slide, c2c);
                        break;
                    case 3:
                        this.slide_carrier_volume_up(d.ch1, slide, c1c);
                        this.slide_modulator_volume_up(d.ch1, slide, c1m);
                        this.slide_modulator_volume_up(d.ch2, slide, c2m);
                        break;
                }
            }
        } else if (vt === 1) this.slide_carrier_volume_up(chan, slide, l1);
        else if (vt === 2) this.slide_modulator_volume_up(chan, slide, l2);
        else if (vt === 3) {
            this.slide_carrier_volume_up(chan, slide, l1);
            this.slide_modulator_volume_up(chan, slide, l2);
        }
    }

    private slide_carrier_volume_down(chan: number, slide: number): void {
        const v = this.chFmparTable[chan].volC;
        this.set_ins_volume(0xff, v + slide <= 63 ? v + slide : 63, chan);
    }

    private slide_modulator_volume_down(chan: number, slide: number): void {
        const v = this.chFmparTable[chan].volM;
        this.set_ins_volume(v + slide <= 63 ? v + slide : 63, 0xff, chan);
    }

    private slide_volume_down(chan: number, slide: number): void {
        const d = this.get_4op_data(chan),
            vt = this.chVolslideType[chan];
        if (vt === 0) {
            if (!this._4op_vol_valid_chan(chan)) {
                this.slide_carrier_volume_down(chan, slide);
                const i = this.get_instr_data_by_ch(chan);
                if (i && (i.fm.connect || (this.percussion_mode && chan >= 16)))
                    this.slide_modulator_volume_down(chan, slide);
            } else {
                switch (d.conn) {
                    case 0:
                        this.slide_carrier_volume_down(d.ch1, slide);
                        break;
                    case 1:
                        this.slide_carrier_volume_down(d.ch1, slide);
                        this.slide_modulator_volume_down(d.ch2, slide);
                        break;
                    case 2:
                        this.slide_carrier_volume_down(d.ch1, slide);
                        this.slide_carrier_volume_down(d.ch2, slide);
                        break;
                    case 3:
                        this.slide_carrier_volume_down(d.ch1, slide);
                        this.slide_modulator_volume_down(d.ch1, slide);
                        this.slide_modulator_volume_down(d.ch2, slide);
                        break;
                }
            }
        } else if (vt === 1) this.slide_carrier_volume_down(chan, slide);
        else if (vt === 2) this.slide_modulator_volume_down(chan, slide);
        else if (vt === 3) {
            this.slide_carrier_volume_down(chan, slide);
            this.slide_modulator_volume_down(chan, slide);
        }
    }

    private volume_slide(chan: number, up: number, down: number): void {
        if (up) this.slide_volume_up(chan, up);
        else if (down) this.slide_volume_down(chan, down);
    }

    private global_volume_slide(up: number, down: number): void {
        if (up !== 0xff) this.global_volume = Math.min(this.global_volume + up, 63);
        if (down !== 0xff) this.global_volume = this.global_volume >= down ? this.global_volume - down : 0;
        this.set_global_volume();
    }

    // ---- Arpeggio / vibrato / tremolo ----

    private arpeggio(slot: number, chan: number): void {
        const AS = [1, 2, 0],
            ai = slot * 80 + chan * 4;
        const n = this.chArpggTable[ai + 1];
        let f: number;
        switch (this.chArpggTable[ai]) {
            case 0:
                f = nFreq(n - 1);
                break;
            case 1:
                f = nFreq(n - 1 + this.chArpggTable[ai + 2]);
                break;
            case 2:
                f = nFreq(n - 1 + this.chArpggTable[ai + 3]);
                break;
            default:
                f = 0;
        }
        this.chArpggTable[ai] = AS[this.chArpggTable[ai]];
        this.change_frequency(chan, f + this.get_instr_fine_tune(this.chEventTable[chan * 6 + 1]));
    }

    private vibrato(slot: number, chan: number): void {
        const f = this.chFreqTable[chan],
            vi = slot * 100 + chan * 5;
        this.chVibrTable[vi] += this.chVibrTable[vi + 1] * this.vibtrem_speed_factor;
        const s = this.calc_vibrato_shift(this.chVibrTable[vi + 2], this.chVibrTable[vi]);
        const d = this.chVibrTable[vi] & this.vibtrem_table_size;
        this.chVibrTable[vi + 3] = d ? 1 : 0;
        if (!d) this.portamento_down(chan, s, nFreq(0));
        else this.portamento_up(chan, s, nFreq(97));
        this.chFreqTable[chan] = f;
    }

    private tremolo(slot: number, chan: number): void {
        const vm = this.chFmparTable[chan].volM,
            vc = this.chFmparTable[chan].volC;
        const ti = slot * 100 + chan * 5;
        this.chTremTable[ti] += this.chTremTable[ti + 1] * this.vibtrem_speed_factor;
        const s = this.calc_vibrato_shift(this.chTremTable[ti + 2], this.chTremTable[ti]);
        const d = this.chTremTable[ti] & this.vibtrem_table_size;
        this.chTremTable[ti + 3] = d ? 1 : 0;
        if (slot === 1) {
            if (!this.chTremTable[ti]) this.slide_volume_down(chan, s);
            else this.slide_volume_up(chan, s);
        } else {
            if (!d) this.slide_volume_down(chan, s);
            else this.slide_volume_up(chan, s);
        }
        this.chFmparTable[chan].volM = vm;
        this.chFmparTable[chan].volC = vc;
    }

    private calc_vibrato_shift(depth: number, position: number): number {
        const X = depth * this.vibtrem_table[position & (this.vibtrem_table_size - 1)];
        const rot = (X << 1) | (X >> 15);
        return ((rot >> 8) & 0xff) | ((rot & 1) << 8);
    }

    // ---- Effects update ----

    private update_effects_slot(slot: number, chan: number): void {
        const ei = slot * 40 + chan * 2,
            def = this.chEffectTable[ei],
            val = this.chEffectTable[ei + 1];
        switch (def) {
            case ef_Arpeggio:
                if (val) this.arpeggio(slot, chan);
                break;
            case ef_ArpggVSlide:
                this.volume_slide(chan, (val >> 4) & 0xf, val & 0xf);
                this.arpeggio(slot, chan);
                break;
            case ef_ArpggVSlideFine:
                this.arpeggio(slot, chan);
                break;
            case ef_FSlideUp:
                this.portamento_up(chan, val, nFreq(97));
                break;
            case ef_FSlideDown:
                this.portamento_down(chan, val, nFreq(0));
                break;
            case ef_FSlideUpVSlide:
                this.portamento_up(chan, this.chFslideTable[slot * 20 + chan], nFreq(97));
                this.volume_slide(chan, (val >> 4) & 0xf, val & 0xf);
                break;
            case ef_FSlUpFineVSlide:
                this.volume_slide(chan, (val >> 4) & 0xf, val & 0xf);
                break;
            case ef_FSlideDownVSlide:
                this.portamento_down(chan, this.chFslideTable[slot * 20 + chan], nFreq(0));
                this.volume_slide(chan, (val >> 4) & 0xf, val & 0xf);
                break;
            case ef_FSlDownFineVSlide:
                this.volume_slide(chan, (val >> 4) & 0xf, val & 0xf);
                break;
            case ef_FSlUpVSlF:
                this.portamento_up(chan, this.chFslideTable[slot * 20 + chan], nFreq(97));
                break;
            case ef_FSlDownVSlF:
                this.portamento_down(chan, this.chFslideTable[slot * 20 + chan], nFreq(0));
                break;
            case ef_TonePortamento:
                this.tone_portamento(slot, chan);
                break;
            case ef_TPortamVolSlide:
                this.volume_slide(chan, (val >> 4) & 0xf, val & 0xf);
                this.tone_portamento(slot, chan);
                break;
            case ef_TPortamVSlideFine:
                this.tone_portamento(slot, chan);
                break;
            case ef_Vibrato:
                if (!this.chVibrTable[slot * 100 + chan * 5 + 4]) this.vibrato(slot, chan);
                break;
            case ef_Tremolo:
                if (!this.chTremTable[slot * 100 + chan * 5 + 4]) this.tremolo(slot, chan);
                break;
            case ef_VibratoVolSlide:
                this.volume_slide(chan, (val >> 4) & 0xf, val & 0xf);
                if (!this.chVibrTable[slot * 100 + chan * 5 + 4]) this.vibrato(slot, chan);
                break;
            case ef_VibratoVSlideFine:
                if (!this.chVibrTable[slot * 100 + chan * 5 + 4]) this.vibrato(slot, chan);
                break;
            case ef_VolSlide:
                this.volume_slide(chan, (val >> 4) & 0xf, val & 0xf);
                break;
            case ef_RetrigNote:
                if (this.chRetrigTable[slot * 20 + chan] >= val) {
                    this.chRetrigTable[slot * 20 + chan] = 0;
                    this.output_note(this.chEventTable[chan * 6], this.chEventTable[chan * 6 + 1], chan, true, true);
                } else this.chRetrigTable[slot * 20 + chan]++;
                break;
            case ef_MultiRetrigNote:
                if (this.chRetrigTable[slot * 20 + chan] >= val >> 4) {
                    switch (val & 0xf) {
                        case 1:
                            this.slide_volume_down(chan, 1);
                            break;
                        case 2:
                            this.slide_volume_down(chan, 2);
                            break;
                        case 3:
                            this.slide_volume_down(chan, 4);
                            break;
                        case 4:
                            this.slide_volume_down(chan, 8);
                            break;
                        case 5:
                            this.slide_volume_down(chan, 16);
                            break;
                        case 9:
                            this.slide_volume_up(chan, 1);
                            break;
                        case 10:
                            this.slide_volume_up(chan, 2);
                            break;
                        case 11:
                            this.slide_volume_up(chan, 4);
                            break;
                        case 12:
                            this.slide_volume_up(chan, 8);
                            break;
                        case 13:
                            this.slide_volume_up(chan, 16);
                            break;
                        case 6:
                            this.slide_volume_down(chan, this.chanvol(chan) - (((this.chanvol(chan) * 2) / 3) | 0));
                            break;
                        case 7:
                            this.slide_volume_down(chan, this.chanvol(chan) - ((this.chanvol(chan) / 2) | 0));
                            break;
                        case 14:
                            this.slide_volume_up(chan, Math.min((this.chanvol(chan) * 3) / 2 - this.chanvol(chan), 63));
                            break;
                        case 15:
                            this.slide_volume_up(chan, Math.min(this.chanvol(chan) * 2 - this.chanvol(chan), 63));
                            break;
                    }
                    this.chRetrigTable[slot * 20 + chan] = 0;
                    this.output_note(this.chEventTable[chan * 6], this.chEventTable[chan * 6 + 1], chan, true, true);
                } else this.chRetrigTable[slot * 20 + chan]++;
                break;
            case ef_Tremor:
                const ti = slot * 60 + chan * 3;
                if (this.chTremorTable[ti] >= 0) {
                    if (this.chTremorTable[ti] + 1 <= val >> 4) this.chTremorTable[ti]++;
                    else {
                        this.slide_volume_down(chan, 63);
                        this.chTremorTable[ti] = -1;
                    }
                } else {
                    if (this.chTremorTable[ti] - 1 >= -(val & 0xf)) this.chTremorTable[ti]--;
                    else {
                        this.set_ins_volume(this.chTremorTable[ti + 1], this.chTremorTable[ti + 2], chan);
                        this.chTremorTable[ti] = 1;
                    }
                }
                break;
            case ef_Extended2:
                switch (val >> 4) {
                    case ef_ex2_NoteDelay:
                        if (this.chNotedelTable[chan] === 0) {
                            this.chNotedelTable[chan] = 0xff;
                            this.output_note(
                                this.chEventTable[chan * 6],
                                this.chEventTable[chan * 6 + 1],
                                chan,
                                true,
                                true,
                            );
                        } else if (this.chNotedelTable[chan] !== 0xff) this.chNotedelTable[chan]--;
                        break;
                    case ef_ex2_NoteCut:
                        if (this.chNotecutTable[chan] === 0) {
                            this.chNotecutTable[chan] = 0xff;
                            this.key_off(chan);
                        } else if (this.chNotecutTable[chan] !== 0xff) this.chNotecutTable[chan]--;
                        break;
                    case ef_ex2_GlVolSlideUp:
                        this.global_volume_slide(val & 0xf, 0xff);
                        break;
                    case ef_ex2_GlVolSlideDn:
                        this.global_volume_slide(0xff, val & 0xf);
                        break;
                }
                break;
        }
    }

    private update_effects(): void {
        for (let c = 0; c < this.songinfo.nm_tracks; c++) {
            this.update_effects_slot(0, c);
            this.update_effects_slot(1, c);
        }
    }

    private update_fine_effects(slot: number, chan: number): void {
        const ei = slot * 40 + chan * 2,
            def = this.chEffectTable[ei],
            val = this.chEffectTable[ei + 1];
        switch (def) {
            case ef_ArpggVSlideFine:
                this.volume_slide(chan, (val >> 4) & 0xf, val & 0xf);
                break;
            case ef_FSlideUpFine:
                this.portamento_up(chan, val, nFreq(97));
                break;
            case ef_FSlideDownFine:
                this.portamento_down(chan, val, nFreq(0));
                break;
            case ef_FSlUpVSlF:
            case ef_FSlDownVSlF:
                this.volume_slide(chan, (val >> 4) & 0xf, val & 0xf);
                break;
            case ef_FSlUpFineVSlide:
                this.portamento_up(chan, this.chFslideTable[slot * 20 + chan], nFreq(97));
                break;
            case ef_FSlDownFineVSlide:
                this.portamento_down(chan, this.chFslideTable[slot * 20 + chan], nFreq(0));
                break;
            case ef_FSlUpFineVSlF:
                this.portamento_up(chan, this.chFslideTable[slot * 20 + chan], nFreq(97));
                this.volume_slide(chan, (val >> 4) & 0xf, val & 0xf);
                break;
            case ef_FSlDownFineVSlF:
                this.portamento_down(chan, this.chFslideTable[slot * 20 + chan], nFreq(0));
                this.volume_slide(chan, (val >> 4) & 0xf, val & 0xf);
                break;
            case ef_TPortamVSlideFine:
                this.volume_slide(chan, (val >> 4) & 0xf, val & 0xf);
                break;
            case ef_Vibrato:
                if (this.chVibrTable[slot * 100 + chan * 5 + 4]) this.vibrato(slot, chan);
                break;
            case ef_Tremolo:
                if (this.chTremTable[slot * 100 + chan * 5 + 4]) this.tremolo(slot, chan);
                break;
            case ef_VibratoVolSlide:
                if (this.chVibrTable[slot * 100 + chan * 5 + 4]) this.vibrato(slot, chan);
                break;
            case ef_VibratoVSlideFine:
                this.volume_slide(chan, (val >> 4) & 0xf, val & 0xf);
                if (this.chVibrTable[slot * 100 + chan * 5 + 4]) this.vibrato(slot, chan);
                break;
            case ef_VolSlideFine:
                this.volume_slide(chan, (val >> 4) & 0xf, val & 0xf);
                break;
            case ef_Extended2:
                switch (val >> 4) {
                    case ef_ex2_GlVolSlideUpF:
                        this.global_volume_slide(val & 0xf, 0xff);
                        break;
                    case ef_ex2_GlVolSlideDnF:
                        this.global_volume_slide(0xff, val & 0xf);
                        break;
                }
                break;
        }
    }

    private update_extra_fine_effects_slot(slot: number, chan: number): void {
        const ei = slot * 40 + chan * 2,
            def = this.chEffectTable[ei],
            val = this.chEffectTable[ei + 1];
        switch (def) {
            case ef_Extended2:
                switch (val >> 4) {
                    case ef_ex2_GlVolSldUpXF:
                        this.global_volume_slide(val & 0xf, 0xff);
                        break;
                    case ef_ex2_GlVolSldDnXF:
                        this.global_volume_slide(0xff, val & 0xf);
                        break;
                    case ef_ex2_VolSlideUpXF:
                        this.volume_slide(chan, val & 0xf, 0);
                        break;
                    case ef_ex2_VolSlideDnXF:
                        this.volume_slide(chan, 0, val & 0xf);
                        break;
                    case ef_ex2_FreqSlideUpXF:
                        this.portamento_up(chan, val & 0xf, nFreq(97));
                        break;
                    case ef_ex2_FreqSlideDnXF:
                        this.portamento_down(chan, val & 0xf, nFreq(0));
                        break;
                }
                break;
            case ef_GlobalFreqSlideUpXF:
                this.portamento_up(chan, val, nFreq(97));
                break;
            case ef_GlobalFreqSlideDnXF:
                this.portamento_down(chan, val, nFreq(0));
                break;
            case ef_ExtraFineArpeggio:
                this.arpeggio(slot, chan);
                break;
            case ef_ExtraFineVibrato:
                if (!this.chVibrTable[slot * 100 + chan * 5 + 4]) this.vibrato(slot, chan);
                break;
            case ef_ExtraFineTremolo:
                if (!this.chTremTable[slot * 100 + chan * 5 + 4]) this.tremolo(slot, chan);
                break;
        }
    }

    private update_extra_fine_effects(): void {
        for (let c = 0; c < this.songinfo.nm_tracks; c++) {
            this.update_extra_fine_effects_slot(0, c);
            this.update_extra_fine_effects_slot(1, c);
        }
    }

    // ---- Check swap arp/vibr & custom vibrato ----

    private check_swap_arp_vibr(event: number[], slot: number, chan: number): void {
        const nr =
            event[4 - slot * 2] === ef_Extended &&
            event[5 - slot * 2] === ef_ex_ExtendedCmd2 * 16 + ef_ex_cmd2_NoRestart;
        const mo = chan * MACRO_TABLE_STRIDE;
        switch (event[2 + slot * 2]) {
            case ef_SwapArpeggio:
                if (nr) {
                    const a = this.get_arpeggio_table(event[3 + slot * 2]);
                    if (a) {
                        const l = a[0];
                        if ((this.chMacroTable[mo + 4] | (this.chMacroTable[mo + 5] << 8)) > l) {
                            this.chMacroTable[mo + 4] = l & 0xff;
                            this.chMacroTable[mo + 5] = (l >> 8) & 0xff;
                        }
                    }
                    this.chMacroTable[mo + 9] = event[3 + slot * 2];
                } else {
                    this.chMacroTable[mo + 3] = 1;
                    this.chMacroTable[mo + 4] = 0;
                    this.chMacroTable[mo + 5] = 0;
                    this.chMacroTable[mo + 9] = event[3 + slot * 2];
                    this.chMacroTable[mo + 10] = this.chEventTable[chan * 6];
                }
                break;
            case ef_SwapVibrato:
                if (nr) {
                    const v = this.get_vibrato_table(event[3 + slot * 2]);
                    if (v) {
                        const l = v[0];
                        if ((this.chMacroTable[mo + 6] | (this.chMacroTable[mo + 7] << 8)) > l) {
                            this.chMacroTable[mo + 6] = l & 0xff;
                            this.chMacroTable[mo + 7] = (l >> 8) & 0xff;
                        }
                    }
                    this.chMacroTable[mo + 11] = event[3 + slot * 2];
                } else {
                    const curVib = this.get_vibrato_table(this.chMacroTable[mo + 11]);
                    this.chMacroTable[mo + 16] = curVib ? curVib[2] : 0;
                    this.chMacroTable[mo + 12] = 1;
                    this.chMacroTable[mo + 6] = 0;
                    this.chMacroTable[mo + 7] = 0;
                    this.chMacroTable[mo + 11] = event[3 + slot * 2];
                }
                break;
            case ef_SetCustomSpeedTab:
                this.generate_custom_vibrato(event[3 + slot * 2]);
                break;
        }
    }

    private generate_custom_vibrato(value: number): void {
        const vts = [16, 16, 16, 16, 32, 32, 32, 32, 64, 64, 64, 64, 128, 128, 128, 128];
        if (value === 0) {
            this.vibtrem_table_size = 32;
            this.vibtrem_table.set(def_vibtrem_table);
        } else if (value <= 239) {
            this.vibtrem_table_size = 32;
            const mr = value / 16;
            for (let i2 = 0; i2 <= 7; i2++) {
                this.vibtrem_table[i2 * 32] = 0;
                for (let i = 1; i <= 16; i++) this.vibtrem_table[i2 * 32 + i] = Math.round(i * mr);
                for (let i = 17; i <= 31; i++) this.vibtrem_table[i2 * 32 + i] = Math.round((32 - i) * mr);
            }
        } else {
            this.vibtrem_speed_factor = ((value - 240) % 4) + 1;
            const ts = vts[value - 240];
            this.vibtrem_table_size = 2 * ts;
            const mb = 256 / ts;
            for (let i2 = 0; i2 <= 128 / ts - 1; i2++) {
                this.vibtrem_table[2 * ts * i2] = 0;
                for (let i = 1; i <= ts; i++) this.vibtrem_table[2 * ts * i2 + i] = Math.max(0, i * mb - 1);
                for (let i = ts + 1; i <= 2 * ts - 1; i++)
                    this.vibtrem_table[2 * ts * i2 + i] = Math.max(0, (2 * ts - i) * mb - 1);
            }
        }
    }

    private chanvol(chan: number): number {
        const ins = this.get_instr_data_by_ch(chan);
        const conn = ins ? ins.fm.connect : 0;
        return conn
            ? 63 - (((this.chFmparTable[chan].volM + this.chFmparTable[chan].volC + 1) / 2) | 0)
            : 63 - this.chFmparTable[chan].volC;
    }

    // ---- is_data_empty ----

    private is_data_empty2(instr: any): boolean {
        return (
            !instr.fm.attckM &&
            !instr.fm.attckC &&
            !instr.fm.decM &&
            !instr.fm.decC &&
            !instr.fm.sustnM &&
            !instr.fm.sustnC &&
            !instr.fm.relM &&
            !instr.fm.relC
        );
    }

    private is_ins_adsr_data_empty(ins: number): boolean {
        const i = this.get_instr_data(ins);
        return i ? this.is_data_empty2(i) : true;
    }
}

// ---- Static helpers ----

function no_swap_and_restart(event: number[]): boolean {
    const NO_RESTART = ef_ex_ExtendedCmd2 * 16 + ef_ex_cmd2_NoRestart;
    return (
        !(
            (event[4] === ef_SwapArpeggio || event[4] === ef_SwapVibrato) &&
            event[2] === ef_Extended &&
            event[3] === NO_RESTART
        ) &&
        !(
            (event[2] === ef_SwapArpeggio || event[2] === ef_SwapVibrato) &&
            event[4] === ef_Extended &&
            event[5] === NO_RESTART
        )
    );
}

function calc_freq_shift_up(freq: number, shift: number): number {
    let oc = (freq >> 10) & 7,
        fr = (freq & 0x3ff) + shift;
    if (fr >= 0x2ae) {
        if (oc === 7) fr = 0x2ae;
        else {
            oc++;
            fr -= 0x158;
        }
    }
    return (oc << 10) + fr;
}

function calc_freq_shift_down(freq: number, shift: number): number {
    let oc = (freq >> 10) & 7,
        fr = (freq & 0x3ff) - shift;
    if (fr <= 0x156) {
        if (oc === 0) fr = 0x156;
        else {
            oc--;
            fr += 0x158;
        }
    }
    return (oc << 10) + fr;
}
