<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Player from '../../lib/player';
  import DOMScreen from './DOMScreen.svelte';
  import { TextBuffer, COLOR } from './textbuffer';
  import { BOX } from './cp437';
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
    buf.drawString(0, y + 2, 'Format: ', COLOR.LIGHTGREY);
    buf.drawString(8, y + 2, songInfo.type || 'Unknown', COLOR.LIGHTCYAN);
  }

  function drawChannelTable(buf: any) {
    if (!oplState?.channels) return;

    const channels = oplState.channels;
    const maxCh = channels.length;
    const startY = 7;

    for (let i = 0; i < maxCh; i++) {
      const ch = channels[i];
      const col = i < 9 ? 0 : 40;
      const row = i < 9 ? i : i - 9;
      const x = col;
      const y = startY + row * 4;

      const is4Op = ch.flag4Op;
      const label = is4Op ? '4OP' : '2OP';
      buf.drawString(x + 1, y, `Ch.${String(i + 1).padStart(2, '0')}`, COLOR.WHITE);
      buf.drawString(x + 36, y, label, is4Op ? COLOR.LIGHTRED : COLOR.DARKGREY);

      buf.drawHLine(x, y, 39, BOX.H, COLOR.DARKGREY);

      drawOperatorParams(buf, x + 1, y + 1, ch.operators[0], COLOR.LIGHTCYAN);
      drawOperatorParams(buf, x + 1, y + 3, ch.operators[1], COLOR.LIGHTGREEN);

      const noteX = x + 36;
      const noteY = y + 1;
      const freq = ch.frequency.toString(16).toUpperCase().padStart(3, '0');
      const block = ch.block.toString(16).toUpperCase();
      buf.drawString(noteX, noteY, block, COLOR.BROWN);
      buf.drawString(noteX, noteY + 1, freq, COLOR.YELLOW);

      const keyOnChar = ch.keyOn ? 0x0E : 0x20;
      buf.drawChar(noteX + 1, noteY + 2, keyOnChar, ch.keyOn ? COLOR.LIGHTMAGENTA : COLOR.DARKGREY);

      if (oplState.opl3Mode) {
        const leftOn = !!(ch.panning & 0x01);
        const rightOn = !!(ch.panning & 0x02);
        buf.drawChar(noteX, noteY + 2, 0x28, leftOn ? COLOR.WHITE : COLOR.DARKGREY);
        buf.drawChar(noteX + 2, noteY + 2, 0x29, rightOn ? COLOR.WHITE : COLOR.DARKGREY);
      }

      drawAlgorithm(buf, x + 9, y + 1, ch.synthesisType, is4Op);
    }
  }

  function drawOperatorParams(buf: any, x: number, y: number, op: any, color: number) {
    if (!op) return;

    const waveNames = ['SIN', 'HLF', 'ABS', 'PUL', 'WS4', 'WS5', 'WS6', 'WS7'];
    buf.drawString(x, y, waveNames[op.waveform] || 'SIN', color);

    buf.drawChar(x + 4, y, op.tremolo ? 0x54 : 0x2D, op.tremolo ? COLOR.LIGHTGREY : COLOR.DARKGREY);
    buf.drawChar(x + 5, y, op.vibrato ? 0x56 : 0x2D, op.vibrato ? COLOR.LIGHTGREY : COLOR.DARKGREY);
    buf.drawChar(x + 6, y, op.sustain ? 0x53 : 0x2D, op.sustain ? COLOR.LIGHTGREY : COLOR.DARKGREY);
    buf.drawChar(x + 7, y, op.ksr ? 0x4B : 0x2D, op.ksr ? COLOR.LIGHTGREY : COLOR.DARKGREY);

    buf.drawString(x + 9, y, 'x' + op.multiplier.toString(16).toUpperCase(), color);

    buf.drawChar(x + 12, y, op.attackRate.toString(16).toUpperCase().charCodeAt(0), color);
    buf.drawChar(x + 13, y, op.decayRate.toString(16).toUpperCase().charCodeAt(0), color);

    buf.drawChar(x + 15, y, op.sustainLevel.toString(16).toUpperCase().charCodeAt(0), color);
    buf.drawChar(x + 16, y, op.releaseRate.toString(16).toUpperCase().charCodeAt(0), color);

    buf.drawString(x + 18, y, 'K' + op.ksl.toString(), color);

    const ol = op.outputLevel.toString(16).toUpperCase().padStart(2, '0');
    buf.drawString(x + 21, y, ol, color);
  }

  function drawAlgorithm(buf: any, x: number, y: number, synthType: number, is4Op: boolean) {
    if (is4Op) {
      buf.drawBox(x, y, 5, 3, COLOR.DARKGREY);
      buf.drawString(x + 1, y + 1, synthType ? 'AM' : 'FM', COLOR.YELLOW);
    } else {
      if (synthType === 0) {
        buf.drawString(x, y, 'FM', COLOR.YELLOW);
        buf.drawString(x, y + 1, '|v', COLOR.DARKGREY);
      } else {
        buf.drawString(x, y, 'AM', COLOR.YELLOW);
        buf.drawString(x, y + 1, '+', COLOR.DARKGREY);
      }
    }
  }

  function drawLevelBars(buf: any) {
    if (!oplState?.channels) return;

    const channels = oplState.channels;
    const maxCh = channels.length;
    const barY = 44;
    const barMaxH = 4;

    buf.drawHLine(0, barY - 1, 80, BOX.H, COLOR.DARKGREY);

    for (let i = 0; i < maxCh; i++) {
      const ch = channels[i];
      const col = i < 9 ? 0 : 40;
      const row = i < 9 ? i : i - 9;
      const barX = col + 7 + row * 3;

      const op0Level = 63 - ch.operators[0].outputLevel;
      const op1Level = 63 - ch.operators[1].outputLevel;
      const combinedLevel = Math.max(op0Level, op1Level);

      const displayLevel = ch.keyOn ? Math.floor((combinedLevel / 63) * barMaxH) : 0;

      const color = ch.keyOn ? COLOR.LIGHTGREEN : COLOR.DARKGREY;
      buf.drawLevelBar(barX, barY, displayLevel, barMaxH, color);
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

  <DOMScreen bind:this={domScreen} buffer={textBuffer} />
</div>
