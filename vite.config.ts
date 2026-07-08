import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
    if (mode === 'worklet') {
        return {
            build: {
                lib: {
                    entry: resolve(__dirname, 'src/lib/worklet-processor.ts'),
                    formats: ['iife'],
                    name: 'OPL3_AudioWorklet',
                    fileName: () => 'opl3-worklet.js',
                },
                outDir: resolve(__dirname, 'src/lib'),
                emptyOutDir: false,
                minify: true,
            },
        };
    }

    return {
        root: resolve(__dirname, 'src/app'),
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src'),
                '$lib': resolve(__dirname, 'src/lib'),
            }
        },
        plugins: [
            svelte({
                compilerOptions: {
                    runes: true,
                },
            }),
            tailwindcss(),
            viteStaticCopy({
                targets: [
                    {
                        src: 'modules',
                        dest: '.',
                    },
                ],
            }),
        ],

        server: {
            open: true,
            headers: {
                'Cross-Origin-Opener-Policy': 'same-origin',
                'Cross-Origin-Embedder-Policy': 'require-corp',
            },
        },
        build: {
            outDir: resolve(__dirname, 'dist'),
            emptyOutDir: true,
            minify: true,
            rollupOptions: {
                input: resolve(__dirname, 'src/app/index.html'),
            },
            copyPublicDir: true,
        },
    };
});
