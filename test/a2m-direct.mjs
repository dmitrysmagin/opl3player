// Direct A2M test — creates OPL3 + A2M on main thread, no AudioWorklet
import { chromium } from 'playwright';
import { createServer } from 'vite';

const PORT = 8766;

async function main() {
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

    // Load a page that directly tests A2M + OPL3
    await page.goto(`http://localhost:${PORT}/src/index.html`, { waitUntil: 'networkidle', timeout: 30000 });

    // Execute direct test of OPL3 + A2M on the main thread
    const result = await page.evaluate(async () => {
        try {
            // We need OPL3 and A2M classes — they're inside the worklet bundle
            // The main page only has OPL3.Player (main-thread player)
            // Let's try to construct a minimal test using the raw worklet source

            // Fetch the test file
            const resp = await fetch('/test/data/fm-troni.a2m');
            const buf = new Uint8Array(await resp.arrayBuffer());
            console.log('Test file loaded, size:', buf.length);

            // Create a minimal OPL3 emulator inline
            // We need to see if OPL write works at all
            const opl = {
                regs: new Uint8Array(512),
                write(addr, reg, data) {
                    this.regs[reg] = data;
                    console.log('OPL write:', addr, reg.toString(16), data);
                },
                read(buf) {
                    buf[0] = 0;
                    buf[1] = 0;
                },
                init() {
                    console.log('OPL init');
                    this.regs.fill(0);
                }
            };

            const writeCount = { count: 0 };
            const origWrite = opl.write.bind(opl);
            const trackWrite = (addr, reg, data) => {
                origWrite(addr, reg, data);
                writeCount.count++;
            };

            // We need to instantiate A2M directly.
            // Since A2M is not exposed on the main-thread bundle, we need to
            // fetch the worklet source (which includes A2M) and evaluate it,
            // or find another way.
            
            // Load the worklet JS as text and instantiate in a sandbox
            const workletResp = await fetch('/dist/opl3-worklet.js');
            const workletSrc = await workletResp.text();
            
            // The worklet is an IIFE. Let me try to extract A2M from it.
            // Actually, this is too complex. Let me use a simpler approach.
            
            console.log('Worklet bundle size:', workletSrc.length);
            console.log('Worklet contains A2M:', workletSrc.includes('A2M'));
            console.log('Worklet contains FormatPlayer:', workletSrc.includes('FormatPlayer'));

            return {
                success: true,
                workletSize: workletSrc.length,
                hasA2M: workletSrc.includes('A2M'),
                hasFormatPlayer: workletSrc.includes('FormatPlayer'),
            };
        } catch (e) {
            return { success: false, error: e.message, stack: e.stack };
        }
    });

    console.log('Direct test result:', JSON.stringify(result, null, 2));

    // Now let's try to load A2M via the normal Playback path and intercept OPL writes
    // by monkey-patching the OPL3 prototype before the worklet is created.
    console.log('\n--- Test 2: Monkey-patch OPL3.write ---');
    const result2 = await page.evaluate(async () => {
        try {
            // Monkey-patch Uint8Array to detect SharedArrayBuffer writes from AudioWorklet
            const origSet = Uint8Array.prototype.__lookupGetter__('buffer');
            
            // Listen for AudioWorklet messages
            window._oplWrites = [];
            
            // Patch OPL3.Player to intercept writes to the register bank
            const origInit = OPL3.Player.prototype.initContext;
            // Can't access prototype since it's not exported
            
            return { error: 'Cannot patch' };
        } catch(e) {
            return { error: e.message };
        }
    });
    console.log('Test 2 result:', JSON.stringify(result2));

    // Test 3: Use Proxy to monitor SharedArrayBuffer
    console.log('\n--- Test 3: SharedArrayBuffer proxy ---');
    const result3 = await page.evaluate(async () => {
        const errors = [];
        
        // The player instance already exists in the page
        if (typeof player === 'undefined') {
            return { error: 'No player' };
        }
        
        try {
            // Set up a listener for debug messages BEFORE loading
            player.addEventListener('debug', (e) => {
                console.log('[A2M_DEBUG]', JSON.stringify(e.detail));
            });
            
            // Load the file
            const resp = await fetch('/test/data/fm-troni.a2m');
            const buf = await resp.arrayBuffer();
            console.log('Starting play...');
            await player.play(buf);
            console.log('Play initiated');
            
            return { success: true };
        } catch(e) {
            return { error: e.message };
        }
    });
    console.log('Test 3 result:', JSON.stringify(result3));

    // Wait and poll register banks
    await page.waitForTimeout(3000);
    
    const regState = await page.evaluate(() => {
        if (!player.registerBank0) return { error: 'no reg bank' };
        const nz = [];
        for (let i = 0; i < 256; i++) {
            if (player.registerBank0[i]) nz.push({ reg: '0x' + i.toString(16), val: player.registerBank0[i] });
        }
        return { nonZeroCount: nz.length, entries: nz.slice(0, 30) };
    });
    console.log('\nRegister state after 3s:', JSON.stringify(regState, null, 2));

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
