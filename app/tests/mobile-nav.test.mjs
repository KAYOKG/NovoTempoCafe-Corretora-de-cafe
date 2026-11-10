import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Run against the local Vite server: node --test tests/mobile-nav.test.mjs
test('header fits 320–1024px and mobile navigation supports keyboard use', async () => {
  const profile = await mkdtemp(join(tmpdir(), 'novotempo-mobile-'));
  const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
  ], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
  let ws;
  try {
    const endpoint = await new Promise((resolve, reject) => {
      let output = '';
      const timeout = setTimeout(() => reject(new Error('Chrome did not start')), 15000);
      chrome.on('error', reject);
      chrome.stderr.on('data', chunk => {
        output += chunk;
        const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (match) { clearTimeout(timeout); resolve(match[1]); }
      });
    });
    const targets = await (await fetch(`http://${new URL(endpoint).host}/json/list`)).json();
    ws = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
    await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
    let id = 0;
    const pending = new Map();
    ws.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (pending.has(message.id)) {
        const { resolve, reject } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      }
    });
    const cdp = (method, params = {}) => new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`CDP timeout: ${method}`)), 10000);
      pending.set(++id, { resolve: value => { clearTimeout(timeout); resolve(value); }, reject: error => { clearTimeout(timeout); reject(error); } });
      ws.send(JSON.stringify({ id, method, params }));
    });
    const evaluate = async expression => {
      const result = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    await evaluate('1 + 1');
    await cdp('Page.navigate', { url: process.env.SITE_URL || 'http://127.0.0.1:5174/NovoTempoCafe-Corretora-de-cafe/' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await evaluate(`new Promise(resolve => { const poll = () => document.querySelector('header') ? resolve(true) : setTimeout(poll, 50); poll(); })`);
    for (const width of [320, 360, 390, 480, 639, 640, 768, 1024]) {
      await cdp('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 1, mobile: false });
      const measurement = await evaluate(`new Promise(resolve => setTimeout(() => {
        const header = document.querySelector('header');
        const brand = header.querySelector('a[aria-label]').getBoundingClientRect();
        const menu = header.querySelector('button[aria-expanded]');
        const targets = menu ? [menu] : [...header.querySelectorAll('a[href]')].slice(1);
        const boxes = targets.map(a => a.getBoundingClientRect());
        resolve({ menu: !!menu, overlap: boxes.some(r => brand.left < r.right && brand.right > r.left && brand.top < r.bottom && brand.bottom > r.top), fits: [brand, ...boxes].every(r => r.left >= 0 && r.right <= innerWidth), touch: boxes.every(r => r.width >= 44 && r.height >= 44), boxes: boxes.map(r => ({width:r.width,height:r.height})) });
      }, 100))`);
      console.log(`${width}px: ${JSON.stringify(measurement)}`);
      assert.equal(measurement.overlap, false, `overlap at ${width}px`);
      assert.equal(measurement.fits, true, `overflow at ${width}px`);
      assert.equal(measurement.menu, width < 640, `menu breakpoint at ${width}px`);
      assert.equal(measurement.touch, true, `touch target at ${width}px`);
    }
    await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 800, deviceScaleFactor: 1, mobile: false });
    await evaluate(`new Promise(resolve => setTimeout(resolve, 100))`);
    await evaluate(`document.querySelector('header button').focus(); document.querySelector('header button').click()`);
    assert.equal(await evaluate(`!!document.querySelector('dialog[open]')`), true);
    assert.equal(await evaluate(`document.querySelector('header button').getAttribute('aria-expanded')`), 'true');
    const links = await evaluate(`Array.from(document.querySelectorAll('dialog[open] a[href]')).map(a => ({ href: a.getAttribute('href'), height: a.getBoundingClientRect().height }))`);
    assert.deepEqual(links.map(a => a.href), ['#servicos', '#quem-somos', '#contato']);
    assert.ok(links.every(a => a.height >= 44));
    assert.equal(await evaluate(`Array.from(document.querySelectorAll('dialog[open] button')).every(button => { const r = button.getBoundingClientRect(); return r.width >= 44 && r.height >= 44; })`), true, 'close target is at least 44px');
    for (let i = 0; i < 10; i++) {
      await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
      await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
      assert.equal(await evaluate(`!!document.activeElement.closest('dialog[open]')`), true, 'focus stays inside menu');
    }
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await evaluate(`new Promise(resolve => setTimeout(resolve, 400))`);
    assert.equal(await evaluate(`!!document.querySelector('dialog[open]')`), false);
    assert.equal(await evaluate(`document.querySelector('header button').getAttribute('aria-expanded')`), 'false');
    assert.equal(await evaluate(`document.activeElement === document.querySelector('header button')`), true);
    await evaluate(`document.querySelector('header button').click()`);
    await evaluate(`document.querySelector('dialog[open] a[href="#contato"]').click()`);
    await evaluate(`new Promise(resolve => setTimeout(resolve, 400))`);
    assert.equal(await evaluate(`location.hash`), '#contato');
    assert.equal(await evaluate(`!!document.querySelector('dialog[open]')`), false, 'navigation closes the drawer');
    await evaluate(`document.querySelector('header button').focus(); document.querySelector('header button').click()`);
    await cdp('Emulation.setDeviceMetricsOverride', { width: 640, height: 800, deviceScaleFactor: 1, mobile: false });
    await evaluate(`new Promise(resolve => setTimeout(resolve, 100))`);
    assert.equal(await evaluate(`!!document.querySelector('dialog[open]')`), false, 'desktop resize dismisses the drawer');
    const iframeFits = await evaluate(`(async () => {
      const frame = document.createElement('iframe');
      frame.style.width = '390px';
      frame.src = location.pathname;
      const loaded = new Promise(resolve => frame.onload = resolve);
      document.body.append(frame);
      try {
        await loaded;
        await new Promise(resolve => { const poll = () => frame.contentDocument.querySelector('header button') ? resolve() : setTimeout(poll, 50); poll(); });
        const header = frame.contentDocument.querySelector('header');
        const brand = header.querySelector('a[aria-label]').getBoundingClientRect();
        const menu = header.querySelector('button').getBoundingClientRect();
        return brand.right <= menu.left && menu.right <= 390 && menu.height >= 44;
      } finally { frame.remove(); }
    })()`);
    assert.equal(iframeFits, true, '390px fixed-width iframe has no overlap');
  } finally {
    ws?.close();
    chrome.kill();
    await new Promise(resolve => chrome.exitCode !== null ? resolve() : chrome.once('exit', resolve));
    assert.ok(profile.startsWith(join(tmpdir(), 'novotempo-mobile-')));
    await rm(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  }
});
