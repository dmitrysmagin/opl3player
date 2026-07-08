<script lang="ts">
  let {
    bank0,
    bank1,
    currentTime,
  }: {
    bank0: Uint8Array | null;
    bank1: Uint8Array | null;
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
    <p class="font-mono text-blue-400">{currentTime.toFixed(2)} s</p>
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

</div>
