<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Player from '../../lib/player';
  import DOMScreen from './DOMScreen.svelte';
  import { TextBuffer, COLOR } from './textbuffer';
  
  import { decodeOpl3State, type Opl3State } from './opl3-state';

  const player = new Player({ prebuffer: 3000, sampleRate: 48000 });
  const textBuffer = new TextBuffer(80, 50);

  let domScreen: DOMScreen;
  let songInfo: Record<string, any> | null = $state(null);
  let isPlaying = $state(false);
  let isPaused = $state(false);
  let file: File | null = $state(null);

  let rafId = 0;
  let oplState: Opl3State | null = null;

  function onLoad(data: Record<string, any>) {
    songInfo = data;
    isPlaying = true;
    isPaused = false;
  }

  onMount(() => {
    player.on('load', onLoad);
  });

  onDestroy(() => {
    player.off('load', onLoad);
    cancelAnimationFrame(rafId);
  });

  function startLoop() {
    function tick() {
      const bank0 = player.registerBank0;
      const bank1 = player.registerBank1;
      if (bank0 && bank1) {
        oplState = decodeOpl3State(bank0, bank1);
      }
      drawFrame();
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
  }

  function stopLoop() {
    cancelAnimationFrame(rafId);
  }

  async function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      file = files[0];
      isPlaying = true;
      isPaused = false;
      const data = await file.arrayBuffer();
      try {
        await player.play(data);
        await player.resume();
        startLoop();
      } catch (e) {
        console.error('Playback failed', e);
        isPlaying = false;
      }
    }
  }

  function handlePause() {
    player.pause();
    isPaused = true;
    isPlaying = false;
    stopLoop();
  }

  function handleResume() {
    player.resume();
    isPaused = false;
    isPlaying = true;
    startLoop();
  }

  function handleStop() {
    player.stop();
    isPlaying = false;
    isPaused = false;
    songInfo = null;
    file = null;
    oplState = null;
    stopLoop();
    textBuffer.clear();
    domScreen?.flush();
  }

  function drawFrame() {
    textBuffer.clear();
    drawTitleBar(textBuffer);
    drawGd3Tags(textBuffer);
    if (oplState) {
      drawChannelTable(textBuffer);
      drawLevelBars(textBuffer);
    }
    domScreen.flush();
  }

  function drawTitleBar(buf: any) {
    buf.fillRect(0, 0, 80, 1, 0x20, COLOR.WHITE, COLOR.BLUE);
    buf.drawString(1, 0, 'OPL3 Player', COLOR.YELLOW, COLOR.BLUE);
    if (file) {
      buf.drawString(55, 0, 'Now playing:', COLOR.WHITE, COLOR.BLUE);
      const name = file.name.length > 20 ? file.name.slice(0, 20) : file.name;
      buf.drawString(68, 0, name, COLOR.YELLOW, COLOR.BLUE);
    }
  }

  function drawGd3Tags(buf: any) {
    if (!songInfo) return;
    const y = 2;
    buf.drawString(0, y, 'Title:  ', COLOR.LIGHTGREY);
    buf.drawString(8, y, songInfo.title || 'Unknown', COLOR.LIGHTCYAN);
    buf.drawString(0, y + 1, 'Artist: ', COLOR.LIGHTGREY);
    buf.drawString(8, y + 1, songInfo.author || 'Unknown', COLOR.LIGHTCYAN);
    buf.drawString(0, y + 2, 'Game:   ', COLOR.LIGHTGREY);
    buf.drawString(8, y + 2, songInfo.game || 'Unknown', COLOR.LIGHTCYAN);
    buf.drawString(0, y + 3, 'Date:   ', COLOR.LIGHTGREY);
    buf.drawString(8, y + 3, songInfo.date || 'Unknown', COLOR.LIGHTCYAN);
  }

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
    [0x20,0x20,0x20,0x20,0x20,0x20,0x20],
    [0xDB,0x10,0xDB,0x10,0xDB,0x10,0xDB],
    [0x20,0x20,0x20,0xDA,0xC4,0xC4,0xD9],
    [0x20,0x20,0x20,0xB3,0x20,0x20,0x20],
    [0x20,0x20,0x20,0x1F,0x20,0x20,0x20],
    [0x20,0x20,0x20,0xDB,0x20,0x20,0x20],
    [0x20,0x20,0x20,0x20,0x20,0x20,0x20],
  ];
  const ALGO_ASFM = [
    [0x20,0x20,0x20,0x20,0x20,0x20,0x20],
    [0xDB,0xC4,0xC4,0xC4,0xBF,0x20,0x20],
    [0x20,0x20,0x20,0x20,0xB3,0x20,0x20],
    [0x20,0x20,0x20,0x20,0xC3,0x10,0xDB],
    [0x20,0x20,0x20,0x20,0xB3,0x20,0x20],
    [0xDB,0x10,0xDB,0x10,0xDB,0x20,0x20],
    [0x20,0x20,0x20,0x20,0x20,0x20,0x20],
  ];
  const ALGO_FMAS = [
    [0x20,0x20,0x20,0x20,0x20,0x20,0x20],
    [0xDB,0xC4,0x10,0xDB,0xBF,0x20,0x20],
    [0x20,0x20,0x20,0x20,0xB3,0x20,0x20],
    [0x20,0x20,0x20,0x20,0xC3,0x10,0xDB],
    [0x20,0x20,0x20,0x20,0xB3,0x20,0x20],
    [0xDB,0xC4,0x10,0xDB,0xD9,0x20,0x20],
    [0x20,0x20,0x20,0x20,0x20,0x20,0x20],
  ];
  const ALGO_ASAS = [
    [0x20,0x20,0x20,0x20,0x20,0x20,0x20],
    [0xDB,0xC4,0xC4,0xC4,0xBF,0x20,0x20],
    [0x20,0x20,0x20,0x20,0xB3,0x20,0x20],
    [0xDB,0xC4,0x10,0xDB,0xC5,0x10,0xDB],
    [0x20,0x20,0x20,0x20,0xB3,0x20,0x20],
    [0xDB,0xC4,0xC4,0xC4,0xD9,0x20,0x20],
    [0x20,0x20,0x20,0x20,0x20,0x20,0x20],
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
    [0,0,0,0,0,0,0],
    [COLOR.LIGHTCYAN,COLOR.LIGHTGREY,COLOR.LIGHTGREEN,COLOR.LIGHTGREY,COLOR.YELLOW,COLOR.LIGHTGREY,0],
    [0,0,0,COLOR.LIGHTGREY,COLOR.LIGHTGREY,COLOR.LIGHTGREY,COLOR.LIGHTGREY],
    [0,0,0,COLOR.LIGHTGREY,0,0,0],
    [0,0,0,COLOR.LIGHTGREY,0,0,0],
    [0,0,0,COLOR.YELLOW,0,0,0],
    [0,0,0,0,0,0,0],
  ];
  const ALGO_4OP_COLORS_ASFM = [
    [0,0,0,0,0,0,0],
    [COLOR.LIGHTCYAN,COLOR.LIGHTGREY,COLOR.LIGHTGREY,COLOR.LIGHTGREY,COLOR.LIGHTGREY,0,0],
    [0,0,0,0,COLOR.LIGHTGREY,0,0],
    [0,0,0,0,COLOR.LIGHTGREY,COLOR.LIGHTGREY,COLOR.YELLOW],
    [0,0,0,0,COLOR.LIGHTGREY,0,0],
    [COLOR.LIGHTCYAN,COLOR.LIGHTGREY,COLOR.LIGHTGREEN,COLOR.LIGHTGREY,COLOR.YELLOW,0,0],
    [0,0,0,0,0,0,0],
  ];
  const ALGO_4OP_COLORS_FMAS = [
    [0,0,0,0,0,0,0],
    [COLOR.LIGHTCYAN,COLOR.LIGHTGREY,COLOR.LIGHTGREY,COLOR.LIGHTGREEN,COLOR.LIGHTGREY,0,0],
    [0,0,0,0,COLOR.LIGHTGREY,0,0],
    [0,0,0,0,COLOR.LIGHTGREY,COLOR.LIGHTGREY,COLOR.YELLOW],
    [0,0,0,0,COLOR.LIGHTGREY,0,0],
    [COLOR.LIGHTCYAN,COLOR.LIGHTGREY,COLOR.LIGHTGREY,COLOR.LIGHTGREEN,COLOR.LIGHTGREY,0,0],
    [0,0,0,0,0,0,0],
  ];
  const ALGO_4OP_COLORS_ASAS = [
    [0,0,0,0,0,0,0],
    [COLOR.LIGHTCYAN,COLOR.LIGHTGREY,COLOR.LIGHTGREY,COLOR.LIGHTGREY,COLOR.LIGHTGREY,0,0],
    [0,0,0,0,COLOR.LIGHTGREY,0,0],
    [COLOR.LIGHTCYAN,COLOR.LIGHTGREY,COLOR.LIGHTGREY,COLOR.LIGHTGREEN,COLOR.LIGHTGREY,COLOR.LIGHTGREY,COLOR.YELLOW],
    [0,0,0,0,COLOR.LIGHTGREY,0,0],
    [COLOR.LIGHTGREEN,COLOR.LIGHTGREY,COLOR.LIGHTGREY,COLOR.LIGHTGREY,COLOR.LIGHTGREY,0,0],
    [0,0,0,0,0,0,0],
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

  const OP = 9;
  const NI = 36;
  const FB = 33;

  function drawChannelHeader(buf: any, x: number, y: number, chIdx: number, is4Op: boolean) {
    buf.drawChar(x, y, 0xD5, COLOR.DARKGREY);
    buf.drawChar(x + 1, y, 0xCD, COLOR.DARKGREY);
    if (is4Op) {
      const pair = chIdx + 3;
      buf.drawString(x + 2, y, `${String(chIdx + 1).padStart(2, '0')}+${String(pair + 1).padStart(2, '0')}`, COLOR.WHITE);
    } else {
      buf.drawString(x + 2, y, `Ch.${String(chIdx + 1).padStart(2, '0')}`, COLOR.WHITE);
    }
    for (let k = 7; k < 36; k++) buf.drawChar(x + k, y, 0xCD, COLOR.DARKGREY);
    if (is4Op) {
      buf.drawString(x + 36, y, '4OP', COLOR.LIGHTRED);
    } else {
      for (let k = 36; k < 39; k++) buf.drawChar(x + k, y, 0xCD, COLOR.DARKGREY);
    }
    buf.drawChar(x + 39, y, 0xB8, COLOR.DARKGREY);
  }

  function drawOpParams(buf: any, x: number, y: number, op: any, color: number) {
    const wp = WAVE_PATTERNS[op.waveform] || WAVE_PATTERNS[0];
    for (let i = 0; i < 4; i++) buf.drawChar(x + OP + i, y, wp[i], color);
    buf.drawChar(x + OP + 5, y, op.attackRate.toString(16).toUpperCase().charCodeAt(0), color);
    buf.drawChar(x + OP + 6, y, op.decayRate.toString(16).toUpperCase().charCodeAt(0), color);
    buf.drawChar(x + OP + 7, y, op.sustainLevel.toString(16).toUpperCase().charCodeAt(0), color);
    buf.drawChar(x + OP + 8, y, op.releaseRate.toString(16).toUpperCase().charCodeAt(0), color);
    const tc = op.tremolo ? COLOR.LIGHTGREY : COLOR.DARKGREY;
    const vc = op.vibrato ? COLOR.LIGHTGREY : COLOR.DARKGREY;
    const sc = op.sustain ? COLOR.LIGHTGREY : COLOR.DARKGREY;
    const kc = op.ksr ? COLOR.LIGHTGREY : COLOR.DARKGREY;
    buf.drawChar(x + OP + 10, y, op.tremolo ? 0x54 : 0x2D, tc);
    buf.drawChar(x + OP + 11, y, op.vibrato ? 0x56 : 0x2D, vc);
    buf.drawChar(x + OP + 12, y, op.sustain ? 0x53 : 0x2D, sc);
    buf.drawChar(x + OP + 13, y, op.ksr ? 0x4B : 0x2D, kc);
    const mult = op.multiplier.toString(16).toUpperCase();
    buf.drawString(x + OP + 15, y, mult.length === 1 ? ` ${mult}` : mult, color);
    const ksl = op.ksl;
    buf.drawString(x + OP + 17, y, ksl === 0 ? '---' : ksl === 1 ? '1.5' : ksl === 2 ? '3.0' : '6.0', color);
    const ol = op.outputLevel.toString(16).toUpperCase().padStart(2, '0');
    buf.drawString(x + OP + 21, y, ol, color);
  }

  function drawAlgoRow(buf: any, ax: number, ay: number, ch: any, is4Op: boolean, algoRow: number) {
    if (is4Op) {
      const synthType = ch.synthesisType;
      const ch2 = oplState?.channels[ch.channel + 3];
      const secondSynth = ch2?.synthesisType ?? 0;
      let data, colData;
      if (synthType === 0 && secondSynth === 0) {
        data = ALGO_FMFM; colData = ALGO_4OP_COLORS_FMFM;
      } else if (synthType === 1 && secondSynth === 0) {
        data = ALGO_ASFM; colData = ALGO_4OP_COLORS_ASFM;
      } else if (synthType === 0 && secondSynth === 1) {
        data = ALGO_FMAS; colData = ALGO_4OP_COLORS_FMAS;
      } else {
        data = ALGO_ASAS; colData = ALGO_4OP_COLORS_ASAS;
      }
      if (algoRow >= 0 && algoRow < data.length) {
        for (let col = 0; col < 7; col++) {
          const c = data[algoRow][col];
          const color = colData[algoRow][col];
          if (c !== 0x20 || color !== 0) {
            buf.drawChar(ax + col, ay, c, color);
          }
        }
      }
    } else {
      const data = ch.synthesisType === 0 ? ALGO_FM : ALGO_AS;
      const colData = ch.synthesisType === 0 ? ALGO_FM_COLORS : ALGO_AS_COLORS;
      if (algoRow >= 0 && algoRow < data.length) {
        for (let col = 0; col < 7; col++) {
          const c = data[algoRow][col];
          const color = colData[algoRow][col];
          if (c !== 0x20 || color !== 0) {
            buf.drawChar(ax + col, ay, c, color);
          }
        }
      }
    }
  }

  function drawRowBorders(buf: any, x: number, y: number, count: number) {
    for (let r = 0; r < count; r++) {
      buf.drawChar(x, y + r, 0xB3, COLOR.DARKGREY);
      buf.drawChar(x + 39, y + r, 0xB3, COLOR.DARKGREY);
    }
  }

  function drawChannelTable(buf: any) {
    if (!oplState?.channels) return;
    const channels = oplState.channels;
    const startY = 7;

    for (let i = 0; i < 18; i++) {
      if (i >= 3 && i <= 5 && channels[i - 3]?.flag4Op) continue;
      if (i >= 12 && i <= 14 && channels[i - 3]?.flag4Op) continue;

      const ch = channels[i];
      const col = i < 9 ? 0 : 40;
      const row = i < 9 ? i : i - 9;
      const x = col;
      const y = startY + row * 4;
      const is4Op = ch?.flag4Op ?? false;

      drawChannelHeader(buf, x, y, i, is4Op);

      drawOpParams(buf, x, y + 1, ch.operators[0], COLOR.LIGHTCYAN);
      const block = ch.block.toString(16).toUpperCase();
      buf.drawString(x + NI, y + 1, ` ${block} `, COLOR.BROWN);
      drawAlgoRow(buf, x + 1, y + 1, ch, is4Op, 0);

      const fb = ch.feedback;
      const fg = FEEDBACK_GLYPHS[fb] || FEEDBACK_GLYPHS[0];
      buf.drawChar(x + FB, y + 2, fg[0], COLOR.YELLOW);
      buf.drawChar(x + FB + 1, y + 2, fg[1], COLOR.YELLOW);
      const freq = ch.frequency.toString(16).toUpperCase().padStart(3, '0');
      buf.drawString(x + NI, y + 2, freq, COLOR.YELLOW);
      drawAlgoRow(buf, x + 1, y + 2, ch, is4Op, 1);

      const op1 = is4Op ? channels[i + 3]?.operators[1] : ch.operators[1];
      drawOpParams(buf, x, y + 3, op1, COLOR.LIGHTGREEN);
      const leftOn = !!(ch.panning & 0x01);
      const rightOn = !!(ch.panning & 0x02);
      const keyChar = ch.keyOn ? 0x0E : 0x20;
      const keyColor = ch.keyOn ? COLOR.LIGHTMAGENTA : COLOR.DARKGREY;
      buf.drawChar(x + NI, y + 3, 0x28, leftOn ? COLOR.WHITE : COLOR.DARKGREY);
      buf.drawChar(x + NI + 1, y + 3, keyChar, keyColor);
      buf.drawChar(x + NI + 2, y + 3, 0x29, rightOn ? COLOR.WHITE : COLOR.DARKGREY);
      drawAlgoRow(buf, x + 1, y + 3, ch, is4Op, 2);

      drawRowBorders(buf, x, y + 1, 3);
    }
  }

  function drawLevelBars(buf: any) {
    if (!oplState?.channels) return;
    const channels = oplState.channels;
    const barY = 44;
    const barH = 6;

    buf.drawHLine(0, barY - 1, 80, 0xCD, COLOR.DARKGREY);

    const barColors = [COLOR.RED, COLOR.BROWN, COLOR.YELLOW, COLOR.LIGHTGREEN, COLOR.LIGHTGREEN, COLOR.LIGHTGREEN];

    for (let i = 0; i < 18; i++) {
      if (i >= 3 && i <= 5 && channels[i - 3]?.flag4Op) continue;
      if (i >= 12 && i <= 14 && channels[i - 3]?.flag4Op) continue;

      const ch = channels[i];
      const col = i < 9 ? 0 : 40;
      const row = i < 9 ? i : i - 9;
      const barX = col + 7 + row * 3;

      const is4Op_ = ch?.flag4Op ?? false;
      const slave = is4Op_ ? channels[i + 3] : null;
      const rawLevel = is4Op_
        ? Math.max(ch.operators[0].outputLevel, ch.operators[1].outputLevel, slave?.operators[0]?.outputLevel ?? 0, slave?.operators[1]?.outputLevel ?? 0)
        : Math.max(ch.operators[0].outputLevel, ch.operators[1].outputLevel);
      const fill = ch.keyOn ? Math.round((63 - rawLevel) / 63 * barH) : 0;

      for (let b = 0; b < barH; b++) {
        const isFilled = b < fill;
        const chc = isFilled ? 0xDB : 0x20;
        buf.drawChar(barX, barY + (barH - 1 - b), chc, barColors[b]);
        buf.drawChar(barX + 1, barY + (barH - 1 - b), chc, barColors[b]);
      }
    }
  }
</script>

<div class="bg-slate-900 p-4 rounded-xl border border-slate-700">
  <div class="mb-4 flex items-center gap-4">
    <label class="file-label">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
      <span>{file ? file.name : 'Upload music'}</span>
      <input
        type="file"
        accept=".raw,.dro,.laa,.imf,.rad,.a2m,.a2t"
        class="file-input"
        onchange={handleFileUpload}
      />
    </label>

    <button onclick={handlePause} disabled={!isPlaying || isPaused}
      class="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium text-white">
      Pause
    </button>
    <button onclick={handleResume} disabled={!isPaused}
      class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium text-white">
      Resume
    </button>
    <button onclick={handleStop} disabled={!isPlaying && !isPaused}
      class="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium text-white">
      Stop
    </button>
  </div>

  <p class="text-gray-500 text-xs mb-2">Visualization modeled after: <a href="https://github.com/MrKsoft/vgmslap" target="_blank" class="underline hover:text-gray-300">github.com/MrKsoft/vgmslap</a></p>
  <DOMScreen bind:this={domScreen} buffer={textBuffer} />
</div>
