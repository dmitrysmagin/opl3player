# A2M Driver Adaptation Plan

## 1. File & Class

- **File**: `src/lib/format/a2m.ts`
- **Class**: `A2M extends FormatPlayer`
- **Directive**: `@ts-nocheck` (same as other format drivers)

---

## 2. Static Data (inline constants)

| What | JS |
|---|---|
| `_panning[3]` | `const _panning = new Uint8Array([0x30, 0x10, 0x20])` |
| `def_vibtrem_table[256]` | `const def_vibtrem_table = new Uint8Array([...])` |
| `nFreq(note)` | Function returning `uint16_t` via a lookup table |
| All effect constants | `const` enum-like declarations |
| Register offset tables (`_ch_n`, `_ch_m`, `_ch_c`) | Flat `Uint16Array` for each percussion mode |

---

## 3. OPL Interface (3 functions → 3 inline methods)

| C++ | JS |
|---|---|
| `opl2out(reg, data)` | `this.opl.write(0, reg & 0xff, data)` |
| `opl3out(reg, data)` | `this.opl.write(reg < 0x100 ? 0 : 1, reg & 0xff, data)` |
| `opl3exp(data)` | `this.opl.write(1, data & 0xff, (data >> 8) & 0xff)` |

No `chip` tracking or `setchip()` calls.

---

## 4. Uint8Array Pool Layouts (editor_mode = true)

All pools pre-allocated in the constructor.

### Instrument Pool — `#instrPool: Uint8Array`

```
255 × 14 bytes = 3,570 bytes
```

| Offset | Field | Bytes |
|---|---|---|
| 0-10 | FM register block (OPL byte format) | 11 |
| 11 | panning | 1 |
| 12 | fine_tune (int8) | 1 |
| 13 | perc_voice | 1 |

### Instrument Extension Array — `#instrExt: InstrDataExt[]`

Parallel array, length = `instrInfo.count`, each entry:

| Field | Type | Meaning |
|---|---|---|
| `fmreg` | `number` | 1-based index into fmreg pool (0 = none) |
| `arpeggio` | `number` | 1-based arpeggio table index |
| `vibrato` | `number` | 1-based vibrato table index |
| `dis_fmreg_cols` | `number` | 28-bit bitmask of disabled FM register columns |

### FM Register Macro Pool — `#fmregPool: Uint8Array`

```
255 × 3,840 bytes = 979,200 bytes
```

| Offset | Field | Bytes |
|---|---|---|
| 0 | length | 1 |
| 1 | loop_begin | 1 |
| 2 | loop_length | 1 |
| 3 | keyoff_pos | 1 |
| 4 | arpeggio_table | 1 |
| 5 | vibrato_table | 1 |
| 6-3830 | 255 cells × 15 bytes | 3,825 |

Each cell (15 bytes):

| Offset | Field | Bytes |
|---|---|---|
| 0-10 | FM register block (same as FMInstData) | 11 |
| 11-12 | freq_slide (int16 LE) | 2 |
| 13 | panning | 1 |
| 14 | duration | 1 |

### Arpeggio/Vibrato Pool — `#arpvibPool: Uint8Array`

```
255 × 520 bytes = 132,600 bytes
```

| Offset | Field | Bytes |
|---|---|---|
| 0 | arpeggio.length | 1 |
| 1 | arpeggio.speed | 1 |
| 2 | arpeggio.loop_begin | 1 |
| 3 | arpeggio.loop_length | 1 |
| 4 | arpeggio.keyoff_pos | 1 |
| 5-259 | arpeggio.data | 255 |
| 260 | vibrato.length | 1 |
| 261 | vibrato.speed | 1 |
| 262 | vibrato.delay | 1 |
| 263 | vibrato.loop_begin | 1 |
| 264 | vibrato.loop_length | 1 |
| 265 | vibrato.keyoff_pos | 1 |
| 266-520 | vibrato.data (int8) | 255 |

### Pattern Event Pool — `#patternPool: Uint8Array`

```
128 × 20 × 256 × 6 bytes = 3,932,160 bytes
```

Index: `(pattern * channels + ch) * rows + row` → 6-byte event:

| Offset | Field |
|---|---|
| 0 | note |
| 1 | instr_def |
| 2 | eff[0].def |
| 3 | eff[0].val |
| 4 | eff[1].def |
| 5 | eff[1].val |

### Song Info — `#songinfo: Record<string, any>`

```ts
{
    songname: string,         // 42 chars max
    composer: string,         // 42 chars max
    instr_names: string[],    // 255 names, 42 chars each
    pattern_order: Uint8Array, // length 128
    tempo: number,
    speed: number,
    common_flag: number,
    patt_len: number,
    nm_tracks: number,
    macro_speedup: number,
    flag_4op: number,
    lock_flags: Uint8Array(20),
    bpm_rows_per_beat: number,
    bpm_tempo_finetune: number,
}
```

---

## 5. Bitfield Helper Classes

These are lightweight view objects (like `DataView`) — constructed on the fly, never stored permanently.

### `FMInstData` — wraps 11 bytes

All 23 getters + 23 setters mapping the C bitfields directly. Example:

```js
fm.multipM   // → this.#d[0] & 0x0f
fm.feedb     // → (this.#d[10] >> 1) & 7
fm.connect   // → this.#d[10] & 1
```

Setters keep the `Uint8Array` in sync. The pool is the one true store.

### `InstrData` — wraps 14 bytes

```js
get fm()        → new FMInstData(this.#d, 0)
get panning()   → this.#d[11] & 3
get fine_tune() → (this.#d[12] << 24) >> 24  // sign-extend
get perc_voice()→ this.#d[13]
```

### `RegTableDef` — wraps 15 bytes (macro cell)

```js
get fm()         → new FMInstData(this.#d, 0)
get freq_slide() → this.#d[11] | (this.#d[12] << 8)
get panning()    → this.#d[13] & 3
get duration()   → this.#d[14]
```

---

## 6. Per-Channel State — `#ch`

All `tCHDATA` fields as flat typed arrays of length 20 (channels):

| C field | JS | Size |
|---|---|---|
| `event_table[20]` | `#chEventTable` (Uint8Array) | 20 × 6 = 120 |
| `voice_table[20]` | `#chVoiceTable` (Uint8Array) | 20 |
| `freq_table[20]` | `#chFreqTable` (Uint16Array) | 40 |
| `zero_fq_table[20]` | `#chZeroFqTable` (Uint16Array) | 40 |
| `effect_table[2][20]` | `#chEffectTable` (Uint8Array) | 2 × 20 × 2 = 80 |
| `porta_table[2][20]` | `#chPortaTable` (Uint16Array + Uint8Array) | 2 × 20 × 3 |
| `macro_table[20]` | `#chMacroTable` (Uint16Array + Uint8Array) | 20 × ~12 |
| ... plus all remaining fields | matching typed arrays | ~2 KB total |

All `bool` fields → `Uint8Array(20)` with 0/1 values (`#chVolumeLock`, `#chPanLock`, `#chKeyoffLoop`, etc.)

Temporary view classes for per-channel sub-structures:
- `PortaTable` — freq + speed
- `ArpggTable` — state, note, add1, add2
- `VibrTable` / `TremTable` — pos, dir, speed, depth, fine
- `MacroTable` — fmreg_pos, arpg_pos, vib_pos, duration, counts, etc.
- `EffectEntry` — def + val

---

## 7. Decompression (5 standalone functions)

All operate on `Uint8Array` in/out:

| Algorithm | Lines (est.) |
|---|---|
| Sixpack | ~150 |
| LZW | ~100 |
| LZSS | ~100 |
| LZH | ~200 |
| aPlib | ~50 |

---

## 8. FormatPlayer Interface

| Method | Body |
|---|---|
| `static probe(buffer)` | `"_A2module_"` (bytes 0-9) or `"_A2tiny_module_"` (bytes 0-14) |
| `load(buffer)` | → `a2_import()` → detect type → decompress → parse headers → allocate pools → import instruments/fmreg/arpvib/patterns |
| `update()` | `newtimer()` → may call `poll_proc()` + `macro_poll_proc()` depending on tick counters → `return !songend` |
| `rewind()` | `opl.init()` → `init_player()` → set order 0 → reset all per-channel state |
| `getrefresh()` | `tempo * macro_speedup` (Hz), clamped 18-1000 |
| `gettype()` | `` `Adlib Tracker 2 (v${ffver})` `` or `` `Adlib Tracker 2 (tiny module v${ffver})` `` |
| `gettitle()` | `songinfo.songname` |
| `getauthor()` | `songinfo.composer` |
| `getinstruments()` | `instrInfo.count` |

---

## 9. Playback Engine (the main body)

| Group | Functions | Lines (est.) |
|---|---|---|
| **Tick dispatch** | `newtimer()`, `poll_proc()`, `macro_poll_proc()` | ~300 |
| **Row processing** | `play_line()`, `process_effects_prepare()`, `process_effects()`, `new_process_note()` | ~400 |
| **Note output** | `output_note()`, `key_on()`, `key_off()`, `change_freq()`, `release_sustaining_sound()` | ~150 |
| **Volume** | `set_volume()`, `set_ins_volume()`, `set_ins_volume_4op()`, `reset_ins_volume()`, `chanvol()` | ~100 |
| **Slides** | `portamento_up/down()`, `volume_slide()`, `slide_volume_up/down()` | ~100 |
| **Arpeggio** | `arpeggio()` | ~50 |
| **Vibrato/Tremolo** | `vibrato()`, `tremolo()`, `calc_vibrato_shift()` | ~100 |
| **Macro engine** | `init_macro_table()`, `macro_poll_proc()`, `_macro_speedup()` | ~250 |
| **Effects update** | `update_effects()`, `update_effects_slot()`, `update_fine_effects()`, `update_extra_fine_effects()` | ~200 |
| **Song navigation** | `set_current_order()`, `calc_following_order()`, `update_song_position()` | ~100 |
| **Timer / init** | `init_irq()`, `done_irq()`, `update_timer()`, `update_playback_speed()`, `set_clock_rate()` | ~100 |
| **Pattern looping** | `no_loop()` | ~50 |

Total C++: ~2250 lines → JS: ~1800 lines expected.

---

## 10. Mapping C++ Access Patterns

The getter/setter design lets playback code look near-identical:

| C++ | JS |
|---|---|
| `fm->multipM` | `fm.multipM` |
| `ch->freq_table[chan]` | `#chFreqTable[chan]` |
| `songinfo->tempo` | `songinfo.tempo` |
| `eventsinfo->events[...]` | `#patternPool[...]` |
| `rtd->fm` | `rtd.fm` (returns FMInstData view) |
| `event->eff[0].def` | accessed via index arithmetic on `#patternPool` |

---

## 11. Build & Integration

1. Import in `registry.ts`:
   ```ts
   import A2M from "./a2m";
   export const formats = [LAA, DRO, RAW, RAD, A2M, IMF];
   ```
2. `static probe()` checks magic → no heuristic scan needed
3. Build commands unchanged: `npm run build` + `npx tsc --noEmit`

---

## 12. Summary

| Component | C++ lines | JS lines (est.) |
|---|---|---|
| Constants + OPL helpers | 50 | 40 |
| Data structures + bitfield classes | 700 (header) | 200 |
| Decompression (5 algos) | 600 | 500 |
| Loader (a2m/a2t import, parse) | 1000 | 800 |
| Playback engine | 2100 | 1600 |
| **Total** | **~4450** | **~3100** |

Estimated effort: 1-2 weeks of focused work.
