// League phase: the 36 teams are placed on a map of Europe one by one.
import { loadMap } from '../data.js';
import { countryName } from '../lib/countries.js';
import { flagHTML } from '../lib/flags.js';
import { project, WIDTH, HEIGHT } from '../lib/projection.js';
import { esc, prefersReducedMotion, shuffle } from '../lib/util.js';

export const meta = { id: 'league', title: 'League phase', short: 'League phase' };
export const available = (season) => (season.leaguePhase?.teams?.length || 0) > 0;
export const steps = () => ['The teams'];

const MIN_GAP = 13; // pins closer than this are spread out around their city

function layout(teams, T) {
  const placed = [];
  for (const t of teams) {
    let [x, y] = project(T[t].lon, T[t].lat);
    const off = x > WIDTH - 12 || x < 12 || y < 12 || y > HEIGHT - 12;
    if (off) { x = Math.min(Math.max(x, 18), WIDTH - 18); y = Math.min(Math.max(y, 18), HEIGHT - 18); }
    let px = x, py = y;
    for (let k = 0; k < 24 && placed.some((p) => Math.hypot(p.x - px, p.y - py) < MIN_GAP); k++) {
      const a = (k % 6) * Math.PI / 3 + Math.floor(k / 6) * 0.5, rr = MIN_GAP * (1 + Math.floor(k / 6) * 0.6);
      px = x + Math.cos(a) * rr; py = y + Math.sin(a) * rr;
    }
    placed.push({ t, x: px, y: py, off });
  }
  return placed;
}

export function play({ el, season, onStep }) {
  return new Promise((resolve) => {
    const T = season.teams;
    const teams = season.leaguePhase.teams;
    const countries = new Set(teams.map((t) => T[t].country));
    let timer = null, done = false;

    el.innerHTML = `<div class="bar"><h2>League phase</h2><span class="score"></span></div>
      <h3 class="ask anim">36 teams, one league</h3>
      <p class="hint" id="lp-hint">The qualifiers are through. These are the ${teams.length} teams in the league phase.</p>
      <div class="map-wrap"><p class="hint">Loading the map…</p></div>
      <div class="lp-list" id="lp-list" aria-live="polite"></div>
      <div class="foot" id="lp-foot"><span></span><button class="btn ghost" data-act="lp-skip">Skip</button></div>`;
    onStep?.(0);

    loadMap().then((map) => {
      if (!el.isConnected) return;
      const pins = layout(teams, T);
      el.querySelector('.map-wrap').innerHTML = `
        <svg class="map" viewBox="0 0 ${map.width} ${map.height}" role="img" aria-label="Map of Europe with the league phase teams">
          <rect class="sea" width="${map.width}" height="${map.height}"/>
          <g class="land">${map.paths.map((p) => `<path d="${p.d}"><title>${esc(p.name)}</title></path>`).join('')}</g>
          <g class="pins">${pins.map((p) => `
            <g class="pin" data-t="${p.t}" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})">
              <g class="drop">
                <title>${esc(T[p.t].name)}, ${esc(T[p.t].city)}</title>
                <circle r="6"/>
                <text class="lbl" x="${p.x > map.width - 170 ? -10 : 10}" y="4" text-anchor="${p.x > map.width - 170 ? 'end' : 'start'}">${esc(T[p.t].name)}${p.off ? ` (${esc(T[p.t].city)}) →` : ''}</text>
              </g>
            </g>`).join('')}</g>
        </svg>`;
      run();
    }).catch((e) => { el.querySelector('.map-wrap').innerHTML = `<p class="hint">${esc(e.message)}</p>`; finish(); });

    function land(t) {
      const pin = el.querySelector(`.pin[data-t="${t}"]`);
      if (pin) { pin.classList.add('in', 'now'); setTimeout(() => pin.classList.remove('now'), 1400); }
      el.querySelector('#lp-list').insertAdjacentHTML('beforeend',
        `<span class="lp-team" data-t="${t}">${flagHTML(T[t].country)}${esc(T[t].name)}<small>${esc(T[t].city)}</small></span>`);
      const n = el.querySelectorAll('.lp-team').length;
      el.querySelector('#lp-hint').textContent = `${n} of ${teams.length}: ${T[t].name} from ${T[t].city}, ${countryName(T[t].country)}.`;
    }

    function run() {
      const order = shuffle(teams);
      if (prefersReducedMotion()) { order.forEach(land); finish(); return; }
      timer = setInterval(() => {
        if (!el.isConnected) { clearInterval(timer); return; }
        const t = order.shift();
        if (!t) { clearInterval(timer); setTimeout(finish, 600); return; }
        land(t);
      }, 260);
    }

    function finish() {
      if (done) return;
      done = true; clearInterval(timer);
      // Skipped: place the rest at once
      teams.forEach((t) => { if (!el.querySelector(`.lp-team[data-t="${t}"]`)) land(t); });
      el.querySelectorAll('.pin.now').forEach((p) => p.classList.remove('now'));
      el.querySelector('.map')?.classList.add('done');
      el.querySelector('#lp-hint').textContent = `${teams.length} teams from ${countries.size} countries. Hover over a team or a dot to see who is where.`;
      el.querySelector('#lp-foot').innerHTML = '<span></span><button class="btn" data-act="lp-next">Continue</button>';
    }

    // Highlight a pin from the list and vice versa
    const hl = (t, on) => {
      el.querySelector(`.pin[data-t="${t}"]`)?.classList.toggle('hl', on);
      el.querySelector(`.lp-team[data-t="${t}"]`)?.classList.toggle('hl', on);
    };
    el.addEventListener('mouseover', (e) => { const x = e.target.closest('[data-t]'); if (x) hl(x.dataset.t, true); });
    el.addEventListener('mouseout', (e) => { const x = e.target.closest('[data-t]'); if (x) hl(x.dataset.t, false); });

    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act^="lp-"]');
      if (!b) return;
      if (b.dataset.act === 'lp-skip') finish();
      else resolve({ score: 0, max: 0, lines: [['Teams in the league phase', `${teams.length} from ${countries.size} countries`]] });
    });
  });
}
