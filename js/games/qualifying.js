// Qualifying: type the country of every new team in each round, submit, then see the answers.
// In the last round the player also picks which team in each tie reached the league phase.
import { bindCombos, comboHTML, focusField, resultHTML } from '../lib/country-field.js';
import { countryName } from '../lib/countries.js';
import { esc, tieResult } from '../lib/util.js';

export const meta = { id: 'qualifying', title: 'Qualifying', short: 'Qualifying' };
export const available = (season) => season.stages.some((s) => s.type === 'qualifying');
export const steps = (season) => [...season.stages.filter((s) => s.type === 'qualifying').map((s) => s.name), 'Summary'];

const PICK_POINTS = 2;
const PATHS = { champions: 'Champions Path', league: 'League Path' };

export function play({ el, season, start = 0, onStep }) {
  return new Promise((resolve) => {
    const ST = season.stages.filter((s) => s.type === 'qualifying');
    const T = season.teams;
    const LAST = ST.length - 1;
    const nm = (t) => T[t].name;

    // New teams per round, in the order they appear
    const NEW = [];
    const seen = new Set();
    ST.forEach((st, r) => {
      NEW[r] = [];
      st.ties.forEach((tie) => tie.slots.forEach(({ team }) => { if (!seen.has(team)) { seen.add(team); NEW[r].push(team); } }));
    });
    const MAX = NEW.flat().length + ST[LAST].ties.length * PICK_POINTS;

    const S = { r: 0, drafts: {}, sel: {}, ans: {}, picks: {}, submitted: [], summary: false };
    // Starting later in the flow (review mode): earlier rounds are filled in with the right answers
    if (start > 0) {
      for (let r = 0; r < Math.min(start, ST.length); r++) {
        NEW[r].forEach((t) => { const c = T[t].country; S.sel[t] = c; S.drafts[t] = countryName(c); S.ans[t] = { code: c, ok: true }; });
        if (r === LAST) ST[LAST].ties.forEach((tie, i) => { S.picks[i] = tie.winner; });
        S.submitted[r] = true;
      }
      S.r = Math.min(start, LAST);
      S.summary = start > LAST;
    }
    const points = () => Object.values(S.ans).filter((a) => a.ok).length
      + (S.submitted[LAST] ? ST[LAST].ties.filter((tie, i) => S.picks[i] === tie.winner).length * PICK_POINTS : 0);
    const progress = (r) => {
      const countries = NEW[r].filter((t) => S.sel[t]).length;
      const picks = r === LAST ? Object.keys(S.picks).length : 0;
      const needPicks = r === LAST ? ST[LAST].ties.length : 0;
      return { countries, picks, needPicks, done: countries === NEW[r].length && picks === needPicks };
    };

    function row(r, i, t, tie) {
      const isNew = NEW[r].includes(t), sub = S.submitted[r], last = r === LAST;
      const pick = S.picks[i];
      let cls = 'row' + (last ? ' row3' : '');
      if (sub) cls += t === tie.winner ? ' win' : (last && t === pick ? ' wrong' : ' dim');
      let right;
      if (isNew && !sub) right = comboHTML({ key: t, draft: S.drafts[t], invalid: S.drafts[t] && !S.sel[t] && S.touched?.[t], label: `Country of ${nm(t)}` });
      else if (isNew) right = resultHTML(S.ans[t]?.code, T[t].country);
      else right = `<span class="cty">${esc(countryName(T[t].country))}</span>`;
      const name = `<span class="tn">${esc(nm(t))}${sub && t === tie.winner ? '<span class="adv">Through</span>' : ''}</span>`;
      const pickBtn = last
        ? (sub ? `<span class="pickmark">${pick === t ? (t === tie.winner ? '✓' : '✗') : ''}</span>`
          : `<button class="pickbtn ${pick === t ? 'on' : ''}" data-act="q-pick" data-i="${i}" data-t="${t}" aria-pressed="${pick === t}">${pick === t ? '✓ Through' : 'Through?'}</button>`)
        : '';
      return `<div class="${cls}">${name}${right}${pickBtn}</div>`;
    }

    function footer(r) {
      const p = progress(r), sub = S.submitted[r];
      if (sub) return `<span class="hint" style="margin:0"></span><button class="btn" data-act="q-next">${r < LAST ? 'Next round' : 'See summary'}</button>`;
      const parts = [`${p.countries} of ${NEW[r].length} countries`];
      if (r === LAST) parts.push(`${p.picks} of ${p.needPicks} picks`);
      return `<span class="hint" style="margin:0" id="q-status">${parts.join(', ')}</span>
        <button class="btn" data-act="q-submit" id="q-submit" ${p.done ? '' : 'disabled'}>Submit answers</button>`;
    }

    function roundHTML() {
      const r = S.r, st = ST[r], sub = S.submitted[r];
      let i = 0, body = '', lastPath;
      for (const tie of st.ties) {
        if (tie.path !== lastPath) {
          if (lastPath !== undefined) body += '</div>';
          if (tie.path) body += `<h3 class="path">${PATHS[tie.path] || esc(tie.path)}</h3>`;
          body += '<div class="ties">';
          lastPath = tie.path;
        }
        const idx = i++;
        const [a, b] = tie.slots.map((s) => s.team);
        let res = '';
        if (sub) {
          const verdict = r === LAST
            ? `<b class="${S.picks[idx] === tie.winner ? 'ok' : 'no'}">${S.picks[idx] === tie.winner ? `Correct pick, +${PICK_POINTS} pts` : 'Wrong pick'}.</b> `
            : '';
          res = `<div class="res">${verdict}${esc(tieResult(tie, T, a, b))}</div>`;
        }
        body += `<div class="tie">${row(r, idx, a, tie)}${row(r, idx, b, tie)}${res}</div>`;
      }
      body += '</div>';

      let hint;
      if (sub) {
        const ok = NEW[r].filter((t) => S.ans[t].ok).length;
        hint = `You got ${ok} of ${NEW[r].length} countries right in this round.`;
      } else {
        hint = r === 0
          ? 'Type the country of every team and pick it from the list. Answers are revealed when you submit the round.'
          : 'Type the country of every new team. Teams you have already seen show their country.';
        if (r === LAST) hint += ` Also pick which team in each tie reached the league phase (${PICK_POINTS} pts each).`;
      }
      return `<div class="bar"><h2>${esc(st.name)}</h2><span class="score">${points()} pts</span></div>
        <p class="hint">${hint}</p>${body}
        <div class="foot" id="q-foot">${footer(r)}</div>`;
    }

    function lines() {
      const out = ST.map((st, r) => [st.name, `${NEW[r].filter((t) => S.ans[t]?.ok).length}/${NEW[r].length} countries`]);
      const ok = ST[LAST].ties.filter((tie, i) => S.picks[i] === tie.winner).length;
      out.push(['To the league phase', `${ok}/${ST[LAST].ties.length} correct`]);
      return out;
    }

    function summaryHTML() {
      const misses = NEW.flat().filter((t) => !S.ans[t]?.ok)
        .map((t) => `<div class="miss"><span><b>${esc(nm(t))}</b>: ${esc(countryName(T[t].country))}</span><span>You answered ${esc(countryName(S.ans[t]?.code) || 'nothing')}</span></div>`).join('');
      return `<div class="bar"><h2>Qualifying done</h2><span class="score">${points()} / ${MAX} pts</span></div>
        <div class="rounds">${lines().map(([k, v]) => `<div class="rrow"><span>${esc(k)}</span><span>${esc(v)}</span></div>`).join('')}</div>
        ${misses ? `<h3 class="path">Countries you missed</h3>${misses}` : ''}
        <div class="foot"><span></span><button class="btn" data-act="q-done">Continue</button></div>`;
    }

    function render() { el.innerHTML = S.summary ? summaryHTML() : roundHTML(); onStep?.(S.summary ? ST.length : S.r); }
    const updateFooter = () => { const f = el.querySelector('#q-foot'); if (f && !S.submitted[S.r]) f.innerHTML = footer(S.r); };
    const firstOpen = (after) => {
      const list = NEW[S.r], start = after ? list.indexOf(after) + 1 : 0;
      return [...list.slice(start), ...list.slice(0, start)].find((t) => !S.sel[t]);
    };

    S.touched = {};
    bindCombos(el, S, {
      onChange: (t) => { S.touched[t] = true; updateFooter(); },
      onDone: (t) => { const next = firstOpen(t); if (next) focusField(el, next); },
    });

    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act^="q-"]');
      if (!b || b.disabled) return;
      const act = b.dataset.act;
      if (act === 'q-pick') {
        S.picks[+b.dataset.i] = b.dataset.t;
        // update only the two pick buttons in this tie, so typed text and focus elsewhere are kept
        b.closest('.tie').querySelectorAll('.pickbtn').forEach((x) => {
          const on = x.dataset.t === b.dataset.t;
          x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); x.textContent = on ? '✓ Through' : 'Through?';
        });
        updateFooter();
      } else if (act === 'q-submit') {
        if (!progress(S.r).done) return;
        NEW[S.r].forEach((t) => { S.ans[t] = { code: S.sel[t], ok: S.sel[t] === T[t].country }; });
        S.submitted[S.r] = true;
        render(); scrollTo(0, 0);
      } else if (act === 'q-next') {
        if (S.r < LAST) { S.r++; render(); scrollTo(0, 0); focusField(el, firstOpen()); }
        else { S.summary = true; render(); scrollTo(0, 0); }
      } else if (act === 'q-done') resolve({ score: points(), max: MAX, lines: lines() });
    });

    render();
    focusField(el, firstOpen());
  });
}
