# opl3player

OPL3 (YMF262) player with AudioWorklet. Browser-based OPL3 music playback supporting multiple tracker and game music formats.

Forked from [doomjs/opl3](https://github.com/doomjs/opl3) with major architectural changes:

- Deprecated `ScriptProcessorNode` + Worker replaced with [`AudioWorkletNode`](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode) — less CPU load, less data transfer
- Vite + TypeScript build (was Rollup + JavaScript)
- Browser-native `EventTarget` (was Node `EventEmitter` polyfill)
- Common abstract base class for all format drivers (`FormatPlayer`)
- Shared register buffers for real-time OPL3 state observation
- RAD format support added

## Build

```sh
npm install
npm run build          # builds dist/opl3-worklet.js + dist/opl3.js
npm run dev            # opens test page at src/index.html
npm run typecheck      # TypeScript type checking
```

The build produces two bundles:

| Bundle | Entry | Format | Purpose |
|---|---|---|---|
| `dist/opl3-worklet.js` | `src/lib/worklet-processor.ts` | IIFE | AudioWorklet — loaded via `audioWorklet.addModule()` |
| `dist/opl3.js` | `src/lib/index.ts` | UMD (`OPL3` global) | Main thread — `<script>` tag include |

During dev (`npm run dev`), Vite serves `src/index.html` which loads the pre-built `dist/opl3.js`. Requires `npm run build` first.

## Usage

Include the bundled script and create a player:

```html
<script type="text/javascript" src="/dist/opl3.js"></script>
```

```js
var player = new OPL3.Player({ sampleRate: 48000 });

player.on("currentTime", (value) => {
    console.log(`frame: ${value.currentFrame}, time: ${value.currentTime.toFixed(2)}s`);
});

// Load and play a supported format
fetch("song.imf")
    .then(r => r.arrayBuffer())
    .then(buf => player.play(buf));
```

### API

| Method | Description |
|---|---|
| `play(buffer)` | Load and start playback (`ArrayBuffer` or `Uint8Array`) |
| `pause()` | Suspend audio context |
| `resume()` | Resume audio context |
| `stop()` | Close audio context and reset |
| `on(event, callback)` | Listen for events (`currentTime`, `context`) |

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

## License

MIT
