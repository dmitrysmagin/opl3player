<script lang="ts">
  import DOSPlayer from './lib/DOSPlayer.svelte';
</script>

<div class="min-h-screen bg-slate-900 text-white">
  <div class="max-w-5xl mx-auto p-6 space-y-6">
    <h1 class="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
      OPL3 Music Player
    </h1>

    <DOSPlayer />

    <div class="copyright text-center text-slate-500 text-xs mt-8">
      OPL3 Music Player • Svelte 5 + Vite + Tailwind CSS
    </div>
  </div>
</div>
