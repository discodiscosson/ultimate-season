import { DATALIST, bindCountryField, fieldHTML, focusField, makeOptions, resultHTML } from '../lib/country-field.js';
import { countryName } from '../lib/countries.js';
import { esc, tieResult } from '../lib/util.js';

export const meta = { id: 'qualifying', title: 'Kvalet', short: 'Kval' };
export const available = (season) => season.stages.some((s) => s.type === 'qualifying');

const PICK_POINTS = 2;
const PATHS = { champions: 'Mästarvägen', league: 'Ligavägen' };

export function play({ el, season, difficulty }) {
  return new Promise((resolve) => {
    const ST = season.stages.filter((s) => s.type === 'qualifying');
    const T = season.teams;
    const LAST = ST.length - 1;
    const nm = (t) => T[t].name;

    // Nya lag per omgång, i den ordning de dyker upp
    const NEW = [];
    const seen = new Set();
    ST.forEach((st, r) => {
      NEW[r] = [];
      st.ties.forEach((tie) => tie.slots.forEach(({ team }) => { if (!seen.has(team)) { seen.add(team); NEW[r].push(team); } }));
    });
    const pool = Object.values(T).map((t) => t.country);
    const MAX = NEW.flat().length + ST[LAST].ties.length * PICK_POINTS;

    const S = { r: 0, ans: {}, err: {}, drafts: {}, opts: {}, picks: {}, summary: false };
    const answered = (r) => NEW[r].every((t) => S.ans[t]);
    const points = () => Object.values(S.ans).filter((a) => a.ok).length
      + ST[LAST].ties.filter((tie, i) => S.picks[i] === tie.winner).length * PICK_POINTS;

    function row(r, i, t, tie) {
      const isNew = NEW[r].includes(t), a = S.ans[t], done = answered(r);
      const pick = S.picks[i];
      const pickPhase = r === LAST && done;
      const revealed = r < LAST ? done : pick !== undefined;
      let cls = 'row';
      if (revealed) cls += t === tie.winner ? ' win' : (r === LAST && t === pick ? ' wrong' : ' dim');
      let right;
      if (isNew && !a) {
        S.opts[t] ||= makeOptions(T[t].country, pool);
        right = fieldHTML({ key: t, difficulty, options: S.opts[t], draft: S.drafts[t], err: S.err[t], label: `Land för ${nm(t)}` });
      } else if (isNew) right = resultHTML(a.code, T[t].country);
      else right = `<span class="cty">${esc(countryName(T[t].country))}</span>`;
      const name = `<span class="tn">${esc(nm(t))}${revealed && t === tie.winner ? '<span class="adv">Vidare</span>' : ''}</span>`;
      return pickPhase && !revealed
        ? `<button class="${cls}" data-act="q-pick" data-i="${i}" data-t="${t}">${name}${right}</button>`
        : `<div class="${cls}">${name}${right}</div>`;
    }

    function roundHTML() {
      const r = S.r, st = ST[r], done = answered(r);
      let i = 0, body = '', lastPath;
      for (const tie of st.ties) {
        if (tie.path !== lastPath) {
          if (lastPath !== undefined) body += '</div>';
          if (tie.path) body += `<h3 class="path">${PATHS[tie.path] || esc(tie.path)}</h3>`;
          body += '<div class="ties">';
          lastPath = tie.path;
        }
        const idx = i++, pick = S.picks[idx];
        const [a, b] = tie.slots.map((s) => s.team);
        const show = r < LAST ? done : pick !== undefined;
        let res = '';
        if (show) {
          const verdict = r === LAST ? `<b class="${pick === tie.winner ? 'ok' : 'no'}">${pick === tie.winner ? `Rätt, +${PICK_POINTS} p` : 'Fel'}.</b> ` : '';
          res = `<div class="res">${verdict}${esc(tieResult(tie, T, a, b))}</div>`;
        }
        body += `<div class="tie">${row(r, idx, a, tie)}${row(r, idx, b, tie)}${res}</div>`;
      }
      body += '</div>';

      const left = NEW[r].filter((t) => !S.ans[t]).length;
      const nTies = st.ties.length, picked = Object.keys(S.picks).length;
      let hint, status, canNext;
      if (!done) {
        const how = difficulty === 'easy' ? 'Välj rätt land för varje nytt lag.' : 'Skriv landet för varje nytt lag och tryck Enter eller OK.';
        hint = r === 0 ? how : `${how} Lag du redan mött visar sitt land.`;
        status = `${left} lag kvar`; canNext = false;
      } else if (r < LAST) {
        hint = 'Alla länder klara. Här är omgångens resultat.'; status = ''; canNext = true;
      } else {
        hint = `Välj vilket lag i varje möte som gick till ligafasen. ${PICK_POINTS} p per rätt.`;
        status = picked < nTies ? `${nTies - picked} möten kvar` : ''; canNext = picked === nTies;
      }
      return `${DATALIST}
        <div class="bar"><h2>${esc(st.name)}</h2><span class="score">${points()} p</span></div>
        <p class="hint">${hint}</p>${body}
        <div class="foot"><span class="hint" style="margin:0">${status}</span>
        <button class="btn" data-act="q-next" ${canNext ? '' : 'disabled'}>${r < LAST ? 'Nästa omgång' : 'Se sammanfattning'}</button></div>`;
    }

    function lines() {
      const out = ST.map((st, r) => [st.name, `${NEW[r].filter((t) => S.ans[t]?.ok).length}/${NEW[r].length} länder`]);
      const ok = ST[LAST].ties.filter((tie, i) => S.picks[i] === tie.winner).length;
      out.push(['Till ligafasen', `${ok}/${ST[LAST].ties.length} rätt`]);
      return out;
    }

    function summaryHTML() {
      const misses = NEW.flat().filter((t) => S.ans[t] && !S.ans[t].ok)
        .map((t) => `<div class="miss"><span><b>${esc(nm(t))}</b>: ${esc(countryName(T[t].country))}</span><span>Du svarade ${esc(countryName(S.ans[t].code))}</span></div>`).join('');
      return `<div class="bar"><h2>Kvalet klart</h2><span class="score">${points()} / ${MAX} p</span></div>
        <div class="rounds">${lines().map(([k, v]) => `<div class="rrow"><span>${esc(k)}</span><span>${esc(v)}</span></div>`).join('')}</div>
        ${misses ? `<h3 class="path">Länder du missade</h3>${misses}` : ''}
        <div class="foot"><span></span><button class="btn" data-act="q-done">Vidare till slutspelet</button></div>`;
    }

    function focusNext(after) {
      const list = NEW[S.r], start = after ? list.indexOf(after) + 1 : 0;
      const next = [...list.slice(start), ...list.slice(0, start)].find((t) => !S.ans[t]);
      if (next && difficulty !== 'easy') focusField(el, next);
    }

    function render() { el.innerHTML = S.summary ? summaryHTML() : roundHTML(); }

    bindCountryField(el, S, (t, code) => {
      if (S.ans[t]) return;
      S.ans[t] = { code, ok: code === T[t].country };
      render(); focusNext(t);
    }, render);

    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act^="q-"]');
      if (!b || b.disabled) return;
      const act = b.dataset.act;
      if (act === 'q-pick') { const i = +b.dataset.i; if (S.picks[i] === undefined) { S.picks[i] = b.dataset.t; render(); } }
      else if (act === 'q-next') {
        if (S.r < LAST) { S.r++; render(); scrollTo(0, 0); focusNext(); }
        else { S.summary = true; render(); scrollTo(0, 0); }
      } else if (act === 'q-done') resolve({ score: points(), max: MAX, lines: lines() });
    });

    render(); focusNext();
  });
}
