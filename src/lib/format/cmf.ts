// @ts-nocheck
// CMF player — ported from AdPlug's cmf.cpp by Adam Nielsen <malvineous@shikadi.net>
import { FormatPlayer } from "./player";

// ── OPL register base offsets ────────────────────────────────────────────────
const BASE_CHAR_MULT  = 0x20;
const BASE_SCAL_LEVL  = 0x40;
const BASE_ATCK_DCAY  = 0x60;
const BASE_SUST_RLSE  = 0x80;
const BASE_FNUM_L     = 0xA0;
const BASE_KEYON_FREQ = 0xB0;
const BASE_RHYTHM     = 0xBD;
const BASE_WAVE       = 0xE0;
const BASE_FEED_CONN  = 0xC0;
const OPLBIT_KEYON    = 0x20;

// OPLOFFSET(ch): register offset for channel ch's modulator (carrier is +3)
function OPLOFFSET(ch: number): number {
    return (Math.floor(ch / 3) * 8) + (ch % 3);
}

// ── Instrument tables (verbatim from SBFMDRV reference) ──────────────────────
// 16 default patches, 11 bytes each, used when file declares 0 instruments
const cDefaultPatches = new Uint8Array([
    0x21,0x21,0xD1,0x07,0xA3,0xA4,0x46,0x25,0x00,0x00,0x0A,
    0x22,0x22,0x0F,0x0F,0xF6,0xF6,0x95,0x36,0x00,0x00,0x0A,
    0xE1,0xE1,0x00,0x00,0x44,0x54,0x24,0x34,0x02,0x02,0x07,
    0xA5,0xB1,0xD2,0x80,0x81,0xF1,0x03,0x05,0x00,0x00,0x02,
    0x71,0x22,0xC5,0x05,0x6E,0x8B,0x17,0x0E,0x00,0x00,0x02,
    0x32,0x21,0x16,0x80,0x73,0x75,0x24,0x57,0x00,0x00,0x0E,
    0x01,0x11,0x4F,0x00,0xF1,0xD2,0x53,0x74,0x00,0x00,0x06,
    0x07,0x12,0x4F,0x00,0xF2,0xF2,0x60,0x72,0x00,0x00,0x08,
    0x31,0xA1,0x1C,0x80,0x51,0x54,0x03,0x67,0x00,0x00,0x0E,
    0x31,0xA1,0x1C,0x80,0x41,0x92,0x0B,0x3B,0x00,0x00,0x0E,
    0x31,0x16,0x87,0x80,0xA1,0x7D,0x11,0x43,0x00,0x00,0x08,
    0x30,0xB1,0xC8,0x80,0xD5,0x61,0x19,0x1B,0x00,0x00,0x0C,
    0xF1,0x21,0x01,0x0D,0x97,0xF1,0x17,0x18,0x00,0x00,0x08,
    0x32,0x16,0x87,0x80,0xA1,0x7D,0x10,0x33,0x00,0x00,0x08,
    0x01,0x12,0x4F,0x00,0x71,0x52,0x53,0x7C,0x00,0x00,0x0A,
    0x02,0x03,0x8D,0x03,0xD7,0xF5,0x37,0x18,0x00,0x00,0x04,
]);

// Default instrument loaded onto every channel at reset (fmdrv opl_reset2)
const cInitInstrument = new Uint8Array([
    0x01,0x11,0x4F,0x00,0xF1,0xF2,0x53,0x74,0x00,0x00,0x08
]);

// Fallback timbres for rhythm channels 11-15 when bMidiDrums is active
// Order: bass drum, snare, tom, top cymbal, hi-hat
const cDefaultDrumPatches = [
    new Uint8Array([0x00,0x00,0x00,0x00,0xF8,0xF8,0x07,0x07,0x00,0x00,0x00]),
    new Uint8Array([0x0C,0x0C,0x00,0x00,0xF8,0xF8,0x07,0x07,0x00,0x01,0x00]),
    new Uint8Array([0x04,0x04,0x00,0x00,0xF8,0xF8,0x07,0x07,0x00,0x00,0x00]),
    new Uint8Array([0x0C,0x0C,0x00,0x00,0xF8,0xF8,0x05,0x05,0x03,0x03,0x00]),
    new Uint8Array([0x0E,0x0E,0x00,0x00,0xF8,0xF8,0x07,0x07,0x03,0x03,0x00]),
];

// MIDI note → OPL block/semitone byte, from SBFMDRV reference (viiri/fmdrv)
const block_note_tbl = new Uint8Array([
    0x00,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0a,0x0b,
    0x00,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0a,0x0b,
    0x10,0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1a,0x1b,
    0x20,0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2a,0x2b,
    0x30,0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3a,0x3b,
    0x40,0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48,0x49,0x4a,0x4b,
    0x50,0x51,0x52,0x53,0x54,0x55,0x56,0x57,0x58,0x59,0x5a,0x5b,
    0x60,0x61,0x62,0x63,0x64,0x65,0x66,0x67,0x68,0x69,0x6a,0x6b,
    0x70,0x71,0x72,0x73,0x74,0x75,0x76,0x77,0x78,0x79,0x7a,0x7b,
    0x70,0x71,0x72,0x73,0x74,0x75,0x76,0x77,0x78,0x79,0x7a,0x7b,
    0x7b,0x7b,0x7b,0x7b,0x7b,0x7b,0x7b,0x7b,
]);

// Note index (1/64ths of semitone, 768 entries) → 10-bit OPL F-number
const fnum_tbl = new Uint16Array([
    343,343,344,344,344,344,345,345,345,346,346,346,
    347,347,347,348,348,348,349,349,349,349,350,350,
    350,351,351,351,352,352,352,353,353,353,354,354,
    354,355,355,355,356,356,356,356,357,357,357,358,
    358,358,359,359,359,360,360,360,361,361,361,362,
    362,362,363,363,363,364,364,364,365,365,365,366,
    366,366,367,367,367,368,368,368,369,369,369,370,
    370,370,371,371,371,372,372,372,373,373,373,374,
    374,374,375,375,375,376,376,376,377,377,377,378,
    378,378,379,379,379,380,380,380,381,381,381,382,
    382,382,383,383,384,384,384,385,385,385,386,386,
    386,387,387,387,388,388,388,389,389,389,390,390,
    391,391,391,392,392,392,393,393,393,394,394,394,
    395,395,395,396,396,397,397,397,398,398,398,399,
    399,399,400,400,401,401,401,402,402,402,403,403,
    403,404,404,405,405,405,406,406,406,407,407,407,
    408,408,409,409,409,410,410,410,411,411,412,412,
    412,413,413,413,414,414,414,415,415,416,416,416,
    417,417,417,418,418,419,419,419,420,420,421,421,
    421,422,422,422,423,423,424,424,424,425,425,425,
    426,426,427,427,427,428,428,429,429,429,430,430,
    430,431,431,432,432,432,433,433,434,434,434,435,
    435,436,436,436,437,437,438,438,438,439,439,440,
    440,440,441,441,442,442,442,443,443,444,444,444,
    445,445,446,446,446,447,447,448,448,448,449,449,
    450,450,450,451,451,452,452,452,453,453,454,454,
    454,455,455,456,456,457,457,457,458,458,459,459,
    459,460,460,461,461,461,462,462,463,463,464,464,
    464,465,465,466,466,467,467,467,468,468,469,469,
    469,470,470,471,471,472,472,472,473,473,474,474,
    475,475,475,476,476,477,477,478,478,478,479,479,
    480,480,481,481,481,482,482,483,483,484,484,485,
    485,485,486,486,487,487,488,488,488,489,489,490,
    490,491,491,492,492,492,493,493,494,494,495,495,
    496,496,496,497,497,498,498,499,499,500,500,501,
    501,501,502,502,503,503,504,504,505,505,506,506,
    506,507,507,508,508,509,509,510,510,511,511,511,
    512,512,513,513,514,514,515,515,516,516,517,517,
    518,518,518,519,519,520,520,521,521,522,522,523,
    523,524,524,525,525,526,526,526,527,527,528,528,
    529,529,530,530,531,531,532,532,533,533,534,534,
    535,535,536,536,537,537,538,538,538,539,539,540,
    540,541,541,542,542,543,543,544,544,545,545,546,
    546,547,547,548,548,549,549,550,550,551,551,552,
    552,553,553,554,554,555,555,556,556,557,557,558,
    558,559,559,560,560,561,561,562,562,563,563,564,
    564,565,565,566,566,567,567,568,568,569,569,570,
    571,571,572,572,573,573,574,574,575,575,576,576,
    577,577,578,578,579,579,580,580,581,581,582,582,
    583,584,584,585,585,586,586,587,587,588,588,589,
    589,590,590,591,591,592,593,593,594,594,595,595,
    596,596,597,597,598,598,599,600,600,601,601,602,
    602,603,603,604,604,605,606,606,607,607,608,608,
    609,609,610,610,611,612,612,613,613,614,614,615,
    615,616,617,617,618,618,619,619,620,620,621,622,
    622,623,623,624,624,625,626,626,627,627,628,628,
    629,629,630,631,631,632,632,633,633,634,635,635,
    636,636,637,637,638,639,639,640,640,641,642,642,
    643,643,644,644,645,646,646,647,647,648,649,649,
    650,650,651,651,652,653,653,654,654,655,656,656,
    657,657,658,659,659,660,660,661,662,662,663,663,
    664,665,665,666,666,667,668,668,669,669,670,671,
    671,672,672,673,674,674,675,675,676,677,677,678,
    678,679,680,680,681,682,682,683,683,684,685,685,
]);

// ── Helper: read null-terminated ASCII string from a Uint8Array ──────────────
function readCStr(buf: Uint8Array, offset: number): string {
    let end = offset;
    while (end < buf.length && buf[end] !== 0) end++;
    return String.fromCharCode(...buf.subarray(offset, end));
}

// ── SBI instrument (11 bytes) ────────────────────────────────────────────────
function makeSBI() {
    return {
        op: [
            { iCharMult: 0, iScalingOutput: 0, iAttackDecay: 0, iSustainRelease: 0, iWaveSel: 0 },
            { iCharMult: 0, iScalingOutput: 0, iAttackDecay: 0, iSustainRelease: 0, iWaveSel: 0 },
        ],
        iConnection: 0,
    };
}

function sbiFromBytes(bytes: Uint8Array, offset: number) {
    const s = makeSBI();
    s.op[0].iCharMult       = bytes[offset + 0];
    s.op[1].iCharMult       = bytes[offset + 1];
    s.op[0].iScalingOutput  = bytes[offset + 2];
    s.op[1].iScalingOutput  = bytes[offset + 3];
    s.op[0].iAttackDecay    = bytes[offset + 4];
    s.op[1].iAttackDecay    = bytes[offset + 5];
    s.op[0].iSustainRelease = bytes[offset + 6];
    s.op[1].iSustainRelease = bytes[offset + 7];
    s.op[0].iWaveSel        = bytes[offset + 8];
    s.op[1].iWaveSel        = bytes[offset + 9];
    s.iConnection           = bytes[offset + 10];
    return s;
}

// ── CMF format player ────────────────────────────────────────────────────────
export default class CMF extends FormatPlayer {

    // Song data (CMF music block)
    private data: Uint8Array = new Uint8Array(0);
    private iPlayPointer = 0;
    private iSongLen = 0;

    // Header fields
    private iInstrumentBlockOffset = 0;
    private iMusicOffset = 0;
    private iTicksPerQuarterNote = 0;
    private iTicksPerSecond = 0;
    private iTagOffsetTitle = 0;
    private iTagOffsetComposer = 0;
    private iTagOffsetRemarks = 0;
    private iNumInstruments = 0;

    // Instruments
    private pInstruments: ReturnType<typeof makeSBI>[] = [];
    private iInstCount = 16;        // effective count for MIDI patch wraparound
    private iDrumPatchBase = 128;   // index of the 5 fallback drum patches

    // Playback state
    private iDelayRemaining = 0;
    private bSongEnd = false;
    private iPrevCommand = 0;
    private iNoteCount = 0;
    private bPercussive = false;
    private bMidiDrums = false;

    // Per-channel state (16 MIDI, 9 OPL)
    private chMIDI: { iPatch: number; iPitchbend: number; iTranspose: number; }[] = [];
    private chOPL:  { iNoteStart: number; iMIDINote: number; iMIDIChannel: number; iMIDIPatch: number; }[] = [];

    // Shadow of OPL register state
    private iCurrentRegs = new Uint8Array(256);

    // Running note dedup per MIDI channel
    private iNotePlaying = new Uint8Array(16).fill(255);
    private bNoteFix = new Uint8Array(16);  // boolean per channel

    // Metadata strings
    private strTitle = '';
    private strComposer = '';
    private strRemarks = '';

    constructor(opl: any, options?: Record<string, any>) {
        super(opl, options);
    }

    static probe(buffer: Uint8Array): boolean {
        if (buffer.length < 4) return false;
        return (
            buffer[0] === 0x43 && // 'C'
            buffer[1] === 0x54 && // 'T'
            buffer[2] === 0x4D && // 'M'
            buffer[3] === 0x46    // 'F'
        );
    }

    load(buffer: Uint8Array): boolean {
        const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);

        // Check signature
        if (
            buffer[0] !== 0x43 || buffer[1] !== 0x54 ||
            buffer[2] !== 0x4D || buffer[3] !== 0x46
        ) return false;

        const iVer = view.getUint16(4, true);
        if (iVer !== 0x0101 && iVer !== 0x0100) return false;

        // Read header fields (all at fixed offsets)
        this.iInstrumentBlockOffset = view.getUint16(6,  true);
        this.iMusicOffset           = view.getUint16(8,  true);
        this.iTicksPerQuarterNote   = view.getUint16(10, true);
        this.iTicksPerSecond        = view.getUint16(12, true);
        this.iTagOffsetTitle        = view.getUint16(14, true);
        this.iTagOffsetComposer     = view.getUint16(16, true);
        this.iTagOffsetRemarks      = view.getUint16(18, true);
        // bytes 20-35: iChannelsInUse[16] (not needed for playback)

        // Sanity-clamp tag offsets to before the instrument block (matches AdPlug)
        if (this.iTagOffsetTitle    >= this.iInstrumentBlockOffset) this.iTagOffsetTitle    = 0;
        if (this.iTagOffsetComposer >= this.iInstrumentBlockOffset) this.iTagOffsetComposer = 0;
        if (this.iTagOffsetRemarks  >= this.iInstrumentBlockOffset) this.iTagOffsetRemarks  = 0;

        if (iVer === 0x0100) {
            this.iNumInstruments = buffer[36];
        } else {
            this.iNumInstruments = view.getUint16(36, true);
            // iTempo at offset 38 (not used for refresh calculation)
        }

        // ── Instruments ──────────────────────────────────────────────────────
        // Always at least 128 slots + 5 reserved drum patches
        this.iDrumPatchBase = Math.max(this.iNumInstruments, 128);
        this.pInstruments = [];
        for (let i = 0; i < this.iDrumPatchBase + 5; i++) this.pInstruments.push(makeSBI());

        // Populate the 5 fallback drum patches at the end of the array
        for (let i = 0; i < 5; i++) {
            this.pInstruments[this.iDrumPatchBase + i] = sbiFromBytes(cDefaultDrumPatches[i], 0);
        }

        // Read file instruments (11 bytes data + 5 bytes padding each = 16 bytes/instrument)
        let instrOff = this.iInstrumentBlockOffset;
        for (let i = 0; i < this.iNumInstruments; i++) {
            if (instrOff + 11 > buffer.length) break;
            this.pInstruments[i] = sbiFromBytes(buffer, instrOff);
            instrOff += 16; // 11 data + 5 padding
        }

        // If no instruments in file, fall back to the default 16-patch bank
        if (this.iNumInstruments > 0) {
            this.iInstCount = this.iNumInstruments;
        } else {
            this.iInstCount = 16;
            for (let i = 0; i < 16; i++) {
                this.pInstruments[i] = sbiFromBytes(cDefaultPatches, i * 11);
            }
        }

        // ── Tag strings ───────────────────────────────────────────────────────
        if (this.iTagOffsetTitle)    this.strTitle    = readCStr(buffer, this.iTagOffsetTitle);
        if (this.iTagOffsetComposer) this.strComposer = readCStr(buffer, this.iTagOffsetComposer);
        if (this.iTagOffsetRemarks)  this.strRemarks  = readCStr(buffer, this.iTagOffsetRemarks);

        // ── Music data ────────────────────────────────────────────────────────
        if (this.iMusicOffset >= buffer.length) return false;
        this.data = buffer.slice(this.iMusicOffset);
        this.iSongLen = this.data.length;

        // Detect General-MIDI channel-9 drum track (requires data to be set first)
        this.bMidiDrums = this.detectMidiDrums();

        this.rewind(0);
        // Whole song loops from the start.
        this._loopStart = true;
        return true;
    }

    update(): boolean {
        this.iDelayRemaining = 0;

        while (!this.iDelayRemaining) {
            let iCommand = this.iPlayPointer < this.iSongLen ? this.data[this.iPlayPointer++] : 0;
            if ((iCommand & 0x80) === 0) {
                // Running status — reuse previous command
                this.iPlayPointer--;
                iCommand = this.iPrevCommand;
            } else {
                this.iPrevCommand = iCommand;
            }

            const iChannel = iCommand & 0x0F;
            switch (iCommand & 0xF0) {
                case 0x80: { // Note off
                    if (this.iPlayPointer > this.iSongLen - 2) break;
                    const iNote     = this.data[this.iPlayPointer++];
                    const iVelocity = this.data[this.iPlayPointer++];
                    this.cmfNoteOff(iChannel, iNote, iVelocity);
                    break;
                }
                case 0x90: { // Note on
                    if (this.iPlayPointer > this.iSongLen - 2) break;
                    let iNote     = this.data[this.iPlayPointer++];
                    let iVelocity = this.data[this.iPlayPointer++];
                    if (iVelocity) {
                        if (this.iNotePlaying[iChannel] === iNote) {
                            iVelocity = 0;
                            this.bNoteFix[iChannel] = 1;
                        }
                    } else {
                        if (this.bNoteFix[iChannel]) {
                            iVelocity = 127;
                            this.bNoteFix[iChannel] = 0;
                        }
                    }
                    this.iNotePlaying[iChannel] = iVelocity ? iNote : 255;
                    if (iVelocity) {
                        this.cmfNoteOn(iChannel, iNote, iVelocity);
                    } else {
                        this.cmfNoteOff(iChannel, iNote, iVelocity);
                    }
                    break;
                }
                case 0xA0: { // Polyphonic key pressure (ignored)
                    if (this.iPlayPointer > this.iSongLen - 2) break;
                    this.iPlayPointer += 2;
                    break;
                }
                case 0xB0: { // Controller
                    if (this.iPlayPointer > this.iSongLen - 2) break;
                    const iController = this.data[this.iPlayPointer++];
                    const iValue      = this.data[this.iPlayPointer++];
                    this.MIDIcontroller(iChannel, iController, iValue);
                    break;
                }
                case 0xC0: { // Instrument/program change
                    if (this.iPlayPointer >= this.iSongLen) break;
                    const iNewInstrument = this.data[this.iPlayPointer++];
                    const iPatch = this.iInstCount > 0 ? (iNewInstrument % this.iInstCount) : 0;
                    this.chMIDI[iChannel].iPatch = iPatch;

                    if (!this.bPercussive || iChannel < 11) {
                        const iNumCh = this.bPercussive ? 6 : 9;
                        for (let i = 0; i < iNumCh; i++) {
                            if (this.chOPL[i].iNoteStart === 0 && this.chOPL[i].iMIDIChannel === iChannel)
                                this.chOPL[i].iMIDIChannel = -1;
                        }
                        for (let i = 0; i < iNumCh; i++) {
                            if (this.chOPL[i].iNoteStart > 0 && this.chOPL[i].iMIDIChannel === iChannel)
                                this.MIDIchangeInstrument(i, iChannel, iPatch);
                        }
                    } else {
                        this.MIDIchangeInstrument(this.getPercChannel(iChannel), iChannel, iPatch);
                    }
                    break;
                }
                case 0xD0: { // Channel pressure (ignored)
                    if (this.iPlayPointer >= this.iSongLen) break;
                    this.iPlayPointer++;
                    break;
                }
                case 0xE0: { // Pitch bend
                    if (this.iPlayPointer > this.iSongLen - 2) break;
                    const iLSB = this.data[this.iPlayPointer++];
                    const iMSB = this.data[this.iPlayPointer++];
                    this.chMIDI[iChannel].iPitchbend = (iMSB << 7) | iLSB;
                    this.cmfNoteUpdate(iChannel);
                    break;
                }
                case 0xF0: { // System messages
                    switch (iCommand) {
                        case 0xF0: { // Sysex: F0 <vlq length> <data>
                            const iLen = this.readMIDINumber();
                            this.iPlayPointer = Math.min(this.iPlayPointer + iLen, this.iSongLen);
                            break;
                        }
                        case 0xF1: // MIDI Time Code Quarter Frame (1 data byte, ignored)
                            if (this.iPlayPointer < this.iSongLen) this.iPlayPointer++;
                            break;
                        case 0xF2: // Song position pointer (2 data bytes, ignored)
                            if (this.iPlayPointer < this.iSongLen - 1) this.iPlayPointer += 2;
                            break;
                        case 0xF3: // Song select (1 data byte, ignored)
                            if (this.iPlayPointer < this.iSongLen) this.iPlayPointer++;
                            break;
                        case 0xF6: // Tune request (no data)
                            break;
                        case 0xF7: { // EOX / escape: F7 <vlq length> <data>
                            const iLen = this.readMIDINumber();
                            this.iPlayPointer = Math.min(this.iPlayPointer + iLen, this.iSongLen);
                            break;
                        }
                        case 0xF8: // Timing clock
                        case 0xFA: // Start
                        case 0xFB: // Continue
                        case 0xFE: // Active sensing
                            break;
                        case 0xFC: // Stop
                            this.bSongEnd = true;
                            this.iPlayPointer = 0;
                            break;
                        case 0xFF: { // Meta-event: FF <type> <vlq length> <data>
                            if (this.iPlayPointer >= this.iSongLen) break;
                            const iEvent   = this.data[this.iPlayPointer++];
                            const iMetaLen = this.readMIDINumber();
                            if (iEvent === 0x2F) { // End of track
                                this.bSongEnd = true;
                                this.iPlayPointer = 0;
                            } else {
                                this.iPlayPointer = Math.min(this.iPlayPointer + iMetaLen, this.iSongLen);
                            }
                            break;
                        }
                    }
                    break;
                }
            }

            if (this.iPlayPointer >= this.iSongLen) {
                this.bSongEnd = true;
                this.iPlayPointer = 0;
            }

            this.iDelayRemaining = this.readMIDINumber();
        }

        // Signal loop end and rewind for a seamless loop, matching RAD/RAW.
        const ended = this.bSongEnd;
        if (ended) {
            this._loopEnd = true;
            this.rewind();
        }
        return !ended;
    }

    rewind(subsong?: number): void {
        this.opl.init();
        this.writeOPL(0x01, 0x20); // enable waveform select
        this.writeOPL(0x05, 0x00); // disable OPL3 mode
        this.writeOPL(0x08, 0x00); // CSM+SEL off

        // Program every melodic channel with the default instrument (fmdrv opl_reset2)
        for (let i = 0; i < 9; i++) {
            const iOffset = OPLOFFSET(i);
            this.writeOPL(BASE_CHAR_MULT  + iOffset,     cInitInstrument[0]);
            this.writeOPL(BASE_CHAR_MULT  + iOffset + 3, cInitInstrument[1]);
            this.writeOPL(BASE_SCAL_LEVL  + iOffset,     cInitInstrument[2]);
            this.writeOPL(BASE_SCAL_LEVL  + iOffset + 3, cInitInstrument[3]);
            this.writeOPL(BASE_ATCK_DCAY  + iOffset,     cInitInstrument[4]);
            this.writeOPL(BASE_ATCK_DCAY  + iOffset + 3, cInitInstrument[5]);
            this.writeOPL(BASE_SUST_RLSE  + iOffset,     cInitInstrument[6]);
            this.writeOPL(BASE_SUST_RLSE  + iOffset + 3, cInitInstrument[7]);
            this.writeOPL(BASE_WAVE       + iOffset,     cInitInstrument[8]);
            this.writeOPL(BASE_WAVE       + iOffset + 3, cInitInstrument[9]);
            this.writeOPL(BASE_FEED_CONN  + i,           cInitInstrument[10]);
        }

        // Enable AM + VIB depth (Creative's CMF player always does this)
        this.writeOPL(0xBD, 0xC0);

        this.bSongEnd        = false;
        this.iPlayPointer    = 0;
        this.iPrevCommand    = 0;
        this.iNoteCount      = 0;

        // Reset MIDI channel state
        this.chMIDI = [];
        for (let i = 0; i < 16; i++) {
            this.chMIDI.push({ iPatch: 0, iPitchbend: 8192, iTranspose: 0 });
        }

        // Reset OPL voice state
        this.chOPL = [];
        for (let i = 0; i < 9; i++) {
            this.chOPL.push({ iNoteStart: 0, iMIDINote: -1, iMIDIChannel: -1, iMIDIPatch: -1 });
        }

        this.iCurrentRegs.fill(0);
        this.iNotePlaying.fill(255);
        this.bNoteFix.fill(0);

        // Force rhythm mode on for MIDI-drum files, loading fallback timbres
        if (this.bMidiDrums) this.rhythmModeReset(true);

        // Read the initial delay before the first event
        this.iDelayRemaining = this.readMIDINumber();
    }

    getrefresh(): number {
        if (this.iDelayRemaining) {
            return this.iTicksPerSecond / this.iDelayRemaining;
        }
        return this.iTicksPerSecond; // wait one tick
    }

    gettype(): string  { return "Creative Music File (CMF)"; }
    gettitle(): string { return this.strTitle; }
    getauthor(): string { return this.strComposer; }
    getdesc(): string  { return this.strRemarks; }

    // ── Private helpers ───────────────────────────────────────────────────────

    private readMIDINumber(): number {
        let iValue = 0;
        for (let i = 0; i < 4; i++) {
            const iNext = this.iPlayPointer < this.iSongLen ? this.data[this.iPlayPointer++] : 0;
            iValue = (iValue << 7) | (iNext & 0x7F);
            if ((iNext & 0x80) === 0) break;
        }
        return iValue;
    }

    private writeOPL(iRegister: number, iValue: number): void {
        this.opl.write(0, iRegister, iValue);
        this.iCurrentRegs[iRegister] = iValue;
    }

    // Write one operator's registers for instrument iInstrument onto OPL channel iChannel.
    // iOperatorSource: which SBI operator slot to read (0=mod, 1=car)
    // iOperatorDest:   which OPL slot to write (0=mod, 1=car)
    private writeInstrumentSettings(
        iChannel: number, iOperatorSource: number, iOperatorDest: number, iInstrument: number
    ): void {
        let iOPLOffset = OPLOFFSET(iChannel);
        if (iOperatorDest) iOPLOffset += 3;

        const op = this.pInstruments[iInstrument].op[iOperatorSource];
        this.writeOPL(BASE_CHAR_MULT + iOPLOffset, op.iCharMult);
        this.writeOPL(BASE_SCAL_LEVL + iOPLOffset, op.iScalingOutput);
        this.writeOPL(BASE_ATCK_DCAY + iOPLOffset, op.iAttackDecay);
        this.writeOPL(BASE_SUST_RLSE + iOPLOffset, op.iSustainRelease);
        this.writeOPL(BASE_WAVE      + iOPLOffset, op.iWaveSel);
        this.writeOPL(BASE_FEED_CONN + iChannel,   this.pInstruments[iInstrument].iConnection);
    }

    // Convert MIDI note + channel → OPL block and F-number using SBFMDRV lookup tables
    private getFreq(iChannel: number, iNote: number): { iBlock: number; iOPLFNum: number } {
        const iClampedNote = Math.max(0, Math.min(127, iNote));
        const iBlockNote = block_note_tbl[iClampedNote];

        let iBlk     = (iBlockNote & 0x70) >> 4; // octave 0..7
        let iNoteIdx = (iBlockNote & 0x0F) << 6; // semitone * 64

        // Per-channel transpose (stored in units of 1/256 semitone → convert to 1/64)
        iNoteIdx += (this.chMIDI[iChannel].iTranspose / 4) | 0;

        // Pitch bend: 8192 = centre (0 offset), 0 = -2 semitones, 16384 = +2 semitones
        iNoteIdx += ((this.chMIDI[iChannel].iPitchbend - 8192) / 128) | 0;

        // Wrap within [0, 768), adjusting octave
        if (iNoteIdx < 0)    { iNoteIdx += 768; iBlk--; if (iBlk < 0) { iNoteIdx = 0;   iBlk = 0; } }
        if (iNoteIdx >= 768) { iNoteIdx -= 768; iBlk++; if (iBlk > 7) { iNoteIdx = 767; iBlk = 7; } }

        return { iBlock: iBlk, iOPLFNum: fnum_tbl[iNoteIdx] };
    }

    private getPercChannel(iChannel: number): number {
        switch (iChannel) {
            case 11: return 6; // Bass drum    → OPL channel 7 (0-indexed: 6)
            case 12: return 7; // Snare drum   → OPL channel 8
            case 13: return 8; // Tom tom      → OPL channel 9
            case 14: return 8; // Top cymbal   → OPL channel 9
            case 15: return 7; // Hi-hat       → OPL channel 8
        }
        return 0;
    }

    // Map General MIDI percussion key → nearest CMF rhythm channel (11-15)
    private gmKeyToRhythmChannel(iNote: number): number {
        if (iNote === 35 || iNote === 36)                              return 11; // bass drum
        if (iNote >= 37 && iNote <= 40)                                return 12; // snare
        if (iNote === 42 || iNote === 44 || iNote === 46)             return 15; // hi-hat
        if ([49,51,52,53,55,57,59,80,81].indexOf(iNote) >= 0)        return 14; // cymbal
        return 13; // toms and everything else
    }

    private cmfNoteOn(iChannel: number, iNote: number, iVelocity: number): void {
        if (this.bMidiDrums && iChannel === 9) iChannel = this.gmKeyToRhythmChannel(iNote);

        const { iBlock, iOPLFNum } = this.getFreq(iChannel, iNote);

        if (iChannel > 10 && this.bPercussive) {
            // ── Rhythm / percussion mode ──────────────────────────────────────
            const iPercChannel = this.getPercChannel(iChannel);
            this.MIDIchangeInstrument(iPercChannel, iChannel, this.chMIDI[iChannel].iPatch);

            // Velocity → carrier output level (fmdrv formula)
            const iCarrierScal = this.pInstruments[this.chMIDI[iChannel].iPatch].op[1].iScalingOutput;
            const iBaseLevel   = 63 - (iCarrierScal & 0x3F);
            const iKSL         = iCarrierScal & 0xC0;
            const iLevel       = (63 - (((iVelocity | 0x80) * iBaseLevel) >> 8)) | iKSL;

            let iOPLOffset = BASE_SCAL_LEVL + OPLOFFSET(iPercChannel);
            if (iChannel === 11) iOPLOffset += 3; // bass drum: carrier only
            this.writeOPL(iOPLOffset, iLevel);

            this.writeOPL(BASE_FNUM_L     + iPercChannel, iOPLFNum & 0xFF);
            this.writeOPL(BASE_KEYON_FREQ + iPercChannel, (iBlock << 2) | ((iOPLFNum >> 8) & 0x03));

            const iBit = 1 << (15 - iChannel);
            if (this.iCurrentRegs[BASE_RHYTHM] & iBit)
                this.writeOPL(BASE_RHYTHM, this.iCurrentRegs[BASE_RHYTHM] & ~iBit);
            this.writeOPL(BASE_RHYTHM, this.iCurrentRegs[BASE_RHYTHM] | iBit);

            this.chOPL[iPercChannel].iNoteStart    = ++this.iNoteCount;
            this.chOPL[iPercChannel].iMIDIChannel  = iChannel;
            this.chOPL[iPercChannel].iMIDINote     = iNote;

        } else {
            // ── Melodic (or non-percussive channel) ───────────────────────────
            const iNumCh = this.bPercussive ? 6 : 9;
            let iOPLChannel = -1;

            // Tier 1: released voice last owned by this MIDI channel
            for (let i = 0; i < iNumCh; i++) {
                if (this.chOPL[i].iNoteStart === 0 && this.chOPL[i].iMIDIChannel === iChannel) {
                    iOPLChannel = i; break;
                }
            }
            // Tier 2: never-used voice
            if (iOPLChannel === -1) {
                for (let i = 0; i < iNumCh; i++) {
                    if (this.chOPL[i].iMIDIChannel === -1) { iOPLChannel = i; break; }
                }
            }
            // Tier 3: any released voice
            if (iOPLChannel === -1) {
                for (let i = 0; i < iNumCh; i++) {
                    if (this.chOPL[i].iNoteStart === 0) { iOPLChannel = i; break; }
                }
            }
            // Tier 4: steal the oldest sounding voice
            if (iOPLChannel === -1) {
                iOPLChannel = 0;
                let iEarliest = this.chOPL[0].iNoteStart;
                for (let i = 1; i < iNumCh; i++) {
                    if (this.chOPL[i].iNoteStart < iEarliest) {
                        iOPLChannel = i; iEarliest = this.chOPL[i].iNoteStart;
                    }
                }
                this.writeOPL(BASE_KEYON_FREQ + iOPLChannel,
                    this.iCurrentRegs[BASE_KEYON_FREQ + iOPLChannel] & ~OPLBIT_KEYON);
            }

            // Reprogram instrument only if this voice was owned by a different channel
            if (this.chOPL[iOPLChannel].iMIDIChannel !== iChannel) {
                this.MIDIchangeInstrument(iOPLChannel, iChannel, this.chMIDI[iChannel].iPatch);
            }

            this.chOPL[iOPLChannel].iNoteStart   = ++this.iNoteCount;
            this.chOPL[iOPLChannel].iMIDIChannel = iChannel;
            this.chOPL[iOPLChannel].iMIDINote    = iNote;

            // Velocity → carrier output level
            const iCarrierScal = this.pInstruments[this.chMIDI[iChannel].iPatch].op[1].iScalingOutput;
            const iBaseLevel   = 63 - (iCarrierScal & 0x3F);
            const iKSL         = iCarrierScal & 0xC0;
            const iLevel       = (63 - (((iVelocity | 0x80) * iBaseLevel) >> 8)) | iKSL;
            this.writeOPL(BASE_SCAL_LEVL + OPLOFFSET(iOPLChannel) + 3, iLevel);

            this.writeOPL(BASE_FNUM_L     + iOPLChannel, iOPLFNum & 0xFF);
            this.writeOPL(BASE_KEYON_FREQ + iOPLChannel,
                OPLBIT_KEYON | (iBlock << 2) | ((iOPLFNum & 0x300) >> 8));
        }
    }

    private cmfNoteOff(iChannel: number, iNote: number, _iVelocity: number): void {
        if (this.bMidiDrums && iChannel === 9) iChannel = this.gmKeyToRhythmChannel(iNote);

        if (iChannel > 10 && this.bPercussive) {
            const iOPLChannel = this.getPercChannel(iChannel);
            if (this.chOPL[iOPLChannel].iMIDINote !== iNote) return;
            this.writeOPL(BASE_RHYTHM, this.iCurrentRegs[BASE_RHYTHM] & ~(1 << (15 - iChannel)));
            this.chOPL[iOPLChannel].iNoteStart = 0;
        } else {
            const iNumCh = this.bPercussive ? 6 : 9;
            for (let i = 0; i < iNumCh; i++) {
                if (
                    this.chOPL[i].iMIDIChannel === iChannel &&
                    this.chOPL[i].iMIDINote    === iNote    &&
                    this.chOPL[i].iNoteStart    !== 0
                ) {
                    this.chOPL[i].iNoteStart = 0;
                    this.writeOPL(BASE_KEYON_FREQ + i,
                        this.iCurrentRegs[BASE_KEYON_FREQ + i] & ~OPLBIT_KEYON);
                }
            }
        }
    }

    private cmfNoteUpdate(iChannel: number): void {
        if (iChannel > 10 && this.bPercussive) {
            const iPercChannel = this.getPercChannel(iChannel);
            const { iBlock, iOPLFNum } = this.getFreq(iChannel, this.chOPL[iPercChannel].iMIDINote);
            this.writeOPL(BASE_FNUM_L     + iPercChannel, iOPLFNum & 0xFF);
            this.writeOPL(BASE_KEYON_FREQ + iPercChannel, (iBlock << 2) | ((iOPLFNum >> 8) & 0x03));
        } else {
            const iNumCh = this.bPercussive ? 6 : 9;
            for (let i = 0; i < iNumCh; i++) {
                if (this.chOPL[i].iMIDIChannel === iChannel && this.chOPL[i].iNoteStart > 0) {
                    const { iBlock, iOPLFNum } = this.getFreq(iChannel, this.chOPL[i].iMIDINote);
                    this.writeOPL(BASE_FNUM_L     + i, iOPLFNum & 0xFF);
                    this.writeOPL(BASE_KEYON_FREQ + i,
                        OPLBIT_KEYON | (iBlock << 2) | ((iOPLFNum & 0x300) >> 8));
                }
            }
        }
    }

    private MIDIchangeInstrument(iOPLChannel: number, iMIDIChannel: number, iNewInstrument: number): void {
        if (iMIDIChannel > 10 && this.bPercussive) {
            switch (iMIDIChannel) {
                case 11: // Bass drum: channel 7 (idx 6) mod + car
                    this.writeInstrumentSettings(6, 0, 0, iNewInstrument);
                    this.writeInstrumentSettings(6, 1, 1, iNewInstrument);
                    break;
                case 12: // Snare drum: channel 8 (idx 7) carrier
                    this.writeInstrumentSettings(7, 0, 1, iNewInstrument);
                    break;
                case 13: // Tom tom: channel 9 (idx 8) modulator
                    this.writeInstrumentSettings(8, 0, 0, iNewInstrument);
                    break;
                case 14: // Top cymbal: channel 9 (idx 8) carrier
                    this.writeInstrumentSettings(8, 0, 1, iNewInstrument);
                    break;
                case 15: // Hi-hat: channel 8 (idx 7) modulator
                    this.writeInstrumentSettings(7, 0, 0, iNewInstrument);
                    break;
            }
        } else {
            this.writeInstrumentSettings(iOPLChannel, 0, 0, iNewInstrument);
            this.writeInstrumentSettings(iOPLChannel, 1, 1, iNewInstrument);
        }
        this.chOPL[iOPLChannel].iMIDIPatch = iNewInstrument;
    }

    private MIDIcontroller(iChannel: number, iController: number, iValue: number): void {
        switch (iController) {
            case 0x63: // AdPlug extension: AM+VIB depth toggle
                if (iValue) {
                    this.writeOPL(BASE_RHYTHM, (this.iCurrentRegs[BASE_RHYTHM] & ~0xC0) | (iValue << 6));
                } else {
                    this.writeOPL(BASE_RHYTHM, this.iCurrentRegs[BASE_RHYTHM] & ~0xC0);
                }
                break;
            case 0x66: // Song marker (ignore)
                break;
            case 0x67: // Rhythm/percussive mode switch
                this.rhythmModeReset(iValue !== 0);
                break;
            case 0x68: // Transpose up (1/256 semitone per unit)
                this.chMIDI[iChannel].iTranspose = iValue;
                this.cmfNoteUpdate(iChannel);
                break;
            case 0x69: // Transpose down
                this.chMIDI[iChannel].iTranspose = -iValue;
                this.cmfNoteUpdate(iChannel);
                break;
            // All other controllers silently ignored
        }
    }

    // Switch OPL into/out of rhythm (percussive) mode with a full chip reset
    private rhythmModeReset(bPerc: boolean): void {
        this.bPercussive = bPerc;

        this.writeOPL(0x08, 0x00);
        for (let i = 0; i < 9; i++) {
            const iOffset = OPLOFFSET(i);
            this.writeOPL(BASE_CHAR_MULT  + iOffset,     cInitInstrument[0]);
            this.writeOPL(BASE_CHAR_MULT  + iOffset + 3, cInitInstrument[1]);
            this.writeOPL(BASE_SCAL_LEVL  + iOffset,     cInitInstrument[2]);
            this.writeOPL(BASE_SCAL_LEVL  + iOffset + 3, cInitInstrument[3]);
            this.writeOPL(BASE_ATCK_DCAY  + iOffset,     cInitInstrument[4]);
            this.writeOPL(BASE_ATCK_DCAY  + iOffset + 3, cInitInstrument[5]);
            this.writeOPL(BASE_SUST_RLSE  + iOffset,     cInitInstrument[6]);
            this.writeOPL(BASE_SUST_RLSE  + iOffset + 3, cInitInstrument[7]);
            this.writeOPL(BASE_WAVE       + iOffset,     cInitInstrument[8]);
            this.writeOPL(BASE_WAVE       + iOffset + 3, cInitInstrument[9]);
            this.writeOPL(BASE_FEED_CONN  + i,           cInitInstrument[10]);

            this.chOPL[i] = { iNoteStart: 0, iMIDINote: -1, iMIDIChannel: -1, iMIDIPatch: -1 };
        }
        for (let i = 0; i < 16; i++) this.chMIDI[i].iPatch = 0;

        // Point rhythm channels at fallback drum patches for GM-drum files
        if (this.bMidiDrums && bPerc) {
            for (let ch = 11; ch <= 15; ch++) {
                this.chMIDI[ch].iPatch = this.iDrumPatchBase + (ch - 11);
            }
        }

        // AM + VIB depth always on; add rhythm enable bit in percussive mode
        this.writeOPL(BASE_RHYTHM, bPerc ? 0xE0 : 0xC0);
    }

    // Scan the music block once at load time to detect General MIDI channel-9 drums.
    // Returns true when: channel 9 has note-ons, never receives a program change,
    // and all channel-9 note numbers lie within the GM percussion range (35-81).
    private detectMidiDrums(): boolean {
        let p = 0;
        let prev = 0;
        let bCh9Note    = false;
        let bCh9Prog    = false;
        let bCh9NonDrum = false;

        // Skip the initial leading delay (VLQ bytes with MSB set, then one final byte)
        while (p < this.iSongLen && (this.data[p] & 0x80)) p++;
        if (p < this.iSongLen) p++;

        const readVLQ = (): number => {
            let v = 0;
            for (let c = 0; c < 4 && p < this.iSongLen; c++) {
                const b = this.data[p++];
                v = (v << 7) | (b & 0x7F);
                if (!(b & 0x80)) break;
            }
            return v;
        };

        while (p < this.iSongLen) {
            let cmd = this.data[p++];
            if ((cmd & 0x80) === 0) { p--; cmd = prev; } else { prev = cmd; }
            const ch = cmd & 0x0F;

            switch (cmd & 0xF0) {
                case 0x80: case 0xA0: case 0xB0: case 0xE0: // two data bytes
                    p += 2; break;
                case 0x90: { // note on
                    if (p > this.iSongLen - 2) { p = this.iSongLen; break; }
                    const iNote = this.data[p++];
                    const iVel  = this.data[p++];
                    if (ch === 9 && iVel > 0) {
                        bCh9Note = true;
                        if (iNote < 35 || iNote > 81) bCh9NonDrum = true;
                    }
                    break;
                }
                case 0xC0: // program change
                    if (ch === 9) bCh9Prog = true;
                    p++; break;
                case 0xD0: // channel pressure
                    p++; break;
                case 0xF0:
                    if (cmd === 0xF0 || cmd === 0xF7) {
                        const len = readVLQ(); p += len;
                    } else if (cmd === 0xFF) {
                        if (p >= this.iSongLen) break;
                        const evt = this.data[p++];
                        const len = readVLQ();
                        if (evt === 0x2F) { p = this.iSongLen; break; }
                        p += len;
                    } else if (cmd === 0xFC) {
                        p = this.iSongLen;
                    }
                    break;
            }
            if (p >= this.iSongLen) break;

            // Skip inter-event delay
            while (p < this.iSongLen && (this.data[p] & 0x80)) p++;
            if (p < this.iSongLen) p++;
        }

        return bCh9Note && !bCh9Prog && !bCh9NonDrum;
    }
}
