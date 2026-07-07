import { VGA_FONT, VGA_FONT_W, VGA_FONT_H } from './vga-font';

export const CHAR_W = VGA_FONT_W;
export const CHAR_H = VGA_FONT_H;

const ATLAS_COLS = 16;
const ATLAS_W = ATLAS_COLS * CHAR_W;
const ATLAS_H = ATLAS_COLS * CHAR_H;

export const PALETTE = [
  '#000000', '#0000AA', '#00AA00', '#00AAAA',
  '#AA0000', '#AA00AA', '#AA5500', '#AAAAAA',
  '#555555', '#5555FF', '#55FF55', '#55FFFF',
  '#FF5555', '#FF55FF', '#FFFF55', '#FFFFFF',
];

export const COLOR = {
  BLACK: 0, BLUE: 1, GREEN: 2, CYAN: 3,
  RED: 4, MAGENTA: 5, BROWN: 6, LIGHTGREY: 7,
  DARKGREY: 8, LIGHTBLUE: 9, LIGHTGREEN: 10, LIGHTCYAN: 11,
  LIGHTRED: 12, LIGHTMAGENTA: 13, YELLOW: 14, WHITE: 15,
} as const;

let fontAtlases: HTMLCanvasElement[] = [];

function buildFontAtlases() {
  if (fontAtlases.length > 0) return;
  for (let c = 0; c < 16; c++) {
    const cvs = document.createElement('canvas');
    cvs.width = ATLAS_W;
    cvs.height = ATLAS_H;
    const ctx = cvs.getContext('2d')!;
    const img = ctx.createImageData(ATLAS_W, ATLAS_H);
    const px = img.data;

    const hex = PALETTE[c].slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    for (let glyph = 0; glyph < 256; glyph++) {
      const gx = (glyph % ATLAS_COLS) * CHAR_W;
      const gy = (glyph / ATLAS_COLS | 0) * CHAR_H;
      const off = glyph * CHAR_H;
      for (let row = 0; row < CHAR_H; row++) {
        const bits = VGA_FONT[off + row];
        const base = ((gy + row) * ATLAS_W + gx) * 4;
        for (let col = 0; col < CHAR_W; col++) {
          if (bits & (0x80 >> col)) {
            const i = base + col * 4;
            px[i] = r;
            px[i + 1] = g;
            px[i + 2] = b;
            px[i + 3] = 255;
          }
        }
      }
    }
    ctx.putImageData(img, 0, 0);
    fontAtlases.push(cvs);
  }
}

export class TextBuffer {
  chars: Uint8Array;
  attrs: Uint8Array;
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.chars = new Uint8Array(width * height);
    this.attrs = new Uint8Array(width * height);
    this.clear();
  }

  clear() {
    this.chars.fill(0x20);
    this.attrs.fill(0x07);
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  setCell(x: number, y: number, char: number, fg: number, bg: number = 0) {
    if (!this.inBounds(x, y)) return;
    const idx = y * this.width + x;
    this.chars[idx] = char;
    this.attrs[idx] = (bg << 4) | fg;
  }

  getCell(x: number, y: number): { char: number; fg: number; bg: number } {
    if (!this.inBounds(x, y)) return { char: 0x20, fg: 7, bg: 0 };
    const idx = y * this.width + x;
    const attr = this.attrs[idx];
    return { char: this.chars[idx], fg: attr & 0x0F, bg: (attr >> 4) & 0x0F };
  }

  drawChar(x: number, y: number, char: number, fg: number, bg: number = 0) {
    this.setCell(x, y, char, fg, bg);
  }

  drawString(x: number, y: number, str: string, fg: number, bg: number = 0) {
    for (let i = 0; i < str.length; i++) {
      this.drawChar(x + i, y, str.charCodeAt(i), fg, bg);
    }
  }

  drawStringFromCodes(x: number, y: number, codes: number[], fg: number, bg: number = 0) {
    for (let i = 0; i < codes.length; i++) {
      this.drawChar(x + i, y, codes[i], fg, bg);
    }
  }

  fillRect(x: number, y: number, w: number, h: number, char: number, fg: number, bg: number = 0) {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        this.drawChar(x + dx, y + dy, char, fg, bg);
      }
    }
  }

  drawHLine(x: number, y: number, len: number, char: number, fg: number, bg: number = 0) {
    for (let i = 0; i < len; i++) {
      this.drawChar(x + i, y, char, fg, bg);
    }
  }

  drawVLine(x: number, y: number, len: number, char: number, fg: number, bg: number = 0) {
    for (let i = 0; i < len; i++) {
      this.drawChar(x, y + i, char, fg, bg);
    }
  }

  drawBox(x: number, y: number, w: number, h: number, fg: number, bg: number = 0, double: boolean = false) {
    const tl = double ? 0xC9 : 0xDA;
    const tr = double ? 0xBB : 0xBF;
    const bl = double ? 0xC8 : 0xC0;
    const br = double ? 0xD9 : 0xD9;
    const hLine = double ? 0xCD : 0xC4;
    const vLine = double ? 0xBA : 0xB3;

    this.drawChar(x, y, tl, fg, bg);
    this.drawChar(x + w - 1, y, tr, fg, bg);
    this.drawChar(x, y + h - 1, bl, fg, bg);
    this.drawChar(x + w - 1, y + h - 1, br, fg, bg);

    this.drawHLine(x + 1, y, w - 2, hLine, fg, bg);
    this.drawHLine(x + 1, y + h - 1, w - 2, hLine, fg, bg);
    this.drawVLine(x, y + 1, h - 2, vLine, fg, bg);
    this.drawVLine(x + w - 1, y + 1, h - 2, vLine, fg, bg);
  }

  drawLevelBar(x: number, y: number, level: number, maxH: number, fg: number, bg: number = 0) {
    const blocks = [0x20, 0xB0, 0xB1, 0xB2, 0xDB];
    const filled = Math.max(0, Math.min(maxH, level));
    const empty = maxH - filled;

    for (let row = 0; row < empty; row++) {
      this.drawChar(x, y + row, 0x20, fg, bg);
    }
    for (let row = 0; row < filled; row++) {
      const intensity = Math.min(4, Math.floor((row / maxH) * 5) + 1);
      this.drawChar(x, y + empty + row, blocks[intensity], fg, bg);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    buildFontAtlases();

    const canvasW = this.width * CHAR_W;
    const canvasH = this.height * CHAR_H;
    ctx.clearRect(0, 0, canvasW, canvasH);

    for (let cy = 0; cy < this.height; cy++) {
      for (let cx = 0; cx < this.width; cx++) {
        const idx = cy * this.width + cx;
        const charCode = this.chars[idx];
        const attr = this.attrs[idx];
        const fg = attr & 0x0F;
        const bg = (attr >> 4) & 0x0F;

        const px = cx * CHAR_W;
        const py = cy * CHAR_H;
        const srcX = (charCode % ATLAS_COLS) * CHAR_W;
        const srcY = (charCode / ATLAS_COLS | 0) * CHAR_H;

        ctx.fillStyle = PALETTE[bg];
        ctx.fillRect(px, py, CHAR_W, CHAR_H);

        if (charCode !== 0x20) {
          ctx.drawImage(fontAtlases[fg], srcX, srcY, CHAR_W, CHAR_H, px, py, CHAR_W, CHAR_H);
        }
      }
    }
  }
}
