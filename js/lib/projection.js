// Map projection for the Europe map: Lambert azimuthal equal-area centred on Europe.
// Used both by scripts/build-map.mjs (to draw the countries) and at runtime (to place teams), so they always match.
const LON0 = 15, LAT0 = 52;
const BOX = { lonMin: -12, lonMax: 50, latMin: 34, latMax: 71 };
export const WIDTH = 1000;

const rad = Math.PI / 180;
function laea(lon, lat) {
  const l = (lon - LON0) * rad, p = lat * rad, p0 = LAT0 * rad;
  const k = Math.sqrt(2 / (1 + Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l)));
  return [k * Math.cos(p) * Math.sin(l), k * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l))];
}

// Bounds of the box, found by sampling its edges
let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
for (let i = 0; i <= 100; i++) {
  const lon = BOX.lonMin + (BOX.lonMax - BOX.lonMin) * i / 100, lat = BOX.latMin + (BOX.latMax - BOX.latMin) * i / 100;
  for (const [x, y] of [laea(lon, BOX.latMin), laea(lon, BOX.latMax), laea(BOX.lonMin, lat), laea(BOX.lonMax, lat)]) {
    xmin = Math.min(xmin, x); xmax = Math.max(xmax, x); ymin = Math.min(ymin, y); ymax = Math.max(ymax, y);
  }
}
const SCALE = WIDTH / (xmax - xmin);
export const HEIGHT = Math.round((ymax - ymin) * SCALE);

// [x, y] in map pixels for a longitude/latitude
export function project(lon, lat) {
  const [x, y] = laea(lon, lat);
  return [(x - xmin) * SCALE, (ymax - y) * SCALE];
}
