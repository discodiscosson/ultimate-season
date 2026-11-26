// Qualifying.
// Country rounds (the first two): type the country of every new team.
// Advance rounds (the rest): pick who went through.
// Third qualifying round: also mark every team that has played a European Cup / Champions League final.
// Last round (play-off): also name each team's biggest rival instead.
// Nothing is revealed until the round is submitted.
import { answerHTML, bindCombos, comboHTML, focusField } from '../lib/combo.js';
import { countryName } from '../lib/countries.js';
import { esc, tieResult } from '../lib/util.js';

export const meta = { id: 'qualifying', title: 'Qualifying', short: 'Qualifying' };
export const available = (season) => season.stages.some((s) => s.type === 'qualifying');
export const steps = (season) => [...season.stages.filter((s) => s.type === 'qualifying').map((s) => s.name), 'Summary'];

const COUNTRY_ROUNDS = 2;
const PICK_POINTS = 2;
const RIVAL_POINTS = 1;

export function play({ el, season, start = 0, onStep }) {
  return new Promise((resolve) => {
    const ST = season.stages.filter((s) => s.type === 'qualifying');
    const T = season.teams;
    const LAST = ST.length - 1;
    const nm = (t) => T[t].name;
    const isCountry = (r) => r < COUNTRY_ROUNDS;
    const hasRival = (r) => r === LAST && !isCountry(r);
    const hasFinalists = (r) => !isCountry(r) && r !== LAST;
    const isFinalist = (t) => (T[t].finals || []).length > 0;
    const rivalsOf = (t) => T[t].rivals || [];

    const teamsIn = (r) => ST[r].ties.flatMap((tie) => tie.slots.map((s) => s.team));
    // New teams per country round, in the order they appear
    const NEW = [];
    const seen = new Set();
    ST.forEach((st, r) => {
      NEW[r] = [];
      teamsIn(r).forEach((t) => { if (!seen.has(t)) { seen.add(t); NEW[r].push(t); } });
    });
    const rivalTeams = (r) => (hasRival(r) ? teamsIn(r).filter((t) => rivalsOf(t).length) : []);

    const roundMax = (r) => (isCountry(r)
      ? NEW[r].length
      : ST[r].ties.length * PICK_POINTS + (hasFinalists(r) ? teamsIn(r).filter(isFinalist).length : 0) + rivalTeams(r).length * RIVAL_POINTS);
    const MAX = ST.reduce((s, _, r) => s + roundMax(r), 0);

    const S = { r: 0, drafts: {}, sel: {}, ans: {}, picks: ST.map(() => ({})), marks: ST.map(() => new Set()), submitted: [], summary: false, touched: {} };
    const rk = (t) => `rival:${t}`;

    // Per-round results (only meaningful once submitted)
    function score(r) {
      if (isCountry(r)) {
        const ok = NEW[r].filter((t) => S.ans[t]?.ok).length;
        return { total: ok, countries: ok };
      }
      const picks = ST[r].ties.filter((tie, i) => S.picks[r][i] === tie.winner).length;
      const finalists = hasFinalists(r) ? teamsIn(r).filter(isFinalist) : [];
      const hit = finalists.filter((t) => S.marks[r].has(t)).length;
      const wrong = [...S.marks[r]].filter((t) => !isFinalist(t)).length;
      const marks = Math.max(0, hit - wrong);
      const rivals = rivalTeams(r).filter((t) => rivalsOf(t).includes(S.sel[rk(t)])).length;
      return { total: picks * PICK_POINTS + marks + rivals * RIVAL_POINTS, picks, hit, wrong, marks, finalists: finalists.length, rivals };
    }
    const points = () => ST.reduce((s, _, r) => s + (S.submitted[r] ? score(r).total : 0), 0);

    function progress(r) {
      if (isCountry(r)) {
        const n = NEW[r].filter((t) => S.sel[t]).length;
        return { text: `${n} of ${NEW[r].length} countries`, done: n === NEW[r].length };
      }
      const p = Object.keys(S.picks[r]).length, need = ST[r].ties.length;
      const parts = [`${p} of ${need} picks`];
      let done = p === need;
      if (hasRival(r)) {
        const rv = rivalTeams(r).filter((t) => S.sel[rk(t)]).length, rn = rivalTeams(r).length;
        parts.push(`${rv} of ${rn} rivals`);
        done = done && rv === rn;
      }
      return { text: parts.join(', '), done };
    }

    // Review mode: start later in the flow with earlier rounds filled in with the right answers
    if (start > 0) {
      for (let r = 0; r < Math.min(start, ST.length); r++) {
        if (isCountry(r)) NEW[r].forEach((t) => { const c = T[t].country; S.sel[t] = c; S.drafts[t] = countryName(c); S.ans[t] = { code: c, ok: true }; });
        else {
          ST[r].ties.forEach((tie, i) => { S.picks[r][i] = tie.winner; });
          if (hasFinalists(r)) teamsIn(r).filter(isFinalist).forEach((t) => S.marks[r].add(t));
          rivalTeams(r).forEach((t) => { S.sel[rk(t)] = rivalsOf(t)[0]; S.drafts[rk(t)] = rivalsOf(t)[0]; });
        }
        S.submitted[r] = true;
      }
      S.r = Math.min(start, LAST);
      S.summary = start > LAST;
    }

    // ---- Rows ----
    function countryRow(r, t, tie) {
      const sub = S.submitted[r], isNew = NEW[r].includes(t);
      let cls = 'row';
      if (sub) cls += t === tie.winner ? ' win' : ' dim';
      let right;
      if (isNew && !sub) right = comboHTML({ key: t, draft: S.drafts[t], invalid: S.touched[t] && S.drafts[t] && !S.sel[t], label: `Country of ${nm(t)}` });
      else if (isNew) right = answerHTML(S.ans[t]?.code, T[t].country);
      else right = `<span class="cty">${esc(countryName(T[t].country))}</span>`;
      return `<div class="${cls}"><span class="tn">${esc(nm(t))}${sub && t === tie.winner ? '<span class="adv">Through</span>' : ''}</span>${right}</div>`;
    }

    function advanceRow(r, i, t, tie) {
      const sub = S.submitted[r], pick = S.picks[r][i], marked = S.marks[r].has(t);
      let cls = 'row arow';
      if (sub) cls += t === tie.winner ? ' win' : (t === pick ? ' wrong' : ' dim');
      const name = `<span class="tn">${esc(nm(t))}<span class="ctry">${esc(countryName(T[t].country))}</span>${sub && t === tie.winner ? '<span class="adv">Through</span>' : ''}</span>`;
      let ctrls;
      if (!sub) {
        ctrls = `<div class="ctrls">
          ${hasFinalists(r) ? `<button class="togbtn ${marked ? 'on' : ''}" data-act="q-mark" data-t="${t}" aria-pressed="${marked}" title="Has played a European Cup or Champions League final">🏆 ${marked ? 'Finalist' : 'Finalist?'}</button>` : ''}
          <button class="pickbtn ${pick === t ? 'on' : ''}" data-act="q-pick" data-i="${i}" data-t="${t}" aria-pressed="${pick === t}">${pick === t ? '✓ Through' : 'Through?'}</button>
        </div>`;
      } else {
        const fin = hasFinalists(r) ? T[t].finals || [] : [];
        let badge = '';
        if (fin.length && marked) badge = `<span class="badge ok">🏆 Final ${fin.join(', ')} ✓</span>`;
        else if (fin.length) badge = `<span class="badge miss">🏆 Missed: final ${fin.join(', ')}</span>`;
        else if (marked) badge = '<span class="badge no">✗ Never in a final</span>';
        ctrls = `<div class="ctrls">${badge}<span class="pickmark">${pick === t ? (t === tie.winner ? '✓' : '✗') : ''}</span></div>`;
      }
      let rival = '';
      if (hasRival(r) && rivalsOf(t).length) {
        const key = rk(t);
        rival = !sub
          ? `<div class="rival"><span class="rlbl">Biggest rival</span>${comboHTML({ key, src: 'club', draft: S.drafts[key], invalid: S.touched[key] && S.drafts[key] && !S.sel[key], label: `Biggest rival of ${nm(t)}` })}</div>`
          : `<div class="rival"><span class="rlbl">Biggest rival</span>${rivalAnswer(t)}</div>`;
      }
      return `<div class="${cls}">${name}${ctrls}${rival}</div>`;
    }

    function rivalAnswer(t) {
      const given = S.sel[rk(t)], acc = rivalsOf(t);
      if (acc.includes(given)) return `<span class="cty ok">${esc(given)} ✓</span>`;
      return `<span class="cty no"><s>${given ? esc(given) : 'No answer'}</s>${esc(acc.join(' or '))}</span>`;
    }

    // ---- Screens ----
    function footer(r) {
      if (S.submitted[r]) return `<span></span><button class="btn" data-act="q-next">${r < LAST ? 'Next round' : 'See summary'}</button>`;
      const p = progress(r);
      return `<span class="hint" style="margin:0">${p.text}</span>
        <button class="btn" data-act="q-submit" ${p.done ? '' : 'disabled'}>Submit answers</button>`;
    }

    function hintFor(r) {
      if (S.submitted[r]) {
        const s = score(r);
        if (isCountry(r)) return `You got ${s.countries} of ${NEW[r].length} countries right.`;
        let h = `${s.picks} of ${ST[r].ties.length} picks right.`;
        if (hasFinalists(r)) h += ` Finalists: ${s.hit} of ${s.finalists} found${s.wrong ? `, ${s.wrong} wrongly marked` : ''}.`;
        if (hasRival(r)) h += ` Rivals: ${s.rivals} of ${rivalTeams(r).length}.`;
        return `${h} ${s.total} pts this round.`;
      }
      if (isCountry(r)) {
        return r === 0
          ? 'Type the country of every team and pick it from the list. Answers are revealed when you submit the round.'
          : 'Type the country of every new team. Teams you have already seen show their country.';
      }
      let h = `Pick which team went through in each tie (${PICK_POINTS} pts).`;
      if (hasFinalists(r)) h += ' Mark every team that has ever played in a European Cup or Champions League final (+1 for each one found, −1 for each wrong mark).';
      if (hasRival(r)) h += ` Also name each team’s biggest rival (${RIVAL_POINTS} pt each).`;
      return h;
    }

    function roundHTML() {
      const r = S.r, st = ST[r], sub = S.submitted[r];
      const ties = st.ties.map((tie, i) => {
        const [a, b] = tie.slots.map((s) => s.team);
        const row = isCountry(r) ? (t) => countryRow(r, t, tie) : (t) => advanceRow(r, i, t, tie);
        let res = '';
        if (sub) {
          const verdict = isCountry(r) ? '' : `<b class="${S.picks[r][i] === tie.winner ? 'ok' : 'no'}">${S.picks[r][i] === tie.winner ? `Correct pick, +${PICK_POINTS} pts` : 'Wrong pick'}.</b> `;
          res = `<div class="res">${verdict}${esc(tieResult(tie, T, a, b))}</div>`;
        }
        return `<div class="tie">${row(a)}${row(b)}${res}</div>`;
      }).join('');
      return `<div class="bar"><h2>${esc(st.name)}</h2><span class="score">${points()} pts</span></div>
        <p class="hint">${hintFor(r)}</p><div class="ties">${ties}</div>
        <div class="foot" id="q-foot">${footer(r)}</div>`;
    }

    function lines() {
      return ST.map((st, r) => {
        const s = score(r);
        if (isCountry(r)) return [st.name, `${s.countries}/${NEW[r].length} countries`];
        let v = `${s.picks}/${st.ties.length} through`;
        if (hasFinalists(r)) v += `, ${s.hit}/${s.finalists} finalists`;
        if (hasRival(r)) v += `, ${s.rivals}/${rivalTeams(r).length} rivals`;
        return [st.name, v];
      });
    }

    function summaryHTML() {
      const misses = NEW.slice(0, COUNTRY_ROUNDS).flat().filter((t) => !S.ans[t]?.ok)
        .map((t) => `<div class="miss"><span><b>${esc(nm(t))}</b>: ${esc(countryName(T[t].country))}</span><span>You answered ${esc(S.ans[t]?.code ? countryName(S.ans[t].code) : 'nothing')}</span></div>`).join('');
      return `<div class="bar"><h2>Qualifying done</h2><span class="score">${points()} / ${MAX} pts</span></div>
        <div class="rounds">${lines().map(([k, v]) => `<div class="rrow"><span>${esc(k)}</span><span>${esc(v)}</span></div>`).join('')}</div>
        ${misses ? `<h3 class="path">Countries you missed</h3>${misses}` : ''}
        <div class="foot"><span></span><button class="btn" data-act="q-done">Continue</button></div>`;
    }

    function render() { el.innerHTML = S.summary ? summaryHTML() : roundHTML(); onStep?.(S.summary ? ST.length : S.r); }
    const updateFooter = () => { const f = el.querySelector('#q-foot'); if (f && !S.submitted[S.r]) f.innerHTML = footer(S.r); };
    const nextOpen = (after) => {
      const all = isCountry(S.r) ? NEW[S.r] : rivalTeams(S.r).map(rk);
      const i = after ? all.indexOf(after) + 1 : 0;
      return [...all.slice(i), ...all.slice(0, i)].find((k) => !S.sel[k]);
    };

    bindCombos(el, S, {
      onChange: (k) => { S.touched[k] = true; updateFooter(); },
      onDone: (k) => focusField(el, nextOpen(k)),
    });

    const setToggle = (btn, on, onText, offText) => { btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', on); btn.textContent = on ? onText : offText; };

    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act^="q-"]');
      if (!b || b.disabled) return;
      const act = b.dataset.act, r = S.r;
      if (act === 'q-pick') {
        S.picks[r][+b.dataset.i] = b.dataset.t;
        // update only the pick buttons in this tie so typed text and focus elsewhere are kept
        b.closest('.tie').querySelectorAll('.pickbtn').forEach((x) => setToggle(x, x.dataset.t === b.dataset.t, '✓ Through', 'Through?'));
        updateFooter();
      } else if (act === 'q-mark') {
        const t = b.dataset.t;
        if (S.marks[r].has(t)) S.marks[r].delete(t); else S.marks[r].add(t);
        setToggle(b, S.marks[r].has(t), '🏆 Finalist', '🏆 Finalist?');
      } else if (act === 'q-submit') {
        if (!progress(r).done) return;
        if (isCountry(r)) NEW[r].forEach((t) => { S.ans[t] = { code: S.sel[t], ok: S.sel[t] === T[t].country }; });
        S.submitted[r] = true;
        render(); scrollTo(0, 0);
      } else if (act === 'q-next') {
        if (S.r < LAST) { S.r++; render(); scrollTo(0, 0); focusField(el, nextOpen()); }
        else { S.summary = true; render(); scrollTo(0, 0); }
      } else if (act === 'q-done') resolve({ score: points(), max: MAX, lines: lines() });
    });

    render();
    if (!S.summary && !S.submitted[S.r]) focusField(el, nextOpen());
  });
}
