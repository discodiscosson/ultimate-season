// Forgiving name matching for player answers: exact name or alias first, then a small typo margin.
import { norm } from './countries.js';

function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

// entries: [{ id, name, aliases }] -> match(input) returns the id or null
export function nameMatcher(entries) {
  const list = entries.map((e) => ({ id: e.id, keys: [e.name, ...(e.aliases || []), String(e.name).split(' ').pop()].map(norm) }));
  return (input) => {
    const n = norm(input);
    if (n.length < 3) return null;
    const exact = list.find((x) => x.keys.includes(n));
    if (exact) return exact.id;
    let best = null, bestD = 99;
    for (const x of list) for (const k of x.keys) { const d = lev(n, k); if (d < bestD) { bestD = d; best = x.id; } }
    return n.length >= 5 && bestD <= (n.length >= 9 ? 2 : 1) ? best : null;
  };
}
