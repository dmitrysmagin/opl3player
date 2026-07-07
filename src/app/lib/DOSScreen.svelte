<script lang="ts">
  import { onMount } from 'svelte';
  import { TextBuffer, CHAR_W, CHAR_H } from './textbuffer';

  const COLS = 80;
  const ROWS = 50;

  let canvas: HTMLCanvasElement | null = null;
  let buffer: TextBuffer | null = null;

  export function getBuffer(): TextBuffer | null {
    return buffer;
  }

  onMount(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    buffer = new TextBuffer(COLS, ROWS);
  });

  export function flush() {
    if (!canvas || !buffer) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    buffer.render(ctx);
  }
</script>

<canvas
  bind:this={canvas}
  width={COLS * CHAR_W}
  height={ROWS * CHAR_H}
  style="image-rendering: pixelated; image-rendering: crisp-edges; width: 100%; max-width: 800px;"
></canvas>
