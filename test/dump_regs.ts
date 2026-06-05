import { formats } from "../src/lib/format/registry";
import OPL3 from "../src/lib/opl3";
import { FormatPlayer } from "../src/lib/format/player";
import * as fs from "fs";

export class RegDumpPlayer {
    opl: OPL3;
    format: FormatPlayer | null = null;
    bank0: Uint8Array;
    bank1: Uint8Array;
    snapshots: string[] = [];

    constructor() {
        this.opl = new OPL3();
        this.bank0 = new Uint8Array(256);
        this.bank1 = new Uint8Array(256);

        const origWrite = this.opl.write.bind(this.opl);
        this.opl.write = (array: number, address: number, data: number) => {
            origWrite(array, address, data);
            if (array === 0) this.bank0[address] = data;
            else this.bank1[address] = data;
        };
    }

    load(buffer: Uint8Array): boolean {
        for (const FormatType of formats) {
            if (FormatType.probe && FormatType.probe(buffer)) {
                this.format = new FormatType(this.opl, {});
                try {
                    this.format.load(buffer);
                    this.snapshot();
                    return true;
                } catch (e) {
                    this.format = null;
                    return false;
                }
            }
        }
        return false;
    }

    snapshot(): void {
        const hex0 = Array.from(this.bank0).map(b => b.toString(16).padStart(2, "0")).join("");
        const hex1 = Array.from(this.bank1).map(b => b.toString(16).padStart(2, "0")).join("");
        this.snapshots.push("0 " + hex0);
        this.snapshots.push("1 " + hex1);
    }

    update(): boolean {
        if (!this.format) return false;
        const playing = this.format.update();
        this.snapshot();
        return playing;
    }

    run(maxUpdates = 0): void {
        for (let i = 0; maxUpdates ? i < maxUpdates : true; i++) {
            if (!this.update()) break;
        }
    }

}

function main(): void {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error("Usage: tsx test/dump_regs.ts <input.mod> [output.txt] [--max-updates <n>]");
        process.exit(1);
    }

    const inputPath = args[0];
    const outputPath = args[1] || inputPath.replace(/\.[^.]+$/, "") + "_regs.txt";

    const maxIdx = args.indexOf("--max-updates");
    const maxUpdates = maxIdx >= 0 ? parseInt(args[maxIdx + 1], 10) : 0;

    const buffer = fs.readFileSync(inputPath);
    const player = new RegDumpPlayer();

    if (!player.load(new Uint8Array(buffer))) {
        console.error("Failed to load " + inputPath);
        process.exit(1);
    }

    const meta = player.format!;
    console.error("Loaded: " + meta.gettype());
    console.error("Title: " + meta.gettitle());
    console.error("Author: " + meta.getauthor());

    if (maxUpdates) {
        console.error("Running " + maxUpdates + " updates...");
    } else {
        console.error("Running until module ends...");
    }
    player.run(maxUpdates);

    const output = player.snapshots.join("\n") + "\n";
    fs.writeFileSync(outputPath, output);
    console.error("Wrote " + outputPath + " (" + player.snapshots.length + " lines)");
}

if (require.main === module) main();
