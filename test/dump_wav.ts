import { formats } from "../src/lib/format/registry";
import OPL3 from "../src/lib/opl3";
import { FormatPlayer } from "../src/lib/format/player";
import * as fs from "fs";

export class WavPlayer {
    opl: OPL3;
    format: FormatPlayer | null = null;
    sampleRate = 48000;

    constructor(sampleRate = 48000) {
        this.opl = new OPL3();
        this.sampleRate = sampleRate;
    }

    load(buffer: Uint8Array): boolean {
        for (const FormatType of formats) {
            if (FormatType.probe && FormatType.probe(buffer)) {
                this.format = new FormatType(this.opl, {});
                try {
                    this.format.load(buffer);
                    return true;
                } catch (e) {
                    this.format = null;
                    return false;
                }
            }
        }
        return false;
    }

    generate(maxSamples = 0): Int16Array {
        if (!this.format) throw new Error("No format loaded");
        const frame = new Int16Array(2);
        const chunks: Int16Array[] = [];
        let total = 0;

        while (!maxSamples || total < maxSamples) {
            const refresh = this.format.getrefresh() || 50;
            const framesPerTick = Math.max(1, Math.round(this.sampleRate / refresh));

            for (let i = 0; i < framesPerTick && (!maxSamples || total < maxSamples); i++) {
                this.opl.read(frame);
                chunks.push(new Int16Array([frame[0], frame[1]]));
                total += 2;
            }

            if (!this.format.update()) break;
        }

        const result = new Int16Array(total);
        let offset = 0;
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }
        return result;
    }
}

function writeWav(path: string, samples: Int16Array, sampleRate: number): void {
    const channels = 2;
    const bitsPerSample = 16;
    const byteRate = sampleRate * channels * bitsPerSample / 8;
    const blockAlign = channels * bitsPerSample / 8;
    const dataSize = samples.length * bitsPerSample / 8;
    const fileSize = 36 + dataSize;

    const buf = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buf);

    const writeStr = (off: number, s: string) => {
        for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
    };

    writeStr(0, "RIFF");
    view.setUint32(4, fileSize, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeStr(36, "data");
    view.setUint32(40, dataSize, true);

    const sampleView = new Int16Array(buf, 44);
    sampleView.set(samples);

    fs.writeFileSync(path, new Uint8Array(buf));
}

function main(): void {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error("Usage: tsx test/dump_wav.ts <input.mod> [output.wav] [--max-samples <n>]");
        process.exit(1);
    }

    const inputPath = args[0];
    const outputPath = args[1] || inputPath.replace(/\.[^.]+$/, "") + ".wav";
    const sampleRate = 48000;

    // Parse optional --max-samples flag (safety limit, 0 = unlimited)
    const maxIdx = args.indexOf("--max-samples");
    const maxArg = maxIdx >= 0 ? parseInt(args[maxIdx + 1], 10) : 0;
    const maxSamples = maxArg > 0 ? maxArg * 2 : 0; // convert frames to samples (L+R)

    const buffer = fs.readFileSync(inputPath);
    const player = new WavPlayer();

    if (!player.load(new Uint8Array(buffer))) {
        console.error("Failed to load " + inputPath);
        process.exit(1);
    }

    const meta = player.format!;
    console.error("Loaded: " + meta.gettype());
    console.error("Title: " + meta.gettitle());
    console.error("Author: " + meta.getauthor());

    if (maxSamples) {
        console.error("Generating audio (max " + (maxSamples / 2) + " samples)...");
    } else {
        console.error("Generating audio (until module ends)...");
    }
    const samples = player.generate(maxSamples);

    const seconds = samples.length / 2 / sampleRate;
    console.error("Generated " + samples.length + " samples (" + seconds.toFixed(1) + "s)");
    console.error("Writing " + outputPath + " (" + (samples.length * 2 / 1048576).toFixed(1) + " MiB)...");
    writeWav(outputPath, samples, sampleRate);
    console.error("Done.");
}

if (require.main === module) main();
