<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Player from '../../lib/player';

    const player = new Player({ prebuffer: 3000, sampleRate: 48000 });

    let currentTime = $state(0);
    let songInfo = $state<Record<string, any> | null>(null);
    let file = $state<File | null>(null);
    let isPlaying = $state(false);
    let isPaused = $state(false);

    let registerBank0 = $state<Uint8Array | null>(null);
    let registerBank1 = $state<Uint8Array | null>(null);
    let registerInterval: number | null = null;

    function onCurrentTime(data: { currentFrame: number; currentTime: number }) {
        currentTime = data.currentTime;
    }

    function onLoad(data: Record<string, any>) {
        songInfo = data;
        isPaused = false;
    }

    onMount(() => {
        player.on('currentTime', onCurrentTime);
        player.on('load', onLoad);

        registerInterval = window.setInterval(() => {
            if (player.registerBank0 && player.registerBank1) {
                registerBank0 = new Uint8Array(player.registerBank0);
                registerBank1 = new Uint8Array(player.registerBank1);
            }
        }, 100);
    });

    onDestroy(() => {
        if (registerInterval) window.clearInterval(registerInterval);
        player.off('currentTime', onCurrentTime);
        player.off('load', onLoad);
    });

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
        registerBank0 = null;
        registerBank1 = null;
    }

    function formatBank(bank: Uint8Array): string {
        const lines: string[] = [];
        for (let i = 0; i < 256; i += 32) {
            const row = [...bank.slice(i, i + 32)].map(v => v.toString(16).padStart(2, '0')).join(' ');
            lines.push(row);
        }
        return lines.join('\n');
    }

    function getMetadataEntries(): [string, any][] {
        if (!songInfo) return [];
        return Object.entries(songInfo);
    }
</script>

<div class="min-h-screen bg-slate-900 text-white">
    <div class="max-w-4xl mx-auto p-6 space-y-6">
        <h1 class="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            OPL3 Music Player
        </h1>

        <div class="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
            <div class="file-section">
                <label class="file-label">
                    <span>{file ? file.name : 'Upload music'}</span>
                    <input
                        type="file"
                        accept=".raw,.dro,.laa,.imf,.rad,.a2m,.a2t"
                        class="file-input"
                        onchange={handleFileUpload}
                    />
                </label>
            </div>

            <div class="controls mt-4">
                <button
                    onclick={handlePause}
                    disabled={!isPlaying || isPaused}
                    class="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                    Pause
                </button>
                <button
                    onclick={handleResume}
                    disabled={!isPaused}
                    class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                    Resume
                </button>
                <button
                    onclick={handleStop}
                    disabled={!isPlaying && !isPaused}
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                    Stop
                </button>
            </div>

            <div class="display-panel mt-6">
                <p class="song-info text-xl font-semibold mb-2">
                    {#if songInfo}
                        {songInfo.title || 'Unknown Track'}
                    {:else}
                        No music loaded
                    {/if}
                </p>
                <p class="song-artist text-slate-400 mb-2">
                    {#if songInfo}
                        {songInfo.author || 'Unknown Artist'}
                    {:else}
                        Upload a music file to start
                    {/if}
                </p>

                <p class="current-time text-lg font-mono text-blue-400">
                    {currentTime.toFixed(2)} s
                </p>

                {#if songInfo && songInfo.type}
                    <div class="space-y-2 text-sm text-slate-400 mt-4">
                        <div class="info-section">
                            <span class="info-label font-semibold">Format:</span>
                            <span class="info-value">{songInfo.type}</span>
                        </div>
                    </div>
                {/if}

                {#if registerBank0}
                    <div class="mt-6 space-y-3">
                        <div>
                            <span class="info-label font-semibold block mb-1 text-sm">Bank 0 (live)</span>
                            <pre class="bg-slate-900 p-3 rounded text-xs font-mono text-green-400 overflow-auto max-h-96 leading-relaxed whitespace-pre">{formatBank(registerBank0)}</pre>
                        </div>
                        {#if registerBank1}
                            <div>
                                <span class="info-label font-semibold block mb-1 text-sm">Bank 1 (live)</span>
                                <pre class="bg-slate-900 p-3 rounded text-xs font-mono text-green-400 overflow-auto max-h-96 leading-relaxed whitespace-pre">{formatBank(registerBank1)}</pre>
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>

        {#if songInfo}
            <div class="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                <h2 class="text-xl font-semibold mb-4 text-slate-400">Metadata</h2>
                <div class="register-display bg-slate-900 p-4 rounded overflow-auto max-h-96">
                    {#each getMetadataEntries() as [key, value]}
                        <div class="mb-2">
                            <span class="font-mono text-blue-400">{key}:</span>
                            <span class="text-slate-300">{String(value)}</span>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <div class="copyright text-center text-slate-500 text-xs mt-8">
            OPL3 Music Player • Svelte 5 + Vite + Tailwind CSS
        </div>
    </div>
</div>
