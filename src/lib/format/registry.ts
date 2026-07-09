//
// Format registry — single source of truth for all supported format drivers
//

import LAA from "./laa";
import DRO from "./dro";
import IMF from "./imf";
import RAW from "./raw";
import RAD2 from "./rad2";
import A2M from "./a2m";
import CMF from "./cmf";

export const formats = [
    LAA, DRO, RAW, RAD2, A2M, CMF,
    // Formats with no magic header (IMF) — heuristic probe
    IMF
];
