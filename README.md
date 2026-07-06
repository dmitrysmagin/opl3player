# opl3player

OPL3 (YMF262) player with AudioWorklet. Browser-based OPL3 music playback supporting multiple tracker and game music formats.

Forked from [doomjs/opl3](https://github.com/doomjs/opl3) with major architectural changes:

- Deprecated `ScriptProcessorNode` + Worker replaced with [`AudioWorkletNode`](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode) — less CPU load, less data transfer
- Vite + TypeScript build (was Rollup + JavaScript)
- Browser-native `EventTarget` (was Node `EventEmitter` polyfill)
- Common abstract base class for all format drivers (`FormatPlayer`)
- Shared register buffers for real-time OPL3 state observation
- RAD format support added
- Svelte 5 UI with runes mode and Tailwind CSS v4

## Project structure

```
src/
├── app/              # Svelte 5 frontend app
│   ├── index.html
│   ├── main.ts
│   ├── app.svelte
│   ├── styles.css
│   └── lib/
│       └── Opl3Player.svelte
└── lib/              # Library code (format parsers, player, worklet)
    ├── player.ts
    ├── worklet-processor.ts
    ├── opl3-worklet.js   # Built worklet (gitignored)
    ├── format/
    ├── ymfm/
    └── ...
```

## Build

```sh
npm install
npm run build          # builds worklet + Svelte app to dist/
npm run dev            # dev server with hot reload
```

The build produces three outputs:

| Output | Source | Purpose |
|---|---|---|
| `src/lib/opl3-worklet.js` | `src/lib/worklet-processor.ts` | AudioWorklet — loaded at compile time |
| `dist/index.html` + `dist/assets/` | `src/app/` | Svelte 5 app |

## Development

```sh
npm run dev            # Vite dev server at http://localhost:5173
npm run build          # Production build
npm run preview        # Preview production build locally
```

The worklet is rebuilt automatically before each `dev` or `build` via the `build:worklet` script.

### Tailwind CSS v4

Styling uses Tailwind CSS v4 with the `@tailwindcss/vite` plugin. Custom CSS classes (`.file-input`, `.file-name`, etc.) are in `src/app/styles.css`.

## Usage (library API)

If you want to use the player library programmatically (without the Svelte UI):

```js
import { Player } from '$lib/player';

const player = new Player({ sampleRate: 48000 });

player.addEventListener('currentTime', (event) => {
    const { currentFrame, currentTime } = event.detail;
    console.log(`frame: ${currentFrame}, time: ${currentTime.toFixed(2)}s`);
});

// Load and play a supported format
fetch("song.imf")
    .then(r => r.arrayBuffer())
    .then(buf => player.play(buf));
```

### Player API

| Method | Description |
|---|---|
| `play(buffer)` | Load and start playback (`ArrayBuffer` or `Uint8Array`) |
| `pause()` | Suspend audio context |
| `resume()` | Resume audio context |
| `stop()` | Close audio context and reset |
| `addEventListener(event, callback)` | Listen for events (`currentTime`, `playing`, `stopped`) |

### Shared register buffers

After initialization, the player exposes two `Uint8Array(256)` views for live OPL3 register state:

```js
player.registerBank0  // OPL3 bank 0 registers (addresses 0x00–0xFF)
player.registerBank1  // OPL3 bank 1 registers (addresses 0x100–0x1FF)
```

Updated on every `opl.write()` call in real time.

## Supported formats

| Format | Extension | Name |
|---|---|---|
| **IMF** | `.imf` | Apogee IMF |
| **DRO** | `.dro` | DOSBox Raw OPL v1.0 |
| **RAW** | `.raw` | Raw AdLib Capture |
| **RAD** | `.rad` | Reality AdLib Tracker |
| **LAA** | `.laa` | LucasArts AdLib MIDI |

Format detection uses `static probe()` (magic byte matching). Each format driver extends the `FormatPlayer` abstract base class (`src/lib/format/player.ts`) and implements:

| Method | Returns | Description |
|---|---|---|
| `load(buffer)` | `void` | Parse binary buffer |
| `update()` | `boolean` | Process one tick (false = song end) |
| `rewind(subsong?)` | `void` | Reset playback position |
| `getrefresh()` | `number` | Timer refresh rate in Hz |
| `gettype()` | `string` | Human-readable format name |
| `gettitle()` / `getauthor()` / `getdesc()` | `string` | Optional metadata |

## Requirements

- Browser with [`AudioWorklet`](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) support (Chrome 66+, Firefox 76+, Safari 14.1+)
- `SharedArrayBuffer` requires `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` HTTP headers (configured in Vite dev server)
- Node.js 18+ for development

## License

MIT
