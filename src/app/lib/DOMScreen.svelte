<script lang="ts">
  import { onMount } from 'svelte';
  import { TextBuffer, PALETTE, cp437toUnicode } from './textbuffer';

  const COLS = 80;
  const ROWS = 50;

  let { buffer }: { buffer: TextBuffer } = $props();
  let container: HTMLDivElement | null = null;
  let cells: HTMLSpanElement[] = [];

  onMount(() => {
    if (!container) return;
    for (let i = 0; i < COLS * ROWS; i++) {
      const span = document.createElement('span');
      span.className = 'dos-cell';
      container.appendChild(span);
      cells.push(span);
    }
  });

  export function flush() {
    if (!cells.length) return;
    for (let i = 0; i < COLS * ROWS; i++) {
      const ch = buffer.chars[i];
      const attr = buffer.attrs[i];
      const fg = attr & 0x0F;
      const bg = (attr >> 4) & 0x0F;
      const cell = cells[i];

      if ((cell as any)._ch !== ch) {
        (cell as any)._ch = ch;
        cell.textContent = cp437toUnicode(ch);
      }
      if ((cell as any)._fg !== fg) {
        (cell as any)._fg = fg;
        cell.style.color = PALETTE[fg];
      }
      if ((cell as any)._bg !== bg) {
        (cell as any)._bg = bg;
        cell.style.backgroundColor = PALETTE[bg];
      }
    }
  }
</script>

<div bind:this={container} class="dos-grid"></div>

<style>
  .dos-grid {
    display: grid;
    grid-template-columns: repeat(80, 1ch);
    font-family: 'VT323', monospace;
    font-size: 28px;
    line-height: 1;
    margin: 0 auto;
    background: #000;
    width: min-content;
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: none;
    -moz-osx-font-smoothing: unset;
  }
  :global(.dos-cell) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1ch;
    height: 1em;
    text-align: center;
    overflow: visible;
    font-variant-ligatures: none;
  }
</style>
