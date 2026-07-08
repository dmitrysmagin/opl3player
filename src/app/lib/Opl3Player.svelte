<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Player, { type PlayerOptions } from '../../lib/player';
  import HexDumpView from './HexDumpView.svelte';
  import DosView from './DosView.svelte';
  import InfoView from './InfoView.svelte';
  import FileTree from './FileTree.svelte';

  const playerOptions: PlayerOptions = { prebuffer: 3000, sampleRate: 48000, emulator: 'nuked' };
  const player = new Player(playerOptions);

  let songInfo    = $state<Record<string, any> | null>(null);
  let file        = $state<File | null>(null);
  let isPlaying   = $state(false);
  let isPaused    = $state(false);
  let elapsed     = $state(0);
  let duration    = $state<number | null>(null);
  let isSeeking   = $state(false);
  let seekTarget  = $state(0);
  let bank0       = $state<Uint8Array | null>(null);
  let bank1       = $state<Uint8Array | null>(null);
  let activeTab   = $state<'hex' | 'dos' | 'info'>('dos');

  let rafId = 0;

  function formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function onLoad(data: Record<string, any>) {
    songInfo = data;
    isPaused = false;
    elapsed = 0;
    duration = null;   // reset until dry-run arrives
  }

  function onDuration(data: number | null) {
    duration = data;
  }

  function onCurrentTime(data: { currentFrame: number; currentTime: number; elapsed: number }) {
    if (!isSeeking) {
      elapsed = data.elapsed;
      // Always keep seekTarget in sync with elapsed when not seeking
      // This ensures smooth updates and handles loop resets correctly
      seekTarget = data.elapsed;
    }
  }

  onMount(() => {
    player.on('load', onLoad);
    player.on('duration', onDuration);
    player.on('currentTime', onCurrentTime);
    startLoop();
  });

  onDestroy(() => {
    player.off('load', onLoad);
    player.off('duration', onDuration);
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
    elapsed = 0;
    duration = null;
    songInfo = null;
    file = null;
    bank0 = null;
    bank1 = null;
  }

  // Progress bar interaction
  function handleSeekInput(event: Event) {
    const input = event.target as HTMLInputElement;
    isSeeking = true;
    seekTarget = parseFloat(input.value);
  }

  function handleSeekChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const target = parseFloat(input.value);
    isSeeking = false;
    elapsed = target;
    player.seek(target);
  }



  // Handle file selection from tree
  async function handleTreeSelect(path: string, name: string) {
    // Stop current playback if any
    if (isPlaying || isPaused) {
      player.stop();
    }
    
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load: ${response.status}`);
      }
      const data = await response.arrayBuffer();
      
      // Create a File object for display
      file = new File([data], name, { type: 'application/octet-stream' });
      isPlaying = true;
      isPaused = false;
      
      await player.play(data);
      await player.resume();
    } catch (e) {
      console.error('Failed to load file from tree:', e);
      isPlaying = false;
    }
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

    <!-- Play/Pause toggle button -->
    <button
      onclick={isPlaying ? handlePause : handleResume}
      disabled={!isPlaying && !isPaused}
      class="w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        {isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'} text-white">
      {#if isPlaying}
        <!-- Pause icon (two bars) -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"/>
          <rect x="14" y="4" width="4" height="16"/>
        </svg>
      {:else}
        <!-- Play icon (triangle) -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      {/if}
    </button>

    <!-- Stop button -->
    <button
      onclick={handleStop}
      disabled={!isPlaying && !isPaused}
      class="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-white">
      <!-- Stop icon (square) -->
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="4" width="16" height="16"/>
      </svg>
    </button>
  </div>

  <!-- Progress bar -->
  {#if isPlaying || isPaused}
    <div class="px-4 py-3 border-b border-slate-700 flex items-center gap-3">
      <!-- Elapsed time -->
      <span class="text-slate-300 text-xs font-mono w-10 shrink-0 text-right">
        {formatTime(isSeeking ? seekTarget : elapsed)}
      </span>

      <!-- Seek slider -->
      <div class="relative flex-1 flex items-center">
        {#if duration !== null}
          <!-- Known duration: full interactive seek bar -->
          <input
            type="range"
            min="0"
            max={duration}
            step="any"
            value={isSeeking ? seekTarget : elapsed}
            oninput={handleSeekInput}
            onchange={handleSeekChange}
            class="seek-slider w-full"
            style="--pct: {Math.min(100, ((isSeeking ? seekTarget : elapsed) / duration!) * 100).toFixed(3)}%"
          />
        {:else}
          <!-- Unknown duration (looping / infinite): indeterminate progress bar -->
          <div class="w-full h-1.5 bg-slate-600 rounded-full overflow-hidden">
            <div class="h-full bg-blue-400 rounded-full transition-none"
                 style="width: 100%; animation: pulse 2s ease-in-out infinite;">
            </div>
          </div>
        {/if}
      </div>

      <!-- Duration / elapsed-only -->
      <span class="text-slate-400 text-xs font-mono w-10 shrink-0">
        {#if duration !== null}
          {formatTime(duration)}
        {:else}
          &ndash;&ndash;:&ndash;&ndash;
        {/if}
      </span>
    </div>
  {/if}

  <!-- File Tree -->
  <div class="border-b border-slate-700">
    <FileTree onSelect={handleTreeSelect} />
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
    <button
      onclick={() => activeTab = 'info'}
      class="px-5 py-2 text-sm font-medium transition-colors
        {activeTab === 'info'
          ? 'text-white border-b-2 border-blue-400 bg-slate-750'
          : 'text-slate-400 hover:text-slate-200'}">
      Info
    </button>
  </div>

  <!-- Tab content -->
  <div class="p-4">
    {#if activeTab === 'dos'}
      <DosView {bank0} {bank1} {songInfo} fileName={file?.name ?? null} />
    {:else if activeTab === 'hex'}
      <HexDumpView {bank0} {bank1} currentTime={elapsed} />
    {:else}
      <InfoView {songInfo} />
    {/if}
  </div>

</div>

<style>
  .seek-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(
      to right,
      #60a5fa calc(var(--pct, 0%) ),
      #475569 calc(var(--pct, 0%) )
    );
    outline: none;
    cursor: pointer;
  }

  .seek-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #93c5fd;
    cursor: pointer;
    transition: background 0.15s;
  }

  .seek-slider::-webkit-slider-thumb:hover {
    background: #bfdbfe;
  }

  .seek-slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #93c5fd;
    cursor: pointer;
    border: none;
    transition: background 0.15s;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
</style>
