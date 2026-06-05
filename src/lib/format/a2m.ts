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

    // ====================================================================
    //  Loader — a2_import / a2m_import / a2t_import
    // ====================================================================

    load(buffer: Uint8Array): boolean {
        return this.#a2_import(buffer);
    }

    // ---- helpers ----

    #is_data_empty(data: Uint8Array, size: number): boolean {
        for (let i = 0; i < size; i++)
            if (data[i]) return false;
        return true;
    }

    #init_songdata(): void {
        this.songinfo = {
            songname: '', composer: '', instr_names: [],
            pattern_order: new Uint8Array(128).fill(0x80),
            tempo: this.tempo, speed: this.speed,
            common_flag: 0, patt_len: 64, nm_tracks: 18,
            macro_speedup: 1, flag_4op: 0, lock_flags: new Uint8Array(20),
            bpm_rows_per_beat: 0, bpm_tempo_finetune: 0,
        };
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

    #instruments_allocate(number: number): void {
        if (this.editor_mode) number = 255;
        // Pool already allocated in constructor; just set count
        this.instrInfo.count = number;
        this.instrInfo.size = number;
        // Reset instrExt
        this.#instrExt = [];
        for (let i = 0; i < number; i++)
            this.#instrExt.push({ fmreg: 0, arpeggio: 0, vibrato: 0, dis_fmreg_cols: 0 });
    }

    #fmdata_fill_from_raw(dst_offset: number, src: Uint8Array, src_offset: number): void {
        for (let i = 0; i < 11; i++)
            this.#instrPool[dst_offset + i] = src[src_offset + i];
    }

    #instrument_import(ins: number, srci: Uint8Array, srcoff: number): void {
        const off = (ins - 1) * INSTR_SIZE;
        this.#fmdata_fill_from_raw(off, srci, srcoff);
        this.#instrPool[off + 11] = srci[srcoff + 11] & 3; // panning
        this.#instrPool[off + 12] = srci[srcoff + 12];       // fine_tune
        this.#instrPool[off + 13] = this.ffver >= 9 ? srci[srcoff + 13] : 0; // perc_voice
        if ((this.#instrPool[off + 11] & 3) >= 3)
            this.#instrPool[off + 11] = 0;
    }

    #parse_common_flag(cf: number): void {
        this.speed_update    = (cf >> 0) & 1;
        this.lockvol         = (cf >> 1) & 1;
        this.lockVP          = (cf >> 2) & 1;
        this.tremolo_depth   = (cf >> 3) & 1;
        this.vibrato_depth   = (cf >> 4) & 1;
        this.panlock         = (cf >> 5) & 1;
        this.percussion_mode = (cf >> 6) & 1;
        this.volume_scaling  = (cf >> 7) & 1;
    }

    // ---- a2m_import (module format) ----

    #a2_import(buf: Uint8Array): boolean {
        if (buf.length > 10) {
            const magic = String.fromCharCode(buf[0],buf[1],buf[2],buf[3],buf[4],buf[5],buf[6],buf[7],buf[8],buf[9]);
            if (magic === '_A2module_') return this.#a2m_import(buf);
        }
        if (buf.length > 15) {
            const tiny = String.fromCharCode(buf[0],buf[1],buf[2],buf[3],buf[4],buf[5],buf[6],buf[7],buf[8],buf[9],buf[10],buf[11],buf[12],buf[13],buf[14]);
            if (tiny === '_A2tiny_module_') return this.#a2t_import(buf);
        }
        return false;
    }

    #a2m_import(buf: Uint8Array): boolean {
        if (buf.length < 16) return false;
        this.#init_songdata();
        this.len = [];
        this.ffver = buf[14];
        this.type = 0;
        if (!this.ffver || this.ffver > 14) return false;
        const npatt = buf[15];
        let offset = 16;

        // Read varheader (len[])
        const vresult = this.#a2m_read_varheader(buf, offset, npatt, buf.length - offset);
        if (vresult === -1) return false;
        offset += vresult;

        // Read songdata
        const sdresult = this.#a2m_read_songdata(buf, offset, buf.length - offset);
        if (sdresult === -1) return false;
        offset += sdresult;

        // Allocate patterns
        this.#patterns_allocate(npatt, this.songinfo.nm_tracks, this.songinfo.patt_len);

        // Read patterns
        const presult = this.#a2m_read_patterns(buf, offset, buf.length - offset);
        if (presult === -1) return false;

        return true;
    }

    #a2m_read_varheader(buf: Uint8Array, off: number, npatt: number, size: number): number {
        let lensize: number;
        const maxblock = this.ffver < 5 ? (npatt / 16 | 0) + 1 : (npatt / 8 | 0) + 1;
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
                this.len[i] = (buf[off + i * 4] | (buf[off + i * 4 + 1] << 8) | (buf[off + i * 4 + 2] << 16) | (buf[off + i * 4 + 3] << 24)) >>> 0;
            return lensize * 4;
        }
        return -1;
    }

    #a2m_read_songdata(buf: Uint8Array, off: number, size: number): number {
        if (this.ffver < 9) {
            if (this.len[0] > size) return -1;
            const unpacked = new Uint8Array(11717);
            this.depack(buf.subarray(off, off + this.len[0]), this.len[0], unpacked, 11717);

            // Song name (Pascal string: skip length byte)
            let s = '';
            const snlen = Math.min(unpacked[0], 42);
            for (let i = 0; i < snlen; i++) s += String.fromCharCode(unpacked[1 + i]);
            this.songinfo.songname = s;

            // Composer
            s = '';
            const clen = Math.min(unpacked[43], 42);
            for (let i = 0; i < clen; i++) s += String.fromCharCode(unpacked[44 + i]);
            this.songinfo.composer = s;

            // Count instruments
            let count = 250;
            while (count && this.#is_data_empty(unpacked.subarray(8336 + (count - 1) * 13, 8336 + count * 13), 13))
                count--;

            this.#instruments_allocate(count);
            for (let i = 0; i < count; i++)
                this.#instrument_import(i + 1, unpacked, 8336 + i * 13);

            // Instrument names
            for (let i = 0; i < 250; i++) {
                const nlen = Math.min(unpacked[86 + i * 33], 32);
                s = '';
                for (let j = 0; j < nlen; j++) s += String.fromCharCode(unpacked[87 + i * 33 + j]);
                this.songinfo.instr_names[i] = s;
            }

            // Pattern order
            for (let i = 0; i < 128; i++)
                this.songinfo.pattern_order[i] = unpacked[11586 + i];

            this.songinfo.tempo = unpacked[11714];
            this.songinfo.speed = unpacked[11715];
            if (this.ffver > 4)
                this.songinfo.common_flag = unpacked[11716];

            return this.len[0];
        } else {
            if (this.len[0] > size) return -1;
            const unpacked = new Uint8Array(1138338);
            this.depack(buf.subarray(off, off + this.len[0]), this.len[0], unpacked, 1138338);

            // Song name
            let s = '';
            const snlen = Math.min(unpacked[0], 42);
            for (let i = 0; i < snlen; i++) s += String.fromCharCode(unpacked[1 + i]);
            this.songinfo.songname = s;

            // Composer
            s = '';
            const clen = Math.min(unpacked[43], 42);
            for (let i = 0; i < clen; i++) s += String.fromCharCode(unpacked[44 + i]);
            this.songinfo.composer = s;

            // Count instruments
            let count = 255;
            while (count && this.#is_data_empty(unpacked.subarray(11051 + (count - 1) * 14, 11051 + count * 14), 14))
                count--;

            this.#instruments_allocate(count);
            for (let i = 0; i < count; i++)
                this.#instrument_import(i + 1, unpacked, 11051 + i * 14);

            // Instrument names
            for (let i = 0; i < 255; i++) {
                const nlen = Math.min(unpacked[86 + i * 43], 42);
                s = '';
                for (let j = 0; j < nlen; j++) s += String.fromCharCode(unpacked[87 + i * 43 + j]);
                this.songinfo.instr_names[i] = s;
            }

            // FM register tables
            this.#fmreg_table_allocate(count, unpacked, 14621);

            // Copy arpeggio/vibrato refs from fmreg headers
            for (let i = 0; i < count; i++) {
                const ext = this.#instrExt[i];
                if (!ext.fmreg) continue;
                const fmoff = (ext.fmreg - 1) * FMREG_TABLE_SIZE;
                ext.arpeggio = this.#fmregPool[fmoff + 4];
                ext.vibrato = this.#fmregPool[fmoff + 5];
            }

            // Arpeggio/vibrato tables
            this.#arpvib_tables_allocate(255, unpacked, 991526);

            // Pattern order
            for (let i = 0; i < 128; i++)
                this.songinfo.pattern_order[i] = unpacked[1124381 + i];

            this.songinfo.tempo = unpacked[1124509];
            this.songinfo.speed = unpacked[1124510];
            this.songinfo.common_flag = unpacked[1124511];
            this.songinfo.patt_len = unpacked[1124512] | (unpacked[1124513] << 8);
            this.songinfo.nm_tracks = unpacked[1124514];
            this.songinfo.macro_speedup = unpacked[1124515] | (unpacked[1124516] << 8);
            this.songinfo.flag_4op = unpacked[1124517];
            for (let i = 0; i < 20; i++)
                this.songinfo.lock_flags[i] = unpacked[1124518 + i];

            // Disabled FM regs
            this.#disabled_fmregs_import(count, unpacked, 1130042);

            // BPM data
            this.songinfo.bpm_rows_per_beat = unpacked[1138335];
            this.songinfo.bpm_tempo_finetune = (unpacked[1138336] | (unpacked[1138337] << 8)) << 16 >> 16;

            return this.len[0];
        }
    }

    // ---- a2t_import (tiny module format) ----

    #a2t_import(buf: Uint8Array): boolean {
        if (buf.length < 23) return false;
        this.#init_songdata();
        this.len = [];
        this.ffver = buf[19];
        this.type = 1;
        if (!this.ffver || this.ffver > 14) return false;
        this.songinfo.tempo = buf[21];
        this.songinfo.speed = buf[22];
        let offset = 23;

        // Read varheader
        const vresult = this.#a2t_read_varheader(buf, offset, buf.length - offset);
        if (vresult === -1) return false;
        offset += vresult;

        // Common flag
        this.#parse_common_flag(this.songinfo.common_flag);

        // Instruments
        const iresult = this.#a2t_read_instruments(buf, offset, buf.length - offset);
        if (iresult === -1) return false;
        offset += iresult;

        // FM reg tables
        const fresult = this.#a2t_read_fmregtable(buf, offset, buf.length - offset);
        if (fresult === -1) return false;
        offset += fresult;

        // Arpeggio/vibrato tables
        const aresult = this.#a2t_read_arpvibtable(buf, offset, buf.length - offset);
        if (aresult === -1) return false;
        offset += aresult;

        // Disabled FM regs
        const dresult = this.#a2t_read_disabled_fmregs(buf, offset, buf.length - offset);
        if (dresult === -1) return false;
        offset += dresult;

        // Pattern order
        const oresult = this.#a2t_read_order(buf, offset, buf.length - offset);
        if (oresult === -1) return false;
        offset += oresult;

        // Allocate patterns
        this.#patterns_allocate(buf[20], this.songinfo.nm_tracks, this.songinfo.patt_len);

        // Read patterns
        const presult = this.#a2t_read_patterns(buf, offset, buf.length - offset);
        if (presult === -1) return false;

        return true;
    }

    #a2t_read_varheader(buf: Uint8Array, off: number, size: number): number {
        switch (this.ffver) {
            case 1: case 2: case 3: case 4:
                if (12 > size) return -1;
                for (let i = 0; i < 6; i++)
                    this.len[i] = buf[off + i * 2] | (buf[off + i * 2 + 1] << 8);
                return 12;
            case 5: case 6: case 7: case 8:
                if (21 > size) return -1;
                this.songinfo.common_flag = buf[off];
                for (let i = 0; i < 10; i++)
                    this.len[i] = buf[off + 1 + i * 2] | (buf[off + 1 + i * 2 + 1] << 8);
                return 21;
            case 9:
                if (86 > size) return -1;
                this.songinfo.common_flag = buf[off];
                this.songinfo.patt_len = buf[off + 1] | (buf[off + 2] << 8);
                this.songinfo.nm_tracks = buf[off + 3];
                this.songinfo.macro_speedup = buf[off + 4] | (buf[off + 5] << 8);
                for (let i = 0; i < 20; i++)
                    this.len[i] = (buf[off + 6 + i * 4] | (buf[off + 6 + i * 4 + 1] << 8) | (buf[off + 6 + i * 4 + 2] << 16) | (buf[off + 6 + i * 4 + 3] << 24)) >>> 0;
                return 86;
            case 10:
                if (107 > size) return -1;
                this.songinfo.common_flag = buf[off];
                this.songinfo.patt_len = buf[off + 1] | (buf[off + 2] << 8);
                this.songinfo.nm_tracks = buf[off + 3];
                this.songinfo.macro_speedup = buf[off + 4] | (buf[off + 5] << 8);
                this.songinfo.flag_4op = buf[off + 6];
                for (let i = 0; i < 20; i++)
                    this.songinfo.lock_flags[i] = buf[off + 7 + i];
                for (let i = 0; i < 20; i++)
                    this.len[i] = (buf[off + 27 + i * 4] | (buf[off + 27 + i * 4 + 1] << 8) | (buf[off + 27 + i * 4 + 2] << 16) | (buf[off + 27 + i * 4 + 3] << 24)) >>> 0;
                return 107;
            case 11: case 12: case 13: case 14:
                if (111 > size) return -1;
                this.songinfo.common_flag = buf[off];
                this.songinfo.patt_len = buf[off + 1] | (buf[off + 2] << 8);
                this.songinfo.nm_tracks = buf[off + 3];
                this.songinfo.macro_speedup = buf[off + 4] | (buf[off + 5] << 8);
                this.songinfo.flag_4op = buf[off + 6];
                for (let i = 0; i < 20; i++)
                    this.songinfo.lock_flags[i] = buf[off + 7 + i];
                for (let i = 0; i < 21; i++)
                    this.len[i] = (buf[off + 27 + i * 4] | (buf[off + 27 + i * 4 + 1] << 8) | (buf[off + 27 + i * 4 + 2] << 16) | (buf[off + 27 + i * 4 + 3] << 24)) >>> 0;
                return 111;
        }
        return -1;
    }

    #a2t_read_instruments(buf: Uint8Array, off: number, size: number): number {
        if (this.len[0] > size) return -1;
        const instnum = this.ffver < 9 ? 250 : 255;
        const instsize = this.ffver < 9 ? 13 : 14;
        let unpackedsize = instnum * instsize;
        if (this.ffver >= 12 && this.ffver <= 14) unpackedsize += 3 + 129 + 1024;
        if (this.ffver === 14) unpackedsize += 3; // BPM_DATA_SIZE
        const unpacked = new Uint8Array(unpackedsize);

        this.depack(buf.subarray(off, off + this.len[0]), this.len[0], unpacked, unpackedsize);

        let p = 0;
        // Skip BPM data (v14), ins_4op_flags (v12+), reserved (v12+)
        if (this.ffver === 14) p += 3;
        if (this.ffver >= 12 && this.ffver <= 14) p += 129 + 1024;

        // Count actual instruments
        let count = instnum;
        while (count && this.#is_data_empty(unpacked.subarray(p + (count - 1) * instsize, p + count * instsize), instsize))
            count--;

        this.#instruments_allocate(count);
        for (let i = 0; i < count; i++, p += instsize)
            this.#instrument_import(i + 1, unpacked, p);

        return this.len[0];
    }

    #a2t_read_fmregtable(buf: Uint8Array, off: number, size: number): number {
        if (this.ffver < 9) return 0;
        if (this.len[1] > size) return -1;

        const unpacked = new Uint8Array(255 * 3831);
        this.depack(buf.subarray(off, off + this.len[1]), this.len[1], unpacked, 255 * 3831);

        this.#fmreg_table_allocate(this.instrInfo.count, unpacked, 0);

        // Copy arpeggio/vibrato refs
        for (let i = 0; i < this.instrInfo.count; i++) {
            const ext = this.#instrExt[i];
            if (!ext.fmreg) continue;
            const fmoff = (ext.fmreg - 1) * FMREG_TABLE_SIZE;
            ext.arpeggio = this.#fmregPool[fmoff + 4];
            ext.vibrato = this.#fmregPool[fmoff + 5];
        }

        return this.len[1];
    }

    #a2t_read_arpvibtable(buf: Uint8Array, off: number, size: number): number {
        if (this.ffver < 9) return 0;
        if (this.len[2] > size) return -1;

        const unpacked = new Uint8Array(255 * 521);
        this.depack(buf.subarray(off, off + this.len[2]), this.len[2], unpacked, 255 * 521);

        this.#arpvib_tables_allocate(255, unpacked, 0);

        return this.len[2];
    }

    #a2t_read_disabled_fmregs(buf: Uint8Array, off: number, size: number): number {
        if (this.ffver < 11) return 0;
        if (this.len[3] > size) return -1;

        const unpacked = new Uint8Array(255 * 28);
        this.depack(buf.subarray(off, off + this.len[3]), this.len[3], unpacked, 255 * 28);

        this.#disabled_fmregs_import(this.instrInfo.count, unpacked, 0);

        return this.len[3];
    }

    #a2t_read_order(buf: Uint8Array, off: number, size: number): number {
        const blocknum = [1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 4, 4, 4, 4];
        const i = blocknum[this.ffver - 1];
        if (this.len[i] > size) return -1;

        const tmp = new Uint8Array(128);
        this.depack(buf.subarray(off, off + this.len[i]), this.len[i], tmp, 128);
        this.songinfo.pattern_order.set(tmp);

        return this.len[i];
    }

    // ---- patterns (common for a2m/a2t) ----

    #patterns_allocate(patterns: number, channels: number, rows: number): void {
        if (this.editor_mode) { patterns = 128; channels = 20; rows = 256; }
        // Pool is pre-allocated; just store metadata
        this.songinfo.patt_len = rows;
        this.songinfo.nm_tracks = channels;
        // re-allocate pool if needed
        const needed = patterns * MAX_CHANNELS * MAX_ROWS * EVENT_V9_14_SIZE;
        if (this.#patternPool.length < needed)
            this.#patternPool = new Uint8Array(needed);
    }

    #a2_read_patterns(src: Uint8Array, s: number, size: number): number {
        let retval = 0;
        let srcOff = 0;

        switch (this.ffver) {
            case 1: case 2: case 3: case 4: {
                const old = new Uint8Array(16 * 2304);
                for (let i = 0; i < 4; i++) {
                    if (!this.len[i + s]) continue;
                    if (this.len[i + s] > size) return -1;

                    this.depack(src.subarray(srcOff, srcOff + this.len[i + s]), this.len[i + s], old, 16 * 2304);

                    for (let p = 0; p < 16; p++) {
                        if (i * 8 + p >= this.songinfo.patt_len) break;
                        for (let r = 0; r < 64; r++)
                            for (let c = 0; c < 9; c++) {
                                const evOff = p * 2304 + r * 9 * 4 + c * 4;
                                const ev = this.get_event_p(i * 16 + p, c, r);
                                ev[0] = old[evOff];
                                ev[1] = old[evOff + 1];
                                ev[2] = old[evOff + 2];
                                ev[3] = old[evOff + 3];
                                this.#convert_v1234_effects(ev, c);
                            }
                    }
                    srcOff += this.len[i + s];
                    size -= this.len[i + s];
                    retval += this.len[i + s];
                }
                break;
            }
            case 5: case 6: case 7: case 8: {
                const old = new Uint8Array(8 * 4608);
                for (let i = 0; i < 8; i++) {
                    if (!this.len[i + s]) continue;
                    if (this.len[i + s] > size) return -1;

                    this.depack(src.subarray(srcOff, srcOff + this.len[i + s]), this.len[i + s], old, 8 * 4608);

                    for (let p = 0; p < 8; p++) {
                        if (i * 8 + p >= this.songinfo.nm_tracks) break;
                        for (let c = 0; c < 18; c++)
                            for (let r = 0; r < 64; r++) {
                                const evOff = p * 4608 + c * 64 * 4 + r * 4;
                                const ev = this.get_event_p(i * 8 + p, c, r);
                                ev[0] = old[evOff];
                                ev[1] = old[evOff + 1];
                                const eDef = old[evOff + 2];
                                const eVal = old[evOff + 3];
                                if (eDef === 22) {
                                    if ((eVal / 16 | 0) !== 0) {
                                        ev[2] = ef_Extended2;
                                        ev[3] = (ef_ex2_FineTuneUp << 4) | (eVal / 16 | 0);
                                    } else {
                                        ev[2] = ef_Extended2;
                                        ev[3] = (ef_ex2_FineTuneDown << 4) | (eVal % 16);
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
            case 9: case 10: case 11: case 12: case 13: case 14: {
                const old = new Uint8Array(8 * 30720);
                for (let i = 0; i < 16; i++) {
                    if (!this.len[i + s]) continue;
                    if (this.len[i + s] > size) return -1;

                    this.depack(src.subarray(srcOff, srcOff + this.len[i + s]), this.len[i + s], old, 8 * 30720);
                    srcOff += this.len[i + s];
                    size -= this.len[i + s];
                    retval += this.len[i + s];

                    for (let p = 0; p < 8; p++) {
                        if (i * 8 + p >= this.songinfo.nm_tracks) break;
                        for (let c = 0; c < this.songinfo.nm_tracks; c++)
                            for (let r = 0; r < this.songinfo.patt_len; r++) {
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

    #a2t_read_patterns(buf: Uint8Array, off: number, size: number): number {
        const blockstart = [2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 5, 5, 5, 5];
        const s = blockstart[this.ffver - 1];
        return this.#a2_read_patterns(buf, s, size);
    }

    #a2m_read_patterns(buf: Uint8Array, off: number, size: number): number {
        return this.#a2_read_patterns(buf, 1, size);
    }

    #convert_v1234_effects(ev: Uint8Array, chan: number): void {
        const def = ev[2];
        const val = ev[3];
        switch (def) {
            case 0x00: ev[2] = 0; break; // Arpeggio → ef_Arpeggio (0x80 in new format, but stored as 0 during conversion)
            case 0x01: ev[2] = ef_FSlideUp; break;
            case 0x02: ev[2] = ef_FSlideDown; break;
            case 0x03: ev[2] = ef_FSlideUpFine; break;
            case 0x04: ev[2] = ef_FSlideDownFine; break;
            case 0x05: ev[2] = ef_TonePortamento; break;
            case 0x06: ev[2] = ef_TPortamVolSlide; break;
            case 0x07: ev[2] = ef_Vibrato; break;
            case 0x08: ev[2] = ef_VibratoVolSlide; break;
            case 0x09: // SetOpIntensity
                if (val & 0xf0) { ev[2] = ef_SetCarrierVol; ev[3] = ((val >> 4) * 4 + 3) & 0xff; }
                else if (val & 0x0f) { ev[2] = ef_SetModulatorVol; ev[3] = ((val & 0x0f) * 4 + 3) & 0xff; }
                else ev[2] = 0;
                break;
            case 0x0a: ev[2] = ef_SetInsVolume; break;
            case 0x0b: ev[2] = ef_PatternBreak; break;
            case 0x0c: ev[2] = ef_PositionJump; break;
            case 0x0d: ev[2] = ef_SetSpeed; break;
            case 0x0e: ev[2] = ef_SetTempo; break;
            case 0x0f: { // Extended
                const sub = val >> 4;
                const lo = val & 0x0f;
                switch (sub) {
                    case 0x00: ev[2] = ef_Extended; ev[3] = (ef_ex_SetTremDepth << 4) | lo; break;
                    case 0x01: ev[2] = ef_Extended; ev[3] = (ef_ex_SetVibDepth << 4) | lo; break;
                    case 0x02: // DefWaveform
                        ev[2] = ef_SetWaveform;
                        ev[3] = lo < 4 ? (lo << 4) | 0x0f : (lo - 4) | 0xf0;
                        break;
                    case 0x03: ev[2] = ef_Extended2; ev[3] = (ef_ex2_FineTuneUp << 4) | lo; break;
                    case 0x04: ev[2] = ef_Extended2; ev[3] = (ef_ex2_FineTuneDown << 4) | lo; break;
                    case 0x05: ev[2] = ef_VolSlide; ev[3] = lo << 4; break;
                    case 0x06: ev[2] = ef_VolSlide; ev[3] = lo; break;
                    case 0x07: ev[2] = ef_VolSlideFine; ev[3] = lo << 4; break;
                    case 0x08: ev[2] = ef_VolSlideFine; ev[3] = lo; break;
                    case 0x09: ev[2] = ef_RetrigNote; ev[3] = lo + 1; break;
                    case 0x0a: ev[2] = ef_Extended; ev[3] = (this.adsr_carrier[chan] ? ef_ex_SetAttckRateC : ef_ex_SetAttckRateM) << 4 | lo; break;
                    case 0x0b: ev[2] = ef_Extended; ev[3] = (this.adsr_carrier[chan] ? ef_ex_SetDecayRateC : ef_ex_SetDecayRateM) << 4 | lo; break;
                    case 0x0c: ev[2] = ef_Extended; ev[3] = (this.adsr_carrier[chan] ? ef_ex_SetSustnLevelC : ef_ex_SetSustnLevelM) << 4 | lo; break;
                    case 0x0d: ev[2] = ef_Extended; ev[3] = (this.adsr_carrier[chan] ? ef_ex_SetRelRateC : ef_ex_SetRelRateM) << 4 | lo; break;
                    case 0x0e: ev[2] = ef_Extended; ev[3] = (ef_ex_SetFeedback << 4) | lo; break;
                    case 0x0f: // ExtendedCmd
                        ev[2] = ef_Extended;
                        ev[3] = ef_ex_ExtendedCmd2 << 4;
                        if (lo < 10) {
                            const cmds = [ef_ex_cmd2_RSS, ef_ex_cmd2_LockVol, ef_ex_cmd2_UnlockVol,
                                ef_ex_cmd2_LockVP, ef_ex_cmd2_UnlockVP, 0, 0,
                                ef_ex_cmd2_VSlide_car, ef_ex_cmd2_VSlide_mod, ef_ex_cmd2_VSlide_def];
                            if (lo === 5) { ev[2] = 0; ev[3] = 0; this.adsr_carrier[chan] = true; }
                            else if (lo === 6) { ev[2] = 0; ev[3] = 0; this.adsr_carrier[chan] = false; }
                            else ev[3] |= cmds[lo];
                        } else { ev[2] = 0; ev[3] = 0; }
                        break;
                }
                break;
            }
            default: ev[2] = 0; ev[3] = 0;
        }
    }

    // ---- FM register macro table allocation ----

    #fmreg_table_allocate(n: number, src: Uint8Array, srcoff: number): void {
        if (this.editor_mode) n = 255;
        for (let i = 0; i < n; i++, srcoff += FMREG_TABLE_SIZE) {
            const ext = this.#instrExt[i];
            // Always store data in pool (editor_mode)
            for (let j = 0; j < FMREG_TABLE_SIZE; j++)
                this.#fmregPool[i * FMREG_TABLE_SIZE + j] = src[srcoff + j];
            const headerLinks = src[srcoff + 1] | src[srcoff + 2] | src[srcoff + 3] | src[srcoff + 4] | src[srcoff + 5];
            if (this.editor_mode || src[srcoff] || headerLinks)
                ext.fmreg = i + 1;
        }
    }

    // ---- Arpeggio/vibrato table allocation ----

    #arpvib_tables_allocate(n: number, src: Uint8Array, srcoff: number): void {
        if (this.editor_mode) n = 255;
        for (let i = 0; i < n; i++, srcoff += 521) {
            // Arpeggio part (260 bytes)
            for (let j = 0; j < 260; j++)
                this.#arpvibPool[i * 521 + j] = src[srcoff + j];
            // Vibrato part (261 bytes)
            for (let j = 0; j < 261; j++)
                this.#arpvibPool[i * 521 + 260 + j] = src[srcoff + 260 + j];
        }
    }

    // ---- Disabled FM regs import ----

    #disabled_fmregs_import(n: number, src: Uint8Array, srcoff: number): void {
        if (this.editor_mode) n = 255;
        for (let i = 0; i < n; i++) {
            let result = 0;
            for (let bit = 0; bit < 28; bit++)
                result |= (src[srcoff + i * 28 + bit] & 1) << bit;
            this.#instrExt[i].dis_fmreg_cols = result;
        }
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
