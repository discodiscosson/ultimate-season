// Builds a standalone HTML file with all code and data inlined, for testing without a server.
// Usage: npm run preview  ->  dist/preview.html
import { build } from 'esbuild';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';

const js = (await build({ entryPoints: ['js/app.js'], bundle: true, format: 'iife', write: false, minify: true })).outputFiles[0].text;
const css = await readFile('css/style.css', 'utf8');
const index = JSON.parse(await readFile('data/index.json', 'utf8'));
const seasons = {};
for (const f of await readdir('data/seasons')) if (f.endsWith('.json')) seasons[f.slice(0, -5)] = JSON.parse(await readFile(`data/seasons/${f}`, 'utf8'));
const flags = {};
for (const f of await readdir('assets/flags')) if (f.endsWith('.svg'))
  flags[f.slice(0, -4)] = 'data:image/svg+xml;base64,' + Buffer.from(await readFile(`assets/flags/${f}`)).toString('base64');
const html = (await readFile('index.html', 'utf8'))
  .replace('<link rel="stylesheet" href="css/style.css">', () => `<style>${css}</style>`)
  .replace('<script type="module" src="js/app.js"></script>', () =>
    `<script>window.__US_INDEX__=${JSON.stringify(index)};window.__US_SEASONS__=${JSON.stringify(seasons)};window.__US_FLAGS__=${JSON.stringify(flags)};</script>`)
  .replace('</body>', () => `<script>${js.replace(/<\/script/gi, '<\\/script')}</script>\n</body>`);
await mkdir('dist', { recursive: true });
await writeFile('dist/preview.html', html);
console.log('Wrote dist/preview.html');
