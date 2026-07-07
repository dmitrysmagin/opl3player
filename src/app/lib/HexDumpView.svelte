<script lang="ts">
  let {
    bank0,
    bank1,
    songInfo,
    currentTime,
  }: {
    bank0: Uint8Array | null;
    bank1: Uint8Array | null;
    songInfo: Record<string, any> | null;
    currentTime: number;
  } = $props();

  function formatBank(bank: Uint8Array): string {
    const lines: string[] = [];
    for (let i = 0; i < 256; i += 16) {
      const row = Array.from(bank.slice(i, i + 16))
        .map(v => v.toString(16).padStart(2, '0'))
        .join(' ');
      lines.push(`${i.toString(16).padStart(3, '0')}: ${row}`);
    }
    return lines.join('\n');
  }
</script>

<div class="space-y-4">
  <div>
    <p class="text-xl font-semibold">
      {songInfo ? (songInfo.title || 'Unknown Track') : 'No music loaded'}
    </p>
    <p class="text-slate-400 mt-1">
      {songInfo ? (songInfo.author || 'Unknown Artist') : 'Upload a music file to start'}
    </p>
    <p class="font-mono text-blue-400 mt-1">{currentTime.toFixed(2)} s</p>
    {#if songInfo?.type}
      <p class="text-sm text-slate-400 mt-1">
        Format: <span class="text-white">{songInfo.type}</span>
      </p>
    {/if}
  </div>

  {#if bank0}
    <div>
      <span class="font-semibold text-sm block mb-1 text-slate-300">Bank 0 (live)</span>
      <pre class="bg-slate-950 p-3 rounded text-xs font-mono text-green-400 overflow-auto max-h-80 leading-relaxed">{formatBank(bank0)}</pre>
    </div>
  {/if}

  {#if bank1}
    <div>
      <span class="font-semibold text-sm block mb-1 text-slate-300">Bank 1 (live)</span>
      <pre class="bg-slate-950 p-3 rounded text-xs font-mono text-green-400 overflow-auto max-h-80 leading-relaxed">{formatBank(bank1)}</pre>
    </div>
  {/if}

  {#if songInfo}
    <div>
      <h3 class="text-sm font-semibold text-slate-400 mb-2">Metadata</h3>
      <div class="bg-slate-950 p-3 rounded text-sm space-y-1">
        {#each Object.entries(songInfo) as [key, value]}
          <div>
            <span class="font-mono text-blue-400">{key}:</span>
            <span class="text-slate-300 ml-2">{String(value)}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
