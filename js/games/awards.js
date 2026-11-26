// Awards, the end of the season.
// 1. Team of the Season: fill in the whole starting XI, then submit to see how many you got right.
// 2. Player of the Season: one attempt.
// 3. Young Player of the Season: one attempt.
import { countryName } from '../lib/countries.js';
import { flagHTML } from '../lib/flags.js';
import { nameMatcher } from '../lib/names.js';
import { esc } from '../lib/util.js';

export const meta = { id: 'awards', title: 'Awards', short: 'Awards' };
export const available = (season) => !!season.awards?.teamOfSeason?.length;
export const steps = () => ['Team of the Season', 'Player of the Season', 'Young Player of the Season'];

const XI_POINT = 1, AWARD_POINTS = 3;
const POS_NAME = { GK: 'Goalkeeper', DF: 'Defender', MF: 'Midfielder', FW: 'Forward' };

export function play({ el, season, start = 0, onStep }) {
  return new Promise((resolve) => {
    const T = season.teams, A = season.awards;
    const groups = A.teamOfSeason;
    const XI = groups.flatMap((g) => g.players.map((p, j) => ({ ...p, pos: g.pos, id: `${g.pos}${j}` })));
    const matchXI = nameMatcher(XI);
    const slots = groups.flatMap((g) => g.players.map((_, j) => `${g.pos}-${j}`));
    const S = { step: Math.min(start, 2), xi: {}, xiDone: false, award: {}, awardDone: {} };

    const who = (p) => `${flagHTML(p.nat)}<span class="aw-name">${esc(p.name)}</span><span class="aw-team">${flagHTML(T[p.team].country)}${esc(T[p.team].name)}</span>`;

    // Marking: a player counts once, in the right position group
    function markXI() {
      const used = new Set();
      return Object.fromEntries(slots.map((slot) => {
        const pos = slot.split('-')[0], id = matchXI(S.xi[slot] || '');
        const p = id && XI.find((x) => x.id === id);
        if (!p) return [slot, { ok: false }];
        if (used.has(id)) return [slot, { ok: false, dup: true, p }];
        used.add(id);
        return [slot, p.pos === pos ? { ok: true, p } : { ok: false, wrongPos: true, p }];
      }));
    }
    const xiScore = () => (S.xiDone ? Object.values(markXI()).filter((m) => m.ok).length * XI_POINT : 0);
    const keys = { player: 'Player of the Season', young: 'Young Player of the Season' };
    const awardOk = (k) => !!S.awardDone[k] && !!nameMatcher([{ id: 1, ...A[k] }])(S.award[k] || '');
    const score = () => xiScore() + ['player', 'young'].filter(awardOk).length * AWARD_POINTS;

    function teamScreen() {
      onStep?.(0);
      const done = S.xiDone, marks = done ? markXI() : {};
      const lines = [...groups].reverse().map((g) => `<div class="pitch-line">${g.players.map((_, j) => {
        const slot = `${g.pos}-${j}`, m = marks[slot];
        if (!done) return `<label class="pslot"><span class="ppos">${g.pos}</span><input data-xi="${slot}" value="${esc(S.xi[slot] || '')}" placeholder="${POS_NAME[g.pos]}" autocomplete="off" spellcheck="false" aria-label="${POS_NAME[g.pos]} ${j + 1}"></label>`;
        const note = m.ok ? '' : m.dup ? 'Already named' : m.wrongPos ? `In the team as ${POS_NAME[m.p.pos].toLowerCase()}` : 'Not in the team';
        return `<div class="pslot ${m.ok ? 'ok' : 'no'}"><span class="ppos">${g.pos}</span>
          <span class="pans">${m.ok ? `${flagHTML(m.p.nat)}${esc(m.p.name)} ✓` : `<s>${esc(S.xi[slot] || 'Empty')}</s>`}</span>
          ${note ? `<span class="pnote">${note}</span>` : ''}</div>`;
      }).join('')}</div>`).join('');
      const filled = slots.filter((s) => (S.xi[s] || '').trim()).length;
      el.innerHTML = `<div class="bar"><h2>Awards</h2><span class="score">${score()} pts</span></div>
        <h3 class="ask ${done ? '' : 'anim'}">${done ? `You got ${xiScore()} of ${XI.length}` : 'Team of the Season'}</h3>
        <p class="hint">${done
          ? 'The UEFA technical study group’s team of the season:'
          : `Name the whole starting XI chosen by UEFA’s technical study group (${groups.map((g) => g.players.length).join('-')}), then submit. A player counts in the right position, ${XI_POINT} pt each. The surname is enough.`}</p>
        <div class="pitch">${lines}</div>
        ${done ? `<div class="aw-list">${groups.map((g) => g.players.map((p) => `<div class="aw-row"><span class="ppos">${g.pos}</span>${who(p)}</div>`).join('')).join('')}</div>` : ''}
        <div class="foot"><span class="hint" style="margin:0" id="xi-status">${done ? '' : `${filled} of ${XI.length} named`}</span>
          ${done ? '<button class="btn" data-act="aw-next">Player of the Season</button>'
            : `<button class="btn" data-act="aw-xi" ${filled === XI.length ? '' : 'disabled'}>Submit the team</button>`}</div>`;
      if (!done) el.querySelector('input[data-xi]')?.focus();
    }

    function awardScreen(k) {
      onStep?.(k === 'player' ? 1 : 2);
      const done = !!S.awardDone[k], ok = awardOk(k), p = A[k];
      el.innerHTML = `<div class="bar"><h2>Awards</h2><span class="score">${score()} pts</span></div>
        <h3 class="ask anim">${keys[k]}</h3>
        <p class="hint">${done ? '' : `One attempt. ${AWARD_POINTS} pts if you get it right.`}</p>
        <div class="tie q aw-card">
          ${done ? `<div class="aw-result ${ok ? 'ok' : 'no'}">
              ${ok ? '' : `<p class="aw-your">You said <s>${esc(S.award[k] || 'nothing')}</s></p>`}
              <div class="aw-winner">${flagHTML(p.nat)}<b>${esc(p.name)}</b>${ok ? ' ✓' : ''}</div>
              <div class="aw-team">${flagHTML(T[p.team].country)}${esc(T[p.team].name)}, ${esc(countryName(p.nat))}</div>
              <div class="res"><b class="${ok ? 'ok' : 'no'}">${ok ? `Correct, +${AWARD_POINTS} pts` : 'Wrong'}</b></div></div>`
          : `<div class="ts-input"><input id="aw-in" placeholder="Player name" autocomplete="off" spellcheck="false" enterkeyhint="send" aria-label="${keys[k]}">
              <button class="btn" data-act="aw-guess">Submit</button></div>`}
        </div>
        <div class="foot"><span></span>${done ? `<button class="btn" data-act="aw-next">${k === 'player' ? 'Young Player of the Season' : 'See your results'}</button>` : ''}</div>`;
      el.querySelector('#aw-in')?.focus();
    }

    const render = () => (S.step === 0 ? teamScreen() : awardScreen(S.step === 1 ? 'player' : 'young'));
    function guess() {
      const k = S.step === 1 ? 'player' : 'young', v = el.querySelector('#aw-in')?.value.trim();
      if (!v) return;
      S.award[k] = v; S.awardDone[k] = true; render();
    }
    function finish() {
      resolve({ score: score(), max: XI.length * XI_POINT + 2 * AWARD_POINTS, lines: [
        ['Team of the Season', `${xiScore()}/${XI.length}`],
        ['Player of the Season', awardOk('player') ? 'Correct' : `Wrong, ${A.player.name}`],
        ['Young Player of the Season', awardOk('young') ? 'Correct' : `Wrong, ${A.young.name}`],
      ] });
    }

    el.addEventListener('input', (e) => {
      const k = e.target.dataset?.xi;
      if (!k) return;
      S.xi[k] = e.target.value;
      const filled = slots.filter((s) => (S.xi[s] || '').trim()).length;
      el.querySelector('#xi-status').textContent = `${filled} of ${XI.length} named`;
      el.querySelector('[data-act="aw-xi"]').disabled = filled !== XI.length;
    });
    el.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      if (e.target.id === 'aw-in') { e.preventDefault(); guess(); }
      else if (e.target.dataset?.xi) {
        e.preventDefault();
        const ins = [...el.querySelectorAll('input[data-xi]')], i = ins.indexOf(e.target);
        (ins.slice(i + 1).find((x) => !x.value.trim()) || ins.find((x) => !x.value.trim()))?.focus();
      }
    });
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act^="aw-"]');
      if (!b || b.disabled) return;
      const act = b.dataset.act;
      if (act === 'aw-xi') { S.xiDone = true; render(); scrollTo(0, 0); }
      else if (act === 'aw-guess') guess();
      else if (act === 'aw-next') { if (S.step < 2) { S.step++; render(); scrollTo(0, 0); } else finish(); }
    });
    render();
  });
}
