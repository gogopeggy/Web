// Renders the CV Home mockup to docs/mockups/cv-home/shots/.
//
// Requires playwright-core and a local Chrome install (no browser download).
// playwright-core is deliberately NOT a dependency of this app, so point the
// script at an install elsewhere:
//
//   mkdir %TEMP%\pw && cd %TEMP%\pw && npm i playwright-core
//   set PLAYWRIGHT_CORE=%TEMP%\pw\node_modules\playwright-core\index.js
//   node screenshots.mjs
//
// Without PLAYWRIGHT_CORE it falls back to a normal resolve, which works when
// run from a directory that has playwright-core installed.
//
// This is a design-review artifact, not part of the app build.

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const pw = await import(
	process.env.PLAYWRIGHT_CORE
		? pathToFileURL(process.env.PLAYWRIGHT_CORE).href
		: 'playwright-core'
);
// playwright-core is CJS; importing it by file path gives the exports on .default
const { chromium } = pw.chromium ? pw : pw.default;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'shots');
const base = pathToFileURL(path.join(HERE, 'index.html')).href;

const browser = await chromium.launch({ channel: 'chrome' });

async function shot(name, { width, height, query = '', full = false, clip = null, scale = 2 }) {
	const ctx = await browser.newContext({
		viewport: { width, height },
		deviceScaleFactor: scale,
		isMobile: width < 600,
		hasTouch: width < 600,
	});
	const page = await ctx.newPage();
	await page.goto(base + query, { waitUntil: 'load' });
	await page.waitForTimeout(1400);
	await page.screenshot({
		path: path.join(OUT, name + '.png'),
		fullPage: full,
		clip: clip || undefined,
	});
	console.log('wrote', name + '.png');
	await ctx.close();
}

// desktop, above the fold, natural animated state (card 1 open)
await shot('1-desktop-top', { width: 1280, height: 860 });

// desktop, whole page, all collapsed -> the timeline at a glance
await shot('2-desktop-collapsed', {
	width: 1280,
	height: 860,
	query: '?reveal=all&collapse=all',
	full: true,
});

// desktop, whole page, everything expanded
await shot('3-desktop-expanded', {
	width: 1280,
	height: 860,
	query: '?reveal=all&expand=all',
	full: true,
});

// the sticky header stack, close crop
await shot('4-weatherbar-desktop', {
	width: 1280,
	height: 400,
	query: '?reveal=all',
	clip: { x: 0, y: 0, width: 1280, height: 110 },
	scale: 3,
});

await shot('5-mobile-top', { width: 390, height: 844 });

await shot('6-mobile-collapsed', {
	width: 390,
	height: 844,
	query: '?reveal=all&collapse=all',
	full: true,
});

await shot('7-weatherbar-mobile', {
	width: 390,
	height: 400,
	query: '?reveal=all',
	clip: { x: 0, y: 0, width: 390, height: 132 },
	scale: 3,
});

// the most complex card on its own: nested bullets
{
	const ctx = await browser.newContext({
		viewport: { width: 1280, height: 900 },
		deviceScaleFactor: 2,
	});
	const page = await ctx.newPage();
	await page.goto(base + '?reveal=all&expand=all', { waitUntil: 'load' });
	await page.waitForTimeout(1200);
	await page.locator('.job').nth(2).screenshot({ path: path.join(OUT, '8-macu-expanded.png') });
	console.log('wrote 8-macu-expanded.png');
	await ctx.close();
}

await browser.close();
console.log('done');
