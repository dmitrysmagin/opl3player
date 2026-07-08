<script lang="ts">
  import TreeNode from './TreeNode.svelte';

  interface FileNode {
    name: string;
    type: 'folder' | 'file';
    path: string;
    children?: FileNode[];
  }

  interface Props {
    node: FileNode;
    depth: number;
    expandedFolders: Set<string>;
    selectedFile: string | null;
    onToggle: (path: string) => void;
    onSelect: (node: FileNode) => void;
  }

  let { 
    node, 
    depth, 
    expandedFolders, 
    selectedFile, 
    onToggle, 
    onSelect 
  }: Props = $props();

  let isExpanded = $derived(expandedFolders.has(node.path));
  let isSelected = $derived(selectedFile === node.path);

  function getFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'rad': return '🎵';
      case 'imf': return '🎮';
      case 'a2m': return '🎹';
      case 'dro': return '📀';
      case 'cmf': return '🎼';
      case 'laa': return '🎬';
      case 'raw': return '🎚️';
      default: return '📄';
    }
  }

  function handleToggle(e: Event) {
    e.stopPropagation();
    onToggle(node.path);
  }

  function handleSelect(e: Event) {
    e.stopPropagation();
    onSelect(node);
  }
</script>

{#if node.type === 'folder'}
  {@const hasChildren = node.children && node.children.length > 0}
  <div class="flex flex-col">
    <button 
      class="flex items-center gap-1.5 px-2 py-0.5 bg-transparent border-none cursor-pointer text-left text-[13px] leading-tight text-slate-300 hover:bg-blue-500/15 transition-colors w-full text-left"
      style="padding-left: {depth * 16}px"
      onclick={handleToggle}
    >
      <span class="w-4 h-4 flex items-center justify-center text-[10px] text-slate-400 flex-shrink-0 {!hasChildren ? 'invisible' : ''}">
        {isExpanded ? '▼' : '▶'}
      </span>
      <span class="flex-shrink-0 text-sm w-4 h-4 flex items-center justify-center">{isExpanded ? '📂' : '📁'}</span>
      <span class="font-medium text-slate-200 whitespace-nowrap overflow-hidden text-ellipsis">{node.name}</span>
    </button>
    {#if isExpanded && hasChildren}
      <div class="flex flex-col">
        {#each node.children! as child}
          <TreeNode 
            node={child} 
            depth={depth + 1}
            {expandedFolders}
            {selectedFile}
            {onToggle}
            {onSelect}
          />
        {/each}
      </div>
    {/if}
  </div>
{:else}
  {@const fileIcon = getFileIcon(node.name)}
  {@const selectedClasses = isSelected ? 'bg-green-500/30 text-green-400' : ''}
  <button 
    class="flex items-center gap-1.5 px-2 py-0.5 bg-transparent border-none cursor-pointer text-left text-[13px] leading-tight text-slate-300 hover:bg-green-500/15 transition-colors w-full text-left {selectedClasses}"
    style="padding-left: {depth * 16 + 16}px"
    onclick={handleSelect}
  >
    <span class="flex-shrink-0 text-sm w-4 h-4 flex items-center justify-center">{fileIcon}</span>
    <span class="whitespace-nowrap overflow-hidden text-ellipsis {isSelected ? 'font-medium' : ''}">{node.name}</span>
  </button>
{/if}
