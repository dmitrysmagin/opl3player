//
// Format registry — single source of truth for all supported format drivers
//

import LAA from "./laa";
import DRO from "./dro";
import IMF from "./imf";
import RAW from "./raw";
import RAD from "./rad";

export const formats = [
    LAA, DRO, RAW, RAD,
    // Formats with no magic header (IMF) — heuristic probe
    IMF
];
