// @ts-nocheck
// nukedopl.ts – Faithful TypeScript port of Nuked OPL3 v1.8
// Original C: Copyright (C) 2013-2020 Nuke.YKT (LGPL v2.1+)
// Pointer aliasing (int16_t*, uint8_t*) modelled as () => number closures.

// ─── Constants ────────────────────────────────────────────────────────────────

const RSM_FRAC          = 10;
const OPL_WRITEBUF_SIZE = 1024;
const OPL_WRITEBUF_DELAY = 2;

const CH_2OP  = 0;
const CH_4OP  = 1;
const CH_4OP2 = 2;
const CH_DRUM = 3;

const EGK_NORM = 0x01;
const EGK_DRUM = 0x02;

const EG_ATTACK  = 0;
const EG_DECAY   = 1;
const EG_SUSTAIN = 2;
const EG_RELEASE = 3;

// ─── ROM tables ───────────────────────────────────────────────────────────────

const logsinrom = new Uint16Array([
    0x859,0x6c3,0x607,0x58b,0x52e,0x4e4,0x4a6,0x471,
    0x443,0x41a,0x3f5,0x3d3,0x3b5,0x398,0x37e,0x365,
    0x34e,0x339,0x324,0x311,0x2ff,0x2ed,0x2dc,0x2cd,
    0x2bd,0x2af,0x2a0,0x293,0x286,0x279,0x26d,0x261,
    0x256,0x24b,0x240,0x236,0x22c,0x222,0x218,0x20f,
    0x206,0x1fd,0x1f5,0x1ec,0x1e4,0x1dc,0x1d4,0x1cd,
    0x1c5,0x1be,0x1b7,0x1b0,0x1a9,0x1a2,0x19b,0x195,
    0x18f,0x188,0x182,0x17c,0x177,0x171,0x16b,0x166,
    0x160,0x15b,0x155,0x150,0x14b,0x146,0x141,0x13c,
    0x137,0x133,0x12e,0x129,0x125,0x121,0x11c,0x118,
    0x114,0x10f,0x10b,0x107,0x103,0x0ff,0x0fb,0x0f8,
    0x0f4,0x0f0,0x0ec,0x0e9,0x0e5,0x0e2,0x0de,0x0db,
    0x0d7,0x0d4,0x0d1,0x0cd,0x0ca,0x0c7,0x0c4,0x0c1,
    0x0be,0x0bb,0x0b8,0x0b5,0x0b2,0x0af,0x0ac,0x0a9,
    0x0a7,0x0a4,0x0a1,0x09f,0x09c,0x099,0x097,0x094,
    0x092,0x08f,0x08d,0x08a,0x088,0x086,0x083,0x081,
    0x07f,0x07d,0x07a,0x078,0x076,0x074,0x072,0x070,
    0x06e,0x06c,0x06a,0x068,0x066,0x064,0x062,0x060,
    0x05e,0x05c,0x05b,0x059,0x057,0x055,0x053,0x052,
    0x050,0x04e,0x04d,0x04b,0x04a,0x048,0x046,0x045,
    0x043,0x042,0x040,0x03f,0x03e,0x03c,0x03b,0x039,
    0x038,0x037,0x035,0x034,0x033,0x031,0x030,0x02f,
    0x02e,0x02d,0x02b,0x02a,0x029,0x028,0x027,0x026,
    0x025,0x024,0x023,0x022,0x021,0x020,0x01f,0x01e,
    0x01d,0x01c,0x01b,0x01a,0x019,0x018,0x017,0x017,
    0x016,0x015,0x014,0x014,0x013,0x012,0x011,0x011,
    0x010,0x00f,0x00f,0x00e,0x00d,0x00d,0x00c,0x00c,
    0x00b,0x00a,0x00a,0x009,0x009,0x008,0x008,0x007,
    0x007,0x007,0x006,0x006,0x005,0x005,0x005,0x004,
    0x004,0x004,0x003,0x003,0x003,0x002,0x002,0x002,
    0x002,0x001,0x001,0x001,0x001,0x001,0x001,0x001,
    0x000,0x000,0x000,0x000,0x000,0x000,0x000,0x000,
]);

const exprom = new Uint16Array([
    0x7fa,0x7f5,0x7ef,0x7ea,0x7e4,0x7df,0x7da,0x7d4,
    0x7cf,0x7c9,0x7c4,0x7bf,0x7b9,0x7b4,0x7ae,0x7a9,
    0x7a4,0x79f,0x799,0x794,0x78f,0x78a,0x784,0x77f,
    0x77a,0x775,0x770,0x76a,0x765,0x760,0x75b,0x756,
    0x751,0x74c,0x747,0x742,0x73d,0x738,0x733,0x72e,
    0x729,0x724,0x71f,0x71a,0x715,0x710,0x70b,0x706,
    0x702,0x6fd,0x6f8,0x6f3,0x6ee,0x6e9,0x6e5,0x6e0,
    0x6db,0x6d6,0x6d2,0x6cd,0x6c8,0x6c4,0x6bf,0x6ba,
    0x6b5,0x6b1,0x6ac,0x6a8,0x6a3,0x69e,0x69a,0x695,
    0x691,0x68c,0x688,0x683,0x67f,0x67a,0x676,0x671,
    0x66d,0x668,0x664,0x65f,0x65b,0x657,0x652,0x64e,
    0x649,0x645,0x641,0x63c,0x638,0x634,0x630,0x62b,
    0x627,0x623,0x61e,0x61a,0x616,0x612,0x60e,0x609,
    0x605,0x601,0x5fd,0x5f9,0x5f5,0x5f0,0x5ec,0x5e8,
    0x5e4,0x5e0,0x5dc,0x5d8,0x5d4,0x5d0,0x5cc,0x5c8,
    0x5c4,0x5c0,0x5bc,0x5b8,0x5b4,0x5b0,0x5ac,0x5a8,
    0x5a4,0x5a0,0x59c,0x599,0x595,0x591,0x58d,0x589,
    0x585,0x581,0x57e,0x57a,0x576,0x572,0x56f,0x56b,
    0x567,0x563,0x560,0x55c,0x558,0x554,0x551,0x54d,
    0x549,0x546,0x542,0x53e,0x53b,0x537,0x534,0x530,
    0x52c,0x529,0x525,0x522,0x51e,0x51b,0x517,0x514,
    0x510,0x50c,0x509,0x506,0x502,0x4ff,0x4fb,0x4f8,
    0x4f4,0x4f1,0x4ed,0x4ea,0x4e7,0x4e3,0x4e0,0x4dc,
    0x4d9,0x4d6,0x4d2,0x4cf,0x4cc,0x4c8,0x4c5,0x4c2,
    0x4be,0x4bb,0x4b8,0x4b5,0x4b1,0x4ae,0x4ab,0x4a8,
    0x4a4,0x4a1,0x49e,0x49b,0x498,0x494,0x491,0x48e,
    0x48b,0x488,0x485,0x482,0x47e,0x47b,0x478,0x475,
    0x472,0x46f,0x46c,0x469,0x466,0x463,0x460,0x45d,
    0x45a,0x457,0x454,0x451,0x44e,0x44b,0x448,0x445,
    0x442,0x43f,0x43c,0x439,0x436,0x433,0x430,0x42d,
    0x42a,0x428,0x425,0x422,0x41f,0x41c,0x419,0x416,
    0x414,0x411,0x40e,0x40b,0x408,0x406,0x403,0x400,
]);

// freq-mult × 2 (so 0.5 is encoded as 1, 1 as 2, etc.)
const mt       = new Uint8Array([1,2,4,6,8,10,12,14,16,18,20,20,24,24,30,30]);
const kslrom   = new Uint8Array([0,32,40,45,48,51,53,55,56,58,59,60,61,62,63,64]);
const kslshift = new Uint8Array([8,1,2,0]);

const eg_incstep = [
    new Uint8Array([0,0,0,0]),
    new Uint8Array([1,0,0,0]),
    new Uint8Array([1,0,1,0]),
    new Uint8Array([1,1,1,0]),
];

// Register-address → slot-index within a bank (−1 = invalid)
const ad_slot = new Int8Array([
     0, 1, 2, 3, 4, 5,-1,-1, 6, 7, 8, 9,10,11,-1,-1,
    12,13,14,15,16,17,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
]);

// Channel → primary slot index
const ch_slot = new Uint8Array([
    0,1,2,6,7,8,12,13,14,18,19,20,24,25,26,30,31,32,
]);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Clip to signed 16-bit range. */
function clipSample(s: number): number {
    return s > 32767 ? 32767 : s < -32768 ? -32768 : (s | 0);
}

/** Convert a 32-bit JS integer result to its int16 interpretation. */
function i16(v: number): number {
    return (v << 16) >> 16;
}

// ─── Envelope exp (log→linear) ───────────────────────────────────────────────

function envelopeCalcExp(level: number): number {
    if (level > 0x1fff) level = 0x1fff;
    return (exprom[level & 0xff] << 1) >> (level >> 8);
}

// ─── 8 waveform generators ────────────────────────────────────────────────────
// Each returns a signed int16 value as a JS number.

function calcSin0(phase: number, env: number): number {
    phase &= 0x3ff;
    const neg = (phase & 0x200) ? 0xffff : 0;
    const out = (phase & 0x100) ? logsinrom[(phase & 0xff) ^ 0xff] : logsinrom[phase & 0xff];
    return i16(envelopeCalcExp(out + (env << 3)) ^ neg);
}
function calcSin1(phase: number, env: number): number {
    phase &= 0x3ff;
    const out = (phase & 0x200) ? 0x1000
              : (phase & 0x100) ? logsinrom[(phase & 0xff) ^ 0xff]
              :                   logsinrom[phase & 0xff];
    return envelopeCalcExp(out + (env << 3));
}
function calcSin2(phase: number, env: number): number {
    phase &= 0x3ff;
    const out = (phase & 0x100) ? logsinrom[(phase & 0xff) ^ 0xff] : logsinrom[phase & 0xff];
    return envelopeCalcExp(out + (env << 3));
}
function calcSin3(phase: number, env: number): number {
    phase &= 0x3ff;
    const out = (phase & 0x100) ? 0x1000 : logsinrom[phase & 0xff];
    return envelopeCalcExp(out + (env << 3));
}
function calcSin4(phase: number, env: number): number {
    phase &= 0x3ff;
    const neg = ((phase & 0x300) === 0x100) ? 0xffff : 0;
    const out = (phase & 0x200) ? 0x1000
              : (phase & 0x80)  ? logsinrom[((phase ^ 0xff) << 1) & 0xff]
              :                   logsinrom[(phase << 1) & 0xff];
    return i16(envelopeCalcExp(out + (env << 3)) ^ neg);
}
function calcSin5(phase: number, env: number): number {
    phase &= 0x3ff;
    const out = (phase & 0x200) ? 0x1000
              : (phase & 0x80)  ? logsinrom[((phase ^ 0xff) << 1) & 0xff]
              :                   logsinrom[(phase << 1) & 0xff];
    return envelopeCalcExp(out + (env << 3));
}
function calcSin6(phase: number, env: number): number {
    phase &= 0x3ff;
    const neg = (phase & 0x200) ? 0xffff : 0;
    return i16(envelopeCalcExp(env << 3) ^ neg);
}
function calcSin7(phase: number, env: number): number {
    phase &= 0x3ff;
    const neg = (phase & 0x200) ? 0xffff : 0;
    if (phase & 0x200) phase = (phase & 0x1ff) ^ 0x1ff;
    return i16(envelopeCalcExp((phase << 3) + (env << 3)) ^ neg);
}

const sinFuncs = [calcSin0,calcSin1,calcSin2,calcSin3,calcSin4,calcSin5,calcSin6,calcSin7];

// ─── Data structures ─────────────────────────────────────────────────────────
// Slots, channels, and the chip are plain objects; pointer fields become
// () => number closures so that reading *ptr is just ptr().

function makeSlot(slotNum: number): any {
    return {
        channel:      null,
        chip:         null,
        out:          0,    // int16 output
        fbmod:        0,    // int16 feedback modulator
        mod:          () => 0, // closure: reads modulator source
        prout:        0,    // previous output
        eg_rout:      0x1ff,
        eg_out:       0x1ff,
        eg_inc:       0,
        eg_gen:       EG_RELEASE,
        eg_rate:      0,
        eg_ksl:       0,
        trem:         () => 0, // closure: reads tremolo source
        reg_vib:      0,
        reg_type:     0,
        reg_ksr:      0,
        reg_mult:     0,
        reg_ksl:      0,
        reg_tl:       0,
        reg_ar:       0,
        reg_dr:       0,
        reg_sl:       0,
        reg_rr:       0,
        reg_wf:       0,
        key:          0,
        pg_reset:     0,
        pg_phase:     0,
        pg_phase_out: 0,
        slot_num:     slotNum,
    };
}

function makeChannel(chNum: number): any {
    return {
        slotz:   [null, null],
        pair:    null,
        chip:    null,
        // 4 output pointer closures; default to zeromod (chip set after link)
        out:     [() => 0, () => 0, () => 0, () => 0],
        chtype:  CH_2OP,
        f_num:   0,
        block:   0,
        fb:      0,
        con:     0,
        alg:     0,
        ksv:     0,
        cha:     0xffff,
        chb:     0xffff,
        chc:     0,
        chd:     0,
        ch_num:  chNum,
    };
}

function makeChip(): any {
    const chip: any = {
        channel:          [] as any[],
        slot:             [] as any[],
        timer:            0,
        eg_timer:         0,
        eg_timerrem:      0,
        eg_state:         0,
        eg_add:           0,
        newm:             0,
        nts:              0,
        rhy:              0,
        vibpos:           0,
        vibshift:         1,
        tremolo:          0,
        tremolopos:       0,
        tremoloshift:     4,
        noise:            1,
        zeromod:          0, // always 0; slots/channels close over this
        mixbuff:          [0,0,0,0],
        rm_hh_bit2:       0,
        rm_hh_bit3:       0,
        rm_hh_bit7:       0,
        rm_hh_bit8:       0,
        rm_tc_bit3:       0,
        rm_tc_bit5:       0,
        rateratio:        0,
        samplecnt:        0,
        oldsamples:       [0,0,0,0],
        samples:          [0,0,0,0],
        writebuf_samplecnt: 0,
        writebuf_cur:     0,
        writebuf_last:    0,
        writebuf_lasttime: 0,
        writebuf:         [] as any[],
    };

    // Allocate slots and channels
    for (let i = 0; i < 36; i++) chip.slot.push(makeSlot(i));
    for (let i = 0; i < 18; i++) chip.channel.push(makeChannel(i));

    // Write buffer
    for (let i = 0; i < OPL_WRITEBUF_SIZE; i++) {
        chip.writebuf.push({ time: 0, reg: 0, data: 0 });
    }

    return chip;
}

// ─── Envelope KSL update ─────────────────────────────────────────────────────

function envelopeUpdateKSL(slot: any): void {
    let ksl = (kslrom[slot.channel.f_num >> 6] << 2) - ((0x08 - slot.channel.block) << 5);
    if (ksl < 0) ksl = 0;
    slot.eg_ksl = ksl;
}

// ─── Envelope calculation ────────────────────────────────────────────────────

function envelopeCalc(slot: any): void {
    const chip   = slot.chip;
    const ch     = slot.channel;

    slot.eg_out = (slot.eg_rout + (slot.reg_tl << 2)
                + (slot.eg_ksl >> kslshift[slot.reg_ksl])
                + slot.trem()) & 0xffff;

    let reset    = 0;
    let reg_rate = 0;

    if (slot.key && slot.eg_gen === EG_RELEASE) {
        reset    = 1;
        reg_rate = slot.reg_ar;
    } else {
        switch (slot.eg_gen) {
            case EG_ATTACK:  reg_rate = slot.reg_ar; break;
            case EG_DECAY:   reg_rate = slot.reg_dr; break;
            case EG_SUSTAIN: if (!slot.reg_type) reg_rate = slot.reg_rr; break;
            case EG_RELEASE: reg_rate = slot.reg_rr; break;
        }
    }

    slot.pg_reset = reset;

    const ks       = ch.ksv >> ((slot.reg_ksr ^ 1) << 1);
    const nonzero  = (reg_rate !== 0) ? 1 : 0;
    let   rate     = ks + (reg_rate << 2);
    let   rate_hi  = rate >> 2;
    const rate_lo  = rate & 0x03;
    if (rate_hi & 0x10) rate_hi = 0x0f;

    const eg_shift = rate_hi + chip.eg_add;
    let   shift    = 0;

    if (nonzero) {
        if (rate_hi < 12) {
            if (chip.eg_state) {
                switch (eg_shift) {
                    case 12: shift = 1; break;
                    case 13: shift = (rate_lo >> 1) & 0x01; break;
                    case 14: shift = rate_lo & 0x01; break;
                }
            }
        } else {
            shift = (rate_hi & 0x03) + eg_incstep[rate_lo][chip.timer & 0x03];
            if (shift & 0x04) shift = 0x03;
            if (!shift)       shift = chip.eg_state;
        }
    }

    let eg_rout = slot.eg_rout;
    let eg_inc  = 0;
    let eg_off  = 0;

    // Instant attack
    if (reset && rate_hi === 0x0f) eg_rout = 0x00;

    // Envelope off check
    if ((slot.eg_rout & 0x1f8) === 0x1f8) eg_off = 1;

    if (slot.eg_gen !== EG_ATTACK && !reset && eg_off) eg_rout = 0x1ff;

    switch (slot.eg_gen) {
        case EG_ATTACK:
            if (!slot.eg_rout) {
                slot.eg_gen = EG_DECAY;
            } else if (slot.key && shift > 0 && rate_hi !== 0x0f) {
                eg_inc = (~slot.eg_rout) >> (4 - shift);
            }
            break;
        case EG_DECAY:
            if ((slot.eg_rout >> 4) === slot.reg_sl) {
                slot.eg_gen = EG_SUSTAIN;
            } else if (!eg_off && !reset && shift > 0) {
                eg_inc = 1 << (shift - 1);
            }
            break;
        case EG_SUSTAIN:
        case EG_RELEASE:
            if (!eg_off && !reset && shift > 0) {
                eg_inc = 1 << (shift - 1);
            }
            break;
    }

    slot.eg_rout = (eg_rout + eg_inc) & 0x1ff;

    if (reset)    slot.eg_gen = EG_ATTACK;
    if (!slot.key) slot.eg_gen = EG_RELEASE;
}

function envelopeKeyOn(slot: any, type: number): void  { slot.key |= type; }
function envelopeKeyOff(slot: any, type: number): void { slot.key &= ~type; }

// ─── Phase generator ─────────────────────────────────────────────────────────

function phaseGenerate(slot: any): void {
    const chip   = slot.chip;
    const ch     = slot.channel;
    let   f_num  = ch.f_num;

    if (slot.reg_vib) {
        let range  = (f_num >> 7) & 7;
        const vp   = chip.vibpos;
        if (!(vp & 3))       range = 0;
        else if (vp & 1)     range >>= 1;
        range >>= chip.vibshift;
        if (vp & 4)          range = -range;
        f_num += range;
    }

    const basefreq = (f_num << ch.block) >> 1;
    const phase    = (slot.pg_phase >> 9) & 0xffff;

    if (slot.pg_reset) slot.pg_phase = 0;

    slot.pg_phase = (slot.pg_phase + ((basefreq * mt[slot.reg_mult]) >> 1)) >>> 0;

    // Rhythm mode phase bits
    const noise = chip.noise;
    slot.pg_phase_out = phase;

    if (slot.slot_num === 13) { // hi-hat
        chip.rm_hh_bit2 = (phase >> 2) & 1;
        chip.rm_hh_bit3 = (phase >> 3) & 1;
        chip.rm_hh_bit7 = (phase >> 7) & 1;
        chip.rm_hh_bit8 = (phase >> 8) & 1;
    }
    if (slot.slot_num === 17 && (chip.rhy & 0x20)) { // top cymbal
        chip.rm_tc_bit3 = (phase >> 3) & 1;
        chip.rm_tc_bit5 = (phase >> 5) & 1;
    }

    if (chip.rhy & 0x20) {
        const rm_xor = (chip.rm_hh_bit2 ^ chip.rm_hh_bit7)
                     | (chip.rm_hh_bit3 ^ chip.rm_tc_bit5)
                     | (chip.rm_tc_bit3 ^ chip.rm_tc_bit5);
        switch (slot.slot_num) {
            case 13: // hi-hat
                slot.pg_phase_out = rm_xor << 9;
                slot.pg_phase_out |= (rm_xor ^ (noise & 1)) ? 0xd0 : 0x34;
                break;
            case 16: // snare drum
                slot.pg_phase_out = (chip.rm_hh_bit8 << 9)
                                  | ((chip.rm_hh_bit8 ^ (noise & 1)) << 8);
                break;
            case 17: // top cymbal
                slot.pg_phase_out = (rm_xor << 9) | 0x80;
                break;
        }
    }

    const n_bit = ((noise >> 14) ^ noise) & 0x01;
    chip.noise  = ((noise >> 1) | (n_bit << 22)) >>> 0;
}

// ─── Slot register writes ─────────────────────────────────────────────────────

function slotWrite20(slot: any, data: number): void {
    slot.trem     = (data & 0x80) ? () => slot.chip.tremolo : () => 0;
    slot.reg_vib  = (data >> 6) & 0x01;
    slot.reg_type = (data >> 5) & 0x01;
    slot.reg_ksr  = (data >> 4) & 0x01;
    slot.reg_mult = data & 0x0f;
}

function slotWrite40(slot: any, data: number): void {
    slot.reg_ksl = (data >> 6) & 0x03;
    slot.reg_tl  = data & 0x3f;
    envelopeUpdateKSL(slot);
}

function slotWrite60(slot: any, data: number): void {
    slot.reg_ar = (data >> 4) & 0x0f;
    slot.reg_dr = data & 0x0f;
}

function slotWrite80(slot: any, data: number): void {
    slot.reg_sl = (data >> 4) & 0x0f;
    if (slot.reg_sl === 0x0f) slot.reg_sl = 0x1f;
    slot.reg_rr = data & 0x0f;
}

function slotWriteE0(slot: any, data: number): void {
    slot.reg_wf = data & 0x07;
    if (slot.chip.newm === 0) slot.reg_wf &= 0x03;
}

// ─── Slot generate/feedback ───────────────────────────────────────────────────

function slotGenerate(slot: any): void {
    slot.out = sinFuncs[slot.reg_wf](slot.pg_phase_out + slot.mod(), slot.eg_out);
}

function slotCalcFB(slot: any): void {
    if (slot.channel.fb !== 0) {
        slot.fbmod = (slot.prout + slot.out) >> (0x09 - slot.channel.fb);
    } else {
        slot.fbmod = 0;
    }
    slot.prout = slot.out;
}

// ─── Channel algorithm setup ─────────────────────────────────────────────────
// Replaces C pointer assignments with closure assignments.

function channelSetupAlg(ch: any): void {
    const chip = ch.chip;

    if (ch.chtype === CH_DRUM) {
        if (ch.ch_num === 7 || ch.ch_num === 8) {
            ch.slotz[0].mod = () => chip.zeromod;
            ch.slotz[1].mod = () => chip.zeromod;
            return;
        }
        if (ch.alg & 0x01) {
            ch.slotz[0].mod = () => ch.slotz[0].fbmod;
            ch.slotz[1].mod = () => chip.zeromod;
        } else {
            ch.slotz[0].mod = () => ch.slotz[0].fbmod;
            ch.slotz[1].mod = () => ch.slotz[0].out;
        }
        return;
    }

    if (ch.alg & 0x08) return; // 4-op slave handled by master

    if (ch.alg & 0x04) {
        // 4-op channel: ch.pair is the master, ch is the secondary
        const p = ch.pair;
        p.out[0] = () => chip.zeromod;
        p.out[1] = () => chip.zeromod;
        p.out[2] = () => chip.zeromod;
        p.out[3] = () => chip.zeromod;
        switch (ch.alg & 0x03) {
            case 0x00:
                p.slotz[0].mod = () => p.slotz[0].fbmod;
                p.slotz[1].mod = () => p.slotz[0].out;
                ch.slotz[0].mod = () => p.slotz[1].out;
                ch.slotz[1].mod = () => ch.slotz[0].out;
                ch.out[0] = () => ch.slotz[1].out;
                ch.out[1] = () => chip.zeromod;
                ch.out[2] = () => chip.zeromod;
                ch.out[3] = () => chip.zeromod;
                break;
            case 0x01:
                p.slotz[0].mod = () => p.slotz[0].fbmod;
                p.slotz[1].mod = () => p.slotz[0].out;
                ch.slotz[0].mod = () => chip.zeromod;
                ch.slotz[1].mod = () => ch.slotz[0].out;
                ch.out[0] = () => p.slotz[1].out;
                ch.out[1] = () => ch.slotz[1].out;
                ch.out[2] = () => chip.zeromod;
                ch.out[3] = () => chip.zeromod;
                break;
            case 0x02:
                p.slotz[0].mod = () => p.slotz[0].fbmod;
                p.slotz[1].mod = () => chip.zeromod;
                ch.slotz[0].mod = () => p.slotz[1].out;
                ch.slotz[1].mod = () => ch.slotz[0].out;
                ch.out[0] = () => p.slotz[0].out;
                ch.out[1] = () => ch.slotz[1].out;
                ch.out[2] = () => chip.zeromod;
                ch.out[3] = () => chip.zeromod;
                break;
            case 0x03:
                p.slotz[0].mod = () => p.slotz[0].fbmod;
                p.slotz[1].mod = () => chip.zeromod;
                ch.slotz[0].mod = () => p.slotz[1].out;
                ch.slotz[1].mod = () => chip.zeromod;
                ch.out[0] = () => p.slotz[0].out;
                ch.out[1] = () => ch.slotz[0].out;
                ch.out[2] = () => ch.slotz[1].out;
                ch.out[3] = () => chip.zeromod;
                break;
        }
    } else {
        // 2-op channel
        if (ch.alg & 0x01) {
            ch.slotz[0].mod = () => ch.slotz[0].fbmod;
            ch.slotz[1].mod = () => chip.zeromod;
            ch.out[0] = () => ch.slotz[0].out;
            ch.out[1] = () => ch.slotz[1].out;
            ch.out[2] = () => chip.zeromod;
            ch.out[3] = () => chip.zeromod;
        } else {
            ch.slotz[0].mod = () => ch.slotz[0].fbmod;
            ch.slotz[1].mod = () => ch.slotz[0].out;
            ch.out[0] = () => ch.slotz[1].out;
            ch.out[1] = () => chip.zeromod;
            ch.out[2] = () => chip.zeromod;
            ch.out[3] = () => chip.zeromod;
        }
    }
}

function channelUpdateAlg(ch: any): void {
    ch.alg = ch.con;
    if (ch.chip.newm) {
        if (ch.chtype === CH_4OP) {
            ch.pair.alg = 0x04 | (ch.con << 1) | ch.pair.con;
            ch.alg      = 0x08;
            channelSetupAlg(ch.pair);
        } else if (ch.chtype === CH_4OP2) {
            ch.alg       = 0x04 | (ch.pair.con << 1) | ch.con;
            ch.pair.alg  = 0x08;
            channelSetupAlg(ch);
        } else {
            channelSetupAlg(ch);
        }
    } else {
        channelSetupAlg(ch);
    }
}

// ─── Channel register writes ──────────────────────────────────────────────────

function channelWriteA0(ch: any, data: number): void {
    if (ch.chip.newm && ch.chtype === CH_4OP2) return;
    ch.f_num = (ch.f_num & 0x300) | data;
    ch.ksv   = (ch.block << 1) | ((ch.f_num >> (0x09 - ch.chip.nts)) & 0x01);
    envelopeUpdateKSL(ch.slotz[0]);
    envelopeUpdateKSL(ch.slotz[1]);
    if (ch.chip.newm && ch.chtype === CH_4OP) {
        ch.pair.f_num = ch.f_num;
        ch.pair.ksv   = ch.ksv;
        envelopeUpdateKSL(ch.pair.slotz[0]);
        envelopeUpdateKSL(ch.pair.slotz[1]);
    }
}

function channelWriteB0(ch: any, data: number): void {
    if (ch.chip.newm && ch.chtype === CH_4OP2) return;
    ch.f_num = (ch.f_num & 0xff) | ((data & 0x03) << 8);
    ch.block = (data >> 2) & 0x07;
    ch.ksv   = (ch.block << 1) | ((ch.f_num >> (0x09 - ch.chip.nts)) & 0x01);
    envelopeUpdateKSL(ch.slotz[0]);
    envelopeUpdateKSL(ch.slotz[1]);
    if (ch.chip.newm && ch.chtype === CH_4OP) {
        ch.pair.f_num  = ch.f_num;
        ch.pair.block  = ch.block;
        ch.pair.ksv    = ch.ksv;
        envelopeUpdateKSL(ch.pair.slotz[0]);
        envelopeUpdateKSL(ch.pair.slotz[1]);
    }
}

function channelWriteC0(ch: any, data: number): void {
    ch.fb  = (data & 0x0e) >> 1;
    ch.con = data & 0x01;
    channelUpdateAlg(ch);
    if (ch.chip.newm) {
        ch.cha = ((data >> 4) & 0x01) ? 0xffff : 0;
        ch.chb = ((data >> 5) & 0x01) ? 0xffff : 0;
        ch.chc = ((data >> 6) & 0x01) ? 0xffff : 0;
        ch.chd = ((data >> 7) & 0x01) ? 0xffff : 0;
    } else {
        ch.cha = ch.chb = 0xffff;
        ch.chc = ch.chd = 0;
    }
}

// ─── Channel key on/off ───────────────────────────────────────────────────────

function channelKeyOn(ch: any): void {
    if (ch.chip.newm) {
        if (ch.chtype === CH_4OP) {
            envelopeKeyOn(ch.slotz[0],        EGK_NORM);
            envelopeKeyOn(ch.slotz[1],        EGK_NORM);
            envelopeKeyOn(ch.pair.slotz[0],   EGK_NORM);
            envelopeKeyOn(ch.pair.slotz[1],   EGK_NORM);
        } else if (ch.chtype === CH_2OP || ch.chtype === CH_DRUM) {
            envelopeKeyOn(ch.slotz[0], EGK_NORM);
            envelopeKeyOn(ch.slotz[1], EGK_NORM);
        }
    } else {
        envelopeKeyOn(ch.slotz[0], EGK_NORM);
        envelopeKeyOn(ch.slotz[1], EGK_NORM);
    }
}

function channelKeyOff(ch: any): void {
    if (ch.chip.newm) {
        if (ch.chtype === CH_4OP) {
            envelopeKeyOff(ch.slotz[0],        EGK_NORM);
            envelopeKeyOff(ch.slotz[1],        EGK_NORM);
            envelopeKeyOff(ch.pair.slotz[0],   EGK_NORM);
            envelopeKeyOff(ch.pair.slotz[1],   EGK_NORM);
        } else if (ch.chtype === CH_2OP || ch.chtype === CH_DRUM) {
            envelopeKeyOff(ch.slotz[0], EGK_NORM);
            envelopeKeyOff(ch.slotz[1], EGK_NORM);
        }
    } else {
        envelopeKeyOff(ch.slotz[0], EGK_NORM);
        envelopeKeyOff(ch.slotz[1], EGK_NORM);
    }
}

// ─── 4-op connection ─────────────────────────────────────────────────────────

function channelSet4Op(chip: any, data: number): void {
    for (let bit = 0; bit < 6; bit++) {
        let chnum = bit;
        if (bit >= 3) chnum += 9 - 3;
        if ((data >> bit) & 0x01) {
            chip.channel[chnum].chtype      = CH_4OP;
            chip.channel[chnum + 3].chtype  = CH_4OP2;
            channelUpdateAlg(chip.channel[chnum]);
        } else {
            chip.channel[chnum].chtype      = CH_2OP;
            chip.channel[chnum + 3].chtype  = CH_2OP;
            channelUpdateAlg(chip.channel[chnum]);
            channelUpdateAlg(chip.channel[chnum + 3]);
        }
    }
}

// ─── Rhythm mode ─────────────────────────────────────────────────────────────

function channelUpdateRhythm(chip: any, data: number): void {
    chip.rhy = data & 0x3f;
    if (chip.rhy & 0x20) {
        const ch6 = chip.channel[6];
        const ch7 = chip.channel[7];
        const ch8 = chip.channel[8];

        ch6.out[0] = () => ch6.slotz[1].out;
        ch6.out[1] = () => ch6.slotz[1].out;
        ch6.out[2] = () => chip.zeromod;
        ch6.out[3] = () => chip.zeromod;

        ch7.out[0] = () => ch7.slotz[0].out;
        ch7.out[1] = () => ch7.slotz[0].out;
        ch7.out[2] = () => ch7.slotz[1].out;
        ch7.out[3] = () => ch7.slotz[1].out;

        ch8.out[0] = () => ch8.slotz[0].out;
        ch8.out[1] = () => ch8.slotz[0].out;
        ch8.out[2] = () => ch8.slotz[1].out;
        ch8.out[3] = () => ch8.slotz[1].out;

        for (let n = 6; n < 9; n++) chip.channel[n].chtype = CH_DRUM;
        channelSetupAlg(ch6);
        channelSetupAlg(ch7);
        channelSetupAlg(ch8);

        if (chip.rhy & 0x01) envelopeKeyOn(ch7.slotz[0],  EGK_DRUM);
        else                  envelopeKeyOff(ch7.slotz[0], EGK_DRUM);
        if (chip.rhy & 0x02) envelopeKeyOn(ch8.slotz[1],  EGK_DRUM);
        else                  envelopeKeyOff(ch8.slotz[1], EGK_DRUM);
        if (chip.rhy & 0x04) envelopeKeyOn(ch8.slotz[0],  EGK_DRUM);
        else                  envelopeKeyOff(ch8.slotz[0], EGK_DRUM);
        if (chip.rhy & 0x08) envelopeKeyOn(ch7.slotz[1],  EGK_DRUM);
        else                  envelopeKeyOff(ch7.slotz[1], EGK_DRUM);
        if (chip.rhy & 0x10) {
            envelopeKeyOn(ch6.slotz[0],  EGK_DRUM);
            envelopeKeyOn(ch6.slotz[1],  EGK_DRUM);
        } else {
            envelopeKeyOff(ch6.slotz[0], EGK_DRUM);
            envelopeKeyOff(ch6.slotz[1], EGK_DRUM);
        }
    } else {
        for (let n = 6; n < 9; n++) {
            chip.channel[n].chtype = CH_2OP;
            channelSetupAlg(chip.channel[n]);
            envelopeKeyOff(chip.channel[n].slotz[0], EGK_DRUM);
            envelopeKeyOff(chip.channel[n].slotz[1], EGK_DRUM);
        }
    }
}

// ─── Per-slot process ─────────────────────────────────────────────────────────

function processSlot(slot: any): void {
    slotCalcFB(slot);
    envelopeCalc(slot);
    phaseGenerate(slot);
    slotGenerate(slot);
}

// ─── Core generation (one native-rate sample = 4 channel outputs) ─────────────

function generate4Ch(chip: any, buf4: number[]): void {
    // Output previous right-side samples (quirk: channels are one sample delayed
    // on the left vs the right)
    buf4[1] = clipSample(chip.mixbuff[1]);
    buf4[3] = clipSample(chip.mixbuff[3]);

    // Process slots 0-14
    for (let ii = 0; ii < 15; ii++) processSlot(chip.slot[ii]);

    // Mix left + DAC2-left from all 18 channels
    let m0 = 0, m1 = 0;
    for (let ii = 0; ii < 18; ii++) {
        const ch   = chip.channel[ii];
        const accm = ch.out[0]() + ch.out[1]() + ch.out[2]() + ch.out[3]();
        m0 += i16(accm & ch.cha);
        m1 += i16(accm & ch.chc);
    }
    chip.mixbuff[0] = m0;
    chip.mixbuff[2] = m1;

    // Process slots 15-17 (delayed left quirk)
    for (let ii = 15; ii < 18; ii++) processSlot(chip.slot[ii]);

    buf4[0] = clipSample(chip.mixbuff[0]);
    buf4[2] = clipSample(chip.mixbuff[2]);

    // Process slots 18-32
    for (let ii = 18; ii < 33; ii++) processSlot(chip.slot[ii]);

    // Mix right + DAC2-right
    m0 = 0; m1 = 0;
    for (let ii = 0; ii < 18; ii++) {
        const ch   = chip.channel[ii];
        const accm = ch.out[0]() + ch.out[1]() + ch.out[2]() + ch.out[3]();
        m0 += i16(accm & ch.chb);
        m1 += i16(accm & ch.chd);
    }
    chip.mixbuff[1] = m0;
    chip.mixbuff[3] = m1;

    // Process slots 33-35
    for (let ii = 33; ii < 36; ii++) processSlot(chip.slot[ii]);

    // Tremolo update (every 64 native samples)
    if ((chip.timer & 0x3f) === 0x3f) {
        chip.tremolopos = (chip.tremolopos + 1) % 210;
    }
    chip.tremolo = (chip.tremolopos < 105)
        ? (chip.tremolopos       >> chip.tremoloshift)
        : ((210 - chip.tremolopos) >> chip.tremoloshift);

    // Vibrato position (every 1024 native samples)
    if ((chip.timer & 0x3ff) === 0x3ff) {
        chip.vibpos = (chip.vibpos + 1) & 7;
    }

    chip.timer = (chip.timer + 1) & 0xffff;

    // Envelope timer
    chip.eg_add = 0;
    if (chip.eg_timer) {
        let shift = 0;
        while (shift < 36 && ((chip.eg_timer >> shift) & 1) === 0) shift++;
        chip.eg_add = (shift > 12) ? 0 : shift + 1;
    }

    if (chip.eg_timerrem || chip.eg_state) {
        if (chip.eg_timer === 0xfffffffff) {
            chip.eg_timer    = 0;
            chip.eg_timerrem = 1;
        } else {
            chip.eg_timer++;
            chip.eg_timerrem = 0;
        }
    }
    chip.eg_state ^= 1;

    // Flush write buffer
    while (true) {
        const wb = chip.writebuf[chip.writebuf_cur];
        if (!(wb.reg & 0x200) || wb.time > chip.writebuf_samplecnt) break;
        wb.reg &= 0x1ff;
        writeReg(chip, wb.reg, wb.data);
        chip.writebuf_cur = (chip.writebuf_cur + 1) % OPL_WRITEBUF_SIZE;
    }
    chip.writebuf_samplecnt++;
}

// ─── Resampled generation (one output sample at target rate) ─────────────────

const _buf4: number[] = [0, 0, 0, 0];

function generateResampled(chip: any, buf: number[]): void {
    while (chip.samplecnt >= chip.rateratio) {
        chip.oldsamples[0] = chip.samples[0];
        chip.oldsamples[1] = chip.samples[1];
        chip.oldsamples[2] = chip.samples[2];
        chip.oldsamples[3] = chip.samples[3];
        generate4Ch(chip, _buf4);
        chip.samples[0] = _buf4[0];
        chip.samples[1] = _buf4[1];
        chip.samples[2] = _buf4[2];
        chip.samples[3] = _buf4[3];
        chip.samplecnt -= chip.rateratio;
    }
    const ratio = chip.rateratio;
    const sc    = chip.samplecnt;
    buf[0] = ((chip.oldsamples[0] * (ratio - sc) + chip.samples[0] * sc) / ratio) | 0;
    buf[1] = ((chip.oldsamples[1] * (ratio - sc) + chip.samples[1] * sc) / ratio) | 0;
    chip.samplecnt += 1 << RSM_FRAC;
}

// ─── Register write ───────────────────────────────────────────────────────────

function writeReg(chip: any, reg: number, v: number): void {
    const high = (reg >> 8) & 0x01;
    const regm = reg & 0xff;

    switch (regm & 0xf0) {
        case 0x00:
            if (high) {
                if ((regm & 0x0f) === 0x04) channelSet4Op(chip, v);
                else if ((regm & 0x0f) === 0x05) chip.newm = v & 0x01;
            } else {
                if ((regm & 0x0f) === 0x08) chip.nts = (v >> 6) & 0x01;
            }
            break;

        case 0x20: case 0x30: {
            const si = ad_slot[regm & 0x1f];
            if (si >= 0) slotWrite20(chip.slot[18 * high + si], v);
            break;
        }
        case 0x40: case 0x50: {
            const si = ad_slot[regm & 0x1f];
            if (si >= 0) slotWrite40(chip.slot[18 * high + si], v);
            break;
        }
        case 0x60: case 0x70: {
            const si = ad_slot[regm & 0x1f];
            if (si >= 0) slotWrite60(chip.slot[18 * high + si], v);
            break;
        }
        case 0x80: case 0x90: {
            const si = ad_slot[regm & 0x1f];
            if (si >= 0) slotWrite80(chip.slot[18 * high + si], v);
            break;
        }
        case 0xe0: case 0xf0: {
            const si = ad_slot[regm & 0x1f];
            if (si >= 0) slotWriteE0(chip.slot[18 * high + si], v);
            break;
        }
        case 0xa0:
            if ((regm & 0x0f) < 9)
                channelWriteA0(chip.channel[9 * high + (regm & 0x0f)], v);
            break;

        case 0xb0:
            if (regm === 0xbd && !high) {
                chip.tremoloshift = (((v >> 7) ^ 1) << 1) + 2;
                chip.vibshift     = ((v >> 6) & 0x01) ^ 1;
                channelUpdateRhythm(chip, v);
            } else if ((regm & 0x0f) < 9) {
                const ch = chip.channel[9 * high + (regm & 0x0f)];
                channelWriteB0(ch, v);
                if (v & 0x20) channelKeyOn(ch);
                else          channelKeyOff(ch);
            }
            break;

        case 0xc0:
            if ((regm & 0x0f) < 9)
                channelWriteC0(chip.channel[9 * high + (regm & 0x0f)], v);
            break;
    }
}

// ─── Buffered register write ──────────────────────────────────────────────────
// Faithful port of OPL3_WriteRegBuffered. Writes are timestamped with a minimum
// spacing of OPL_WRITEBUF_DELAY native samples so that back-to-back writes (e.g.
// key-off immediately followed by key-on on a note retrigger) land on different
// samples. Without this, the envelope generator never observes key=0 between the
// two writes and the slot never passes through RELEASE, so the retrigger is
// silently dropped and the voice decays to silence.
function writeRegBuffered(chip: any, reg: number, v: number): void {
    const writebuf_last = chip.writebuf_last;
    const wb            = chip.writebuf[writebuf_last];

    if (wb.reg & 0x200) {
        writeReg(chip, wb.reg & 0x1ff, wb.data);
        chip.writebuf_cur       = (writebuf_last + 1) % OPL_WRITEBUF_SIZE;
        chip.writebuf_samplecnt = wb.time;
    }

    wb.reg  = reg | 0x200;
    wb.data = v;
    let time1 = chip.writebuf_lasttime + OPL_WRITEBUF_DELAY;
    const time2 = chip.writebuf_samplecnt;
    if (time1 < time2) time1 = time2;

    wb.time              = time1;
    chip.writebuf_lasttime = time1;
    chip.writebuf_last     = (writebuf_last + 1) % OPL_WRITEBUF_SIZE;
}

// ─── Chip reset ───────────────────────────────────────────────────────────────

function chipReset(chip: any, samplerate: number): void {
    // Zero all slots
    for (let s = 0; s < 36; s++) {
        const slot       = chip.slot[s];
        slot.out         = 0;
        slot.fbmod       = 0;
        slot.prout       = 0;
        slot.eg_rout     = 0x1ff;
        slot.eg_out      = 0x1ff;
        slot.eg_inc      = 0;
        slot.eg_gen      = EG_RELEASE;
        slot.eg_rate     = 0;
        slot.eg_ksl      = 0;
        slot.trem        = () => 0;
        slot.reg_vib     = 0;
        slot.reg_type    = 0;
        slot.reg_ksr     = 0;
        slot.reg_mult    = 0;
        slot.reg_ksl     = 0;
        slot.reg_tl      = 0;
        slot.reg_ar      = 0;
        slot.reg_dr      = 0;
        slot.reg_sl      = 0;
        slot.reg_rr      = 0;
        slot.reg_wf      = 0;
        slot.key         = 0;
        slot.pg_reset    = 0;
        slot.pg_phase    = 0;
        slot.pg_phase_out = 0;
        slot.mod         = () => chip.zeromod;
    }

    // Zero chip state
    chip.timer           = 0;
    chip.eg_timer        = 0;
    chip.eg_timerrem     = 0;
    chip.eg_state        = 0;
    chip.eg_add          = 0;
    chip.newm            = 0;
    chip.nts             = 0;
    chip.rhy             = 0;
    chip.vibpos          = 0;
    chip.vibshift        = 1;
    chip.tremolo         = 0;
    chip.tremolopos      = 0;
    chip.tremoloshift    = 4;
    chip.noise           = 1;
    chip.zeromod         = 0;
    chip.mixbuff[0] = chip.mixbuff[1] = chip.mixbuff[2] = chip.mixbuff[3] = 0;
    chip.rm_hh_bit2 = chip.rm_hh_bit3 = chip.rm_hh_bit7 = chip.rm_hh_bit8 = 0;
    chip.rm_tc_bit3 = chip.rm_tc_bit5 = 0;
    chip.rateratio       = ((samplerate << RSM_FRAC) / 49716) | 0;
    chip.samplecnt       = 0;
    chip.oldsamples[0] = chip.oldsamples[1] = chip.oldsamples[2] = chip.oldsamples[3] = 0;
    chip.samples[0]    = chip.samples[1]    = chip.samples[2]    = chip.samples[3]    = 0;
    chip.writebuf_samplecnt = 0;
    chip.writebuf_cur    = 0;
    chip.writebuf_last   = 0;
    chip.writebuf_lasttime = 0;
    for (let i = 0; i < OPL_WRITEBUF_SIZE; i++) {
        chip.writebuf[i].time = 0;
        chip.writebuf[i].reg  = 0;
        chip.writebuf[i].data = 0;
    }

    // Link channels → slots
    for (let c = 0; c < 18; c++) {
        const ch = chip.channel[c];
        const ls = ch_slot[c];
        ch.slotz[0] = chip.slot[ls];
        ch.slotz[1] = chip.slot[ls + 3];
        chip.slot[ls    ].channel = ch;
        chip.slot[ls + 3].channel = ch;
        chip.slot[ls    ].chip    = chip;
        chip.slot[ls + 3].chip    = chip;

        // Pair links
        const mod9 = c % 9;
        if (mod9 < 3)      ch.pair = chip.channel[c + 3];
        else if (mod9 < 6) ch.pair = chip.channel[c - 3];
        else               ch.pair = null;

        ch.chip  = chip;
        ch.out[0] = () => chip.zeromod;
        ch.out[1] = () => chip.zeromod;
        ch.out[2] = () => chip.zeromod;
        ch.out[3] = () => chip.zeromod;
        ch.chtype = CH_2OP;
        ch.cha    = 0xffff;
        ch.chb    = 0xffff;
        ch.chc    = 0;
        ch.chd    = 0;
        ch.f_num  = 0;
        ch.block  = 0;
        ch.fb     = 0;
        ch.con    = 0;
        ch.alg    = 0;
        ch.ksv    = 0;
        channelSetupAlg(ch);
    }
}

// ─── Public class ─────────────────────────────────────────────────────────────

export default class NukedOPL3 {
    #chip: any;
    #sampleRate: number;
    #buf2: number[] = [0, 0];

    constructor(sampleRate: number = 48000) {
        this.#sampleRate = sampleRate;
        this.#chip = makeChip();
        chipReset(this.#chip, sampleRate);
    }

    init(): void {
        chipReset(this.#chip, this.#sampleRate);
    }

    /** write(array 0|1, reg 0x00–0xff, value 0x00–0xff) */
    write(array: number, address: number, data: number): void {
        writeRegBuffered(this.#chip, ((array & 1) << 8) | (address & 0xff), data & 0xff);
    }

    /**
     * Generate one stereo sample pair into output[offset] and output[offset+1].
     * Output is normalised to Float32 range (÷32768).
     */
    read(output: Float32Array, seek: number = 0): void {
        generateResampled(this.#chip, this.#buf2);
        output[seek]     = this.#buf2[0] / 32768;
        output[seek + 1] = this.#buf2[1] / 32768;
    }
}
