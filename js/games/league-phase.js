// League phase.
// 1. The 36 teams are placed on a map of Europe one by one.
// 2. Matchday 1: the teams fall from the map into their fixtures.
// 3. The player picks 5 matches, predicts their scores, then plays Missing XI on the same 5 matches.
import { loadMap } from '../data.js';
import { countryName, norm } from '../lib/countries.js';
import { flagHTML } from '../lib/flags.js';
import { project, WIDTH, HEIGHT } from '../lib/projection.js';
import { esc, prefersReducedMotion, shuffle } from '../lib/util.js';

export const meta = { id: 'league', title: 'League phase', short: 'League phase' };
export const available = (season) => (season.leaguePhase?.teams?.length || 0) > 0;
export const steps = (season) => ['The teams', ...(season.leaguePhase?.matchdays || []).map((m) => m.name)];

const PICK = 5;
const EXACT = 3, OUTCOME = 1, XI_POINT = 1;
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

const sign = (a, b) => Math.sign(a - b);
// A player's answer is right if it matches the full name or the surname (last word)
const nameMatches = (given, real) => {
  const g = norm(given), r = norm(real);
  if (!g) return false;
  const last = norm(String(real).trim().split(/\s+/).pop());
  return g === r || g === last;
};

export function play({ el, season, start = 0, onStep }) {
  return new Promise((resolve) => {
    const T = season.teams;
    const LP = season.leaguePhase;
    const teams = LP.teams;
    const MD = LP.matchdays?.[0];
    const countries = new Set(teams.map((t) => T[t].country));
    const nm = (t) => T[t].name;
    const S = { phase: 'map', chosen: [], pred: {}, xiHidden: {}, xiAns: {}, xiDone: false, predDone: false };
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let timer = null;

    // ---------- 1. Map ----------
    function mapScreen() {
      el.innerHTML = `<div class="bar"><h2>League phase</h2><span class="score" id="lp-score"></span></div>
        <h3 class="ask anim" id="lp-ask">36 teams, one league</h3>
        <p class="hint" id="lp-hint">The qualifiers are through. These are the ${teams.length} teams in the league phase.</p>
        <div class="map-wrap"><p class="hint">Loading the map…</p></div>
        <div class="lp-list" id="lp-list" aria-live="polite"></div>
        <div id="lp-md"></div>
        <div class="foot" id="lp-foot"><span></span><button class="btn ghost" data-act="lp-skip">Skip</button></div>`;
      onStep?.(0);
      return loadMap().then((map) => {
        if (!el.isConnected) return;
        const pins = layout(teams, T);
        el.querySelector('.map-wrap').innerHTML = `
          <svg class="map" viewBox="0 0 ${map.width} ${map.height}" role="img" aria-label="Map of Europe with the league phase teams">
            <rect class="sea" width="${map.width}" height="${map.height}"/>
            <g class="land">${map.paths.map((p) => `<path d="${p.d}"><title>${esc(p.name)}</title></path>`).join('')}</g>
            <g class="pins">${pins.map((p) => `
              <g class="pin" data-t="${p.t}" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})">
                <g class="drop">
                  <title>${esc(nm(p.t))}, ${esc(T[p.t].city)}</title>
                  <circle r="6"/>
                  <text class="lbl" x="${p.x > map.width - 170 ? -10 : 10}" y="4" text-anchor="${p.x > map.width - 170 ? 'end' : 'start'}">${esc(nm(p.t))}${p.off ? ` (${esc(T[p.t].city)}) →` : ''}</text>
                </g>
              </g>`).join('')}</g>
          </svg>`;
      });
    }

    function land(t) {
      const pin = el.querySelector(`.pin[data-t="${t}"]`);
      if (pin) { pin.classList.add('in', 'now'); setTimeout(() => pin.classList.remove('now'), 1400); }
      el.querySelector('#lp-list').insertAdjacentHTML('beforeend',
        `<span class="lp-team" data-t="${t}">${flagHTML(T[t].country)}${esc(nm(t))}<small>${esc(T[t].city)}</small></span>`);
      const n = el.querySelectorAll('.lp-team').length;
      el.querySelector('#lp-hint').textContent = `${n} of ${teams.length}: ${nm(t)} from ${T[t].city}, ${countryName(T[t].country)}.`;
    }

    function runMap() {
      const order = shuffle(teams);
      if (prefersReducedMotion()) { order.forEach(land); mapDone(); return; }
      timer = setInterval(() => {
        if (!el.isConnected || S.phase !== 'map') { clearInterval(timer); return; }
        const t = order.shift();
        if (!t) { clearInterval(timer); setTimeout(mapDone, 600); return; }
        land(t);
      }, 260);
    }

    function mapDone() {
      if (S.phase !== 'map') return;
      clearInterval(timer);
      teams.forEach((t) => { if (!el.querySelector(`.lp-team[data-t="${t}"]`)) land(t); });
      el.querySelectorAll('.pin.now').forEach((p) => p.classList.remove('now'));
      el.querySelector('.map')?.classList.add('done');
      S.phase = 'mapdone';
      el.querySelector('#lp-hint').textContent = `${teams.length} teams from ${countries.size} countries. Hover over a team or a dot to see who is where.`;
      el.querySelector('#lp-foot').innerHTML = MD
        ? `<span></span><button class="btn" data-act="lp-md">To ${esc(MD.name)}</button>`
        : '<span></span><button class="btn" data-act="lp-end">Continue</button>';
    }

    // ---------- 2. Matchday draw: teams fall from the map into their fixtures ----------
    const fixtureRow = (m, i, filled) => {
      const team = (t, side) => (filled
        ? `<span class="fx-team">${side === 'h' ? `${esc(nm(t))}${flagHTML(T[t].country)}` : `${flagHTML(T[t].country)}${esc(nm(t))}`}</span>`
        : `<span class="drawslot fx-team" data-fx="${i}-${side}"></span>`);
      return `<div class="mrow fx" data-i="${i}">
        <div class="tc t1">${team(m.home, 'h')}</div><div class="agg"><span class="vs">–</span></div><div class="tc t2">${team(m.away, 'a')}</div></div>`;
    };
    const fixturesHTML = (filled) => `<div class="mtable fixtures" id="fx">
      <div class="mhead"><span class="t1">Home team</span><span class="agg">Score</span><span class="t2">Away team</span></div>
      ${MD.matches.map((m, i) => fixtureRow(m, i, filled)).join('')}</div>`;

    function fly(t, slot, html) {
      const fill = () => { slot.innerHTML = html; slot.classList.add('pop'); };
      const pin = el.querySelector(`.pin[data-t="${t}"] circle`);
      if (!pin || !slot.animate) { fill(); return; }
      const a = pin.getBoundingClientRect(), b = slot.getBoundingClientRect();
      const ghost = document.createElement('span');
      ghost.className = 'chip flyer';
      ghost.innerHTML = `${flagHTML(T[t].country)}${esc(nm(t))}`;
      Object.assign(ghost.style, { left: `${a.left}px`, top: `${a.top}px` });
      el.appendChild(ghost);
      ghost.animate([{ transform: 'translate(0,0) scale(.6)', opacity: .6 }, { transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(1)`, opacity: 1 }],
        { duration: 650, easing: 'cubic-bezier(.4,.1,.3,1)' }).onfinish = () => { ghost.remove(); fill(); };
    }

    async function matchdayDraw() {
      S.phase = 'mddraw';
      onStep?.(1);
      el.querySelector('#lp-ask').textContent = MD.name;
      el.querySelector('#lp-hint').textContent = 'The teams take their places for the first matchday.';
      el.querySelector('#lp-list').remove();
      el.querySelector('.map-wrap')?.classList.add('small');
      el.querySelector('.map-wrap')?.scrollIntoView?.({ block: 'start' });
      el.querySelector('#lp-md').innerHTML = fixturesHTML(false);
      el.querySelector('#lp-foot').innerHTML = '<span></span><button class="btn ghost" data-act="lp-mdskip">Skip</button>';
      if (prefersReducedMotion()) { mdChoose(); return; }
      for (let i = 0; i < MD.matches.length; i++) {
        const m = MD.matches[i];
        for (const [t, side] of [[m.home, 'h'], [m.away, 'a']]) {
          if (S.phase !== 'mddraw' || !el.isConnected) return;
          const slot = el.querySelector(`[data-fx="${i}-${side}"]`);
          if (slot) fly(t, slot, side === 'h' ? `${esc(nm(t))}${flagHTML(T[t].country)}` : `${flagHTML(T[t].country)}${esc(nm(t))}`);
          await sleep(110);
        }
      }
      await sleep(800);
      if (S.phase === 'mddraw') mdChoose();
    }

    // ---------- 3. Pick 5 matches ----------
    function mdChoose() {
      S.phase = 'choose';
      onStep?.(1);
      el.innerHTML = `<div class="bar"><h2>League phase</h2><span class="score">${score()} pts</span></div>
        <h3 class="ask anim">${esc(MD.name)}: pick ${PICK} matches</h3>
        <p class="hint">Choose the ${PICK} matches you want to play. You will predict their scores, then name the missing players from their starting line-ups.</p>
        ${fixturesHTML(true)}
        <div class="foot" id="lp-foot"></div>`;
      el.querySelectorAll('.mrow.fx').forEach((r) => { r.setAttribute('data-act', 'lp-toggle'); r.setAttribute('role', 'button'); r.setAttribute('tabindex', '0'); });
      syncChoose();
    }
    function syncChoose() {
      el.querySelectorAll('.mrow.fx').forEach((r) => {
        const on = S.chosen.includes(+r.dataset.i);
        r.classList.toggle('chosen', on); r.setAttribute('aria-pressed', on);
        r.classList.toggle('locked', !on && S.chosen.length >= PICK);
      });
      el.querySelector('#lp-foot').innerHTML = `<span class="hint" style="margin:0">${S.chosen.length} of ${PICK} chosen</span>
        <button class="btn" data-act="lp-predict" ${S.chosen.length === PICK ? '' : 'disabled'}>Predict the scores</button>`;
    }

    // ---------- 4. Predict the scores ----------
    const predPoints = (i) => {
      const p = S.pred[i], [h, a] = MD.matches[i].score;
      if (!p || p[0] === '' || p[1] === '') return 0;
      const ph = +p[0], pa = +p[1];
      if (ph === h && pa === a) return EXACT;
      return sign(ph, pa) === sign(h, a) ? OUTCOME : 0;
    };
    const predTotal = () => (S.predDone ? S.chosen.reduce((s, i) => s + predPoints(i), 0) : 0);

    function predictScreen() {
      S.phase = 'predict';
      const done = S.predDone;
      const rows = S.chosen.map((i) => {
        const m = MD.matches[i], p = S.pred[i] || ['', ''], pts = predPoints(i);
        const mid = done
          ? `<div class="agg"><span class="real">${m.score[0]}–${m.score[1]}</span><span class="yours ${pts === EXACT ? 'ok' : pts ? 'half' : 'no'}">You: ${esc(p[0])}–${esc(p[1])}${pts ? ` +${pts}` : ''}</span></div>`
          : `<div class="agg pred"><input type="number" min="0" max="20" inputmode="numeric" data-pred="${i}-0" value="${esc(p[0])}" aria-label="${esc(nm(m.home))} goals">
              <span>–</span><input type="number" min="0" max="20" inputmode="numeric" data-pred="${i}-1" value="${esc(p[1])}" aria-label="${esc(nm(m.away))} goals"></div>`;
        const w = done ? sign(m.score[0], m.score[1]) : null;
        return `<div class="mrow fx ${done ? 'done' : ''}">
          <div class="tc t1"><span class="fx-team ${w === 1 ? 'w' : ''}">${esc(nm(m.home))}${flagHTML(T[m.home].country)}</span></div>${mid}
          <div class="tc t2"><span class="fx-team ${w === -1 ? 'w' : ''}">${flagHTML(T[m.away].country)}${esc(nm(m.away))}</span></div></div>`;
      }).join('');
      el.innerHTML = `<div class="bar"><h2>League phase</h2><span class="score">${score()} pts</span></div>
        <h3 class="ask ${done ? '' : 'anim'}">${done ? 'How did you do?' : 'Predict the scores'}</h3>
        <p class="hint">${done
          ? `Exact score ${EXACT} pts, right result ${OUTCOME} pt. You got ${predTotal()} of ${PICK * EXACT} pts.`
          : `Exact score: ${EXACT} pts. Right result (home win, draw or away win): ${OUTCOME} pt.`}</p>
        <div class="mtable fixtures">
          <div class="mhead"><span class="t1">Home team</span><span class="agg">Score</span><span class="t2">Away team</span></div>${rows}</div>
        <div class="foot" id="lp-foot">${done
          ? '<span></span><button class="btn" data-act="lp-xi">Missing XI</button>'
          : `<span class="hint" style="margin:0" id="pred-status"></span><button class="btn" data-act="lp-predsubmit">Submit predictions</button>`}</div>`;
      if (!done) { syncPred(); el.querySelector('input[data-pred]')?.focus(); }
    }
    function syncPred() {
      const filled = S.chosen.filter((i) => S.pred[i] && S.pred[i][0] !== '' && S.pred[i][1] !== '').length;
      el.querySelector('#pred-status').textContent = `${filled} of ${PICK} predicted`;
      el.querySelector('[data-act="lp-predsubmit"]').disabled = filled !== PICK;
    }

    // ---------- 5. Missing XI ----------
    const xiKeys = () => S.chosen.flatMap((i) => (MD.matches[i].lineups ? ['home', 'away'].map((s) => `${i}-${s}`) : []));
    const xiTotal = () => (S.xiDone ? xiKeys().filter((k) => {
      const [i, s] = k.split('-'); return nameMatches(S.xiAns[k], MD.matches[i].lineups[s][S.xiHidden[k]]);
    }).length * XI_POINT : 0);

    function xiScreen() {
      S.phase = 'xi';
      // pick one hidden player per team (not the goalkeeper), once
      xiKeys().forEach((k) => {
        if (S.xiHidden[k] === undefined) { const [i, s] = k.split('-'); const n = MD.matches[i].lineups[s].length; S.xiHidden[k] = 1 + Math.floor(Math.random() * (n - 1)); }
      });
      const done = S.xiDone;
      const cards = S.chosen.map((i) => {
        const m = MD.matches[i];
        const head = `<div class="xi-head">${esc(nm(m.home))}${flagHTML(T[m.home].country)}<b>${m.score[0]}–${m.score[1]}</b>${flagHTML(T[m.away].country)}${esc(nm(m.away))}</div>`;
        if (!m.lineups) {
          return `<div class="xi-card">${head}<p class="xi-empty">Starting line-ups for this match have not been added yet. Add them to <code>LINEUPS</code> in <code>scripts/source_ucl_2025_26.py</code> and the game will hide one player per team for you to name.</p></div>`;
        }
        const side = (s) => {
          const k = `${i}-${s}`, list = m.lineups[s], h = S.xiHidden[k];
          return `<ol class="xi-list">${list.map((p, j) => {
            if (j !== h) return `<li>${esc(p)}</li>`;
            if (!done) return `<li class="xi-miss"><input data-xi="${k}" value="${esc(S.xiAns[k] || '')}" placeholder="Who is missing?" aria-label="Missing player" autocomplete="off" spellcheck="false"></li>`;
            const ok = nameMatches(S.xiAns[k], p);
            return `<li class="xi-miss ${ok ? 'ok' : 'no'}">${ok ? `${esc(p)} ✓` : `<s>${esc(S.xiAns[k] || 'No answer')}</s> ${esc(p)}`}</li>`;
          }).join('')}</ol>`;
        };
        return `<div class="xi-card">${head}<div class="xi-cols"><div><h4>${esc(nm(m.home))}</h4>${side('home')}</div><div><h4>${esc(nm(m.away))}</h4>${side('away')}</div></div></div>`;
      }).join('');
      const keys = xiKeys();
      el.innerHTML = `<div class="bar"><h2>League phase</h2><span class="score">${score()} pts</span></div>
        <h3 class="ask anim">Missing XI</h3>
        <p class="hint">${keys.length
          ? (done ? `You named ${xiTotal()} of ${keys.length} missing players.` : `One player is missing from each starting line-up. Type the name (the surname is enough). ${XI_POINT} pt each.`)
          : 'This game needs the starting line-ups of your matches, which are not in the data yet.'}</p>
        <div class="xi-grid">${cards}</div>
        <div class="foot"><span></span>${keys.length && !done
          ? '<button class="btn" data-act="lp-xisubmit">Submit answers</button>'
          : '<button class="btn" data-act="lp-end">Continue</button>'}</div>`;
    }

    // ---------- Score and events ----------
    const score = () => predTotal() + xiTotal();
    const max = () => PICK * EXACT + xiKeys().length * XI_POINT;

    function end() {
      const lines = [['Teams in the league phase', `${teams.length} from ${countries.size} countries`]];
      if (MD && S.predDone) lines.push([`${MD.name} predictions`, `${predTotal()}/${PICK * EXACT} pts`]);
      if (S.xiDone && xiKeys().length) lines.push(['Missing XI', `${xiTotal()}/${xiKeys().length}`]);
      resolve({ score: score(), max: S.predDone ? max() : 0, lines });
    }

    el.addEventListener('input', (e) => {
      const p = e.target.dataset?.pred;
      if (p) { const [i, k] = p.split('-'); S.pred[i] ||= ['', '']; S.pred[i][k] = e.target.value.replace(/[^0-9]/g, '').slice(0, 2); syncPred(); }
      const x = e.target.dataset?.xi;
      if (x) S.xiAns[x] = e.target.value;
    });
    const hl = (t, on) => {
      el.querySelector(`.pin[data-t="${t}"]`)?.classList.toggle('hl', on);
      el.querySelector(`.lp-team[data-t="${t}"]`)?.classList.toggle('hl', on);
    };
    el.addEventListener('mouseover', (e) => { const x = e.target.closest('[data-t]'); if (x) hl(x.dataset.t, true); });
    el.addEventListener('mouseout', (e) => { const x = e.target.closest('[data-t]'); if (x) hl(x.dataset.t, false); });
    el.addEventListener('keydown', (e) => {
      const row = e.target.closest?.('[data-act="lp-toggle"]');
      if (row && e.target === row && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); row.click(); }
    });
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act^="lp-"]');
      if (!b || b.disabled) return;
      const act = b.dataset.act;
      if (act === 'lp-skip') mapDone();
      else if (act === 'lp-md') matchdayDraw();
      else if (act === 'lp-mdskip') mdChoose();
      else if (act === 'lp-toggle') {
        const i = +b.dataset.i, k = S.chosen.indexOf(i);
        if (k >= 0) S.chosen.splice(k, 1); else if (S.chosen.length < PICK) S.chosen.push(i);
        S.chosen.sort((x, y) => x - y);
        syncChoose();
      } else if (act === 'lp-predict') { predictScreen(); scrollTo(0, 0); }
      else if (act === 'lp-predsubmit') { S.predDone = true; predictScreen(); scrollTo(0, 0); }
      else if (act === 'lp-xi') { xiScreen(); scrollTo(0, 0); }
      else if (act === 'lp-xisubmit') { S.xiDone = true; xiScreen(); scrollTo(0, 0); }
      else if (act === 'lp-end') end();
    });

    // Review mode can start directly at the matchday
    if (start >= 1 && MD) mdChoose();
    else mapScreen().then(() => { if (el.isConnected) runMap(); }).catch((e) => {
      el.querySelector('.map-wrap').innerHTML = `<p class="hint">${esc(e.message)}</p>`; mapDone();
    });
  });
}
