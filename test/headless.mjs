import { chromium } from 'playwright';
import { createServer } from 'vite';

const PORT = 8765;

async function main() {
    // Start Vite dev server
    const server = await createServer({
        configFile: './vite.config.ts',
        server: { port: PORT, strictPort: true },
    });
    await server.listen();

    console.log(`Vite dev server on http://localhost:${PORT}`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ bypassCSP: true });
    const page = await context.newPage();

    const logs = [];
    page.on('console', msg => {
        logs.push({ type: msg.type(), text: msg.text() });
        console.log('[BROWSER]', msg.type(), ':', msg.text());
    });
    page.on('pageerror', err => {
        logs.push({ type: 'pageerror', text: err.message });
        console.log('[PAGE_ERROR]', err.message);
    });

    console.log('Loading page...');
    await page.goto(`http://localhost:${PORT}/src/index.html`, { waitUntil: 'networkidle', timeout: 30000 });

    // Check player object
    const hasPlayer = await page.evaluate(() => typeof player !== 'undefined' && player !== null);
    console.log('Player available:', hasPlayer);
    if (!hasPlayer) { throw new Error('Player not loaded'); }

    const hasWorklet = await page.evaluate(() => typeof AudioWorklet !== 'undefined');
    console.log('AudioWorklet supported:', hasWorklet);

    // Log all custom events from player
    await page.evaluate(() => {
        const eventTypes = ['debug', 'debugWarn', 'metadata', 'load', 'context', 'currentTime', 'regCheck'];
        for (const t of eventTypes) {
            player.addEventListener(t, (e) => console.log('[EVENT_' + t + ']', JSON.stringify(e.detail)));
        }
    });

    // Set up polling to detect OPL writes  
    await page.evaluate(() => {
        window._prevBank0 = null;
        window._pollCount = 0;
        window._oplWriteDetected = false;
        window._pollTimer = setInterval(() => {
            if (!player.registerBank0) return;
            if (!window._prevBank0) {
                window._prevBank0 = new Uint8Array(player.registerBank0);
                return;
            }
            let changed = false;
            for (let i = 0; i < 256; i++) {
                if (player.registerBank0[i] !== window._prevBank0[i]) {
                    if (!changed) console.log('[REG_CHANGE] first change: reg 0x' + i.toString(16) + ' = 0x' + player.registerBank0[i].toString(16));
                    changed = true;
                    window._oplWriteDetected = true;
                }
            }
            if (changed) {
                window._prevBank0 = new Uint8Array(player.registerBank0);
            }
            window._pollCount++;
        }, 100);
    });

    // Load A2M test file
    console.log('Loading A2M file...');
    const result = await page.evaluate(async () => {
        try {
            const resp = await fetch('/test/data/fm-troni.a2m');
            const buf = await resp.arrayBuffer();
            // Use proper async load
            if (!player.audioContext) {
                await player.initContext();
            }
            player.worklet.port.postMessage({ cmd: 'load', value: buf });
            return { ok: true, size: buf.byteLength };
        } catch(e) {
            return { ok: false, error: e.message };
        }
    });
    console.log('Load result:', JSON.stringify(result));
    if (!result.ok) { throw new Error('File load failed: ' + result.error); }

    // Wait for playback to initialize
    await page.waitForTimeout(3000);

    // Check state
    const state = await page.evaluate(() => ({
        audioCtx: player.audioContext ? player.audioContext.state : 'null',
        worklet: player.worklet ? 'exists' : 'null',
        registerBank0: player.registerBank0 ? player.registerBank0.length + ' bytes' : 'null',
        registerBank1: player.registerBank1 ? player.registerBank1.length + ' bytes' : 'null',
    }));
    console.log('Player state:', JSON.stringify(state, null, 2));

    // Check if any register writes happened (registerBank should have non-zero values)
    const regActivity = await page.evaluate(() => {
        if (!player.registerBank0) return { bank0: 'null', bank1: 'null' };
        let nonZero0 = 0, nonZero1 = 0;
        for (let i = 0; i < 256; i++) {
            if (player.registerBank0[i]) nonZero0++;
            if (player.registerBank1[i]) nonZero1++;
        }
        // Check specific OPL3 registers that should be set (0x20, 0x40, 0x60, 0x80, 0xA0, 0xC0, 0xE0)
        const regs20_35 = [];
        for (let i = 0x20; i <= 0x35; i++) regs20_35.push(player.registerBank0[i]);
        const regs40_55 = [];
        for (let i = 0x40; i <= 0x55; i++) regs40_55.push(player.registerBank0[i]);
        const regsA0_A8 = [];
        for (let i = 0xA0; i <= 0xA8; i++) regsA0_A8.push(player.registerBank0[i]);
        const regsB0_B8 = [];
        for (let i = 0xB0; i <= 0xB8; i++) regsB0_B8.push(player.registerBank0[i]);
        // Check OPL3 extensions
        const regs104_105 = [player.registerBank1[4], player.registerBank1[5]];
        return {
            nonZeroBank0: nonZero0,
            nonZeroBank1: nonZero1,
            regs20_35: regs20_35.map(v => v.toString(16).padStart(2,'0')),
            regs40_55: regs40_55.map(v => v.toString(16).padStart(2,'0')),
            regsA0_A8: regsA0_A8.map(v => v.toString(16).padStart(2,'0')),
            regsB0_B8: regsB0_B8.map(v => v.toString(16).padStart(2,'0')),
            regs104_105: regs104_105.map(v => v.toString(16).padStart(2,'0')),
        };
    });
    console.log('Register activity:', JSON.stringify(regActivity, null, 2));

    // Check for info text (metadata event)
    const pageState = await page.evaluate(() => ({
        info: document.querySelector('#info')?.textContent || '(empty)',
        counter: document.querySelector('.counter')?.textContent || '(empty)',
    }));
    console.log('Page UI:', JSON.stringify(pageState));

    // Print all console logs
    console.log('\n=== ALL CONSOLE LOGS ===');
    logs.forEach(l => console.log(`[${l.type}] ${l.text}`));

    const errors = logs.filter(l => l.type === 'error' || l.type === 'pageerror');
    console.log(`\n${errors.length > 0 ? 'FAIL: ' + errors.length + ' errors' : 'PASS: No errors'}`);

    await browser.close();
    await server.close();
    process.exit(errors.length > 0 ? 1 : 0);
}

main().catch(err => {
    console.error('Test failed:', err.message);
    process.exit(1);
});
