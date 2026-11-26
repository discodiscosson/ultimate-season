// Player names for answer dropdowns. Two sources, merged:
// 1. every player in the season data (line-ups, top scorers, awards), always available
// 2. player names from Guess the Career in Supabase (via a search function), when it is configured and reachable
import { PLAYERS_SEARCH_RPC } from '../config.js';
import { norm } from './countries.js';
import { getClient } from './supabase.js';

let pool = [];
const clubs = new Map(); // player name -> club, shown next to database results
export const playerClub = (name) => clubs.get(name) || '';
const cache = new Map();
let remoteOk = true;

export function setPlayerPool(season) {
  const names = new Set();
  for (const md of season.leaguePhase?.matchdays || []) for (const m of md.matches)
    for (const side of ['home', 'away']) (m.lineups?.[side] || []).forEach((n) => names.add(n));
  (season.topScorers || []).forEach((p) => names.add(p.name));
  const A = season.awards;
  if (A) { A.teamOfSeason?.forEach((g) => g.players.forEach((p) => names.add(p.name))); [A.player, A.young].forEach((p) => p && names.add(p.name)); }
  pool = [...names].sort((a, b) => a.localeCompare(b));
}

function local(q) {
  const n = norm(q);
  const ranked = [];
  for (const name of pool) {
    const words = String(name).split(/[\s-]+/).map(norm);
    const r = norm(name).startsWith(n) || words.some((w) => w.startsWith(n)) ? 0 : norm(name).includes(n) ? 1 : null;
    if (r !== null) ranked.push([r, name]);
  }
  return ranked.sort((a, b) => a[0] - b[0] || a[1].localeCompare(b[1])).map((x) => x[1]);
}

async function remote(q) {
  const sb = getClient();
  if (!sb || !remoteOk) return [];
  const key = norm(q);
  if (cache.has(key)) return cache.get(key);
  const { data, error } = await sb.rpc(PLAYERS_SEARCH_RPC, { q });
  if (error) { remoteOk = false; console.warn('Player search is off:', error.message); return []; }
  const names = (data || []).map((r) => (typeof r === 'string' ? r : r.name)).filter(Boolean);
  (data || []).forEach((r) => { if (r?.name && r.club && !clubs.has(r.name)) clubs.set(r.name, r.club); });
  cache.set(key, names);
  return names;
}

// Local matches first, then players from the database; duplicates removed
export async function searchPlayers(q) {
  const text = String(q || '').trim();
  if (text.length < 2) return [];
  const loc = local(text);
  let rem = [];
  try { rem = await remote(text); } catch { rem = []; }
  const seen = new Set(), out = [];
  for (const n of [...loc, ...rem]) { const k = norm(n); if (!seen.has(k)) { seen.add(k); out.push(n); } }
  return out.slice(0, 40);
}
