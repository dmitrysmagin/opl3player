// @ts-nocheck
//
// RAD2 — Reality AdLib Tracker replayer (file formats v1.0 and v2.1)
//
// Ported from adplug's rad2.cpp, which is based on the public-domain RAD2
// replayer by Shayde/Reality (with v1 support added). Kept as close to the
// original structure as practical:
//   - C++ raw pointers into the tune buffer become integer offsets into
//     `#tune` (a Uint8Array); functions that advance a pointer take a
//     `{ pos }` cursor.
//   - The nested CInstrument / CChannel / CEffects / CRiff structs become
//     plain objects.
//   - `SetOPL3(reg, val)` writes through to the project's OPL (`write(array,
//     addr, data)`) and caches into a 512-byte register mirror for GetOPL3.
//
import { FormatPlayer } from "./player";

// ── Command codes ────────────────────────────────────────────────────────────
const cmPortamentoUp  = 0x1;
const cmPortamentoDwn = 0x2;
const cmToneSlide     = 0x3;
const cmToneVolSlide  = 0x5;
const cmVolSlide      = 0xA;
const cmSetVol        = 0xC;
const cmJumpToLine    = 0xD;
const cmSetSpeed      = 0xF;
const cmIgnore        = ("I".charCodeAt(0) - 55); // 18
const cmMultiplier    = ("M".charCodeAt(0) - 55); // 22
const cmRiff          = ("R".charCodeAt(0) - 55); // 27
const cmTranspose     = ("T".charCodeAt(0) - 55); // 29
const cmFeedback      = ("U".charCodeAt(0) - 55); // 30
const cmVolume        = ("V".charCodeAt(0) - 55); // 31

// ── Sizes ────────────────────────────────────────────────────────────────────
const kTracks      = 100;
const kChannels    = 9;
const kTrackLines  = 64;
const kRiffTracks  = 10;
const kInstruments = 127;

// ── Effect source ────────────────────────────────────────────────────────────
const SNone = 0, SRiff = 1, SIRiff = 2;

// ── Key flags ────────────────────────────────────────────────────────────────
const fKeyOn = 1 << 0, fKeyOff = 1 << 1, fKeyedOn = 1 << 2;

// ── Static tables (verbatim from rad2.cpp) ──────────────────────────────────
const NoteSize = [0, 2, 1, 3, 1, 3, 2, 4];
const ChanOffsets3 = [0, 1, 2, 0x100, 0x101, 0x102, 6, 7, 8];             // OPL3 first channel
const Chn2Offsets3 = [3, 4, 5, 0x103, 0x104, 0x105, 0x106, 0x107, 0x108]; // OPL3 second channel
const NoteFreq = [0x16b, 0x181, 0x198, 0x1b0, 0x1ca, 0x1e5, 0x202, 0x220, 0x241, 0x263, 0x287, 0x2ae];
const OpOffsets2 = [
    [0x003, 0x000], [0x004, 0x001], [0x005, 0x002],
    [0x00B, 0x008], [0x00C, 0x009], [0x00D, 0x00A],
    [0x013, 0x010], [0x014, 0x011], [0x015, 0x012],
];
const OpOffsets3 = [
    [0x00B, 0x008, 0x003, 0x000],
    [0x00C, 0x009, 0x004, 0x001],
    [0x00D, 0x00A, 0x005, 0x002],
    [0x10B, 0x108, 0x103, 0x100],
    [0x10C, 0x109, 0x104, 0x101],
    [0x10D, 0x10A, 0x105, 0x102],
    [0x113, 0x110, 0x013, 0x010],
    [0x114, 0x111, 0x014, 0x011],
    [0x115, 0x112, 0x015, 0x012],
];
const AlgCarriers = [
    [true,  false, false, false], // 0 - 2op - op < op
    [true,  true,  false, false], // 1 - 2op - op + op
    [true,  false, false, false], // 2 - 4op - op < op < op < op
    [true,  false, false, true ], // 3 - 4op - op < op < op + op
    [true,  false, true,  false], // 4 - 4op - op < op + op < op
    [true,  false, true,  true ], // 5 - 4op - op < op + op + op
    [true,  true,  true,  true ], // 6 - 4op - op + op + op + op
];

const BLANK_OP = [0, 0x3F, 0, 0xF0, 0];

// ── Object factories (mirror the C++ structs) ───────────────────────────────
function makeFX() {
    return {
        PortSlide: 0,       // int8
        VolSlide: 0,        // int8
        ToneSlideFreq: 0,   // uint16
        ToneSlideOct: 0,    // uint8
        ToneSlideSpeed: 0,  // uint8
        ToneSlideDir: 0,    // int8
    };
}

function makeRiff() {
    return {
        FX: makeFX(),
        Track: null,          // offset | null
        TrackStart: null,     // offset | null
        Line: 0,
        Speed: 0,
        SpeedCnt: 0,
        TransposeOctave: 0,   // int8
        TransposeNote: 0,     // int8
        LastInstrument: 0,
        Updated: false,
    };
}

function makeChannel() {
    return {
        LastInstrument: 0,
        Instrument: null,     // reference into #Instruments | null
        Volume: 0,
        DetuneA: 0,
        DetuneB: 0,
        KeyFlags: 0,
        CurrFreq: 0,          // uint16
        CurrOctave: 0,        // int8
        FX: makeFX(),
        Riff: makeRiff(),
        IRiff: makeRiff(),
    };
}

function makeInstrument() {
    return {
        Feedback: [0, 0],
        Panning: [0, 0],
        Algorithm: 0,
        Detune: 0,
        Volume: 0,
        RiffSpeed: 0,
        Riff: null,           // offset | null
        Operators: [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ],
        Name: "",
    };
}

const MAGIC = "RAD by REALiTY!!";

export default class RAD2 extends FormatPlayer {
    #tune = null;             // Uint8Array (with one extra trailing 0 byte)

    #Version = 1;
    #UseOPL3 = false;
    #Hertz = 50;
    #Initialised = false;
    #pendingConfig = false;

    #Description = null;      // offset | null

    #Instruments = null;      // instrument[] (length kInstruments)
    #NumInstruments = 0;
    #Channels = null;         // channel[] (length kChannels)

    #OrderList = 0;           // offset
    #OrderListSize = 0;
    #Tracks = null;           // (offset | null)[] length kTracks
    #NumTracks = 0;
    #Riffs = null;            // (offset | null)[kRiffTracks][kChannels]

    #Track = null;            // offset | null
    #Speed = 6;
    #SpeedCnt = 1;
    #Order = 0;
    #Line = 0;
    #Entrances = 0;
    #MasterVol = 64;
    #LineJump = -1;

    #PlayTime = 0;
    #Repeating = false;
    #OrderMap = new Int32Array(4);

    #OPL3Regs = new Uint8Array(512);

    // Scratch outputs of unpackNote() (mirror the C++ member variables)
    #NoteNum = 0;
    #OctaveNum = 0;
    #InstNum = 0;
    #EffectNum = 0;
    #Param = 0;

    constructor(opl, options) {
        super(opl, options);
    }

    // ── FormatPlayer interface ──────────────────────────────────────────────
    static probe(buffer /* Uint8Array */) {
        if (buffer.length < 16) return false;
        return String.fromCharCode.apply(null, buffer.slice(0, 16)) === MAGIC;
    }

    load(buffer /* Uint8Array */) {
        if (!RAD2.probe(buffer))
            throw new Error('Buffer is not a "RAD by REALiTY!!" file');

        // Some old tunes have a truncated final note; append a trailing zero byte
        // so the player never reads past the end (matches adplug's loader).
        const tune = new Uint8Array(buffer.length + 1);
        tune.set(buffer);
        tune[buffer.length] = 0;
        this.#tune = tune;

        const ver = tune[0x10];
        if (ver !== 0x10 && ver !== 0x21)
            throw new Error("Unsupported RAD version: 0x" + ver.toString(16));

        this.#Version = ver >> 4;
        this.#UseOPL3 = this.#Version >= 2;

        // Fresh state containers
        this.#Instruments = new Array(kInstruments);
        for (let i = 0; i < kInstruments; i++) this.#Instruments[i] = makeInstrument();
        this.#Channels = new Array(kChannels);
        for (let i = 0; i < kChannels; i++) this.#Channels[i] = makeChannel();
        this.#Tracks = new Array(kTracks).fill(null);
        this.#Riffs = new Array(kRiffTracks);
        for (let i = 0; i < kRiffTracks; i++) this.#Riffs[i] = new Array(kChannels).fill(null);

        let s = 0x11;

        const flags = tune[s++];
        this.#Speed = flags & 0x1F;

        // BPM (v2 only)
        this.#Hertz = 50;
        if (this.#Version >= 2 && (flags & 0x20)) {
            this.#Hertz = (tune[s] | (tune[s + 1] << 8)) * 2 / 5;
            s += 2;
        }

        // Slow-timer tune
        if (flags & 0x40)
            this.#Hertz = 18.2;

        // Description
        this.#Description = null;
        if (this.#Version >= 2 || (flags & 0x80)) {
            this.#Description = s;
            while (tune[s]) s++;
            s++;
        }

        // ── Instruments ──────────────────────────────────────────────────────
        this.#NumInstruments = 0;
        while (true) {
            const instNum = tune[s++];
            if (instNum === 0) break;
            if (instNum > this.#NumInstruments) this.#NumInstruments = instNum;

            const inst = this.#Instruments[instNum - 1];

            if (this.#Version >= 2) {
                // Name
                const nameLen = tune[s++];
                let name = "";
                for (let i = 0; i < nameLen; i++) name += String.fromCharCode(tune[s++]);
                inst.Name = name;

                const alg = tune[s++];
                inst.Algorithm = alg & 7;
                inst.Panning[0] = (alg >> 3) & 3;
                inst.Panning[1] = (alg >> 5) & 3;

                if (inst.Algorithm < 7) {
                    let b = tune[s++];
                    inst.Feedback[0] = b & 15;
                    inst.Feedback[1] = b >> 4;

                    b = tune[s++];
                    inst.Detune = b >> 4;
                    inst.RiffSpeed = b & 15;

                    inst.Volume = tune[s++];

                    for (let i = 0; i < 4; i++) {
                        const op = inst.Operators[i];
                        for (let j = 0; j < 5; j++) op[j] = tune[s++];
                    }
                } else {
                    // Ignore MIDI instrument data
                    s += 6;
                }

                // Instrument riff?
                if (alg & 0x80) {
                    const size = tune[s] | (tune[s + 1] << 8);
                    s += 2;
                    inst.Riff = s;
                    s += size;
                } else {
                    inst.Riff = null;
                }
            } else {
                // Version 1 instrument (11 raw bytes)
                inst.Name = "";
                inst.Algorithm = tune[s + 8] & 1;
                inst.Panning[0] = 0;
                inst.Panning[1] = 0;
                inst.Feedback[0] = (tune[s + 8] >> 1) & 0x7;
                inst.Feedback[1] = 0;
                inst.Detune = 0;
                inst.RiffSpeed = 0;
                inst.Volume = 64;

                inst.Operators[0][0] = tune[s + 0];
                inst.Operators[1][0] = tune[s + 1];
                inst.Operators[0][1] = tune[s + 2];
                inst.Operators[1][1] = tune[s + 3];
                inst.Operators[0][2] = tune[s + 4];
                inst.Operators[1][2] = tune[s + 5];
                inst.Operators[0][3] = tune[s + 6];
                inst.Operators[1][3] = tune[s + 7];
                inst.Operators[0][4] = tune[s + 9];
                inst.Operators[1][4] = tune[s + 10];
                // Operators[2] and [3] remain zero-filled

                inst.Riff = null;
                s += 11;
            }
        }

        // ── Order list ───────────────────────────────────────────────────────
        this.#OrderListSize = tune[s++];
        this.#OrderList = s;
        s += this.#OrderListSize;

        // ── Tracks ─────────────────────────────────────────────────────────
        this.#NumTracks = 0;
        if (this.#Version >= 2) {
            while (true) {
                const trackNum = tune[s++];
                if (trackNum >= kTracks) break;
                if (trackNum + 1 > this.#NumTracks) this.#NumTracks = trackNum + 1;

                const size = tune[s] | (tune[s + 1] << 8);
                s += 2;
                this.#Tracks[trackNum] = s;
                s += size;
            }
        } else {
            for (let i = 0; i < 32; i++) {
                const pos = tune[s] | (tune[s + 1] << 8);
                s += 2;
                if (pos) {
                    this.#NumTracks = i + 1;
                    this.#Tracks[i] = pos;
                }
            }
        }

        // ── Riffs (v2 only) ──────────────────────────────────────────────────
        if (this.#Version >= 2) {
            while (true) {
                const riffId = tune[s++];
                const riffNum = riffId >> 4;
                const chanNum = riffId & 15;
                if (riffNum >= kRiffTracks || chanNum > kChannels) break;

                const size = tune[s] | (tune[s + 1] << 8);
                s += 2;
                this.#Riffs[riffNum][chanNum - 1] = s;
                s += size;
            }
        }

        // Reset play state; the OPL configuration is applied lazily on the first
        // update() tick so it survives worklet-player's post-load opl.init().
        this.#resetState();
        this.#pendingConfig = true;
        this.#Initialised = true;

        this._loopStart = true; // whole song loops from the start (frame 0)
        return true;
    }

    update(): boolean {
        if (!this.#Initialised) return false;

        if (this.#pendingConfig) {
            this.#configureOPL3();
            this.#pendingConfig = false;
        }

        // Run riffs
        for (let i = 0; i < kChannels; i++) {
            const chan = this.#Channels[i];
            this.#tickRiff(i, chan.IRiff, false);
            this.#tickRiff(i, chan.Riff, true);
        }

        // Run main track
        this.#playLine();

        // Continue effects
        for (let i = 0; i < kChannels; i++) {
            const chan = this.#Channels[i];
            this.#continueFX(i, chan.IRiff.FX);
            this.#continueFX(i, chan.Riff.FX);
            this.#continueFX(i, chan.FX);
        }

        this.#PlayTime++;

        if (this.#Repeating) {
            this._loopEnd = true;
            this.rewind();
            return false;
        }
        return true;
    }

    rewind() {
        if (!this.#tune) return;
        this.#resetState();
        this.#pendingConfig = true;
    }

    getrefresh() {
        return this.#Hertz;
    }

    gettype() {
        return `Reality AdLib Tracker (version ${this.#Version})`;
    }

    getdesc() {
        if (this.#Description === null) return "";
        const tune = this.#tune;
        let s = this.#Description;
        let out = "";
        while (tune[s]) {
            const c = tune[s++];
            if (c >= 0x20) out += String.fromCharCode(c);
            else if (c === 0x01) out += "\n";
            else for (let i = 0; i < c; i++) out += " ";
        }
        return out;
    }

    getpatterns() { return this.#NumTracks; }
    getpattern() { return this.#tune[this.#OrderList + this.#Order] & 0x7f; }
    getorders() { return this.#OrderListSize; }
    getorder() { return this.#Order; }
    getrow() { return this.#Line; }
    getspeed() { return this.#Speed; }
    getinstruments() { return this.#NumInstruments; }
    getinstrument(n) { return this.#Instruments?.[n]?.Name ?? ""; }

    getcontext() {
        return {
            version: this.#Version,
            useOPL3: this.#UseOPL3,
            hertz: this.#Hertz,
            order: this.#Order,
            orderSize: this.#OrderListSize,
            line: this.#Line,
            speed: this.#Speed,
            numTracks: this.#NumTracks,
            numInstruments: this.#NumInstruments,
            repeating: this.#Repeating,
        };
    }

    // ── OPL3 register access ────────────────────────────────────────────────
    #setOPL3(reg, val) {
        val &= 0xFF;
        this.#OPL3Regs[reg] = val;
        this.opl.write(reg >> 8, reg & 0xFF, val);
    }

    #getOPL3(reg) {
        return this.#OPL3Regs[reg];
    }

    // Clear all registers and put the chip into the base RAD playback state.
    // (Mirrors the OPL portion of the C++ Stop().)
    #configureOPL3() {
        this.opl.init();
        this.#OPL3Regs.fill(255);

        for (let reg = 0x20; reg < 0xF6; reg++) {
            // Ensure envelopes decay all the way
            const val = (reg >= 0x60 && reg < 0xA0) ? 0xFF : 0;
            this.#setOPL3(reg, val);
            this.#setOPL3(reg + 0x100, val);
        }

        this.#setOPL3(1, 0x20);    // Allow waveforms
        this.#setOPL3(8, 0);       // No split point
        this.#setOPL3(0xbd, 0);    // No drums, etc.
        this.#setOPL3(0x104, 0);   // Everything 2-op by default
        this.#setOPL3(0x105, 1);   // OPL3 mode on
    }

    // Reset play variables + channels (the non-OPL portion of C++ Stop()).
    #resetState() {
        this.#PlayTime = 0;
        this.#Repeating = false;
        this.#OrderMap.fill(0);

        this.#SpeedCnt = 1;
        this.#Order = 0;
        this.#Track = this.#getTrack();
        this.#Line = 0;
        this.#Entrances = 0;
        this.#MasterVol = 64;

        for (let i = 0; i < kChannels; i++) {
            const chan = this.#Channels[i];
            chan.LastInstrument = 0;
            chan.Instrument = null;
            chan.Volume = 0;
            chan.DetuneA = 0;
            chan.DetuneB = 0;
            chan.KeyFlags = 0;
            chan.Riff.SpeedCnt = 0;
            chan.IRiff.SpeedCnt = 0;
        }
    }

    // ── Note unpacking ──────────────────────────────────────────────────────
    // `cur` is a { pos } cursor; `holder` is the object whose .LastInstrument
    // field is read/written (a channel or a riff). Returns true if last channel.
    #unpackNote(cur, holder) {
        const tune = this.#tune;
        const chanid = tune[cur.pos++];

        this.#InstNum = 0;
        this.#EffectNum = 0;
        this.#Param = 0;

        let note = 0;

        if (this.#Version >= 2) {
            if (chanid & 0x40) {
                const n = tune[cur.pos++];
                note = n & 0x7F;
                if (n & 0x80) this.#InstNum = holder.LastInstrument; // retrigger last
            }
            if (chanid & 0x20) {
                this.#InstNum = tune[cur.pos++];
                holder.LastInstrument = this.#InstNum;
            }
            if (chanid & 0x10) {
                this.#EffectNum = tune[cur.pos++];
                this.#Param = tune[cur.pos++];
            }
        } else {
            let n = tune[cur.pos++];
            note = n & 0x7f;
            if (n & 0x80) this.#InstNum = 16;

            n = tune[cur.pos++];
            this.#InstNum |= n >> 4;
            if (this.#InstNum) holder.LastInstrument = this.#InstNum;

            this.#EffectNum = n & 0xf;
            if (this.#EffectNum) this.#Param = tune[cur.pos++];
        }

        this.#NoteNum = note & 15;
        this.#OctaveNum = note >> 4;

        return (chanid & 0x80) !== 0;
    }

    // ── Track navigation ────────────────────────────────────────────────────
    #getTrack() {
        if (this.#Order >= this.#OrderListSize) this.#Order = 0;

        let trackNum = this.#tune[this.#OrderList + this.#Order];

        // Jump marker (single-level only, to avoid infinite loops)
        if (trackNum & 0x80) {
            this.#Order = trackNum & 0x7F;
            trackNum = this.#tune[this.#OrderList + this.#Order] & 0x7F;
        }

        // Repeat detection: mark the order and flag when we revisit one
        if (this.#Order < 128) {
            const byte = this.#Order >> 5;
            const bit = 1 << (this.#Order & 31);
            if (this.#OrderMap[byte] & bit) this.#Repeating = true;
            else this.#OrderMap[byte] |= bit;
        }

        const t = this.#Tracks[trackNum];
        return (t === undefined || t === null) ? null : t;
    }

    // Skip through a track until reaching the given line (or the next higher).
    // Returns offset or null.
    #skipToLine(trk, linenum, chanRiff) {
        if (trk === null) return null;
        const tune = this.#tune;

        while (true) {
            const lineid = tune[trk];
            if ((lineid & 0x7F) >= linenum) return trk;
            if (lineid & 0x80) break;
            trk++;

            // Skip channel notes
            let chanid;
            do {
                chanid = tune[trk++];
                if (this.#Version >= 2)
                    trk += NoteSize[(chanid >> 4) & 7];
                else if (tune[trk + 1] & 0xf)
                    trk += 3; // v1 note with param
                else
                    trk += 2; // v1 note without param
            } while (!(chanid & 0x80) && !chanRiff);
        }

        return null;
    }

    // ── Play one track line ─────────────────────────────────────────────────
    #playLine() {
        this.#SpeedCnt--;
        if (this.#SpeedCnt > 0) return;
        this.#SpeedCnt = this.#Speed;

        for (let i = 0; i < kChannels; i++) this.#resetFX(this.#Channels[i].FX);

        this.#LineJump = -1;

        const tune = this.#tune;
        let trk = this.#Track;
        if (trk !== null && (tune[trk] & 0x7F) <= this.#Line) {
            const lineid = tune[trk++];

            let last;
            do {
                const channum = tune[trk] & 15;
                const chan = this.#Channels[channum];
                const cur = { pos: trk };
                last = this.#unpackNote(cur, chan);
                trk = cur.pos;
                this.#playNote(channum, this.#NoteNum, this.#OctaveNum, this.#InstNum, this.#EffectNum, this.#Param);
            } while (!last);

            if (lineid & 0x80) trk = null;
            this.#Track = trk;
        }

        // Move to next line
        this.#Line++;
        if (this.#Line >= kTrackLines || this.#LineJump >= 0) {
            if (this.#LineJump >= 0) this.#Line = this.#LineJump;
            else this.#Line = 0;

            this.#Order++;
            this.#Track = this.#getTrack();
            if (this.#Line > 0) this.#Track = this.#skipToLine(this.#Track, this.#Line, false);
        }
    }

    // ── Play a single note / process its effect ──────────────────────────────
    #playNote(channum, notenum, octave, instnum, cmd = 0, param = 0, src = SNone, op = 0) {
        const chan = this.#Channels[channum];

        // Recursion guard (riffs can trigger other riffs)
        if (this.#Entrances >= 8) return;
        this.#Entrances++;

        // Which effects source?
        let fx = chan.FX;
        if (src === SRiff) fx = chan.Riff.FX;
        else if (src === SIRiff) fx = chan.IRiff.FX;

        let transposing = false;

        // Tone-slide: note is the target — skip instrument/note handling entirely
        if (cmd === cmToneSlide) {
            if (notenum > 0 && notenum <= 12) {
                fx.ToneSlideOct = octave;
                fx.ToneSlideFreq = NoteFreq[notenum - 1];
            }
            this.#toneSlide(channum, fx, param);
            this.#Entrances--;
            return;
        }

        // New instrument?
        if (instnum > 0) {
            const oldinst = chan.Instrument;
            const inst = this.#Instruments[instnum - 1];
            chan.Instrument = inst;

            if (inst.Algorithm < 7) {
                this.#loadInstrumentOPL3(channum);

                // Bounce the channel
                chan.KeyFlags |= fKeyOff | fKeyOn;

                this.#resetFX(chan.IRiff.FX);

                if (src !== SIRiff || inst !== oldinst) {
                    if (inst.Riff !== null && inst.RiffSpeed > 0) {
                        chan.IRiff.Track = chan.IRiff.TrackStart = inst.Riff;
                        chan.IRiff.Line = 0;
                        chan.IRiff.Speed = inst.RiffSpeed;
                        chan.IRiff.LastInstrument = 0;

                        if (notenum >= 1 && notenum <= 12) {
                            chan.IRiff.TransposeOctave = octave;
                            chan.IRiff.TransposeNote = notenum;
                            transposing = true;
                        } else {
                            chan.IRiff.TransposeOctave = 3;
                            chan.IRiff.TransposeNote = 12;
                        }

                        chan.IRiff.SpeedCnt = 1;
                        this.#tickRiff(channum, chan.IRiff, false);
                    } else {
                        chan.IRiff.SpeedCnt = 0;
                    }
                }
            } else {
                // Ignore MIDI instruments
                chan.Instrument = null;
            }
        }

        // Starting a channel riff?
        if (cmd === cmRiff || cmd === cmTranspose) {
            this.#resetFX(chan.Riff.FX);

            const p0 = (param / 10) | 0;
            const p1 = param % 10;
            chan.Riff.Track = p1 > 0 ? this.#Riffs[p0][p1 - 1] : null;
            if (chan.Riff.Track !== null) {
                chan.Riff.TrackStart = chan.Riff.Track;
                chan.Riff.Line = 0;
                chan.Riff.Speed = this.#Speed;
                chan.Riff.LastInstrument = 0;

                if (cmd === cmTranspose && notenum >= 1 && notenum <= 12) {
                    chan.Riff.TransposeOctave = octave;
                    chan.Riff.TransposeNote = notenum;
                    transposing = true;
                } else {
                    chan.Riff.TransposeOctave = 3;
                    chan.Riff.TransposeNote = 12;
                }

                chan.Riff.SpeedCnt = 1;
                this.#tickRiff(channum, chan.Riff, true);
            } else {
                chan.Riff.SpeedCnt = 0;
            }
        }

        // Play the note
        if (!transposing && notenum > 0) {
            if (notenum === 15) chan.KeyFlags |= fKeyOff; // key-off
            if (!chan.Instrument || chan.Instrument.Algorithm < 7)
                this.#playNoteOPL3(channum, octave, notenum);
        }

        // Process effect
        switch (cmd) {
            case cmSetVol:
                this.#setVolume(channum, param);
                break;

            case cmSetSpeed:
                if (src === SNone) {
                    this.#Speed = param;
                    this.#SpeedCnt = param;
                } else if (src === SRiff) {
                    chan.Riff.Speed = param;
                    chan.Riff.SpeedCnt = param;
                } else if (src === SIRiff) {
                    chan.IRiff.Speed = param;
                    chan.IRiff.SpeedCnt = param;
                }
                break;

            case cmPortamentoUp:
                fx.PortSlide = param;
                break;

            case cmPortamentoDwn:
                fx.PortSlide = -param;
                break;

            case cmToneVolSlide:
            case cmVolSlide: {
                let val = param;
                if (val >= 50) val = -(val - 50);
                fx.VolSlide = val;
                if (cmd !== cmToneVolSlide) break;
                // Fall through to tone-slide
                this.#toneSlide(channum, fx, param);
                break;
            }

            case cmJumpToLine:
                if (param >= kTrackLines) break;
                // Jump commands in riffs are handled inside tickRiff()
                if (src === SNone) this.#LineJump = param;
                break;

            case cmMultiplier:
                if (src === SIRiff) this.#loadInstMultiplierOPL3(channum, op, param);
                break;

            case cmVolume:
                if (src === SIRiff) this.#loadInstVolumeOPL3(channum, op, param);
                break;

            case cmFeedback:
                if (src === SIRiff) {
                    const which = (param / 10) | 0;
                    const fb = param % 10;
                    this.#loadInstFeedbackOPL3(channum, which, fb);
                }
                break;
        }

        this.#Entrances--;
    }

    #toneSlide(channum, fx, param) {
        const speed = param;
        if (speed) fx.ToneSlideSpeed = speed;
        this.#getSlideDir(channum, fx);
    }

    // ── Instrument → OPL3 ────────────────────────────────────────────────────
    #loadInstrumentOPL3(channum) {
        const chan = this.#Channels[channum];
        const inst = chan.Instrument;
        if (!inst) return;

        const alg = inst.Algorithm;
        chan.Volume = inst.Volume;
        chan.DetuneA = (inst.Detune + 1) >> 1;
        chan.DetuneB = inst.Detune >> 1;

        // 4-op mode for algorithms 2 & 3 (4..6 are simulated in 2-op mode)
        if (this.#UseOPL3 && channum < 6) {
            const mask = 1 << channum;
            this.#setOPL3(0x104, (this.#getOPL3(0x104) & ~mask) | ((alg === 2 || alg === 3) ? mask : 0));
        }

        // Left/right/feedback/algorithm
        if (this.#UseOPL3) {
            this.#setOPL3(0xC0 + ChanOffsets3[channum],
                ((inst.Panning[1] ^ 3) << 4) | (inst.Feedback[1] << 1) | ((alg === 3 || alg === 5 || alg === 6) ? 1 : 0));
            this.#setOPL3(0xC0 + Chn2Offsets3[channum],
                ((inst.Panning[0] ^ 3) << 4) | (inst.Feedback[0] << 1) | ((alg === 1 || alg === 6) ? 1 : 0));
        } else {
            this.#setOPL3(0xC0 + channum,
                ((inst.Panning[0] ^ 3) << 4) | (inst.Feedback[0] << 1) | ((alg === 1) ? 1 : 0));
        }

        const nops = this.#UseOPL3 ? 4 : 2;
        for (let i = 0; i < nops; i++) {
            const opd = (alg < 2 && i >= 2) ? BLANK_OP : inst.Operators[i];
            const reg = this.#UseOPL3 ? OpOffsets3[channum][i] : OpOffsets2[channum][i];

            let vol = ~opd[1] & 0x3F;

            // Volume scaling for carriers
            if (AlgCarriers[alg][i]) {
                vol = (vol * inst.Volume / 64) | 0;
                vol = (vol * this.#MasterVol / 64) | 0;
            }

            this.#setOPL3(reg + 0x20, opd[0]);
            this.#setOPL3(reg + 0x40, (opd[1] & 0xC0) | ((vol ^ 0x3F) & 0x3F));
            this.#setOPL3(reg + 0x60, opd[2]);
            this.#setOPL3(reg + 0x80, opd[3]);
            this.#setOPL3(reg + 0xE0, opd[4]);
        }
    }

    #playNoteOPL3(channum, octave, note) {
        const chan = this.#Channels[channum];

        let o1, o2;
        if (this.#UseOPL3) {
            o1 = ChanOffsets3[channum];
            o2 = Chn2Offsets3[channum];
        } else {
            o1 = 0;
            o2 = channum;
        }

        // Key off
        if (chan.KeyFlags & fKeyOff) {
            chan.KeyFlags &= ~(fKeyOff | fKeyedOn);
            if (this.#UseOPL3)
                this.#setOPL3(0xB0 + o1, this.#getOPL3(0xB0 + o1) & ~0x20);
            this.#setOPL3(0xB0 + o2, this.#getOPL3(0xB0 + o2) & ~0x20);
        }

        if (note > 12) return;

        const op4 = (this.#UseOPL3 && chan.Instrument && chan.Instrument.Algorithm >= 2);

        let freq = NoteFreq[note - 1];
        let frq2 = freq;

        chan.CurrFreq = freq;
        chan.CurrOctave = octave;

        // Detune both channels in opposite directions to keep tuning
        freq = (freq + chan.DetuneA) & 0xFFFF;
        frq2 = (frq2 - chan.DetuneB) & 0xFFFF;

        // Frequency low byte
        if (op4) this.#setOPL3(0xA0 + o1, frq2 & 0xFF);
        this.#setOPL3(0xA0 + o2, freq & 0xFF);

        // Frequency high bits + octave + key on
        if (chan.KeyFlags & fKeyOn)
            chan.KeyFlags = (chan.KeyFlags & ~fKeyOn) | fKeyedOn;

        if (op4)
            this.#setOPL3(0xB0 + o1, (frq2 >> 8) | (octave << 2) | ((chan.KeyFlags & fKeyedOn) ? 0x20 : 0));
        else if (this.#UseOPL3)
            this.#setOPL3(0xB0 + o1, 0);

        this.#setOPL3(0xB0 + o2, (freq >> 8) | (octave << 2) | ((chan.KeyFlags & fKeyedOn) ? 0x20 : 0));
    }

    // ── Effects ──────────────────────────────────────────────────────────────
    #resetFX(fx) {
        fx.PortSlide = 0;
        fx.VolSlide = 0;
        fx.ToneSlideDir = 0;
    }

    #tickRiff(channum, riff, chanRiff) {
        const tune = this.#tune;
        let lineid;

        riff.Updated = true;

        if (riff.SpeedCnt === 0) {
            this.#resetFX(riff.FX);
            return;
        }

        riff.SpeedCnt--;
        if (riff.SpeedCnt > 0) return;
        riff.SpeedCnt = riff.Speed;

        const line = riff.Line++;
        if (riff.Line >= kTrackLines) riff.SpeedCnt = 0;

        this.#resetFX(riff.FX);

        let trk = riff.Track;
        if (trk !== null && (tune[trk] & 0x7F) === line) {
            lineid = tune[trk++];

            // May be clobbered by recursive riffs — see below.
            riff.Updated = false;

            if (chanRiff) {
                // Channel riff: play current note
                const cur = { pos: trk };
                this.#unpackNote(cur, riff);
                trk = cur.pos;
                this.#transpose(riff.TransposeNote, riff.TransposeOctave);
                this.#playNote(channum, this.#NoteNum, this.#OctaveNum, this.#InstNum, this.#EffectNum, this.#Param, SRiff);
            } else {
                // Instrument riff: each column is an extra effect on the same channel
                let last;
                do {
                    const col = tune[trk] & 15;
                    const cur = { pos: trk };
                    last = this.#unpackNote(cur, riff);
                    trk = cur.pos;
                    if (this.#EffectNum !== cmIgnore)
                        this.#transpose(riff.TransposeNote, riff.TransposeOctave);
                    this.#playNote(channum, this.#NoteNum, this.#OctaveNum, this.#InstNum, this.#EffectNum, this.#Param, SIRiff, col > 0 ? ((col - 1) & 3) : 0);
                } while (!last);
            }

            // Exit if a recursive riff replaced or stopped this one.
            if (riff.Updated) return;
            riff.Updated = true;

            if (lineid & 0x80) trk = null;
            riff.Track = trk;
        }

        // Special case: if the next line has a jump command, run it now
        if (trk === null) return;
        const lid = tune[trk] & 0x7F;
        trk++;
        if (lid !== riff.Line) return;

        const cur = { pos: trk };
        this.#unpackNote(cur, { LastInstrument: 0 }); // dummy holder
        if (this.#EffectNum === cmJumpToLine && this.#Param < kTrackLines) {
            riff.Line = this.#Param;
            riff.Track = this.#skipToLine(riff.TrackStart, this.#Param, chanRiff);
        }
    }

    #continueFX(channum, fx) {
        const chan = this.#Channels[channum];

        if (fx.PortSlide)
            this.#portamento(channum, fx, fx.PortSlide, false);

        if (fx.VolSlide) {
            let vol = chan.Volume;
            vol -= fx.VolSlide;
            if (vol < 0) vol = 0;
            this.#setVolume(channum, vol);
        }

        if (fx.ToneSlideDir)
            this.#portamento(channum, fx, fx.ToneSlideDir, true);
    }

    #setVolume(channum, vol) {
        const chan = this.#Channels[channum];

        if (vol > 64) vol = 64;
        chan.Volume = vol;

        // Scale to master volume
        vol = (vol * this.#MasterVol / 64) | 0;

        const inst = chan.Instrument;
        if (!inst) return;
        const alg = inst.Algorithm;

        for (let i = 0; i < 4; i++) {
            if (!AlgCarriers[alg][i]) continue;
            const op = inst.Operators[i];
            const opvol = ((((op[1] & 63) ^ 63) * vol) / 64) | 0;
            const reg = 0x40 + (this.#UseOPL3 ? OpOffsets3[channum][i] : OpOffsets2[channum][i]);
            this.#setOPL3(reg, (this.#getOPL3(reg) & 0xC0) | (opvol ^ 0x3F));
        }
    }

    #getSlideDir(channum, fx) {
        const chan = this.#Channels[channum];

        let speed = fx.ToneSlideSpeed;
        if (speed > 0) {
            const oct = fx.ToneSlideOct;
            const freq = fx.ToneSlideFreq;
            const oldfreq = chan.CurrFreq;
            const oldoct = chan.CurrOctave;

            if (oldoct > oct) speed = -speed;
            else if (oldoct === oct) {
                if (oldfreq > freq) speed = -speed;
                else if (oldfreq === freq) speed = 0;
            }
        }

        fx.ToneSlideDir = speed;
    }

    #loadInstMultiplierOPL3(channum, op, mult) {
        const reg = 0x20 + OpOffsets3[channum][op];
        this.#setOPL3(reg, (this.#getOPL3(reg) & 0xF0) | (mult & 15));
    }

    #loadInstVolumeOPL3(channum, op, vol) {
        const reg = 0x40 + OpOffsets3[channum][op];
        this.#setOPL3(reg, (this.#getOPL3(reg) & 0xC0) | ((vol & 0x3F) ^ 0x3F));
    }

    #loadInstFeedbackOPL3(channum, which, fb) {
        if (which === 0) {
            const reg = 0xC0 + Chn2Offsets3[channum];
            this.#setOPL3(reg, (this.#getOPL3(reg) & 0x31) | ((fb & 7) << 1));
        } else if (which === 1) {
            const reg = 0xC0 + ChanOffsets3[channum];
            this.#setOPL3(reg, (this.#getOPL3(reg) & 0x31) | ((fb & 7) << 1));
        }
    }

    #portamento(channum, fx, amount, toneslide) {
        const chan = this.#Channels[channum];

        let freq = chan.CurrFreq;
        let oct = chan.CurrOctave;

        freq = (freq + amount) & 0xFFFF;

        if (freq < 0x156) {
            if (oct > 0) {
                oct--;
                freq += 0x2AE - 0x156;
            } else {
                freq = 0x156;
            }
        } else if (freq > 0x2AE) {
            if (oct < 7) {
                oct++;
                freq -= 0x2AE - 0x156;
            } else {
                freq = 0x2AE;
            }
        }

        if (toneslide) {
            if (amount >= 0) {
                if (oct > fx.ToneSlideOct || (oct === fx.ToneSlideOct && freq >= fx.ToneSlideFreq)) {
                    freq = fx.ToneSlideFreq;
                    oct = fx.ToneSlideOct;
                }
            } else {
                if (oct < fx.ToneSlideOct || (oct === fx.ToneSlideOct && freq <= fx.ToneSlideFreq)) {
                    freq = fx.ToneSlideFreq;
                    oct = fx.ToneSlideOct;
                }
            }
        }

        chan.CurrFreq = freq;
        chan.CurrOctave = oct;

        // Apply detunes
        let frq2 = (freq - chan.DetuneB) & 0xFFFF;
        freq = (freq + chan.DetuneA) & 0xFFFF;

        let chanOffset = this.#UseOPL3 ? Chn2Offsets3[channum] : channum;
        this.#setOPL3(0xA0 + chanOffset, freq & 0xFF);
        this.#setOPL3(0xB0 + chanOffset, ((freq >> 8) & 3) | (oct << 2) | (this.#getOPL3(0xB0 + chanOffset) & 0xE0));

        if (this.#UseOPL3) {
            chanOffset = ChanOffsets3[channum];
            this.#setOPL3(0xA0 + chanOffset, frq2 & 0xFF);
            this.#setOPL3(0xB0 + chanOffset, ((frq2 >> 8) & 3) | (oct << 2) | (this.#getOPL3(0xB0 + chanOffset) & 0xE0));
        }
    }

    // Transpose the note produced by unpackNote().
    // Note: RAD's legacy tuning puts middle C at octave 3, note 12.
    #transpose(note, octave) {
        if (this.#NoteNum >= 1 && this.#NoteNum <= 12) {
            const toct = octave - 3;
            if (toct !== 0) {
                this.#OctaveNum += toct;
                if (this.#OctaveNum < 0) this.#OctaveNum = 0;
                else if (this.#OctaveNum > 7) this.#OctaveNum = 7;
            }

            const tnot = note - 12;
            if (tnot !== 0) {
                this.#NoteNum += tnot;
                if (this.#NoteNum < 1) {
                    this.#NoteNum += 12;
                    if (this.#OctaveNum > 0) this.#OctaveNum--;
                    else this.#NoteNum = 1;
                }
            }
        }
    }
}
