<script lang="ts">
  import { onMount } from 'svelte';
  import DOMScreen from './DOMScreen.svelte';
  import { TextBuffer, COLOR } from './textbuffer';
  import { decodeOpl3State, type Opl3State, type ChannelState } from './opl3-state';

  let {
    bank0,
    bank1,
    songInfo,
    fileName,
  }: {
    bank0: Uint8Array | null;
    bank1: Uint8Array | null;
    songInfo: Record<string, any> | null;
    fileName: string | null;
  } = $props();

  const textBuffer = new TextBuffer(80, 50);
  let domScreen: DOMScreen;

  // Track peak levels with decay per channel (0-15 visible channels, not reactive)
  let channelPeaks = new Array(16).fill(0);
  const DECAY_RATE = 1; // Decay per frame
  const SUSTAIN_HOLD = true; // Keep level if sustain is on

  // Percussion-specific peak tracking (separate from melodic channels)
  let percussionPeaks = { bd: 0, sd: 0, tom: 0, cy: 0, hh: 0 };

  // Read percussion instrument volumes from OPL3 registers
  // Each percussion instrument uses a specific operator's output level (0x40-0x55)
  // Uses the bank0 prop directly (no parameter needed)
  function getPercussionVolumes(): { bd: number; sd: number; tom: number; cy: number; hh: number } {
    if (!bank0) return { bd: 0, sd: 0, tom: 0, cy: 0, hh: 0 };
    return {
      bd:  bank0[0x43] & 0x3F,  // Bass Drum (operator 14, channel 6)
      sd:  bank0[0x41] & 0x3F,  // Snare Drum (operator 11, channel 7)
      tom: bank0[0x42] & 0x3F,  // Tom Tom (operator 12, channel 7)
      cy:  bank0[0x44] & 0x3F,  // Top Cymbal (operator 15, channel 8)
      hh:  bank0[0x45] & 0x3F,  // Hi-Hat (operator 16, channel 8)
    };
  }

  $effect(() => {
    textBuffer.clear();
    const state = bank0 && bank1 ? decodeOpl3State(bank0, bank1) : null;
    drawTitleBar(fileName);
    if (songInfo) drawGd3Tags(songInfo);
    if (state) {
      drawChannelTable(state);
      updateAndDrawLevelBars(state);
    }
    domScreen?.flush();
  });

  // ─── Drawing constants ────────────────────────────────────────────────────

  const ALGO_FM = [
    [0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20],
    [0xDB, 0xC4, 0x10, 0xDB, 0xC4, 0x10, 0xDB],
    [0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20],
  ];
  const ALGO_AS = [
    [0xDB, 0xC4, 0xC4, 0xBF, 0x20, 0x20, 0x20],
    [0x20, 0x20, 0x20, 0xC3, 0xC4, 0x10, 0xDB],
    [0xDB, 0xC4, 0xC4, 0xD9, 0x20, 0x20, 0x20],
  ];
  const ALGO_FMFM = [
    [0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20],
    [0xDB, 0x10, 0xDB, 0x10, 0xDB, 0x10, 0xDB],
    [0x20, 0x20, 0x20, 0xDA, 0xC4, 0xC4, 0xD9],
    [0x20, 0x20, 0x20, 0xB3, 0x20, 0x20, 0x20],
    [0x20, 0x20, 0x20, 0x1F, 0x20, 0x20, 0x20],
    [0x20, 0x20, 0x20, 0xDB, 0x20, 0x20, 0x20],
    [0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20],
  ];
  const ALGO_ASFM = [
    [0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20],
    [0xDB, 0xC4, 0xC4, 0xC4, 0xBF, 0x20, 0x20],
    [0x20, 0x20, 0x20, 0x20, 0xB3, 0x20, 0x20],
    [0x20, 0x20, 0x20, 0x20, 0xC3, 0x10, 0xDB],
    [0x20, 0x20, 0x20, 0x20, 0xB3, 0x20, 0x20],
    [0xDB, 0x10, 0xDB, 0x10, 0xDB, 0x20, 0x20],
    [0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20],
  ];
  const ALGO_FMAS = [
    [0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20],
    [0xDB, 0xC4, 0x10, 0xDB, 0xBF, 0x20, 0x20],
    [0x20, 0x20, 0x20, 0x20, 0xB3, 0x20, 0x20],
    [0x20, 0x20, 0x20, 0x20, 0xC3, 0x10, 0xDB],
    [0x20, 0x20, 0x20, 0x20, 0xB3, 0x20, 0x20],
    [0xDB, 0xC4, 0x10, 0xDB, 0xD9, 0x20, 0x20],
    [0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20],
  ];
  const ALGO_ASAS = [
    [0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20],
    [0xDB, 0xC4, 0xC4, 0xC4, 0xBF, 0x20, 0x20],
    [0x20, 0x20, 0x20, 0x20, 0xB3, 0x20, 0x20],
    [0xDB, 0xC4, 0x10, 0xDB, 0xC5, 0x10, 0xDB],
    [0x20, 0x20, 0x20, 0x20, 0xB3, 0x20, 0x20],
    [0xDB, 0xC4, 0xC4, 0xC4, 0xD9, 0x20, 0x20],
    [0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20],
  ];
  const ALGO_FM_COLORS = [
    [0, 0, 0, 0, 0, 0, 0],
    [COLOR.LIGHTCYAN, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.LIGHTGREEN, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.YELLOW],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  const ALGO_AS_COLORS = [
    [COLOR.LIGHTCYAN, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.LIGHTGREY, 0, 0, 0],
    [0, 0, 0, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.YELLOW],
    [COLOR.LIGHTGREEN, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.LIGHTGREY, 0, 0, 0],
  ];
  const ALGO_4OP_COLORS_FMFM = [
    [0, 0, 0, 0, 0, 0, 0],
    [COLOR.LIGHTCYAN, COLOR.LIGHTGREY, COLOR.LIGHTGREEN, COLOR.LIGHTGREY, COLOR.YELLOW, COLOR.LIGHTGREY, 0],
    [0, 0, 0, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.LIGHTGREY],
    [0, 0, 0, COLOR.LIGHTGREY, 0, 0, 0],
    [0, 0, 0, COLOR.LIGHTGREY, 0, 0, 0],
    [0, 0, 0, COLOR.YELLOW, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  const ALGO_4OP_COLORS_ASFM = [
    [0, 0, 0, 0, 0, 0, 0],
    [COLOR.LIGHTCYAN, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.LIGHTGREY, 0, 0],
    [0, 0, 0, 0, COLOR.LIGHTGREY, 0, 0],
    [0, 0, 0, 0, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.YELLOW],
    [0, 0, 0, 0, COLOR.LIGHTGREY, 0, 0],
    [COLOR.LIGHTCYAN, COLOR.LIGHTGREY, COLOR.LIGHTGREEN, COLOR.LIGHTGREY, COLOR.YELLOW, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  const ALGO_4OP_COLORS_FMAS = [
    [0, 0, 0, 0, 0, 0, 0],
    [COLOR.LIGHTCYAN, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.LIGHTGREEN, COLOR.LIGHTGREY, 0, 0],
    [0, 0, 0, 0, COLOR.LIGHTGREY, 0, 0],
    [0, 0, 0, 0, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.YELLOW],
    [0, 0, 0, 0, COLOR.LIGHTGREY, 0, 0],
    [COLOR.LIGHTCYAN, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.LIGHTGREEN, COLOR.LIGHTGREY, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  const ALGO_4OP_COLORS_ASAS = [
    [0, 0, 0, 0, 0, 0, 0],
    [COLOR.LIGHTCYAN, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.LIGHTGREY, 0, 0],
    [0, 0, 0, 0, COLOR.LIGHTGREY, 0, 0],
    [COLOR.LIGHTCYAN, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.LIGHTGREEN, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.YELLOW],
    [0, 0, 0, 0, COLOR.LIGHTGREY, 0, 0],
    [COLOR.LIGHTGREEN, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.LIGHTGREY, COLOR.LIGHTGREY, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  const WAVE_PATTERNS = [
    [0x2F, 0x5C, 0x2F, 0x5C],
    [0x5E, 0x2D, 0x5E, 0x2D],
    [0x5E, 0x5E, 0x5E, 0x5E],
    [0x2F, 0x1C, 0x2F, 0x1C],
    [0x5E, 0x76, 0x2D, 0x2D],
    [0x5E, 0x5E, 0x2D, 0x2D],
    [0xA9, 0xAA, 0x5F, 0x5F],
    [0x2D, 0xFB, 0x5C, 0x2D],
  ];
  const FEEDBACK_GLYPHS = [
    [0x20, 0x30], [0xF6, 0x46], [0xF6, 0x38], [0xF6, 0x34],
    [0xF6, 0x32], [0xF6, 0x31], [0x78, 0x32], [0x78, 0x34],
  ];

  // Column offsets inside a 40-char channel block
  const OP = 9;   // operator params start
  const NI = 36;  // note info column
  const FB = 33;  // feedback column

  // ─── Drawing functions ────────────────────────────────────────────────────

  function drawTitleBar(name: string | null) {
    textBuffer.fillRect(0, 0, 80, 1, 0x20, COLOR.WHITE, COLOR.BLUE);
    textBuffer.drawString(1, 0, 'OPL3 Player', COLOR.YELLOW, COLOR.BLUE);
    if (name) {
      textBuffer.drawString(55, 0, 'Now playing:', COLOR.WHITE, COLOR.BLUE);
      const short = name.length > 20 ? name.slice(0, 20) : name;
      textBuffer.drawString(68, 0, short, COLOR.YELLOW, COLOR.BLUE);
    }
  }

  function drawGd3Tags(info: Record<string, any>) {
    const y = 2;
    textBuffer.drawString(0, y,     'Title:  ', COLOR.LIGHTGREY);
    textBuffer.drawString(8, y,     info.title  || 'Unknown', COLOR.LIGHTCYAN);
    textBuffer.drawString(0, y + 1, 'Artist: ', COLOR.LIGHTGREY);
    textBuffer.drawString(8, y + 1, info.author || 'Unknown', COLOR.LIGHTCYAN);
    textBuffer.drawString(0, y + 2, 'Game:   ', COLOR.LIGHTGREY);
    textBuffer.drawString(8, y + 2, info.game   || 'Unknown', COLOR.LIGHTCYAN);
    textBuffer.drawString(0, y + 3, 'Date:   ', COLOR.LIGHTGREY);
    textBuffer.drawString(8, y + 3, info.date   || 'Unknown', COLOR.LIGHTCYAN);
  }

  function drawChannelHeader(x: number, y: number, chIdx: number, is4Op: boolean) {
    textBuffer.drawChar(x, y, 0xD5, COLOR.DARKGREY);
    textBuffer.drawChar(x + 1, y, 0xCD, COLOR.DARKGREY);
    if (is4Op) {
      const pair = chIdx + 3;
      textBuffer.drawString(x + 2, y, `${String(chIdx + 1).padStart(2, '0')}+${String(pair + 1).padStart(2, '0')}`, COLOR.WHITE);
    } else {
      textBuffer.drawString(x + 2, y, `Ch.${String(chIdx + 1).padStart(2, '0')}`, COLOR.WHITE);
    }
    for (let k = 7; k < 36; k++) textBuffer.drawChar(x + k, y, 0xCD, COLOR.DARKGREY);
    if (is4Op) {
      textBuffer.drawString(x + 36, y, '4OP', COLOR.LIGHTRED);
    } else {
      for (let k = 36; k < 39; k++) textBuffer.drawChar(x + k, y, 0xCD, COLOR.DARKGREY);
    }
    textBuffer.drawChar(x + 39, y, 0xB8, COLOR.DARKGREY);
  }

  function drawOpParams(x: number, y: number, op: any, color: number) {
    const wp = WAVE_PATTERNS[op.waveform] || WAVE_PATTERNS[0];
    for (let i = 0; i < 4; i++) textBuffer.drawChar(x + OP + i, y, wp[i], color);
    textBuffer.drawChar(x + OP + 5, y, op.attackRate.toString(16).toUpperCase().charCodeAt(0), color);
    textBuffer.drawChar(x + OP + 6, y, op.decayRate.toString(16).toUpperCase().charCodeAt(0), color);
    textBuffer.drawChar(x + OP + 7, y, op.sustainLevel.toString(16).toUpperCase().charCodeAt(0), color);
    textBuffer.drawChar(x + OP + 8, y, op.releaseRate.toString(16).toUpperCase().charCodeAt(0), color);
    textBuffer.drawChar(x + OP + 10, y, op.tremolo ? 0x54 : 0x2D, op.tremolo ? COLOR.LIGHTGREY : COLOR.DARKGREY);
    textBuffer.drawChar(x + OP + 11, y, op.vibrato ? 0x56 : 0x2D, op.vibrato ? COLOR.LIGHTGREY : COLOR.DARKGREY);
    textBuffer.drawChar(x + OP + 12, y, op.sustain ? 0x53 : 0x2D, op.sustain ? COLOR.LIGHTGREY : COLOR.DARKGREY);
    textBuffer.drawChar(x + OP + 13, y, op.ksr    ? 0x4B : 0x2D, op.ksr    ? COLOR.LIGHTGREY : COLOR.DARKGREY);
    const mult = op.multiplier.toString(16).toUpperCase();
    textBuffer.drawString(x + OP + 15, y, mult.length === 1 ? ` ${mult}` : mult, color);
    const kslStr = op.ksl === 0 ? '---' : op.ksl === 1 ? '1.5' : op.ksl === 2 ? '3.0' : '6.0';
    textBuffer.drawString(x + OP + 17, y, kslStr, color);
    textBuffer.drawString(x + OP + 21, y, op.outputLevel.toString(16).toUpperCase().padStart(2, '0'), color);
  }

  function drawAlgoRow(ax: number, ay: number, ch: ChannelState, is4Op: boolean, algoRow: number, channels: ChannelState[]) {
    if (is4Op) {
      const ch2 = channels[ch.channel + 3];
      const synthType = ch.synthesisType;
      const secondSynth = ch2?.synthesisType ?? 0;
      let data: number[][], colData: number[][];
      if (synthType === 0 && secondSynth === 0)      { data = ALGO_FMFM; colData = ALGO_4OP_COLORS_FMFM; }
      else if (synthType === 1 && secondSynth === 0) { data = ALGO_ASFM; colData = ALGO_4OP_COLORS_ASFM; }
      else if (synthType === 0 && secondSynth === 1) { data = ALGO_FMAS; colData = ALGO_4OP_COLORS_FMAS; }
      else                                           { data = ALGO_ASAS; colData = ALGO_4OP_COLORS_ASAS; }
      if (algoRow >= 0 && algoRow < data.length) {
        for (let col = 0; col < 7; col++) {
          const c = data[algoRow][col];
          const color = colData[algoRow][col];
          if (c !== 0x20 || color !== 0) textBuffer.drawChar(ax + col, ay, c, color);
        }
      }
    } else {
      const data    = ch.synthesisType === 0 ? ALGO_FM       : ALGO_AS;
      const colData = ch.synthesisType === 0 ? ALGO_FM_COLORS : ALGO_AS_COLORS;
      if (algoRow >= 0 && algoRow < data.length) {
        for (let col = 0; col < 7; col++) {
          const c = data[algoRow][col];
          const color = colData[algoRow][col];
          if (c !== 0x20 || color !== 0) textBuffer.drawChar(ax + col, ay, c, color);
        }
      }
    }
  }

  function drawRowBorders(x: number, y: number, count: number) {
    for (let r = 0; r < count; r++) {
      textBuffer.drawChar(x,      y + r, 0xB3, COLOR.DARKGREY);
      textBuffer.drawChar(x + 39, y + r, 0xB3, COLOR.DARKGREY);
    }
  }

  function drawChannelTable(state: Opl3State) {
    const { channels } = state;
    const startY = 7;
    let leftY  = startY;
    let rightY = startY;

    for (let i = 0; i < 18; i++) {
      if (i >= 3  && i <= 5  && channels[i - 3]?.flag4Op) continue;
      if (i >= 12 && i <= 14 && channels[i - 3]?.flag4Op) continue;

      const ch     = channels[i];
      const isLeft = i < 9;
      const x      = isLeft ? 0 : 40;
      const y      = isLeft ? leftY : rightY;
      const is4Op  = ch?.flag4Op ?? false;

      drawChannelHeader(x, y, i, is4Op);

      if (is4Op) {
        const slave    = channels[i + 3];
        const fg       = FEEDBACK_GLYPHS[ch.feedback] || FEEDBACK_GLYPHS[0];
        const leftOn   = !!(ch.panning & 0x01);
        const rightOn  = !!(ch.panning & 0x02);
        const keyChar  = ch.keyOn ? 0x0E : 0x20;
        const keyColor = ch.keyOn ? COLOR.LIGHTMAGENTA : COLOR.DARKGREY;

        // All four operators, one per content row
        drawOpParams(x, y + 1, ch.operators[0],    COLOR.LIGHTCYAN);
        drawOpParams(x, y + 2, ch.operators[1],    COLOR.LIGHTGREEN);
        drawOpParams(x, y + 3, slave?.operators[0], COLOR.LIGHTCYAN);
        drawOpParams(x, y + 4, slave?.operators[1], COLOR.LIGHTGREEN);

        // Note info: block + freq stacked on the right
        textBuffer.drawString(x + NI, y + 1, ` ${ch.block.toString(16).toUpperCase()} `, COLOR.BROWN);
        textBuffer.drawString(x + NI, y + 2, ch.frequency.toString(16).toUpperCase().padStart(3, '0'), COLOR.YELLOW);

        // Feedback glyph + key/panning on row 3
        textBuffer.drawChar(x + FB,     y + 3, fg[0], COLOR.YELLOW);
        textBuffer.drawChar(x + FB + 1, y + 3, fg[1], COLOR.YELLOW);
        textBuffer.drawChar(x + NI,     y + 3, 0x28,    leftOn  ? COLOR.WHITE : COLOR.DARKGREY);
        textBuffer.drawChar(x + NI + 1, y + 3, keyChar, keyColor);
        textBuffer.drawChar(x + NI + 2, y + 3, 0x29,    rightOn ? COLOR.WHITE : COLOR.DARKGREY);

        // Algo diagram: skip blank row 0 and use rows 1–4 of the 7-row 4-op patterns
        drawAlgoRow(x + 1, y + 1, ch, true, 1, channels);
        drawAlgoRow(x + 1, y + 2, ch, true, 2, channels);
        drawAlgoRow(x + 1, y + 3, ch, true, 3, channels);
        drawAlgoRow(x + 1, y + 4, ch, true, 4, channels);

        drawRowBorders(x, y + 1, 4);
      } else {
        const fg       = FEEDBACK_GLYPHS[ch.feedback] || FEEDBACK_GLYPHS[0];
        const leftOn   = !!(ch.panning & 0x01);
        const rightOn  = !!(ch.panning & 0x02);
        const keyChar  = ch.keyOn ? 0x0E : 0x20;
        const keyColor = ch.keyOn ? COLOR.LIGHTMAGENTA : COLOR.DARKGREY;

        drawOpParams(x, y + 1, ch.operators[0], COLOR.LIGHTCYAN);
        textBuffer.drawString(x + NI, y + 1, ` ${ch.block.toString(16).toUpperCase()} `, COLOR.BROWN);
        drawAlgoRow(x + 1, y + 1, ch, false, 0, channels);

        textBuffer.drawChar(x + FB,     y + 2, fg[0], COLOR.YELLOW);
        textBuffer.drawChar(x + FB + 1, y + 2, fg[1], COLOR.YELLOW);
        textBuffer.drawString(x + NI, y + 2, ch.frequency.toString(16).toUpperCase().padStart(3, '0'), COLOR.YELLOW);
        drawAlgoRow(x + 1, y + 2, ch, false, 1, channels);

        drawOpParams(x, y + 3, ch.operators[1], COLOR.LIGHTGREEN);
        textBuffer.drawChar(x + NI,     y + 3, 0x28,    leftOn  ? COLOR.WHITE : COLOR.DARKGREY);
        textBuffer.drawChar(x + NI + 1, y + 3, keyChar, keyColor);
        textBuffer.drawChar(x + NI + 2, y + 3, 0x29,    rightOn ? COLOR.WHITE : COLOR.DARKGREY);
        drawAlgoRow(x + 1, y + 3, ch, false, 2, channels);

        drawRowBorders(x, y + 1, 3);
      }

      const rowHeight = is4Op ? 5 : 4;
      if (isLeft) leftY  += rowHeight;
      else        rightY += rowHeight;
    }
  }

  function updateAndDrawLevelBars(state: Opl3State) {
    const { channels, rhythmMode } = state;
    const barY = 44;
    const barH = 6;
    const barColors = [COLOR.RED, COLOR.BROWN, COLOR.YELLOW, COLOR.LIGHTGREEN, COLOR.LIGHTGREEN, COLOR.LIGHTGREEN];

    textBuffer.drawHLine(0, barY - 1, 80, 0xCD, COLOR.DARKGREY);

    let leftVisIdx  = 0;
    let rightVisIdx = 0;
    const newPeaks = [...channelPeaks];

    // Draw melodic channels (skip percussion channels 6,7,8 if rhythm mode active)
    for (let i = 0; i < 18; i++) {
      // Skip 4-op slave channels
      if (i >= 3  && i <= 5  && channels[i - 3]?.flag4Op) continue;
      if (i >= 12 && i <= 14 && channels[i - 3]?.flag4Op) continue;

      // Skip percussion channels in rhythm mode
      if (rhythmMode) {
        if (i === 6 || i === 7 || i === 8) continue; // Left bank percussion
        if (i === 15 || i === 16 || i === 17) continue; // Right bank percussion (same as 6,7,8)
      }

      const ch      = channels[i];
      const isLeft  = i < 9;
      const col     = isLeft ? 0 : 40;
      const visIdx  = isLeft ? leftVisIdx : rightVisIdx;
      const barX    = col + 7 + visIdx * 3;
      const is4Op   = ch?.flag4Op ?? false;
      const slave   = is4Op ? channels[i + 3] : null;

      // Calculate current level from operators
      const rawLevel = is4Op
        ? Math.max(ch.operators[0].outputLevel, ch.operators[1].outputLevel,
                   slave?.operators[0]?.outputLevel ?? 0, slave?.operators[1]?.outputLevel ?? 0)
        : Math.max(ch.operators[0].outputLevel, ch.operators[1].outputLevel);
      const currentLevel = ch.keyOn ? Math.round((63 - rawLevel) / 63 * barH) : 0;

      // Check if any operator has sustain enabled
      const hasSustain = is4Op
        ? (ch.operators[0].sustain || ch.operators[1].sustain ||
           slave?.operators[0]?.sustain || slave?.operators[1]?.sustain)
        : (ch.operators[0].sustain || ch.operators[1].sustain);

      // Get peak for this visible channel index
      const peakIdx = isLeft ? visIdx : visIdx + 9;
      const oldPeak = newPeaks[peakIdx] || 0;

      let newPeak: number;
      if (currentLevel > oldPeak) {
        newPeak = currentLevel;
      } else if (hasSustain) {
        newPeak = oldPeak;
      } else {
        newPeak = Math.max(0, oldPeak - DECAY_RATE);
      }

      newPeaks[peakIdx] = newPeak;
      const fill = Math.round(newPeak);

      // Draw 2-char wide bar
      for (let b = 0; b < barH; b++) {
        const chc = b < fill ? 0xDB : 0x20;
        textBuffer.drawChar(barX,     barY + (barH - 1 - b), chc, barColors[b]);
        textBuffer.drawChar(barX + 1, barY + (barH - 1 - b), chc, barColors[b]);
      }

      if (isLeft) leftVisIdx++;
      else        rightVisIdx++;
    }

    // Draw percussion bars if rhythm mode active
    if (rhythmMode && bank0) {
      const percussion = getPercussionVolumes();

      // Percussion channels go at positions 6,7,8 (left bank) - reuse those bar positions
      const percBarX = 0 + 7 + 6 * 3; // Position for channel 6

      // Bass Drum - normal 2-char width
      const bdLevel = Math.round((63 - percussion.bd) / 63 * barH);
      const oldBdPeak = percussionPeaks.bd;
      let newBdPeak: number;
      if (bdLevel > oldBdPeak) {
        newBdPeak = bdLevel;
      } else {
        newBdPeak = Math.max(0, oldBdPeak - DECAY_RATE);
      }
      percussionPeaks.bd = newBdPeak;
      const bdFill = Math.round(newBdPeak);

      // Draw BD bar (2 chars wide, at channel 6 position)
      for (let b = 0; b < barH; b++) {
        const chc = b < bdFill ? 0xDB : 0x20;
        textBuffer.drawChar(percBarX,     barY + (barH - 1 - b), chc, barColors[b]);
        textBuffer.drawChar(percBarX + 1, barY + (barH - 1 - b), chc, barColors[b]);
      }

      // Snare Drum - half width (1 char, left side of channel 7 position)
      const sdLevel = Math.round((63 - percussion.sd) / 63 * barH);
      const oldSdPeak = percussionPeaks.sd;
      let newSdPeak: number;
      if (sdLevel > oldSdPeak) {
        newSdPeak = sdLevel;
      } else {
        newSdPeak = Math.max(0, oldSdPeak - DECAY_RATE);
      }
      percussionPeaks.sd = newSdPeak;
      const sdFill = Math.round(newSdPeak);

      // Draw SD bar (1 char wide, left half of channel 7 position)
      for (let b = 0; b < barH; b++) {
        const chc = b < sdFill ? 0xDB : 0x20;
        textBuffer.drawChar(percBarX + 3, barY + (barH - 1 - b), chc, barColors[b]);
      }

      // Tom Tom - half width (1 char, right side of channel 7 position)
      const tomLevel = Math.round((63 - percussion.tom) / 63 * barH);
      const oldTomPeak = percussionPeaks.tom;
      let newTomPeak: number;
      if (tomLevel > oldTomPeak) {
        newTomPeak = tomLevel;
      } else {
        newTomPeak = Math.max(0, oldTomPeak - DECAY_RATE);
      }
      percussionPeaks.tom = newTomPeak;
      const tomFill = Math.round(newTomPeak);

      // Draw TOM bar (1 char wide, right half of channel 7 position)
      for (let b = 0; b < barH; b++) {
        const chc = b < tomFill ? 0xDB : 0x20;
        textBuffer.drawChar(percBarX + 4, barY + (barH - 1 - b), chc, barColors[b]);
      }

      // Top Cymbal - half width (1 char, left side of channel 8 position)
      const cyLevel = Math.round((63 - percussion.cy) / 63 * barH);
      const oldCyPeak = percussionPeaks.cy;
      let newCyPeak: number;
      if (cyLevel > oldCyPeak) {
        newCyPeak = cyLevel;
      } else {
        newCyPeak = Math.max(0, oldCyPeak - DECAY_RATE);
      }
      percussionPeaks.cy = newCyPeak;
      const cyFill = Math.round(newCyPeak);

      // Draw CY bar (1 char wide, left half of channel 8 position)
      for (let b = 0; b < barH; b++) {
        const chc = b < cyFill ? 0xDB : 0x20;
        textBuffer.drawChar(percBarX + 6, barY + (barH - 1 - b), chc, barColors[b]);
      }

      // Hi-Hat - half width (1 char, right side of channel 8 position)
      const hhLevel = Math.round((63 - percussion.hh) / 63 * barH);
      const oldHhPeak = percussionPeaks.hh;
      let newHhPeak: number;
      if (hhLevel > oldHhPeak) {
        newHhPeak = hhLevel;
      } else {
        newHhPeak = Math.max(0, oldHhPeak - DECAY_RATE);
      }
      percussionPeaks.hh = newHhPeak;
      const hhFill = Math.round(newHhPeak);

      // Draw HH bar (1 char wide, right half of channel 8 position)
      for (let b = 0; b < barH; b++) {
        const chc = b < hhFill ? 0xDB : 0x20;
        textBuffer.drawChar(percBarX + 7, barY + (barH - 1 - b), chc, barColors[b]);
      }
    }

    channelPeaks = newPeaks;
  }
</script>

<p class="text-gray-500 text-xs mb-2">
  Visualisation modelled after:
  <a href="https://github.com/MrKsoft/vgmslap" target="_blank" class="underline hover:text-gray-300">
    github.com/MrKsoft/vgmslap
  </a>
</p>
<DOMScreen bind:this={domScreen} buffer={textBuffer} />
