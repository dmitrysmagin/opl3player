export interface FormatInfo {
    title: string;
    author: string;
    desc: string;
    type: string;
    speed: number;
    pattern: number;
    row: number;
    order: number;
    orders: number;
    patterns: number;
    subsong: number;
    subsongs: number;
    instruments: number;
    instrument: string;
}

export abstract class FormatPlayer {
    opl: any;

    /** One-shot flag: true when the song loops back to the start position */
    _loopStart = false;
    /** One-shot flag: true when the song reaches the loop end position */
    _loopEnd = false;

    constructor(opl: any, options?: Record<string, any>) {
        this.opl = opl;
    }

    abstract load(buffer: Uint8Array): void;
    abstract update(): boolean;
    abstract rewind(subsong?: number): void;
    abstract getrefresh(): number;
    abstract gettype(): string;

    gettitle(): string { return ''; }
    getauthor(): string { return ''; }
    getdesc(): string { return ''; }
    getpatterns(): number { return 0; }
    getpattern(): number { return 0; }
    getorders(): number { return 0; }
    getorder(): number { return 0; }
    getrow(): number { return 0; }
    getspeed(): number { return 0; }
    getsubsongs(): number { return 1; }
    getsubsong(): number { return 0; }
    getinstruments(): number { return 0; }
    getinstrument(n: number): string { return ''; }
    getcontext(): any { return undefined; }

    /**
     * Returns one-shot loop event flags and clears them internally.
     * - loopStart: true when the song loops back (jumps to earlier position)
     * - loopEnd: true when the song reaches the loop end point
     * After calling getloop(), both flags are reset to false until the next event.
     */
    getloop(): { loopStart: boolean; loopEnd: boolean } {
        const result = { loopStart: this._loopStart, loopEnd: this._loopEnd };
        this._loopStart = false;
        this._loopEnd = false;
        return result;
    }
}
