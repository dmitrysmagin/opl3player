// @ts-nocheck
import { FormatPlayer } from "./player";
import { a2t_depack } from "./a2m-depack";

// ---- Effect constants ----
export const ef_Arpeggio            = 0x80;
export const ef_FSlideUp            = 1;
export const ef_FSlideDown          = 2;
export const ef_TonePortamento      = 3;
export const ef_Vibrato             = 4;
export const ef_TPortamVolSlide     = 5;
export const ef_VibratoVolSlide     = 6;
export const ef_FSlideUpFine        = 7;
export const ef_FSlideDownFine      = 8;
export const ef_SetModulatorVol     = 9;
export const ef_VolSlide            = 10;
export const ef_PositionJump        = 11;
export const ef_SetInsVolume        = 12;
export const ef_PatternBreak        = 13;
export const ef_SetTempo            = 14;
export const ef_SetSpeed            = 15;
export const ef_TPortamVSlideFine   = 16;
export const ef_VibratoVSlideFine   = 17;
export const ef_SetCarrierVol       = 18;
export const ef_SetWaveform         = 19;
export const ef_VolSlideFine        = 20;
export const ef_RetrigNote          = 21;
export const ef_Tremolo             = 22;
export const ef_Tremor              = 23;
export const ef_ArpggVSlide         = 24;
export const ef_ArpggVSlideFine     = 25;
export const ef_MultiRetrigNote     = 26;
export const ef_FSlideUpVSlide      = 27;
export const ef_FSlideDownVSlide    = 28;
export const ef_FSlUpFineVSlide     = 29;
export const ef_FSlDownFineVSlide   = 30;
export const ef_FSlUpVSlF           = 31;
export const ef_FSlDownVSlF         = 32;
export const ef_FSlUpFineVSlF       = 33;
export const ef_FSlDownFineVSlF     = 34;
export const ef_Extended            = 35;
export const ef_Extended2           = 36;
export const ef_SetGlobalVolume     = 37;
export const ef_SwapArpeggio        = 38;
export const ef_SwapVibrato         = 39;
export const ef_ForceInsVolume      = 40;
export const ef_Extended3           = 41;
export const ef_ExtraFineArpeggio   = 42;
export const ef_ExtraFineVibrato    = 43;
export const ef_ExtraFineTremolo    = 44;
export const ef_SetCustomSpeedTab   = 45;
export const ef_GlobalFSlideUp      = 46;
export const ef_GlobalFSlideDown    = 47;
export const ef_GlobalFreqSlideUpXF = 48;
export const ef_GlobalFreqSlideDnXF = 49;

export const ef_ex_SetTremDepth     = 0;
export const ef_ex_SetVibDepth      = 1;
export const ef_ex_SetAttckRateM    = 2;
export const ef_ex_SetDecayRateM    = 3;
export const ef_ex_SetSustnLevelM   = 4;
export const ef_ex_SetRelRateM      = 5;
export const ef_ex_SetAttckRateC    = 6;
export const ef_ex_SetDecayRateC    = 7;
export const ef_ex_SetSustnLevelC   = 8;
export const ef_ex_SetRelRateC      = 9;
export const ef_ex_SetFeedback      = 10;
export const ef_ex_SetPanningPos    = 11;
export const ef_ex_PatternLoop      = 12;
export const ef_ex_PatternLoopRec   = 13;
export const ef_ex_ExtendedCmd      = 14;
export const ef_ex_ExtendedCmd2     = 15;

export const ef_ex_cmd_MKOffLoopDi  = 0;
export const ef_ex_cmd_MKOffLoopEn  = 1;
export const ef_ex_cmd_TPortaFKdis  = 2;
export const ef_ex_cmd_TPortaFKenb  = 3;
export const ef_ex_cmd_RestartEnv   = 4;
export const ef_ex_cmd_4opVlockOff  = 5;
export const ef_ex_cmd_4opVlockOn   = 6;
export const ef_ex_cmd_ForceBpmSld  = 7;

export const ef_ex_cmd2_RSS         = 0;
export const ef_ex_cmd2_ResetVol    = 1;
export const ef_ex_cmd2_LockVol     = 2;
export const ef_ex_cmd2_UnlockVol   = 3;
export const ef_ex_cmd2_LockVP      = 4;
export const ef_ex_cmd2_UnlockVP    = 5;
export const ef_ex_cmd2_VSlide_mod  = 6;
export const ef_ex_cmd2_VSlide_car  = 7;
export const ef_ex_cmd2_VSlide_def  = 8;
export const ef_ex_cmd2_LockPan     = 9;
export const ef_ex_cmd2_UnlockPan   = 10;
export const ef_ex_cmd2_VibrOff     = 11;
export const ef_ex_cmd2_TremOff     = 12;
export const ef_ex_cmd2_FVib_FGFS   = 13;
export const ef_ex_cmd2_FTrm_XFGFS  = 14;
export const ef_ex_cmd2_NoRestart   = 15;

export const ef_ex2_PatDelayFrame   = 0;
export const ef_ex2_PatDelayRow     = 1;
export const ef_ex2_NoteDelay       = 2;
export const ef_ex2_NoteCut         = 3;
export const ef_ex2_FineTuneUp      = 4;
export const ef_ex2_FineTuneDown    = 5;
export const ef_ex2_GlVolSlideUp    = 6;
export const ef_ex2_GlVolSlideDn    = 7;
export const ef_ex2_GlVolSlideUpF   = 8;
export const ef_ex2_GlVolSlideDnF   = 9;
export const ef_ex2_GlVolSldUpXF    = 10;
export const ef_ex2_GlVolSldDnXF    = 11;
export const ef_ex2_VolSlideUpXF    = 12;
export const ef_ex2_VolSlideDnXF    = 13;
export const ef_ex2_FreqSlideUpXF   = 14;
export const ef_ex2_FreqSlideDnXF   = 15;

export const ef_ex3_SetConnection   = 0;
export const ef_ex3_SetMultipM      = 1;
export const ef_ex3_SetKslM         = 2;
export const ef_ex3_SetTremoloM     = 3;
export const ef_ex3_SetVibratoM     = 4;
export const ef_ex3_SetKsrM         = 5;
export const ef_ex3_SetSustainM     = 6;
export const ef_ex3_SetMultipC      = 7;
export const ef_ex3_SetKslC         = 8;
export const ef_ex3_SetTremoloC     = 9;
export const ef_ex3_SetVibratoC     = 10;
export const ef_ex3_SetKsrC         = 11;
export const ef_ex3_SetSustainC     = 12;

export const EFGR_ARPVOLSLIDE      = 1;
export const EFGR_FSLIDEVOLSLIDE   = 2;
export const EFGR_TONEPORTAMENTO   = 3;
export const EFGR_VIBRATO          = 4;
export const EFGR_TREMOLO          = 5;
export const EFGR_VIBRATOVOLSLIDE  = 6;
export const EFGR_PORTAVOLSLIDE    = 7;
export const EFGR_RETRIGNOTE       = 8;

export const keyoff_flag         = 0x80;
export const fixed_note_flag     = 0x90;
export const pattern_loop_flag   = 0xe0;
export const pattern_break_flag  = 0xf0;

export const BYTE_NULL           = 0xff;

export const MIN_IRQ_FREQ        = 50;
export const MAX_IRQ_FREQ        = 1000;

export const FreqStart           = 0x156;
export const FreqEnd             = 0x2ae;
export const FreqRange           = FreqEnd - FreqStart;

export const MAX_INSTRUMENTS     = 255;
export const MAX_FMREG_TABLES    = 255;
export const MAX_ARPVIB_TABLES   = 255;
export const MAX_PATTERNS        = 128;
export const MAX_CHANNELS        = 20;
export const MAX_ROWS            = 256;

export const FM_INST_SIZE       = 11;
export const INSTR_SIZE         = 14;
export const INSTR_V1_8_SIZE    = 13;
export const REGTABLE_CELL_SIZE = 15;
export const FMREG_TABLE_SIZE   = 6 + 255 * REGTABLE_CELL_SIZE;  // 3831
export const ARPVIB_TABLE_SIZE  = 520;
export const EVENT_V1_8_SIZE    = 4;
export const EVENT_V9_14_SIZE   = 6;

// ========================================================================
//  Static lookup tables
// ========================================================================

export const _panning = new Uint8Array([0x30, 0x10, 0x20]);

export const def_vibtrem_table = new Uint8Array([
    0,24,49,74,97,120,141,161,180,197,212,224,235,244,250,253,255,
    253,250,244,235,224,212,197,180,161,141,120,97,74,49,24,
    0,24,49,74,97,120,141,161,180,197,212,224,235,244,250,253,255,
    253,250,244,235,224,212,197,180,161,141,120,97,74,49,24,
    0,24,49,74,97,120,141,161,180,197,212,224,235,244,250,253,255,
    253,250,244,235,224,212,197,180,161,141,120,97,74,49,24,
    0,24,49,74,97,120,141,161,180,197,212,224,235,244,250,253,255,
    253,250,244,235,224,212,197,180,161,141,120,97,74,49,24,
    0,24,49,74,97,120,141,161,180,197,212,224,235,244,250,253,255,
    253,250,244,235,224,212,197,180,161,141,120,97,74,49,24,
    0,24,49,74,97,120,141,161,180,197,212,224,235,244,250,253,255,
    253,250,244,235,224,212,197,180,161,141,120,97,74,49,24,
    0,24,49,74,97,120,141,161,180,197,212,224,235,244,250,253,255,
    253,250,244,235,224,212,197,180,161,141,120,97,74,49,24,
    0,24,49,74,97,120,141,161,180,197,212,224,235,244,250,253,255,
    253,250,244,235,224,212,197,180,161,141,120,97,74,49,24
]);

const Fnum = new Uint16Array([0x157, 0x16b, 0x181, 0x198, 0x1b0, 0x1ca, 0x1e5, 0x202, 0x220, 0x241, 0x263, 0x287]);

export function nFreq(note: number): number {
    if (note >= 12 * 8)
        return (7 << 10) | FreqEnd;
    return ((note / 12) << 10) | Fnum[note % 12];
}

export const ch_n = [
    new Uint16Array([
        0x003,0x000,0x004,0x001,0x005,0x002,0x006,0x007,0x008,0x103,
        0x100,0x104,0x101,0x105,0x102,0x106,0x107,0x108,0xfff,0xfff
    ]),
    new Uint16Array([
        0x003,0x000,0x004,0x001,0x005,0x002,0x106,0x107,0x108,0x103,
        0x100,0x104,0x101,0x105,0x102,0x006,0x007,0x008,0x008,0x007
    ])
];

export const ch_m = [
    new Uint16Array([
        0x008,0x000,0x009,0x001,0x00a,0x002,0x010,0x011,0x012,0x108,
        0x100,0x109,0x101,0x10a,0x102,0x110,0x111,0x112,0xfff,0xfff
    ]),
    new Uint16Array([
        0x008,0x000,0x009,0x001,0x00a,0x002,0x110,0x111,0x112,0x108,
        0x100,0x109,0x101,0x10a,0x102,0x010,0x014,0x012,0x015,0x011
    ])
];

export const ch_c = [
    new Uint16Array([
        0x00b,0x003,0x00c,0x004,0x00d,0x005,0x013,0x014,0x015,0x10b,
        0x103,0x10c,0x104,0x10d,0x105,0x113,0x114,0x115,0xfff,0xfff
    ]),
    new Uint16Array([
        0x00b,0x003,0x00c,0x004,0x00d,0x005,0x113,0x114,0x115,0x10b,
        0x103,0x10c,0x104,0x10d,0x105,0x013,0xfff,0xfff,0xfff,0xfff
    ])
];

export const _4op_main_chan = new Uint8Array([1, 3, 5, 10, 12, 14]);

// ========================================================================
//  Bitfield helper classes  (step 5 — view objects over Uint8Array pools)
// ========================================================================

// ---- FMInstData: 11-byte OPL register block ----

export class FMInstData {
    #d: Uint8Array;

    constructor(buf: Uint8Array, offset: number) {
        this.#d = buf.subarray(offset, offset + FM_INST_SIZE);
    }

    get raw(): Uint8Array { return this.#d; }

    // byte 0: 0x20 modulator (trem|vibr|sust|ksr|multip)
    get multipM() { return this.#d[0] & 0x0f; }
    set multipM(v) { this.#d[0] = (this.#d[0] & 0xf0) | (v & 0x0f); }
    get ksrM()    { return (this.#d[0] >> 4) & 1; }
    set ksrM(v)   { this.#d[0] ^= (this.#d[0] ^ ((v & 1) << 4)) & 0x10; }
    get sustM()   { return (this.#d[0] >> 5) & 1; }
    set sustM(v)  { this.#d[0] ^= (this.#d[0] ^ ((v & 1) << 5)) & 0x20; }
    get vibrM()   { return (this.#d[0] >> 6) & 1; }
    set vibrM(v)  { this.#d[0] ^= (this.#d[0] ^ ((v & 1) << 6)) & 0x40; }
    get tremM()   { return (this.#d[0] >> 7) & 1; }
    set tremM(v)  { this.#d[0] ^= (this.#d[0] ^ ((v & 1) << 7)) & 0x80; }

    // byte 1: 0x20 carrier
    get multipC() { return this.#d[1] & 0x0f; }
    set multipC(v) { this.#d[1] = (this.#d[1] & 0xf0) | (v & 0x0f); }
    get ksrC()    { return (this.#d[1] >> 4) & 1; }
    set ksrC(v)   { this.#d[1] ^= (this.#d[1] ^ ((v & 1) << 4)) & 0x10; }
    get sustC()   { return (this.#d[1] >> 5) & 1; }
    set sustC(v)  { this.#d[1] ^= (this.#d[1] ^ ((v & 1) << 5)) & 0x20; }
    get vibrC()   { return (this.#d[1] >> 6) & 1; }
    set vibrC(v)  { this.#d[1] ^= (this.#d[1] ^ ((v & 1) << 6)) & 0x40; }
    get tremC()   { return (this.#d[1] >> 7) & 1; }
    set tremC(v)  { this.#d[1] ^= (this.#d[1] ^ ((v & 1) << 7)) & 0x80; }

    // byte 2: 0x40 modulator (ksl|vol)
    get volM()    { return this.#d[2] & 0x3f; }
    set volM(v)   { this.#d[2] = (this.#d[2] & 0xc0) | (v & 0x3f); }
    get kslM()    { return this.#d[2] >> 6; }
    set kslM(v)   { this.#d[2] = (this.#d[2] & 0x3f) | ((v & 3) << 6); }

    // byte 3: 0x40 carrier
    get volC()    { return this.#d[3] & 0x3f; }
    set volC(v)   { this.#d[3] = (this.#d[3] & 0xc0) | (v & 0x3f); }
    get kslC()    { return this.#d[3] >> 6; }
    set kslC(v)   { this.#d[3] = (this.#d[3] & 0x3f) | ((v & 3) << 6); }

    // byte 4: 0x60 modulator (attck|dec)
    get attckM()  { return this.#d[4] >> 4; }
    set attckM(v) { this.#d[4] = (this.#d[4] & 0x0f) | ((v & 0x0f) << 4); }
    get decM()    { return this.#d[4] & 0x0f; }
    set decM(v)   { this.#d[4] = (this.#d[4] & 0xf0) | (v & 0x0f); }

    // byte 5: 0x60 carrier
    get attckC()  { return this.#d[5] >> 4; }
    set attckC(v) { this.#d[5] = (this.#d[5] & 0x0f) | ((v & 0x0f) << 4); }
    get decC()    { return this.#d[5] & 0x0f; }
    set decC(v)   { this.#d[5] = (this.#d[5] & 0xf0) | (v & 0x0f); }

    // byte 6: 0x80 modulator (sustn|rel)
    get sustnM()  { return this.#d[6] >> 4; }
    set sustnM(v) { this.#d[6] = (this.#d[6] & 0x0f) | ((v & 0x0f) << 4); }
    get relM()    { return this.#d[6] & 0x0f; }
    set relM(v)   { this.#d[6] = (this.#d[6] & 0xf0) | (v & 0x0f); }

    // byte 7: 0x80 carrier
    get sustnC()  { return this.#d[7] >> 4; }
    set sustnC(v) { this.#d[7] = (this.#d[7] & 0x0f) | ((v & 0x0f) << 4); }
    get relC()    { return this.#d[7] & 0x0f; }
    set relC(v)   { this.#d[7] = (this.#d[7] & 0xf0) | (v & 0x0f); }

    // byte 8: 0xE0 modulator (waveform)
    get wformM()  { return this.#d[8] & 7; }
    set wformM(v) { this.#d[8] = (this.#d[8] & ~7) | (v & 7); }

    // byte 9: 0xE0 carrier
    get wformC()  { return this.#d[9] & 7; }
    set wformC(v) { this.#d[9] = (this.#d[9] & ~7) | (v & 7); }

    // byte 10: 0xC0 connector (feedb|connect)
    get connect() { return this.#d[10] & 1; }
    set connect(v) { this.#d[10] ^= (this.#d[10] ^ (v & 1)) & 1; }
    get feedb()   { return (this.#d[10] >> 1) & 7; }
    set feedb(v)  { this.#d[10] ^= (this.#d[10] ^ ((v & 7) << 1)) & 0x0e; }
}

// ---- InstrData: 14-byte instrument entry (fm + panning + fine_tune + perc_voice) ----

export class InstrData {
    #d: Uint8Array;

    constructor(buf: Uint8Array, offset: number) {
        this.#d = buf.subarray(offset, offset + INSTR_SIZE);
    }

    get fm(): FMInstData { return new FMInstData(this.#d, 0); }
    get panning()   { return this.#d[11] & 3; }
    set panning(v)  { this.#d[11] = (this.#d[11] & ~3) | (v & 3); }
    get fine_tune() { return (this.#d[12] << 24) >> 24; }
    set fine_tune(v){ this.#d[12] = v & 0xff; }
    get perc_voice(){ return this.#d[13]; }
    set perc_voice(v){ this.#d[13] = v; }
}

// ---- RegTableDef: 15-byte macro cell (fm + freq_slide + panning + duration) ----

export class RegTableDef {
    #d: Uint8Array;

    constructor(buf: Uint8Array, offset: number) {
        this.#d = buf.subarray(offset, offset + REGTABLE_CELL_SIZE);
    }

    get fm(): FMInstData { return new FMInstData(this.#d, 0); }
    get freq_slide() { return (this.#d[11] | (this.#d[12] << 8)) << 16 >> 16; }
    set freq_slide(v){ this.#d[11] = v & 0xff; this.#d[12] = (v >> 8) & 0xff; }
    get panning()   { return this.#d[13] & 3; }
    set panning(v)  { this.#d[13] = (this.#d[13] & ~3) | (v & 3); }
    get duration()  { return this.#d[14]; }
    set duration(v) { this.#d[14] = v; }
    get macro_flags(){ return this.#d[10] & 0xf0; }
    set macro_flags(v){ this.#d[10] = (this.#d[10] & 0x0f) | (v & 0xf0); }
}

// ---- Per-channel view classes ----

export class PortaTable {
    #d: Uint8Array;
    #offset: number;

    constructor(buf: Uint8Array, offset: number) {
        this.#d = buf;
        this.#offset = offset;
    }

    get freq()   { return this.#d[this.#offset] | (this.#d[this.#offset + 1] << 8); }
    set freq(v)  { this.#d[this.#offset] = v & 0xff; this.#d[this.#offset + 1] = (v >> 8) & 0xff; }
    get speed()  { return this.#d[this.#offset + 2]; }
    set speed(v) { this.#d[this.#offset + 2] = v; }
}

export class EffectEntry {
    #d: Uint8Array;
    #offset: number;

    constructor(buf: Uint8Array, offset: number) {
        this.#d = buf;
        this.#offset = offset;
    }

    get def()   { return this.#d[this.#offset]; }
    set def(v)  { this.#d[this.#offset] = v; }
    get val()   { return this.#d[this.#offset + 1]; }
    set val(v)  { this.#d[this.#offset + 1] = v; }
}

export class ArpggTable {
    #d: Uint8Array;
    #offset: number;

    constructor(buf: Uint8Array, offset: number) {
        this.#d = buf;
        this.#offset = offset;
    }

    get state() { return this.#d[this.#offset]; }
    set state(v){ this.#d[this.#offset] = v; }
    get note()  { return this.#d[this.#offset + 1]; }
    set note(v) { this.#d[this.#offset + 1] = v; }
    get add1()  { return this.#d[this.#offset + 2]; }
    set add1(v) { this.#d[this.#offset + 2] = v; }
    get add2()  { return this.#d[this.#offset + 3]; }
    set add2(v) { this.#d[this.#offset + 3] = v; }
}

export class VibrTable {
    #d: Uint8Array;
    #offset: number;

    constructor(buf: Uint8Array, offset: number) {
        this.#d = buf;
        this.#offset = offset;
    }

    get pos()   { return this.#d[this.#offset]; }
    set pos(v)  { this.#d[this.#offset] = v; }
    get dir()   { return this.#d[this.#offset + 1]; }
    set dir(v)  { this.#d[this.#offset + 1] = v; }
    get speed() { return this.#d[this.#offset + 2]; }
    set speed(v){ this.#d[this.#offset + 2] = v; }
    get depth() { return this.#d[this.#offset + 3]; }
    set depth(v){ this.#d[this.#offset + 3] = v; }
    get fine()  { return this.#d[this.#offset + 4]; }
    set fine(v) { this.#d[this.#offset + 4] = v & 1; }
}

export class TremTable {
    #d: Uint8Array;
    #offset: number;

    constructor(buf: Uint8Array, offset: number) {
        this.#d = buf;
        this.#offset = offset;
    }

    get pos()   { return this.#d[this.#offset]; }
    set pos(v)  { this.#d[this.#offset] = v; }
    get dir()   { return this.#d[this.#offset + 1]; }
    set dir(v)  { this.#d[this.#offset + 1] = v; }
    get speed() { return this.#d[this.#offset + 2]; }
    set speed(v){ this.#d[this.#offset + 2] = v; }
    get depth() { return this.#d[this.#offset + 3]; }
    set depth(v){ this.#d[this.#offset + 3] = v; }
    get fine()  { return this.#d[this.#offset + 4]; }
    set fine(v) { this.#d[this.#offset + 4] = v & 1; }
}

export class MacroTable {
    #d: Uint8Array;
    #offset: number;

    constructor(buf: Uint8Array, offset: number) {
        this.#d = buf;
        this.#offset = offset;
    }

    // Each macro table entry is 14 bytes
    get fmreg_pos()     { return this.#d[this.#offset] | (this.#d[this.#offset + 1] << 8); }
    set fmreg_pos(v)    { this.#d[this.#offset] = v & 0xff; this.#d[this.#offset + 1] = (v >> 8) & 0xff; }
    get arpg_pos()      { return this.#d[this.#offset + 2] | (this.#d[this.#offset + 3] << 8); }
    set arpg_pos(v)     { this.#d[this.#offset + 2] = v & 0xff; this.#d[this.#offset + 3] = (v >> 8) & 0xff; }
    get vib_pos()       { return this.#d[this.#offset + 4] | (this.#d[this.#offset + 5] << 8); }
    set vib_pos(v)      { this.#d[this.#offset + 4] = v & 0xff; this.#d[this.#offset + 5] = (v >> 8) & 0xff; }
    get fmreg_duration(){ return this.#d[this.#offset + 6]; }
    set fmreg_duration(v){ this.#d[this.#offset + 6] = v; }
    get arpg_count()    { return this.#d[this.#offset + 7]; }
    set arpg_count(v)   { this.#d[this.#offset + 7] = v; }
    get vib_count()     { return this.#d[this.#offset + 8]; }
    set vib_count(v)    { this.#d[this.#offset + 8] = v; }
    get vib_delay()     { return this.#d[this.#offset + 9]; }
    set vib_delay(v)    { this.#d[this.#offset + 9] = v; }
    get fmreg_ins()     { return this.#d[this.#offset + 10]; }
    set fmreg_ins(v)    { this.#d[this.#offset + 10] = v; }
    get arpg_table()    { return this.#d[this.#offset + 11]; }
    set arpg_table(v)   { this.#d[this.#offset + 11] = v; }
    get vib_table()     { return this.#d[this.#offset + 12]; }
    set vib_table(v)    { this.#d[this.#offset + 12] = v; }
    get arpg_note()     { return this.#d[this.#offset + 13]; }
    set arpg_note(v)    { this.#d[this.#offset + 13] = v; }
    get vib_paused()    { return false; }
    set vib_paused(v)   { /* not stored in pool, handled by callers */ }
    get vib_freq()      { return 0; }
    set vib_freq(v)     { /* not stored in pool, handled by callers */ }
}

export class TremorTable {
    #d: Uint8Array;
    #offset: number;

    constructor(buf: Uint8Array, offset: number) {
        this.#d = buf;
        this.#offset = offset;
    }

    get pos()   { return this.#d[this.#offset]; }
    set pos(v)  { this.#d[this.#offset] = v; }
    get volM()  { return this.#d[this.#offset + 1]; }
    set volM(v) { this.#d[this.#offset + 1] = v; }
    get volC()  { return this.#d[this.#offset + 2]; }
    set volC(v) { this.#d[this.#offset + 2] = v; }
}

// ========================================================================
//  Main player class
// ========================================================================

export default class A2M extends FormatPlayer {
    // ---- type / version ----
    type: number = 0;       // 0 = a2m, 1 = a2t
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

    // ---- song info ----
    songinfo: Record<string, any>;
    instrInfo: { count: number; size: number; ext: any[] };
    arpvib_count: number = 0;

    // ---- Uint8Array pools ----
    #instrPool: Uint8Array;
    #fmregPool: Uint8Array;
    #arpvibPool: Uint8Array;
    #patternPool: Uint8Array;
    #instrExt: any[];

    // ---- Per-channel state (flat typed arrays, length = MAX_CHANNELS) ----
    #chEventTable: Uint8Array;
    #chVoiceTable: Uint8Array;
    #chFreqTable: Uint16Array;
    #chZeroFqTable: Uint16Array;
    #chModulatorVol: Uint8Array;
    #chCarrierVol: Uint8Array;
    #chVolumeLock: Uint8Array;
    #chVol4opLock: Uint8Array;
    #chPeakLock: Uint8Array;
    #chPanLock: Uint8Array;
    #chPanningTable: Uint8Array;
    #chKeyoffLoop: Uint8Array;
    #chPortaFK: Uint8Array;
    #chResetChan: Uint8Array;
    #chLoopbckTable: Uint8Array;
    #chLoopTable: Uint8Array;
    #chNotedelTable: Uint8Array;
    #chNotecutTable: Uint8Array;
    #chFtuneTable: Int8Array;
    #chVolslideType: Uint8Array;

    // effect tables [2][20] stored as flat: slot*20 + chan
    #chEffectTable: Uint8Array;       // [2][20][2] = 80 bytes, access: (slot*20 + chan)*2
    #chFslideTable: Uint8Array;       // [2][20]
    #chGlfsldTable: Uint8Array;       // [2][20][2] = 80 bytes
    #chLastEffect: Uint8Array;        // [2][20][2] = 80 bytes
    #chPortaTable: Uint8Array;        // [2][20][3] = 120 bytes, access: (slot*20 + chan)*3
    #chArpggTable: Uint8Array;        // [2][20][4] = 160 bytes
    #chVibrTable: Uint8Array;         // [2][20][5] = 200 bytes
    #chTremTable: Uint8Array;         // [2][20][5] = 200 bytes
    #chRetrigTable: Uint8Array;       // [2][20]
    #chTremorTable: Uint8Array;       // [2][20][3] = 120 bytes
    #chMacroTable: Uint8Array;        // [20][14] = 280 bytes

    constructor(opl, options) {
        super(opl, options);

        this.vibtrem_table = new Uint8Array(def_vibtrem_table);

        // ---- allocate pools ----
        this.#instrPool = new Uint8Array(MAX_INSTRUMENTS * INSTR_SIZE);
        this.#fmregPool = new Uint8Array(MAX_FMREG_TABLES * FMREG_TABLE_SIZE);
        this.#arpvibPool = new Uint8Array(MAX_ARPVIB_TABLES * ARPVIB_TABLE_SIZE);
        this.#patternPool = new Uint8Array(MAX_PATTERNS * MAX_CHANNELS * MAX_ROWS * EVENT_V9_14_SIZE);
        this.#instrExt = [];

        this.instrInfo = { count: 0, size: 0, ext: this.#instrExt };

        // ---- allocate per-channel state ----
        const C = MAX_CHANNELS;

        // Simple per-channel arrays
        this.#chEventTable    = new Uint8Array(C * EVENT_V9_14_SIZE);
        this.#chVoiceTable    = new Uint8Array(C);
        this.#chFreqTable     = new Uint16Array(C);
        this.#chZeroFqTable   = new Uint16Array(C);
        this.#chModulatorVol  = new Uint8Array(C);
        this.#chCarrierVol    = new Uint8Array(C);
        this.#chVolumeLock    = new Uint8Array(C);
        this.#chVol4opLock    = new Uint8Array(C);
        this.#chPeakLock      = new Uint8Array(C);
        this.#chPanLock       = new Uint8Array(C);
        this.#chPanningTable  = new Uint8Array(C);
        this.#chKeyoffLoop    = new Uint8Array(C);
        this.#chPortaFK       = new Uint8Array(C);
        this.#chResetChan     = new Uint8Array(C);
        this.#chLoopbckTable  = new Uint8Array(C);
        this.#chLoopTable     = new Uint8Array(C * 256);
        this.#chNotedelTable  = new Uint8Array(C);
        this.#chNotecutTable  = new Uint8Array(C);
        this.#chFtuneTable    = new Int8Array(C);
        this.#chVolslideType  = new Uint8Array(C);

        // Slot-indexed arrays [2][C]
        this.#chEffectTable   = new Uint8Array(2 * C * 2);
        this.#chFslideTable   = new Uint8Array(2 * C);
        this.#chGlfsldTable   = new Uint8Array(2 * C * 2);
        this.#chLastEffect    = new Uint8Array(2 * C * 2);
        this.#chPortaTable    = new Uint8Array(2 * C * 3);
        this.#chArpggTable    = new Uint8Array(2 * C * 4);
        this.#chVibrTable     = new Uint8Array(2 * C * 5);
        this.#chTremTable     = new Uint8Array(2 * C * 5);
        this.#chRetrigTable   = new Uint8Array(2 * C);
        this.#chTremorTable   = new Uint8Array(2 * C * 3);
        this.#chMacroTable    = new Uint8Array(C * 14);
    }

    // ====================================================================
    //  OPL helpers (step 3)
    // ====================================================================

    opl2out(reg: number, data: number) {
        this.opl.write(0, reg & 0xff, data);
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
        return new InstrData(this.#instrPool, (ins - 1) * INSTR_SIZE);
    }

    get_instr_ext(ins: number): any {
        if (ins === 0 || ins > this.#instrExt.length) return null;
        return this.#instrExt[ins - 1];
    }

    get_instr_data(ins: number): InstrData | null {
        return this.get_instr(ins);
    }

    get_instr_data_by_ch(chan: number): InstrData | null {
        const ins = this.#chEventTable[chan * EVENT_V9_14_SIZE + 1];
        return this.get_instr(ins);
    }

    get_instr_fine_tune(ins: number): number {
        const instr = this.get_instr(ins);
        return instr ? instr.fine_tune : 0;
    }

    // ---- FM register macro helpers ----

    get_fmreg_table(index: number): Uint8Array | null {
        if (index === 0 || index > MAX_FMREG_TABLES) return null;
        return this.#fmregPool.subarray((index - 1) * FMREG_TABLE_SIZE, index * FMREG_TABLE_SIZE);
    }

    // ---- Arpeggio / vibrato helpers ----

    get_arpeggio_table(arp_table: number): Uint8Array | null {
        if (arp_table === 0 || arp_table > MAX_ARPVIB_TABLES) return null;
        return this.#arpvibPool.subarray((arp_table - 1) * ARPVIB_TABLE_SIZE, (arp_table - 1) * ARPVIB_TABLE_SIZE + 260);
    }

    get_vibrato_table(vib_table: number): Uint8Array | null {
        if (vib_table === 0 || vib_table > MAX_ARPVIB_TABLES) return null;
        const base = (vib_table - 1) * ARPVIB_TABLE_SIZE;
        return this.#arpvibPool.subarray(base + 260, base + 520);
    }

    // ---- Pattern event helpers ----

    get_event_p(pattern: number, channel: number, row: number): Uint8Array {
        const idx = (pattern * MAX_CHANNELS + channel) * MAX_ROWS * EVENT_V9_14_SIZE + row * EVENT_V9_14_SIZE;
        return this.#patternPool.subarray(idx, idx + EVENT_V9_14_SIZE);
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

    #effSlot(slot: number, chan: number): number { return (slot * MAX_CHANNELS + chan); }
    #effSlot3(slot: number, chan: number): number { return (slot * MAX_CHANNELS + chan) * 3; }
    #effSlot4(slot: number, chan: number): number { return (slot * MAX_CHANNELS + chan) * 4; }
    #effSlot5(slot: number, chan: number): number { return (slot * MAX_CHANNELS + chan) * 5; }
    #effSlot2(slot: number, chan: number): number { return (slot * MAX_CHANNELS + chan) * 2; }

    ch_event(chan: number): Uint8Array {
        return this.#chEventTable.subarray(chan * EVENT_V9_14_SIZE, (chan + 1) * EVENT_V9_14_SIZE);
    }

    ch_effect(slot: number, chan: number): EffectEntry {
        return new EffectEntry(this.#chEffectTable, this.#effSlot2(slot, chan));
    }

    ch_last_effect(slot: number, chan: number): EffectEntry {
        return new EffectEntry(this.#chLastEffect, this.#effSlot2(slot, chan));
    }

    ch_glfsld(slot: number, chan: number): EffectEntry {
        return new EffectEntry(this.#chGlfsldTable, this.#effSlot2(slot, chan));
    }

    ch_porta(slot: number, chan: number): PortaTable {
        return new PortaTable(this.#chPortaTable, this.#effSlot3(slot, chan));
    }

    ch_arpgg(slot: number, chan: number): ArpggTable {
        return new ArpggTable(this.#chArpggTable, this.#effSlot4(slot, chan));
    }

    ch_vibr(slot: number, chan: number): VibrTable {
        return new VibrTable(this.#chVibrTable, this.#effSlot5(slot, chan));
    }

    ch_trem(slot: number, chan: number): TremTable {
        return new TremTable(this.#chTremTable, this.#effSlot5(slot, chan));
    }

    ch_macro(chan: number): MacroTable {
        return new MacroTable(this.#chMacroTable, chan * 14);
    }

    ch_tremor(slot: number, chan: number): TremorTable {
        return new TremorTable(this.#chTremorTable, this.#effSlot3(slot, chan));
    }

    ch_fslide(slot: number, chan: number): number {
        return this.#chFslideTable[this.#effSlot(slot, chan)];
    }

    set_ch_fslide(slot: number, chan: number, v: number) {
        this.#chFslideTable[this.#effSlot(slot, chan)] = v;
    }

    ch_retrig(slot: number, chan: number): number {
        return this.#chRetrigTable[this.#effSlot(slot, chan)];
    }

    set_ch_retrig(slot: number, chan: number, v: number) {
        this.#chRetrigTable[this.#effSlot(slot, chan)] = v;
    }

    ch_loop(chan: number, row: number): number {
        return this.#chLoopTable[chan * 256 + row];
    }

    set_ch_loop(chan: number, row: number, v: number) {
        this.#chLoopTable[chan * 256 + row] = v;
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

    load(buffer) {
        // stub
    }

    update() {
        return false;
    }

    rewind(subsong) {
        // stub
    }

    getrefresh() {
        return this.tempo * (this.macro_speedup || 1);
    }

    gettype() {
        return "Adlib Tracker 2" + (this.type === 1 ? " (tiny module" : "") +
            " (v" + this.ffver + ")";
    }

    gettitle() {
        return this.songinfo ? this.songinfo.songname || '' : '';
    }

    getauthor() {
        return this.songinfo ? this.songinfo.composer || '' : '';
    }

    getinstruments() {
        return this.instrInfo.count;
    }
}
