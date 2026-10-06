import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL(`${tmpdir()}/mission-forge-browser/node_modules/playwright/index.mjs`).href);
import { mkdir, writeFile } from 'node:fs/promises';

const mode = process.argv[2] || 'before';
const dir = `screenshots/${mode}`;
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
await page.goto('http://127.0.0.1:8081/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
await page.screenshot({ path: `${dir}/opening.png` });
const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('mission-forge-v3') || '{}'));
for (const phase of ['build', 'flight', 'report']) {
  await page.evaluate(({ saved, phase }) => localStorage.setItem('mission-forge-v3', JSON.stringify({ ...saved, state: { ...saved.state, phase, mission: 'Mars', landing: phase === 'report' ? 6 : 0 } })), { saved, phase });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${dir}/${phase}.png` });
}
await writeFile(`${dir}/browser-errors.json`, JSON.stringify(errors, null, 2));
console.log(JSON.stringify({ mode, errors }));
await browser.close();
