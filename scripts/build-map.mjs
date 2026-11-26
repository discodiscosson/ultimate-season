// Builds assets/maps/europe.json (country outlines as SVG paths) from Natural Earth data via world-atlas.
// Usage: npm run map. Only needed if the projection or map area changes.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { feature } from 'topojson-client';
import { project, WIDTH, HEIGHT } from '../js/lib/projection.js';

const topo = JSON.parse(await readFile('node_modules/world-atlas/countries-50m.json', 'utf8'));
const countries = feature(topo, topo.objects.countries).features;
const M = 60; // keep shapes slightly outside the visible area so coastlines run off the edge

function ringPath(ring) {
  const pts = ring.map(([lon, lat]) => project(lon, lat));
  if (!pts.some(([x, y]) => x > -M && x < WIDTH + M && y > -M && y < HEIGHT + M)) return '';
  // Drop points closer than ~0.8 px to the previous one to keep the file small
  let d = '', lx = null, ly = null, n = 0;
  for (const [x, y] of pts) {
    if (lx !== null && Math.hypot(x - lx, y - ly) < 0.8) continue;
    d += (d ? 'L' : 'M') + `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`;
    lx = x; ly = y; n++;
  }
  return n > 2 ? d + 'Z' : '';
}

const paths = [];
for (const f of countries) {
  const g = f.geometry;
  if (!g) continue;
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  const d = polys.flatMap((poly) => poly.map(ringPath)).join('');
  if (d) paths.push({ id: f.id, name: f.properties.name, d });
}
await mkdir('assets/maps', { recursive: true });
await writeFile('assets/maps/europe.json', JSON.stringify({ width: WIDTH, height: HEIGHT, source: 'Natural Earth via world-atlas', paths }));
console.log(`Wrote assets/maps/europe.json: ${paths.length} countries, ${WIDTH}x${HEIGHT}`);
