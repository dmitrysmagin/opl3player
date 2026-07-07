// @ts-nocheck
//
// Decompression algorithms for A2M/A2T modules, adapted from AdPlug.
// Ported from: sixdepack.cpp, unlzw.c, unlzss.c, unlzh.c, depack.c

// ========================================================================
//  1. Sixpack (adaptive Huffman-like tree, based on sixpack.c by Philip G. Gage)
// ========================================================================

const SIX_COPYRANGES = 6;
const SIX_MINCOPY = 3;
const SIX_MAXCOPY = 255;
const SIX_CODESPERRANGE = SIX_MAXCOPY - SIX_MINCOPY + 1; // 253
const SIX_ROOT = 1;
const SIX_TERMINATE = 256;
const SIX_FIRSTCODE = 257;
const SIX_MAXCHAR = SIX_FIRSTCODE + SIX_COPYRANGES * SIX_CODESPERRANGE - 1; // 1775
const SIX_SUCCMAX = SIX_MAXCHAR + 1; // 1776
const SIX_TWICEMAX = 2 * SIX_MAXCHAR + 1; // 3551
const SIX_MAXFREQ = 2000;

function sixpack_bitvalue(bit: number): number {
    return 1 << bit;
}

function sixpack_copybits(range: number): number {
    return 2 * range + 4; // 4, 6, 8, 10, 12, 14
}

function sixpack_copymin(range: number): number {
    const table = [0, 16, 80, 336, 1360, 5456];
    return table[range];
}

interface SixpackState {
    leftc: Uint16Array;
    rghtc: Uint16Array;
    dad: Uint16Array;
    freq: Uint16Array;
    ibitcount: number;
    ibitbuffer: number;
    ibufcount: number;
    wdbuf: Uint16Array;
    input_size: number;
    obuf: Uint8Array;
    output_size: number;
    obufcount: number;
}

function sixpack_inittree(st: SixpackState): void {
    for (let i = 2; i <= SIX_TWICEMAX; i++) {
        st.dad[i] = i / 2 | 0;
        st.freq[i] = 1;
    }
    for (let i = 1; i <= SIX_MAXCHAR; i++) {
        st.leftc[i] = 2 * i;
        st.rghtc[i] = 2 * i + 1;
    }
}

function sixpack_updatefreq(st: SixpackState, a: number, b: number): void {
    for (;;) {
        st.freq[st.dad[a]] = st.freq[a] + st.freq[b];
        a = st.dad[a];
        if (a === SIX_ROOT) break;
        if (st.leftc[st.dad[a]] === a)
            b = st.rghtc[st.dad[a]];
        else
            b = st.leftc[st.dad[a]];
    }
    if (st.freq[SIX_ROOT] === SIX_MAXFREQ) {
        for (let i = 1; i <= SIX_TWICEMAX; i++)
            st.freq[i] >>= 1;
    }
}

function sixpack_updatemodel(st: SixpackState, code: number): void {
    let a = code + SIX_SUCCMAX;
    let b: number, c: number;
    let code1: number, code2: number;

    st.freq[a]++;
    if (st.dad[a] !== SIX_ROOT) {
        code1 = st.dad[a];
        if (st.leftc[code1] === a)
            sixpack_updatefreq(st, a, st.rghtc[code1]);
        else
            sixpack_updatefreq(st, a, st.leftc[code1]);

        do {
            code2 = st.dad[code1];
            if (st.leftc[code2] === code1)
                b = st.rghtc[code2];
            else
                b = st.leftc[code2];

            if (st.freq[a] > st.freq[b]) {
                if (st.leftc[code2] === code1)
                    st.rghtc[code2] = a;
                else
                    st.leftc[code2] = a;

                if (st.leftc[code1] === a) {
                    st.leftc[code1] = b;
                    c = st.rghtc[code1];
                } else {
                    st.rghtc[code1] = b;
                    c = st.leftc[code1];
                }

                st.dad[b] = code1;
                st.dad[a] = code2;
                sixpack_updatefreq(st, b, c);
                a = b;
            }

            a = st.dad[a];
            code1 = st.dad[a];
        } while (code1 !== SIX_ROOT);
    }
}

function sixpack_inputcode(st: SixpackState, bits: number): number {
    let code = 0;
    for (let i = 1; i <= bits; i++) {
        if (!st.ibitcount) {
            if (st.ibufcount >= st.input_size) return 0;
            st.ibitbuffer = st.wdbuf[st.ibufcount];
            st.ibufcount++;
            st.ibitcount = 15;
        } else {
            st.ibitcount--;
        }
        if (st.ibitbuffer & 0x8000)
            code |= sixpack_bitvalue(i - 1);
        st.ibitbuffer = (st.ibitbuffer << 1) & 0xFFFF;
    }
    return code;
}

function sixpack_uncompress(st: SixpackState): number {
    let a = 1;
    do {
        if (!st.ibitcount) {
            if (st.ibufcount >= st.input_size) return SIX_TERMINATE;
            st.ibitbuffer = st.wdbuf[st.ibufcount];
            st.ibufcount++;
            st.ibitcount = 15;
        } else {
            st.ibitcount--;
        }
        if (st.ibitbuffer & 0x8000)
            a = st.rghtc[a];
        else
            a = st.leftc[a];
        st.ibitbuffer = (st.ibitbuffer << 1) & 0xFFFF;
    } while (a <= SIX_MAXCHAR);

    a -= SIX_SUCCMAX;
    sixpack_updatemodel(st, a);
    return a;
}

function sixpack_do_decode(st: SixpackState): number {
    st.ibufcount = 0;
    st.ibitcount = 0;
    st.ibitbuffer = 0;
    st.obufcount = 0;

    sixpack_inittree(st);

    for (;;) {
        const c = sixpack_uncompress(st);
        if (c === SIX_TERMINATE) {
            return st.obufcount;
        } else if (c < 256) {
            if (st.obufcount >= st.output_size) return st.output_size;
            st.obuf[st.obufcount++] = c;
        } else {
            const t = c - SIX_FIRSTCODE;
            const index = (t / SIX_CODESPERRANGE) | 0;
            const len = t + SIX_MINCOPY - index * SIX_CODESPERRANGE;
            const dist = sixpack_inputcode(st, sixpack_copybits(index)) + sixpack_copymin(index) + len;

            for (let i = 0; i < len; i++) {
                if (st.obufcount >= st.output_size) return st.output_size;
                st.obuf[st.obufcount] = dist > st.obufcount ? 0 : st.obuf[st.obufcount - dist];
                st.obufcount++;
            }
        }
    }
}

export function sixpack_decode(source: Uint8Array, srcbytes: number, dest: Uint8Array, dstbytes: number): number {
    if (srcbytes < 2 || srcbytes > 42 * 1024 - 4096 || dstbytes < 1) return 0;
    if (dstbytes > 42 * 1024) dstbytes = 42 * 1024;

    // A Uint16Array view requires a 2-byte-aligned byteOffset; callers pass
    // subarrays at arbitrary (often odd) offsets, so copy to an aligned buffer
    // when needed. C++ casts char* -> unsigned short* freely (no such constraint).
    const nwords = srcbytes >> 1;
    let wdbuf: Uint16Array;
    if ((source.byteOffset & 1) === 0) {
        wdbuf = new Uint16Array(source.buffer, source.byteOffset, nwords);
    } else {
        const aligned = source.slice(0, nwords << 1);
        wdbuf = new Uint16Array(aligned.buffer, aligned.byteOffset, nwords);
    }

    const st: SixpackState = {
        leftc: new Uint16Array(SIX_MAXCHAR + 1),
        rghtc: new Uint16Array(SIX_MAXCHAR + 1),
        dad: new Uint16Array(SIX_TWICEMAX + 1),
        freq: new Uint16Array(SIX_TWICEMAX + 1),
        ibitcount: 0,
        ibitbuffer: 0,
        ibufcount: 0,
        wdbuf,
        input_size: srcbytes >> 1,
        obuf: dest,
        output_size: dstbytes,
        obufcount: 0,
    };

    return sixpack_do_decode(st);
}


// ========================================================================
//  2. LZW (Adlib Tracker II variant)
// ========================================================================

export function lzw_decompress(source: Uint8Array, dest: Uint8Array, srcsize: number, dstsize: number): number {
    let bitshift = 9;
    let prevbitstring = 0;
    const bitmask = [0x1ff, 0x3ff, 0x7ff, 0xfff, 0x1fff];

    const stack = new Uint8Array(65536);
    const work_ptr = new Uint8Array(65536);

    let sp = 65536 - 1;
    let stringlength = 0;
    let le70 = 0x102;
    let le74 = 0x200;
    let output_idx = 0;
    let le6a = 0, le6c = 0, le6e = 0, le76 = 0, le77 = 0;

    function nextcode(): number {
        const input_idx = prevbitstring >>> 3;
        const bitstring = (source[input_idx] | (source[input_idx + 1] << 8) | (source[input_idx + 2] << 16)) >>> 0;
        const result = (bitstring >>> (prevbitstring & 7)) & bitmask[bitshift - 9];
        prevbitstring = (prevbitstring + bitshift) >>> 0;
        return result;
    }

    for (;;) {
        let code = nextcode();
        if (code === 0x101) break;

        if (code === 0x100) {
            bitshift = 9;
            le74 = 0x200;
            le70 = 0x102;
            code = nextcode();
            le6a = code;
            le6c = code;
            le77 = code;
            le76 = code;
            if (output_idx >= dstsize) break;
            dest[output_idx++] = code;
            continue;
        }

        le6a = code;
        le6e = code;

        if (code >= le70) {
            code = le6c;
            le6a = code;
            code = ((code & 0xff00) + le76) & 0xFFFF;
            sp--;
            stack[sp] = code;
            stringlength++;
        }

        while (le6a > 0xff) {
            const idx = le6a * 3;
            code = ((code & 0xff00) + work_ptr[idx + 2]) & 0xFFFF;
            sp--;
            stack[sp] = code;
            stringlength++;
            code = (work_ptr[idx] | (work_ptr[idx + 1] << 8)) >>> 0;
            le6a = code;
        }

        code = le6a;
        le76 = code;
        le77 = code;
        sp--;
        stack[sp] = code;
        stringlength++;

        while (stringlength--) {
            if (output_idx >= dstsize) break;
            dest[output_idx++] = stack[sp++];
        }

        stringlength = 0;

        const idx = le70 * 3;
        work_ptr[idx] = le6c & 0xff;
        work_ptr[idx + 1] = (le6c >>> 8) & 0xff;
        work_ptr[idx + 2] = le77;
        le70 = (le70 + 1) & 0xFFFF;

        code = le6e;
        le6c = code;

        if (le70 >= le74 && bitshift < 14) {
            bitshift++;
            le74 = (le74 << 1) & 0xFFFF;
        }
    }

    return output_idx;
}


// ========================================================================
//  3. LZSS (Adlib Tracker II variant)
// ========================================================================

const LZSS_N_BITS = 12;
const LZSS_F_BITS = 4;
const LZSS_THRESHOLD = 2;
const LZSS_N = 1 << LZSS_N_BITS;         // 4096
const LZSS_F = (1 << LZSS_F_BITS) + LZSS_THRESHOLD; // 18

export function lzss_decompress(source: Uint8Array, dest: Uint8Array, srcsize: number, dstsize: number): number {
    let input_idx = 0;
    let dx = 0;
    let edi = LZSS_N - LZSS_F;

    const work_ptr = new Uint8Array(65536);
    let output_size = 0;

    for (;;) {
        dx = dx >> 1;
        if (!(dx >> 8)) {
            if (input_idx >= srcsize) break;
            dx = 0xff00 | source[input_idx++];
        }

        if (dx & 1) {
            if (input_idx >= srcsize) break;
            const code = source[input_idx++];
            work_ptr[edi] = code;
            edi = (edi + 1) & (LZSS_N - 1);
            if (output_size >= dstsize) break;
            dest[output_size++] = code;
        } else {
            if (input_idx >= srcsize) break;
            const prevcode = source[input_idx++];
            if (input_idx >= srcsize) break;
            const code = source[input_idx++];
            let ebx = ((code << 4) & 0xff00) | prevcode;
            let length = (code & 0x0f) + LZSS_THRESHOLD + 1;

            do {
                if (output_size >= dstsize) break;
                dest[output_size++] = work_ptr[edi] = work_ptr[ebx];
                ebx = (ebx + 1) & (LZSS_N - 1);
                edi = (edi + 1) & (LZSS_N - 1);
            } while (--length > 0);
        }
    }

    return output_size;
}

// ========================================================================
//  4. LZH (SCO compress -H format, Haruhiko Okumura)
// ========================================================================

export class LZHDecoder {
    private DIC_SIZE = 1 << 14; // 16384
    private NC = 255 + 256 + 2 - 2; // 511
    private CBIT = 16;
    private CODE_BIT = 16;
    private NP = 14 + 1; // 15
    private NT = 16 + 3; // 19
    private PBIT = 14;
    private TBIT = 15;
    private NPT = 1 << 15; // 32768

    private left: Uint16Array;
    private right: Uint16Array;
    private c_len: Uint8Array;
    private pt_len: Uint8Array;
    private blocksize: number = 0;
    private pt_table: Uint16Array;
    private c_table: Uint16Array;

    private bitbuf: number = 0;
    private subbitbuf: number = 0;
    private bitcount: number = 0;

    private input_buffer: Uint8Array;
    private input_idx: number = 0;
    private input_size: number;
    private output_buffer: Uint8Array;
    private output_idx: number = 0;

    constructor() {
        this.left = new Uint16Array(2 * this.NC - 1);
        this.right = new Uint16Array(2 * this.NC - 1);
        this.c_len = new Uint8Array(this.NC);
        this.pt_len = new Uint8Array(this.NPT);
        this.pt_table = new Uint16Array(256);
        this.c_table = new Uint16Array(4096);
    }

    decompress(source: Uint8Array, srcsize: number, dest: Uint8Array, dstsize: number): number {
        this.input_buffer = source;
        this.input_idx = 0;
        this.input_size = srcsize;
        this.output_buffer = dest;
        this.output_idx = 0;

        const ultra = source[this.input_idx++] & 1;

        const size_unpacked = source[this.input_idx] |
            (source[this.input_idx + 1] << 8) |
            (source[this.input_idx + 2] << 16) |
            (source[this.input_idx + 3] << 24);
        this.input_idx += 4;

        if (ultra) {
            // using default DIC_SIZE
        }

        const ptr = new Uint8Array(this.DIC_SIZE);
        this.decode_start();

        let size = size_unpacked;
        while (size > 0 && dstsize > 0) {
            const size_temp = Math.min(size, this.DIC_SIZE);

            this.decode(size_temp, ptr);
            const toCopy = Math.min(dstsize, size_temp);
            dest.set(ptr.subarray(0, toCopy), this.output_idx);
            this.output_idx += toCopy;
            dstsize -= toCopy;
            size -= size_temp;
        }

        return size_unpacked;
    }

    private try_byte(): number {
        if (this.input_idx < this.input_size)
            return this.input_buffer[this.input_idx++];
        return 0;
    }

    private write_buf(ptr: Uint8Array, size: number): void {
        this.output_buffer.set(ptr.subarray(0, size), this.output_idx);
        this.output_idx += size;
    }

    private fillbuf(n: number): void {
        this.bitbuf = (this.bitbuf << n) & 0xFFFF;
        while (n > this.bitcount) {
            n -= this.bitcount;
            this.bitbuf = (this.bitbuf | (this.subbitbuf << n)) & 0xFFFF;
            this.subbitbuf = this.try_byte();
            this.bitcount = 8;
        }
        this.bitcount -= n;
        this.bitbuf = (this.bitbuf | (this.subbitbuf >> this.bitcount)) & 0xFFFF;
    }

    private getbits(n: number): number {
        const x = this.bitbuf >> (16 - n);
        this.fillbuf(n);
        return x;
    }

    private init_getbits(): void {
        this.bitbuf = 0;
        this.subbitbuf = 0;
        this.bitcount = 0;
        this.fillbuf(16);
    }

    // pointer helper: { arr: Uint16Array, idx: number }
    private mkptr(arr: Uint16Array, idx: number): { arr: Uint16Array; idx: number } {
        return { arr, idx };
    }
    private ptrVal(p: { arr: Uint16Array; idx: number }): number {
        return p.arr[p.idx];
    }
    private ptrSet(p: { arr: Uint16Array; idx: number }, v: number): void {
        p.arr[p.idx] = v;
    }

    private make_table(nchar: number, bitlen: Uint8Array, tablebits: number, table: Uint16Array): void {
        const count = new Array(17).fill(0);
        const weight = new Array(17).fill(0);
        const start = new Array(18).fill(0);

        for (let i = 1; i <= 16; i++) count[i] = 0;
        for (let i = 0; i < nchar; i++) count[bitlen[i]]++;

        start[1] = 0;
        for (let i = 1; i <= 16; i++)
            start[i + 1] = (start[i] + (count[i] << (16 - i))) & 0xFFFF;

        const jutbits = 16 - tablebits;
        for (let i = 1; i <= tablebits; i++) {
            start[i] >>= jutbits;
            weight[i] = 1 << (tablebits - i);
        }
        for (let i = tablebits + 1; i <= 16; i++)
            weight[i] = 1 << (16 - i);

        let i = start[tablebits + 1] >> jutbits;
        if (i !== 0) {
            const k = 1 << tablebits;
            while (i !== k) table[i++] = 0;
        }

        let avail = nchar;
        const mask = 1 << (15 - tablebits);
        for (let ch = 0; ch < nchar; ch++) {
            const len = bitlen[ch];
            if (len === 0) continue;
            let nextcode = start[len] + weight[len];
            if (len <= tablebits) {
                for (let j = start[len]; j < nextcode; j++) table[j] = ch;
            } else {
                let k = start[len];
                let p = this.mkptr(table, k >> jutbits);
                let remaining = len - tablebits;
                while (remaining !== 0) {
                    if (this.ptrVal(p) === 0) {
                        this.right[avail] = 0;
                        this.left[avail] = 0;
                        this.ptrSet(p, avail++);
                    }
                    if (k & mask)
                        p = this.mkptr(this.right, this.ptrVal(p));
                    else
                        p = this.mkptr(this.left, this.ptrVal(p));
                    k = (k << 1) & 0xFFFF;
                    remaining--;
                }
                this.ptrSet(p, ch);
            }
            start[len] = nextcode;
        }
    }

    private read_pt_len(nn: number, nbit: number, i_special: number): void {
        const n = this.getbits(nbit);
        if (n === 0) {
            const c = this.getbits(nbit);
            for (let i = 0; i < nn; i++) this.pt_len[i] = 0;
            for (let i = 0; i < 256; i++) this.pt_table[i] = c;
        } else {
            let i = 0;
            while (i < n) {
                let c = this.bitbuf >> (16 - 3);
                if (c === 7) {
                    let mask = 1 << (16 - 1 - 3);
                    while (mask & this.bitbuf) { mask >>= 1; c++; }
                }
                this.fillbuf(c < 7 ? 3 : c - 3);
                this.pt_len[i++] = c;
                if (i === i_special) {
                    c = this.getbits(2);
                    while (--c >= 0) this.pt_len[i++] = 0;
                }
            }
            while (i < nn) this.pt_len[i++] = 0;
            this.make_table(nn, this.pt_len, 8, this.pt_table);
        }
    }

    private read_c_len(): void {
        const n = this.getbits(this.CBIT);
        if (n === 0) {
            const c = this.getbits(this.CBIT);
            for (let i = 0; i < this.NC; i++) this.c_len[i] = 0;
            for (let i = 0; i < 4096; i++) this.c_table[i] = c;
        } else {
            let i = 0;
            while (i < n) {
                let c = this.pt_table[this.bitbuf >> (16 - 8)];
                if (c >= this.NT) {
                    let mask = 1 << (16 - 1 - 8);
                    do {
                        if (this.bitbuf & mask) c = this.right[c];
                        else c = this.left[c];
                        mask >>= 1;
                    } while (c >= this.NT);
                }
                this.fillbuf(this.pt_len[c]);
                if (c <= 2) {
                    if (c === 0) c = 1;
                    else if (c === 1) c = this.getbits(4) + 3;
                    else c = this.getbits(this.CBIT) + 20;
                    while (--c >= 0) this.c_len[i++] = 0;
                } else {
                    this.c_len[i++] = c - 2;
                }
            }
            while (i < this.NC) this.c_len[i++] = 0;
            this.make_table(this.NC, this.c_len, 12, this.c_table);
        }
    }

    private decode_c(): number {
        if (this.blocksize === 0) {
            this.blocksize = this.getbits(16);
            if (this.blocksize === 0) return this.NC;
            this.read_pt_len(this.NT, this.TBIT, 3);
            this.read_c_len();
            this.read_pt_len(this.NP, this.PBIT, -1);
        }
        this.blocksize--;
        let j = this.c_table[this.bitbuf >> (16 - 12)];
        if (j >= this.NC) {
            let mask = 1 << (16 - 1 - 12);
            do {
                if (this.bitbuf & mask) j = this.right[j];
                else j = this.left[j];
                mask >>= 1;
            } while (j >= this.NC);
        }
        this.fillbuf(this.c_len[j]);
        return j;
    }

    private decode_p(): number {
        let j = this.pt_table[this.bitbuf >> (16 - 8)];
        if (j >= this.NP) {
            let mask = 1 << (16 - 1 - 8);
            do {
                if (this.bitbuf & mask) j = this.right[j];
                else j = this.left[j];
                mask >>= 1;
            } while (j >= this.NP);
        }
        this.fillbuf(this.pt_len[j]);
        if (j !== 0) j = (1 << (j - 1)) + this.getbits(j - 1);
        return j;
    }

    private huf_decode_start(): void {
        this.init_getbits();
        this.blocksize = 0;
    }

    private decode_start(): void {
        this.huf_decode_start();
        this.j = 0;
        this.done = false;
    }

    private j: number = 0;
    private done: boolean = false;

    private decode(count: number, buffer: Uint8Array): number {
        let r = 0;
        let i = this.lastI;
        while (--this.j >= 0) {
            buffer[r] = buffer[i];
            i = (i + 1) & (this.DIC_SIZE - 1);
            if (++r === count) { this.lastI = i; return r; }
        }
        for (;;) {
            const c = this.decode_c();
            if (c === this.NC) {
                this.done = true;
                this.lastI = i;
                return r;
            }
            if (c <= 255) {
                buffer[r] = c;
                if (++r === count) { this.lastI = i; return r; }
            } else {
                this.j = c - (255 + 1 - 2); // UCHAR_MAX + 1 - THRESHOLD
                i = (r - this.decode_p() - 1) & (this.DIC_SIZE - 1);
                while (--this.j >= 0) {
                    buffer[r] = buffer[i];
                    i = (i + 1) & (this.DIC_SIZE - 1);
                    if (++r === count) { this.lastI = i; return r; }
                }
            }
        }
    }

    private lastI: number = 0;
}

export function lzh_decompress(source: Uint8Array, dest: Uint8Array, srcsize: number, dstsize: number): number {
    const decoder = new LZHDecoder();
    return decoder.decompress(source, srcsize, dest, dstsize);
}


// ========================================================================
//  5. aPlib (v0.26b, Joergen Ibsen)
// ========================================================================

export function ap_depack(source: Uint8Array, dest: Uint8Array, srcsize: number, dstsize: number): number {
    let src_idx = 0;
    let dst_idx = 0;
    let tag = 0;
    let bitcount = 0;
    let R0 = -1 >>> 0; // 0xFFFFFFFF

    function aP_getbit(): number {
        if (!bitcount) {
            if (src_idx >= srcsize) return 0;
            tag = source[src_idx++];
            bitcount = 7;
        } else {
            bitcount--;
        }
        const bit = (tag >> 7) & 1;
        tag = (tag << 1) & 0xFF;
        return bit;
    }

    function aP_getgamma(): number {
        let result = 1;
        do {
            result = (result << 1) + aP_getbit();
        } while (aP_getbit());
        return result;
    }

    if (!srcsize || !dstsize) return 0;
    dest[dst_idx++] = source[src_idx++];
    srcsize--;
    dstsize--;

    while (true) {
        if (aP_getbit()) {
            if (aP_getbit()) {
                if (aP_getbit()) {
                    let offs = 0;
                    for (let i = 4; i; i--)
                        offs = (offs << 1) + aP_getbit();
                    if (offs) {
                        if (!dstsize) return dst_idx;
                        if (offs > dst_idx) return dst_idx;
                        dest[dst_idx] = dest[dst_idx - offs];
                        dst_idx++;
                        dstsize--;
                    } else {
                        if (!dstsize) return dst_idx;
                        dest[dst_idx++] = 0;
                        dstsize--;
                    }
                } else {
                    if (!srcsize) return dst_idx;
                    let offs = source[src_idx++];
                    srcsize--;
                    const len = 2 + (offs & 1);
                    offs >>= 1;
                    if (offs) {
                        for (let n = len; n; n--) {
                            if (!dstsize) return dst_idx;
                            if (offs > dst_idx) return dst_idx;
                            dest[dst_idx] = dest[dst_idx - offs];
                            dst_idx++;
                            dstsize--;
                        }
                    } else {
                        return dst_idx; // done
                    }
                    R0 = offs;
                }
                } else {
                    let offs = aP_getgamma();
                    if (offs === 2) {
                        offs = R0;
                        let len = aP_getgamma();
                        for (; len; len--) {
                            if (!dstsize) return dst_idx;
                            if (offs > dst_idx) return dst_idx;
                            dest[dst_idx] = dest[dst_idx - offs];
                            dst_idx++;
                            dstsize--;
                        }
                    } else {
                        offs = (offs - 3) >>> 0;
                        offs = (offs << 8) >>> 0;
                        if (!srcsize) return dst_idx;
                        offs = (offs + source[src_idx++]) >>> 0;
                        srcsize--;

                        let len = aP_getgamma();
                        if (offs >= 32000) len++;
                        if (offs >= 1280) len++;
                        if (offs < 128) len += 2;

                        for (; len; len--) {
                            if (!dstsize) return dst_idx;
                            if (offs > dst_idx) return dst_idx;
                            dest[dst_idx] = dest[dst_idx - offs];
                            dst_idx++;
                            dstsize--;
                        }
                        R0 = offs;
                    }
                }
        } else {
            if (!srcsize || !dstsize) return dst_idx;
            dest[dst_idx++] = source[src_idx++];
            srcsize--;
            dstsize--;
        }
    }
}


// ========================================================================
//  6. Dispatch function
// ========================================================================

export function a2t_depack(ffver: number, source: Uint8Array, srcsize: number, dest: Uint8Array, dstsize: number): number {
    switch (ffver) {
        case 1:
        case 5: return sixpack_decode(source, srcsize, dest, dstsize);
        case 2:
        case 6: return lzw_decompress(source, dest, srcsize, dstsize);
        case 3:
        case 7: return lzss_decompress(source, dest, srcsize, dstsize);
        case 4:
        case 8:
            dest.set(source.subarray(0, Math.min(srcsize, dstsize)));
            return Math.min(dstsize, srcsize);
        case 9:
        case 10:
        case 11: return ap_depack(source, dest, srcsize, dstsize);
        case 12:
        case 13:
        case 14: return lzh_decompress(source, dest, srcsize, dstsize);
        default: return 0;
    }
}
