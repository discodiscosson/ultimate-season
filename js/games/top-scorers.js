// Top goalscorers: ten attempts to name the top scorers. The list fills in as you find them.
import { countryName, norm } from '../lib/countries.js';
import { flagHTML } from '../lib/flags.js';
import { esc } from '../lib/util.js';

export const meta = { id: 'scorers', title: 'Top goalscorers', short: 'Top scorers' };
export const available = (season) => (season.topScorers?.length || 0) > 0;
export const steps = () => ['Top goalscorers'];

const ATTEMPTS = 10;
const POINTS = 2;

function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

export function play({ el, season, onStep }) {
  return new Promise((resolve) => {
    const T = season.teams;
    const P = season.topScorers;
    const S = { found: new Set(), wrong: [], left: ATTEMPTS, done: false, last: null, msg: '' };
    const cutoff = Math.max(...P.map((p) => p.rank));
    const answers = P.map((p, i) => ({ i, keys: [p.name, ...(p.aliases || []), p.name.split(' ').pop()].map(norm) }));

    // Exact match on a name or alias first, then a small typo margin on the longer names
    function match(input) {
      const n = norm(input);
      if (n.length < 3) return null;
      const exact = answers.find((a) => a.keys.includes(n));
      if (exact) return exact.i;
      let best = null, bestD = 99;
      for (const a of answers) for (const k of a.keys) {
        const d = lev(n, k);
        if (d < bestD) { bestD = d; best = a.i; }
      }
      return n.length >= 5 && bestD <= (n.length >= 9 ? 2 : 1) ? best : null;
    }

    function render() {
      const pts = S.found.size * POINTS;
      const rows = P.map((p, i) => {
        const hit = S.found.has(i), show = hit || S.done;
        const cls = [hit ? 'hit' : S.done ? 'missed' : '', S.last === i ? 'new' : ''].join(' ');
        return `<div class="ts-row ${cls}">
          <span class="ts-rank">${p.rank}</span>
          <span class="ts-player">${show ? `${flagHTML(p.nat)}<span title="${esc(countryName(p.nat))}">${esc(p.name)}</span>` : '<span class="ts-hidden"></span>'}</span>
          <span class="ts-team">${show ? `${flagHTML(T[p.team].country)}<span>${esc(T[p.team].name)}</span>` : ''}</span>
          <span class="ts-goals">${p.goals}</span>
          <span class="ts-min">${show ? p.minutes : ''}</span>
        </div>`;
      }).join('');
      const dots = Array.from({ length: ATTEMPTS }, (_, k) => `<i class="${k < ATTEMPTS - S.left ? 'used' : ''}"></i>`).join('');
      el.innerHTML = `<div class="bar"><h2>Top goalscorers</h2><span class="score">${pts} pts</span></div>
        <h3 class="ask ${S.done ? '' : 'anim'}">${S.done ? (S.found.size === P.length ? 'You got them all!' : `You found ${S.found.size} of ${P.length}`) : `Name the top ${cutoff} goalscorers`}</h3>
        <p class="hint">${S.done
          ? `${pts} pts. The list includes everyone tied on the last place.`
          : `You have ${ATTEMPTS} attempts. Type a player and press Enter. The goals are shown as a clue, and the list fills in as you find them (${POINTS} pts each).`}</p>
        ${S.done ? '' : `<div class="ts-input">
          <input id="ts-in" placeholder="Player name" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="send" aria-label="Player name">
          <button class="btn" data-act="ts-guess">Submit</button>
        </div>
        <div class="ts-meta"><span class="ts-dots" aria-label="${S.left} attempts left">${dots}</span><span>${S.left} attempt${S.left === 1 ? '' : 's'} left</span>
          <span class="ts-msg ${S.msg ? 'show' : ''}" role="status">${esc(S.msg)}</span></div>`}
        <div class="ts-table">
          <div class="ts-row ts-head"><span>Rank</span><span>Player</span><span>Team</span><span>Goals</span><span>Minutes</span></div>${rows}
        </div>
        ${S.wrong.length ? `<div class="ts-wrong">${S.wrong.map((w) => `<span class="chip">✗ ${esc(w)}</span>`).join('')}</div>` : ''}
        <div class="foot"><span></span>${S.done
          ? '<button class="btn" data-act="ts-end">Continue</button>'
          : '<button class="btn ghost" data-act="ts-giveup">Give up</button>'}</div>`;
      S.last = null;
      onStep?.(0);
      el.querySelector('#ts-in')?.focus();
    }

    function guess() {
      const input = el.querySelector('#ts-in');
      const v = input?.value.trim();
      if (!v || S.done) return;
      const i = match(v);
      if (i !== null && S.found.has(i)) { S.msg = `${P[i].name} is already on the list`; render(); return; }
      S.left--;
      if (i !== null) { S.found.add(i); S.last = i; S.msg = `✓ ${P[i].name}, ${P[i].goals} goals`; }
      else { S.wrong.push(v); S.msg = `✗ ${v} is not on the list`; }
      if (S.left === 0 || S.found.size === P.length) S.done = true;
      render();
    }

    el.addEventListener('keydown', (e) => { if (e.target.id === 'ts-in' && e.key === 'Enter') { e.preventDefault(); guess(); } });
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act^="ts-"]');
      if (!b) return;
      if (b.dataset.act === 'ts-guess') guess();
      else if (b.dataset.act === 'ts-giveup') { S.done = true; render(); }
      else resolve({ score: S.found.size * POINTS, max: P.length * POINTS, lines: [['Top goalscorers', `${S.found.size}/${P.length} found`]] });
    });
    render();
  });
}
