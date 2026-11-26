// League phase.
// 1. The 36 teams are placed on a map of Europe one by one.
// 2. For every matchday: the teams drop into their fixtures, the player picks 5 matches, predicts their scores,
//    plays Missing XI on the same matches, and the league table updates with the teams moving to their new places.
// 3. The final table splits: the top 8 wait in the round of 16, places 9–24 move into their play-off ties, 25–36 are out.
import { loadMap } from '../data.js';
import { countryName, norm } from '../lib/countries.js';
import { flagHTML } from '../lib/flags.js';
import { project, WIDTH, HEIGHT } from '../lib/projection.js';
import { standings } from '../lib/standings.js';
import { esc, prefersReducedMotion, shuffle } from '../lib/util.js';

export const meta = { id: 'league', title: 'League phase', short: 'League phase' };
export const available = (season) => (season.leaguePhase?.teams?.length || 0) > 0;
export const steps = (season) => ['The teams', ...(season.leaguePhase?.matchdays || []).flatMap((m) => [m.name, `Table after ${m.name}`]), 'To the knockouts'];

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
    const MDS = LP.matchdays || [];
    const countries = new Set(teams.map((t) => T[t].country));
    const names = Object.fromEntries(teams.map((t) => [t, T[t].name]));
    const nm = (t) => T[t].name;
    const S = { phase: 'map', md: 0, per: MDS.map(() => ({ chosen: [], pred: {}, predDone: false, xiHidden: {}, xiAns: {}, xiDone: false })) };
    const cur = () => S.per[S.md];
    const MD = () => MDS[S.md];
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const head = (title, anim = true) => `<div class="bar"><h2>League phase</h2><span class="score">${score()} pts</span></div>
      <h3 class="ask ${anim ? 'anim' : ''}" id="lp-ask">${title}</h3>`;
    let timer = null;

    // ---------- Score ----------
    const predPoints = (k, i) => {
      const p = S.per[k].pred[i], [h, a] = MDS[k].matches[i].score;
      if (!p || p[0] === '' || p[1] === '') return 0;
      if (+p[0] === h && +p[1] === a) return EXACT;
      return sign(+p[0], +p[1]) === sign(h, a) ? OUTCOME : 0;
    };
    const predTotal = (k) => (S.per[k].predDone ? S.per[k].chosen.reduce((s, i) => s + predPoints(k, i), 0) : 0);
    const xiKeys = (k) => S.per[k].chosen.flatMap((i) => (MDS[k].matches[i].lineups ? ['home', 'away'].map((s) => `${i}-${s}`) : []));
    const xiTotal = (k) => (S.per[k].xiDone ? xiKeys(k).filter((key) => {
      const [i, s] = key.split('-'); return nameMatches(S.per[k].xiAns[key], MDS[k].matches[i].lineups[s][S.per[k].xiHidden[key]]);
    }).length * XI_POINT : 0);
    const score = () => MDS.reduce((s, _, k) => s + predTotal(k) + xiTotal(k), 0);

    // ---------- 1. Map ----------
    function mapScreen() {
      S.phase = 'map';
      el.innerHTML = `${head('36 teams, one league')}
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
      el.querySelector('#lp-foot').innerHTML = MDS.length
        ? `<span></span><button class="btn" data-act="lp-md">To ${esc(MDS[0].name)}</button>`
        : '<span></span><button class="btn" data-act="lp-end">Continue</button>';
    }

    // ---------- 2. Matchday draw ----------
    const teamHTML = (t, side) => (side === 'h' ? `${esc(nm(t))}${flagHTML(T[t].country)}` : `${flagHTML(T[t].country)}${esc(nm(t))}`);
    const fixturesHTML = (filled) => `<div class="mtable fixtures" id="fx">
      <div class="mhead"><span class="t1">Home team</span><span class="agg">Score</span><span class="t2">Away team</span></div>
      ${MD().matches.map((m, i) => `<div class="mrow fx" data-i="${i}">
        <div class="tc t1">${filled ? `<span class="fx-team">${teamHTML(m.home, 'h')}</span>` : `<span class="drawslot fx-team" data-fx="${i}-h"></span>`}</div>
        <div class="agg"><span class="vs">–</span></div>
        <div class="tc t2">${filled ? `<span class="fx-team">${teamHTML(m.away, 'a')}</span>` : `<span class="drawslot fx-team" data-fx="${i}-a"></span>`}</div>
      </div>`).join('')}</div>`;

    function fly(t, slot, html) {
      const fill = () => { slot.innerHTML = html; slot.classList.add('pop'); };
      const chip = el.querySelector(`.lp-team[data-t="${t}"]`);
      if (!chip || !slot.animate) { chip?.classList.add('gone'); fill(); return; }
      const a = chip.getBoundingClientRect(), b = slot.getBoundingClientRect();
      chip.classList.add('gone');
      const ghost = document.createElement('span');
      ghost.className = 'chip flyer';
      ghost.innerHTML = `${flagHTML(T[t].country)}${esc(nm(t))}`;
      Object.assign(ghost.style, { left: `${a.left}px`, top: `${a.top}px` });
      el.appendChild(ghost);
      ghost.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${b.left - a.left}px, ${b.top - a.top}px)` }],
        { duration: 650, easing: 'cubic-bezier(.4,.1,.3,1)' }).onfinish = () => { ghost.remove(); fill(); };
    }

    async function matchdayDraw(k) {
      S.md = k; S.phase = 'mddraw';
      onStep?.(1 + 2 * k);
      const md = MD();
      if (k === 0 && el.querySelector('#lp-list')) {
        // First matchday: the map steps aside and the team boxes drop into their fixtures
        el.querySelector('#lp-ask').textContent = md.name;
        el.querySelector('#lp-hint').textContent = 'The teams take their places for the first matchday.';
        el.querySelector('.map-wrap')?.classList.add('collapsed');
        el.querySelector('#lp-md').innerHTML = fixturesHTML(false);
      } else {
        el.innerHTML = `${head(md.name)}<p class="hint">The fixtures for ${esc(md.name.toLowerCase())}.</p>
          <div id="lp-md">${fixturesHTML(false)}</div><div class="foot" id="lp-foot"></div>`;
      }
      el.querySelector('#lp-foot').innerHTML = '<span></span><button class="btn ghost" data-act="lp-mdskip">Skip</button>';
      scrollTo(0, 0);
      if (prefersReducedMotion()) { choose(); return; }
      const gap = k === 0 ? 110 : 45;
      for (let i = 0; i < md.matches.length; i++) {
        const m = md.matches[i];
        for (const [t, side] of [[m.home, 'h'], [m.away, 'a']]) {
          if (S.phase !== 'mddraw' || S.md !== k || !el.isConnected) return;
          const slot = el.querySelector(`[data-fx="${i}-${side}"]`);
          if (slot) {
            if (k === 0) fly(t, slot, teamHTML(t, side));
            else { slot.innerHTML = teamHTML(t, side); slot.classList.add('pop'); }
          }
          await sleep(gap);
        }
      }
      await sleep(k === 0 ? 800 : 400);
      if (S.phase === 'mddraw' && S.md === k) choose();
    }

    // ---------- 3. Pick 5 matches ----------
    function choose() {
      S.phase = 'choose';
      onStep?.(1 + 2 * S.md);
      el.innerHTML = `${head(`${esc(MD().name)}: pick ${PICK} matches`)}
        <p class="hint">Choose the ${PICK} matches you want to play. You will predict their scores, then name the missing players from their starting line-ups.</p>
        ${fixturesHTML(true)}
        <div class="foot" id="lp-foot"></div>`;
      el.querySelectorAll('.mrow.fx').forEach((r) => { r.setAttribute('data-act', 'lp-toggle'); r.setAttribute('role', 'button'); r.setAttribute('tabindex', '0'); });
      syncChoose();
    }
    function syncChoose() {
      const c = cur().chosen;
      el.querySelectorAll('.mrow.fx').forEach((r) => {
        const on = c.includes(+r.dataset.i);
        r.classList.toggle('chosen', on); r.setAttribute('aria-pressed', on);
        r.classList.toggle('locked', !on && c.length >= PICK);
      });
      el.querySelector('#lp-foot').innerHTML = `<span class="hint" style="margin:0">${c.length} of ${PICK} chosen</span>
        <button class="btn" data-act="lp-predict" ${c.length === PICK ? '' : 'disabled'}>Predict the scores</button>`;
    }

    // ---------- 4. Predict the scores ----------
    function predictScreen() {
      S.phase = 'predict';
      const k = S.md, P = cur(), done = P.predDone, md = MD();
      const rows = P.chosen.map((i) => {
        const m = md.matches[i], p = P.pred[i] || ['', ''], pts = predPoints(k, i);
        const mid = done
          ? `<div class="agg"><span class="real">${m.score[0]}–${m.score[1]}</span><span class="yours ${pts === EXACT ? 'ok' : pts ? 'half' : 'no'}">You: ${esc(p[0])}–${esc(p[1])}${pts ? ` +${pts}` : ''}</span></div>`
          : `<div class="agg pred"><input type="number" min="0" max="20" inputmode="numeric" data-pred="${i}-0" value="${esc(p[0])}" aria-label="${esc(nm(m.home))} goals">
              <span>–</span><input type="number" min="0" max="20" inputmode="numeric" data-pred="${i}-1" value="${esc(p[1])}" aria-label="${esc(nm(m.away))} goals"></div>`;
        const w = done ? sign(m.score[0], m.score[1]) : null;
        return `<div class="mrow fx ${done ? 'done' : ''}">
          <div class="tc t1"><span class="fx-team ${w === 1 ? 'w' : ''}">${teamHTML(m.home, 'h')}</span></div>${mid}
          <div class="tc t2"><span class="fx-team ${w === -1 ? 'w' : ''}">${teamHTML(m.away, 'a')}</span></div></div>`;
      }).join('');
      el.innerHTML = `${head(done ? 'How did you do?' : 'Predict the scores', !done)}
        <p class="hint">${done
          ? `Exact score ${EXACT} pts, right result ${OUTCOME} pt. You got ${predTotal(k)} of ${PICK * EXACT} pts on ${esc(md.name.toLowerCase())}.`
          : `${esc(md.name)}. Exact score: ${EXACT} pts. Right result (home win, draw or away win): ${OUTCOME} pt.`}</p>
        <div class="mtable fixtures">
          <div class="mhead"><span class="t1">Home team</span><span class="agg">Score</span><span class="t2">Away team</span></div>${rows}</div>
        <div class="foot" id="lp-foot">${done
          ? '<span></span><button class="btn" data-act="lp-xi">Missing XI</button>'
          : '<span class="hint" style="margin:0" id="pred-status"></span><button class="btn" data-act="lp-predsubmit">Submit predictions</button>'}</div>`;
      if (!done) { syncPred(); el.querySelector('input[data-pred]')?.focus(); }
    }
    function syncPred() {
      const P = cur();
      const filled = P.chosen.filter((i) => P.pred[i] && P.pred[i][0] !== '' && P.pred[i][1] !== '').length;
      el.querySelector('#pred-status').textContent = `${filled} of ${PICK} predicted`;
      el.querySelector('[data-act="lp-predsubmit"]').disabled = filled !== PICK;
    }

    // ---------- 5. Missing XI ----------
    function xiScreen() {
      S.phase = 'xi';
      const k = S.md, P = cur(), md = MD(), keys = xiKeys(k), done = P.xiDone;
      keys.forEach((key) => {
        if (P.xiHidden[key] === undefined) { const [i, s] = key.split('-'); P.xiHidden[key] = 1 + Math.floor(Math.random() * (md.matches[i].lineups[s].length - 1)); }
      });
      const cards = P.chosen.map((i) => {
        const m = md.matches[i];
        const top = `<div class="xi-head">${esc(nm(m.home))}${flagHTML(T[m.home].country)}<b>${m.score[0]}–${m.score[1]}</b>${flagHTML(T[m.away].country)}${esc(nm(m.away))}</div>`;
        if (!m.lineups) {
          return `<div class="xi-card">${top}<p class="xi-empty">Starting line-ups for this match have not been added yet. Add them to <code>LINEUPS</code> in <code>scripts/source_ucl_2025_26.py</code> and the game will hide one player per team for you to name.</p></div>`;
        }
        const side = (s) => {
          const key = `${i}-${s}`, h = P.xiHidden[key];
          return `<ol class="xi-list">${m.lineups[s].map((p, j) => {
            if (j !== h) return `<li>${esc(p)}</li>`;
            if (!done) return `<li class="xi-miss"><input data-xi="${key}" value="${esc(P.xiAns[key] || '')}" placeholder="Who is missing?" aria-label="Missing player" autocomplete="off" spellcheck="false"></li>`;
            const ok = nameMatches(P.xiAns[key], p);
            return `<li class="xi-miss ${ok ? 'ok' : 'no'}">${ok ? `${esc(p)} ✓` : `<s>${esc(P.xiAns[key] || 'No answer')}</s> ${esc(p)}`}</li>`;
          }).join('')}</ol>`;
        };
        return `<div class="xi-card">${top}<div class="xi-cols"><div><h4>${esc(nm(m.home))}</h4>${side('home')}</div><div><h4>${esc(nm(m.away))}</h4>${side('away')}</div></div></div>`;
      }).join('');
      el.innerHTML = `${head('Missing XI')}
        <p class="hint">${keys.length
          ? (done ? `You named ${xiTotal(k)} of ${keys.length} missing players.` : `One player is missing from each starting line-up. Type the name (the surname is enough). ${XI_POINT} pt each.`)
          : 'This game needs the starting line-ups of your matches, which are not in the data yet.'}</p>
        <div class="xi-grid">${cards}</div>
        <div class="foot"><span></span>${keys.length && !done
          ? '<button class="btn" data-act="lp-xisubmit">Submit answers</button>'
          : '<button class="btn" data-act="lp-table">Update the table</button>'}</div>`;
    }

    // ---------- 6. The table moves ----------
    const upTo = (k) => MDS.slice(0, k + 1).flatMap((m) => m.matches);
    const zone = (p) => (p <= 8 ? 'z1' : p <= 24 ? 'z2' : 'z3');
    const gdText = (n) => (n > 0 ? `+${n}` : String(n));
    const rowInner = (r, move = 0) => `<span class="c-pos">${r.pos}${move ? `<i class="mv ${move > 0 ? 'up' : 'down'}">${move > 0 ? '▲' : '▼'}${Math.abs(move)}</i>` : ''}</span>
      <span class="c-team">${flagHTML(T[r.t].country)}<span>${esc(nm(r.t))}</span></span>
      <span>${r.p}</span><span class="c-w">${r.w}</span><span class="c-w">${r.d}</span><span class="c-w">${r.l}</span>
      <span class="c-w">${r.gf}</span><span class="c-w">${r.ga}</span><span>${gdText(r.gd)}</span><span class="c-pts">${r.pts}</span>`;

    function tableScreen(k) {
      S.md = k; S.phase = 'table';
      onStep?.(2 + 2 * k);
      const md = MDS[k];
      const before = standings(teams, k === 0 ? [] : upTo(k - 1), names);
      const after = standings(teams, upTo(k), names);
      const last = k === MDS.length - 1;
      el.innerHTML = `${head(`Table after ${esc(md.name)}`)}
        <p class="hint">${last
          ? 'The final league phase table. Top 8 go straight to the round of 16, places 9–24 go to the knockout phase play-offs, places 25–36 are out.'
          : 'Top 8 go straight to the round of 16. Places 9–24 go to the knockout phase play-offs. Places 25–36 are out.'}</p>
        <div class="ltable" id="lt" role="table" aria-label="League table">
          <div class="lt-row lt-head" role="row"><span>Pos</span><span class="c-team">Team</span><span>Pld</span><span class="c-w">W</span><span class="c-w">D</span><span class="c-w">L</span><span class="c-w">GF</span><span class="c-w">GA</span><span>GD</span><span>Pts</span></div>
          ${before.map((r) => `<div class="lt-row ${k === 0 ? '' : zone(r.pos)}" role="row" data-t="${r.t}">${rowInner(r)}</div>`).join('')}
        </div>
        <div class="foot"><span></span><button class="btn" data-act="${last ? 'lp-ko' : 'lp-next'}">${last ? 'To the knockouts' : `To ${esc(MDS[k + 1].name)}`}</button></div>`;

      const apply = () => {
        const box = el.querySelector('#lt');
        if (!box) return;
        const rows = Object.fromEntries([...box.querySelectorAll('.lt-row[data-t]')].map((r) => [r.dataset.t, r]));
        const firstTop = Object.fromEntries(Object.entries(rows).map(([t, r]) => [t, r.getBoundingClientRect().top]));
        const oldPos = Object.fromEntries(before.map((r) => [r.t, r.pos]));
        const oldPts = Object.fromEntries(before.map((r) => [r.t, r.pts]));
        for (const r of after) {
          const row = rows[r.t];
          row.innerHTML = rowInner(r, k === 0 ? 0 : oldPos[r.t] - r.pos);
          row.className = `lt-row ${zone(r.pos)}${r.pts > oldPts[r.t] ? ` gain g${r.pts - oldPts[r.t]}` : ''}`;
          box.appendChild(row); // reorder to the new positions
        }
        // FLIP: start each row where it was and let it slide to its new place
        if (!box.animate) return;
        for (const r of after) {
          const row = rows[r.t];
          const dy = firstTop[r.t] - row.getBoundingClientRect().top;
          if (dy) row.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 1100, easing: 'cubic-bezier(.5,0,.2,1)' });
        }
      };
      if (prefersReducedMotion()) apply(); else setTimeout(() => { if (S.phase === 'table' && S.md === k) apply(); }, 700);
    }

    // ---------- 7. To the knockouts ----------
    async function knockoutScreen() {
      S.phase = 'ko';
      onStep?.(1 + 2 * MDS.length);
      const final = standings(teams, upTo(MDS.length - 1), names);
      const pos = Object.fromEntries(final.map((r) => [r.t, r.pos]));
      const KS = season.stages.filter((s) => s.type === 'knockout');
      const poTies = KS[0]?.ties || [];
      const seeded = (KS[1]?.ties || []).flatMap((t) => t.slots.filter((s) => s.team).map((s) => s.team))
        .sort((a, b) => pos[a] - pos[b]);
      const chip = (t) => `${flagHTML(T[t].country)}<span>${esc(nm(t))}</span><i class="kpos">${pos[t]}</i>`;
      el.innerHTML = `${head('To the knockouts')}
        <p class="hint" id="ko-hint">The league phase is over. Who goes where?</p>
        <div class="ko-split">
          <div class="ko-table">${final.map((r) => `<div class="kt-row ${zone(r.pos)}" data-t="${r.t}">
            <span class="kt-pos">${r.pos}</span>${flagHTML(T[r.t].country)}<span class="kt-name">${esc(nm(r.t))}</span><b>${r.pts}</b></div>`).join('')}</div>
          <div class="ko-dest">
            <div class="ko-box"><h4>Straight to the round of 16</h4>
              <div class="ko-seeds">${seeded.map((t) => `<span class="ko-slot" data-ko="${t}"></span>`).join('')}</div></div>
            <div class="ko-box"><h4>Knockout phase play-offs</h4>
              <div class="ko-ties">${poTies.map((tie) => `<div class="ko-tie">${tie.slots.map((s) => `<span class="ko-slot" data-ko="${s.team}"></span>`).join('<span class="ko-vs">v</span>')}</div>`).join('')}</div></div>
          </div>
        </div>
        <div class="foot" id="lp-foot"><span></span><button class="btn ghost" data-act="lp-koskip">Skip</button></div>`;
      scrollTo(0, 0);
      const motion = !prefersReducedMotion();
      const fill = (t) => { const s = el.querySelector(`.ko-slot[data-ko="${t}"]`); if (s && !s.innerHTML) { s.innerHTML = chip(t); s.classList.add('pop', 'filled'); } };
      const flyRow = (t) => {
        const row = el.querySelector(`.kt-row[data-t="${t}"]`), slot = el.querySelector(`.ko-slot[data-ko="${t}"]`);
        if (!row || !slot) return;
        row.classList.add('sent');
        if (!motion || !slot.animate) { fill(t); return; }
        const a = row.getBoundingClientRect(), b = slot.getBoundingClientRect();
        const ghost = document.createElement('span');
        ghost.className = 'chip flyer';
        ghost.innerHTML = `${flagHTML(T[t].country)}${esc(nm(t))}`;
        Object.assign(ghost.style, { left: `${a.left + 30}px`, top: `${a.top}px` });
        el.appendChild(ghost);
        ghost.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${b.left - a.left - 30}px, ${b.top - a.top}px)` }],
          { duration: 700, easing: 'cubic-bezier(.4,.1,.3,1)' }).onfinish = () => { ghost.remove(); fill(t); };
      };
      const finish = () => {
        if (S.phase !== 'ko') return;
        S.phase = 'kodone';
        el.querySelectorAll('.kt-row').forEach((r) => (pos[r.dataset.t] > 24 ? r.classList.add('out') : r.classList.add('sent')));
        [...seeded, ...poTies.flatMap((t) => t.slots.map((s) => s.team))].forEach(fill);
        el.querySelector('#ko-hint').textContent = 'The top 8 wait in the round of 16. The other 16 meet over two legs for the last 8 places.';
        el.querySelector('#lp-foot').innerHTML = '<span></span><button class="btn" data-act="lp-end">Start the knockouts</button>';
      };
      S.koFinish = finish;
      if (!motion) { finish(); return; }
      await sleep(900);
      // 25–36 are out
      if (S.phase !== 'ko') return;
      el.querySelector('#ko-hint').textContent = 'Places 25–36 are out.';
      el.querySelectorAll('.kt-row.z3').forEach((r, i) => setTimeout(() => r.classList.add('out'), i * 70));
      await sleep(1600);
      if (S.phase !== 'ko') return;
      el.querySelector('#ko-hint').textContent = 'The top 8 go straight to the round of 16.';
      for (const t of seeded) { if (S.phase !== 'ko') return; flyRow(t); await sleep(220); }
      await sleep(900);
      if (S.phase !== 'ko') return;
      el.querySelector('#ko-hint').textContent = 'Places 9–24 are drawn into the knockout phase play-offs.';
      for (const tie of poTies) for (const s of tie.slots) { if (S.phase !== 'ko') return; flyRow(s.team); await sleep(160); }
      await sleep(1000);
      finish();
    }

    // ---------- End ----------
    function end() {
      const lines = [['Teams in the league phase', `${teams.length} from ${countries.size} countries`]];
      let max = 0;
      MDS.forEach((m, k) => {
        if (!S.per[k].predDone) return;
        max += PICK * EXACT + xiKeys(k).length * XI_POINT;
        lines.push([m.name, `${predTotal(k)}/${PICK * EXACT} predictions${xiKeys(k).length ? `, ${xiTotal(k)}/${xiKeys(k).length} Missing XI` : ''}`]);
      });
      resolve({ score: score(), max, lines });
    }

    // ---------- Events ----------
    el.addEventListener('input', (e) => {
      const p = e.target.dataset?.pred;
      if (p) { const [i, j] = p.split('-'); const P = cur(); P.pred[i] ||= ['', '']; P.pred[i][j] = e.target.value.replace(/[^0-9]/g, '').slice(0, 2); syncPred(); }
      const x = e.target.dataset?.xi;
      if (x) cur().xiAns[x] = e.target.value;
    });
    const hl = (t, on) => {
      el.querySelector(`.pin[data-t="${t}"]`)?.classList.toggle('hl', on);
      el.querySelector(`.lp-team[data-t="${t}"]`)?.classList.toggle('hl', on);
    };
    el.addEventListener('mouseover', (e) => { const x = e.target.closest('.pin[data-t], .lp-team[data-t]'); if (x) hl(x.dataset.t, true); });
    el.addEventListener('mouseout', (e) => { const x = e.target.closest('.pin[data-t], .lp-team[data-t]'); if (x) hl(x.dataset.t, false); });
    el.addEventListener('keydown', (e) => {
      const row = e.target.closest?.('[data-act="lp-toggle"]');
      if (row && e.target === row && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); row.click(); }
    });
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act^="lp-"]');
      if (!b || b.disabled) return;
      const act = b.dataset.act;
      if (act === 'lp-skip') mapDone();
      else if (act === 'lp-md') matchdayDraw(0);
      else if (act === 'lp-mdskip') choose();
      else if (act === 'lp-toggle') {
        const c = cur().chosen, i = +b.dataset.i, j = c.indexOf(i);
        if (j >= 0) c.splice(j, 1); else if (c.length < PICK) c.push(i);
        c.sort((x, y) => x - y);
        syncChoose();
      } else if (act === 'lp-predict') { predictScreen(); scrollTo(0, 0); }
      else if (act === 'lp-predsubmit') { cur().predDone = true; predictScreen(); scrollTo(0, 0); }
      else if (act === 'lp-xi') { xiScreen(); scrollTo(0, 0); }
      else if (act === 'lp-xisubmit') { cur().xiDone = true; xiScreen(); scrollTo(0, 0); }
      else if (act === 'lp-table') { tableScreen(S.md); scrollTo(0, 0); }
      else if (act === 'lp-next') matchdayDraw(S.md + 1);
      else if (act === 'lp-ko') knockoutScreen();
      else if (act === 'lp-koskip') S.koFinish?.();
      else if (act === 'lp-end') end();
    });

    // Review mode: step 1 + 2k is matchday k, step 2 + 2k is the table after it
    if (start >= 1 + 2 * MDS.length && MDS.length) knockoutScreen();
    else if (start >= 1 && MDS.length) {
      const k = Math.min(Math.floor((start - 1) / 2), MDS.length - 1);
      S.md = k;
      if ((start - 1) % 2 === 1) tableScreen(k); else choose();
    } else {
      mapScreen().then(() => { if (el.isConnected) runMap(); }).catch((e) => {
        el.querySelector('.map-wrap').innerHTML = `<p class="hint">${esc(e.message)}</p>`; mapDone();
      });
    }
  });
}
