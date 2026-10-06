import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(pathToFileURL(`${tmpdir()}/mission-forge-browser/node_modules/playwright/index.mjs`).href);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [], visited = [];
page.on('pageerror', e => errors.push(e.message));
await mkdir('screenshots/journey', { recursive: true });
async function phase(name) {
  await page.waitForFunction(name => document.querySelector('.mf-game-viewport')?.getAttribute('data-phase') === name, name, { timeout: 120000 });
  visited.push(name); console.log(name);
}
async function shot(name) { await page.waitForTimeout(1600); await page.screenshot({ path: `screenshots/journey/${name}.png` }); }
try {
  await page.goto('http://127.0.0.1:8081/', { waitUntil: 'networkidle' });
  await shot('opening');
  await page.getByRole('button', { name: 'Start mission', exact: true }).click(); await phase('missions');
  await page.getByRole('button', { name: /02 Mars/ }).click(); await shot('destination');
  for (const next of ['brief','route','routePreview','objectives','budget','fuel','power','comms','instruments','overview','craft','build']) {
    await page.locator('.gm-flow-actions button').last().click(); await phase(next);
  }
  await shot('hangar');
  await page.getByRole('button', { name: 'View NASA MRO', exact: true }).click();
  await page.waitForFunction(() => !document.body.innerText.includes('Loading NASA reference spacecraft'));
  await page.waitForTimeout(4500); await shot('nasa-mro');
  if (await page.getByText('Reference model unavailable.', { exact: false }).count()) throw new Error('MRO model load failed');
  await page.getByRole('button', { name: 'Rotate left', exact: true }).click();
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await page.getByRole('button', { name: 'Reset camera', exact: true }).click();
  await page.getByRole('button', { name: 'Back to my craft', exact: true }).click();
  await page.getByRole('button', { name: 'Run launch check', exact: true }).click(); await phase('check');
  await page.waitForTimeout(6500); await shot('readiness');
  const ack = page.locator('.mf-poll-ack input'); if (await ack.count()) await ack.check();
  await page.getByRole('button', { name: 'Launch', exact: true }).click(); await phase('launch'); await shot('launch');
  await page.getByRole('button', { name: 'Skip to orbit' }).click();
  await page.getByRole('button', { name: 'Injection burn', exact: true }).click({ timeout: 120000 }); await phase('flight');
  await page.getByRole('button', { name: 'Pause flight', exact: true }).click(); await shot('flight');
  await page.getByRole('button', { name: 'Cockpit', exact: true }).click(); await shot('cockpit');
  await page.getByRole('button', { name: 'Mission control', exact: true }).click();
  await page.getByRole('button', { name: '20×', exact: true }).click(); await phase('encounter'); await shot('encounter');
  await page.getByRole('button', { name: /Shield forward/ }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click(); await phase('flight'); await phase('landing');
  for (const name of ['Deorbit burn','Atmospheric entry','Parachute deploy','Heat shield jettison','Powered descent','Touchdown']) await page.getByRole('button', { name, exact: true }).click();
  await shot('landing'); await page.getByRole('button', { name: 'Mission report', exact: true }).click(); await phase('report'); await shot('report');
  await page.getByRole('button', { name: 'Redesign & retry', exact: true }).click(); await phase('build');
  for (const viewport of [{ width: 844, height: 390 }, { width: 390, height: 844 }, { width: 667, height: 375 }]) {
    await page.setViewportSize(viewport); await shot(`hangar-${viewport.width}x${viewport.height}`);
    const box = await page.locator('.mf-game-viewport').boundingBox();
    if (Math.abs(box.width - viewport.width) > 2 || Math.abs(box.height - viewport.height) > 2) throw new Error(`Stage not full screen: ${JSON.stringify(box)}`);
    await page.getByRole('button', { name: 'Run launch check', exact: true }).click(); await phase('check'); await shot(`check-${viewport.width}x${viewport.height}`);
    await page.getByRole('button', { name: 'Hangar', exact: true }).click(); await phase('build');
  }
} catch (e) { errors.push(e.stack); await shot('failure'); }
await writeFile('screenshots/journey/results.json', JSON.stringify({ browser: await browser.version(), renderer: 'Chrome headless ANGLE SwiftShader (software rendering)', visited, errors }, null, 2));
console.log(JSON.stringify({ visited, errors })); await browser.close();
if (errors.length) process.exitCode = 1;
