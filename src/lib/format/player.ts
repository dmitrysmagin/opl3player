export abstract class FormatPlayer {
    opl: any;

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
}
