<script lang="ts">
  let {
    songInfo,
  }: {
    songInfo: Record<string, any> | null;
  } = $props();

  function getMetadataItems(info: Record<string, any>): Array<{key: string, value: string}> {
    const items: Array<{key: string, value: string}> = [];
    
    // Format first
    if (info.type) {
      items.push({ key: 'Format', value: info.type.toUpperCase() });
    }
    
    // Title, author, description
    if (info.title) {
      items.push({ key: 'Title', value: info.title });
    }
    if (info.author) {
      items.push({ key: 'Author', value: info.author });
    }
    if (info.desc || info.description) {
      items.push({ key: 'Description', value: info.desc || info.description });
    }
    if (info.game) {
      items.push({ key: 'Game', value: info.game });
    }
    if (info.date) {
      items.push({ key: 'Date', value: info.date });
    }
    
    // Technical info
    if (info.speed !== undefined) {
      items.push({ key: 'Speed', value: String(info.speed) });
    }
    if (info.patterns !== undefined) {
      items.push({ key: 'Patterns', value: String(info.patterns) });
    }
    if (info.orders !== undefined) {
      items.push({ key: 'Orders', value: String(info.orders) });
    }
    if (info.subsongs !== undefined && info.subsongs > 1) {
      items.push({ key: 'Sub-songs', value: String(info.subsongs) });
    }
    if (info.instruments !== undefined) {
      items.push({ key: 'Instruments', value: String(info.instruments) });
    }
    
    // Current position info
    if (info.pattern !== undefined) {
      items.push({ key: 'Pattern', value: String(info.pattern) });
    }
    if (info.row !== undefined) {
      items.push({ key: 'Row', value: String(info.row) });
    }
    if (info.order !== undefined) {
      items.push({ key: 'Order', value: String(info.order) });
    }
    
    return items;
  }

  function getInstrumentNames(info: Record<string, any>): string[] {
    const names: string[] = [];
    for (let i = 0; i < 128; i++) {
      const key = `instrument${i}`;
      if (info[key]) {
        names.push(`${i}: ${info[key]}`);
      }
    }
    return names;
  }

  let metadataItems = $derived(songInfo ? getMetadataItems(songInfo) : []);
  let instrumentNames = $derived(songInfo ? getInstrumentNames(songInfo) : []);
</script>

<div class="space-y-4">
  {#if !songInfo}
    <div class="text-center text-slate-400 py-8">
      <p class="text-lg">No file loaded</p>
      <p class="text-sm mt-2">Select a file from the music library or upload one</p>
    </div>
  {:else}
    <!-- File Information -->
    <div>
      <h3 class="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">File Information</h3>
      <div class="bg-slate-950 p-4 rounded-lg space-y-2">
        {#each metadataItems as item}
          <div class="flex items-baseline gap-3">
            <span class="text-xs font-mono text-blue-400 w-24 shrink-0">{item.key}</span>
            <span class="text-slate-300 text-sm">{item.value}</span>
          </div>
        {/each}
        {#if metadataItems.length === 0}
          <div class="text-slate-500 text-sm">No metadata available</div>
        {/if}
      </div>
    </div>

    <!-- Instruments -->
    {#if instrumentNames.length > 0}
      <div>
        <h3 class="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">
          Instruments ({instrumentNames.length})
        </h3>
        <div class="bg-slate-950 p-4 rounded-lg max-h-60 overflow-y-auto">
          <div class="space-y-1">
            {#each instrumentNames as name}
              <div class="text-xs font-mono text-slate-300">{name}</div>
            {/each}
          </div>
        </div>
      </div>
    {/if}

    <!-- Raw Metadata -->
    <div>
      <h3 class="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">Raw Metadata</h3>
      <div class="bg-slate-950 p-4 rounded-lg max-h-60 overflow-y-auto">
        <div class="space-y-1 text-xs">
          {#each Object.entries(songInfo) as [key, value]}
            <div class="flex items-baseline gap-2">
              <span class="font-mono text-blue-400 shrink-0">{key}:</span>
              <span class="text-slate-300 break-all">{String(value)}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>
