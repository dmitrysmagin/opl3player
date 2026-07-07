// @ts-nocheck
import { FormatPlayer } from "./player";

export default class IMF extends FormatPlayer {
    constructor(opl, options) {
        super(opl, options);
        this.track_name = '';
        this.game_name = '';
        this.author_name = '';
        this.remarks = '';
        this._rate = (options && options.rate) || 560;
        this.songend = false;
    }

    static probe(buffer) {
        // Check for ADLIB header first
        const header = String.fromCharCode.apply(null, buffer.slice(0, 5));
        if (header === "ADLIB") {
            return true;
        }

        const invalidRegs = [
            5, 6, 7, 9, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15,
            0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f,
            0x36, 0x37, 0x38, 0x39, 0x3a, 0x3b, 0x3c, 0x3d, 0x3e, 0x3f,
            0x56, 0x57, 0x58, 0x59, 0x5a, 0x5b, 0x5c, 0x5d, 0x5e, 0x5f,
            0x76, 0x77, 0x78, 0x79, 0x7a, 0x7b, 0x7c, 0x7d, 0x7e, 0x7f,
            0x96, 0x97, 0x98, 0x99, 0x9a, 0x9b, 0x9c, 0x9d, 0x9e, 0x9f,
            0xa9, 0xaa, 0xab, 0xac, 0xad, 0xae, 0xaf,
            0xb9, 0xba, 0xbb, 0xbc,       0xbe, 0xbf,
            0xc9, 0xca, 0xcb, 0xcc, 0xcd, 0xce, 0xcf,
            0xf6, 0xf7, 0xf8, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xff,

        ];

        const allowedVals = [ 0, 0x3f, 0xff ];

        let position = 0;
        const data = new DataView(buffer.buffer);
        let size = data.getUint16(0);

        if (!size) {
            position = 0;
            size = data.byteLength;
        } else {
            size = Math.min(size, data.byteLength);
            position = 2;
        }

        for (; position < size; position += 4) {
            var reg = data.getUint8(position);
            var value = data.getUint8(position + 1);

            if (invalidRegs.some(r => r === reg)) {
                /* Corridor 7 tunes write to non existent regs c9 and ca */
                if (reg == 0xc9 || reg == 0xca)
                    continue;

                if (!allowedVals.some(v => v === value))
                    return false;
            }
        }

        return true;
    }

    load(buffer) {
        if (!(buffer instanceof Uint8Array))
            buffer = new Uint8Array(buffer);

        this.data = buffer;
        this.track_name = '';
        this.game_name = '';
        this.author_name = '';
        this.remarks = '';

        var offset = 0;
        var headerLen = 0;

        // Parse ADLIB header if present
        var headerStr = String.fromCharCode.apply(null, buffer.slice(0, 5));
        if (headerStr === "ADLIB") {
            var version = buffer[5];
            // only version 1 supported
            if (version !== 1) {
                throw new Error('Unsupported ADLIB header version: ' + version);
            }
            // Read null-terminated track name
            var end = 6;
            while (end < buffer.length && buffer[end] !== 0) end++;
            this.track_name = String.fromCharCode.apply(null, buffer.slice(6, end));
            end++;
            // Read null-terminated game name
            var gameStart = end;
            while (end < buffer.length && buffer[end] !== 0) end++;
            this.game_name = String.fromCharCode.apply(null, buffer.slice(gameStart, end));
            end++;
            end++; // skip one more byte (padding?)
            offset = end;
            headerLen = end;
        }

        // Read size field
        var lenSize = headerLen ? 4 : 2;
        var songSize = 0;

        if (headerLen) {
            songSize = (buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16) | (buffer[offset + 3] << 24)) >>> 0;
            offset += 4;
        } else {
            songSize = buffer[offset] | (buffer[offset + 1] << 8);
            offset += 2;
        }

        // If songSize is 0, it's raw music data (no length, no footer)
        if (!songSize) {
            if (headerLen) {
                // with header: rewind to before size field, all remaining data is song data
                offset = headerLen;
                songSize = buffer.length - headerLen;
            } else {
                // raw, first word was 0, file IS the data
                offset = 0;
                songSize = buffer.length;
            }
        }

        // Validity checks
        if (headerLen + (headerLen ? 4 : 2) > buffer.length) {
            throw new Error('IMF file too short for header');
        }
        if (songSize & 3) {
            throw new Error('IMF song data size not multiple of 4');
        }
        if (songSize > buffer.length - offset && songSize !== buffer.length + 2 - offset) {
            throw new Error('Truncated IMF song data');
        }

        // Clamp song size
        if (songSize > buffer.length - offset) {
            songSize = buffer.length - offset;
        }

        this.dataStart = offset;   // saved so rewind() returns here, not to byte 0
        this.dataOffset = offset;
        this.dataEnd = offset + songSize;
        this.songSize = songSize;

        // Parse footer (data after song data)
        if (offset + songSize < buffer.length) {
            var footerOffset = offset + songSize;
            var footerLen = buffer.length - footerOffset;

            if (footerLen > 0) {
                var sig = buffer[footerOffset];

                if (sig === 0x1A && footerLen <= 1 + 3 * 256 + 9) {
                    // Adam Nielsen's footer format
                    var pos = footerOffset + 1;
                    var strEnd = pos;
                    while (strEnd < buffer.length && buffer[strEnd] !== 0) strEnd++;
                    this.track_name = String.fromCharCode.apply(null, buffer.slice(pos, strEnd));
                    pos = strEnd + 1;
                    strEnd = pos;
                    while (strEnd < buffer.length && buffer[strEnd] !== 0) strEnd++;
                    this.author_name = String.fromCharCode.apply(null, buffer.slice(pos, strEnd));
                    pos = strEnd + 1;
                    strEnd = pos;
                    while (strEnd < buffer.length && buffer[strEnd] !== 0) strEnd++;
                    this.remarks = String.fromCharCode.apply(null, buffer.slice(pos, strEnd));
                } else if (footerLen === 88 && !buffer[footerOffset + 17] && !buffer[footerOffset + 81] && !this.track_name) {
                    // Muse tag format
                    this.track_name = String.fromCharCode.apply(null, buffer.slice(footerOffset + 2, footerOffset + 18));
                    this.remarks = String.fromCharCode.apply(null, buffer.slice(footerOffset + 18, footerOffset + 82));
                } else {
                    // Generic text footer
                    this.remarks = String.fromCharCode.apply(null, buffer.slice(footerOffset, buffer.length));
                }
            }
        }

        return true;
    }

    update(): boolean {
        this.delay = 0;
        while (!this.delay && this.dataOffset < this.dataEnd) {
            try {
                var reg = this.data[this.dataOffset++];
                var value = this.data[this.dataOffset++];
                this.delay = this.data[this.dataOffset] | (this.data[this.dataOffset + 1] << 8);
                this.dataOffset += 2;

                this.midi_write_adlib(reg, value);
                if (this.delay) return true;
            } catch (err) {
                break;
            }
        }

        // Song has ended — rewind for seamless loop and signal end to caller
        this.rewind();
        return false;
    }

    rewind() {
        this.dataOffset = this.dataStart ?? 0;  // restart at song data, not file byte 0
        this.delay = 0;
        this.songend = false;
        this.opl.init();
        this.opl.write(0, 0x01, 0x20);  // enable waveform select (OPL2 WSE)
    }

    getrefresh() {
        return this._rate / (this.delay || 1);
    }

    gettype() {
        return "Apogee IMF";
    }

    gettitle() {
        if (this.game_name) return this.track_name ? this.track_name + ' - ' + this.game_name : this.game_name;
        return this.track_name;
    }

    getauthor() {
        return this.author_name;
    }

    getdesc() {
        return this.remarks;
    }

    midi_write_adlib(r, v) {
        var a = 0;
        if (r >= 0x100) {
            a = 1;
            r -= 0x100;
        }

        this.opl.write(a, r, v);
    }
}
