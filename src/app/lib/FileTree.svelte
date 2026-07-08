<script lang="ts">
  import TreeNode from './TreeNode.svelte';

  interface FileNode {
    name: string;
    type: 'folder' | 'file';
    path: string;
    children?: FileNode[];
  }

  interface Props {
    onSelect: (path: string, name: string) => void;
  }

  let { onSelect }: Props = $props();

  let treeData = $state<FileNode | null>(null);
  let expandedFolders = $state<Set<string>>(new Set(['/modules']));
  let selectedFile = $state<string | null>(null);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  // Load the modules.json on mount
  $effect(() => {
    loadModules();
  });

  async function loadModules() {
    try {
      const response = await fetch('/modules/modules.json');
      if (!response.ok) {
        throw new Error(`Failed to load modules: ${response.status}`);
      }
      treeData = await response.json();
      // Expand root by default
      if (treeData) {
        expandedFolders.add(treeData.path);
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load modules';
    } finally {
      isLoading = false;
    }
  }

  function toggleFolder(path: string) {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    expandedFolders = newExpanded;
  }

  function selectFile(node: FileNode) {
    selectedFile = node.path;
    onSelect(node.path, node.name);
  }
</script>

<div class="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden text-sm max-h-100 flex flex-col">
  {#if isLoading}
    <div class="p-5 text-center text-slate-400">Loading modules...</div>
  {:else if error}
    <div class="p-5 text-center text-red-400">{error}</div>
  {:else if treeData}
    <div class="bg-gradient-to-b from-slate-700 to-slate-800 px-3 py-2.5 border-b border-slate-600 flex items-center gap-2 font-semibold text-slate-200">
      <span class="text-base">🎶</span>
      <span>Music Library</span>
    </div>
    <div class="overflow-y-auto py-2 flex-1">
      {#each treeData.children || [] as child}
        <TreeNode 
          node={child} 
          depth={0}
          {expandedFolders}
          {selectedFile}
          onToggle={toggleFolder}
          onSelect={selectFile}
        />
      {/each}
    </div>
  {/if}
</div>
