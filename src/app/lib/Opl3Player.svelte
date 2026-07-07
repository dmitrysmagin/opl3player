<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Player from '../../lib/player';
  import HexDumpView from './HexDumpView.svelte';
  import DosView from './DosView.svelte';

  const player = new Player({ prebuffer: 3000, sampleRate: 48000 });

  let songInfo    = $state<Record<string, any> | null>(null);
  let file        = $state<File | null>(null);
  let isPlaying   = $state(false);
  let isPaused    = $state(false);
  let currentTime = $state(0);
  let bank0       = $state<Uint8Array | null>(null);
  let bank1       = $state<Uint8Array | null>(null);
  let activeTab   = $state<'hex' | 'dos'>('dos');

  let rafId = 0;

  function onLoad(data: Record<string, any>) {
    songInfo = data;
    isPaused = false;
  }

  function onCurrentTime(data: { currentTime: number }) {
    currentTime = data.currentTime;
  }

  onMount(() => {
    player.on('load', onLoad);
    player.on('currentTime', onCurrentTime);
    startLoop();
  });

  onDestroy(() => {
    player.off('load', onLoad);
    player.off('currentTime', onCurrentTime);
    cancelAnimationFrame(rafId);
  });

  function startLoop() {
    function tick() {
      if (player.registerBank0 && player.registerBank1) {
        bank0 = new Uint8Array(player.registerBank0);
        bank1 = new Uint8Array(player.registerBank1);
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
  }

  async function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files?.length) return;
    file = files[0];
    isPlaying = true;
    isPaused = false;
    const data = await file.arrayBuffer();
    try {
      await player.play(data);
      await player.resume();
    } catch (e) {
      console.error('Playback failed', e);
      isPlaying = false;
    }
  }

  function handlePause() {
    player.pause();
    isPaused = true;
    isPlaying = false;
  }

  function handleResume() {
    player.resume();
    isPaused = false;
    isPlaying = true;
  }

  function handleStop() {
    player.stop();
    isPlaying = false;
    isPaused = false;
    currentTime = 0;
    songInfo = null;
    file = null;
    bank0 = null;
    bank1 = null;
  }
</script>

<div class="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">

  <!-- Controls bar -->
  <div class="flex items-center gap-3 p-4 border-b border-slate-700 flex-wrap">
    <label class="file-label">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
      <span>{file ? file.name : 'Upload music'}</span>
      <input
        type="file"
        accept=".raw,.dro,.laa,.imf,.rad,.a2m,.a2t,.cmf"
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

  <!-- Tab bar -->
  <div class="flex border-b border-slate-700">
    <button
      onclick={() => activeTab = 'dos'}
      class="px-5 py-2 text-sm font-medium transition-colors
        {activeTab === 'dos'
          ? 'text-white border-b-2 border-blue-400 bg-slate-750'
          : 'text-slate-400 hover:text-slate-200'}">
      DOS View
    </button>
    <button
      onclick={() => activeTab = 'hex'}
      class="px-5 py-2 text-sm font-medium transition-colors
        {activeTab === 'hex'
          ? 'text-white border-b-2 border-blue-400 bg-slate-750'
          : 'text-slate-400 hover:text-slate-200'}">
      Hex Dump
    </button>
  </div>

  <!-- Tab content -->
  <div class="p-4">
    {#if activeTab === 'dos'}
      <DosView {bank0} {bank1} {songInfo} fileName={file?.name ?? null} />
    {:else}
      <HexDumpView {bank0} {bank1} {songInfo} {currentTime} />
    {/if}
  </div>

</div>
