// Qualifying.
// Country rounds (the first two): type the country of every new team.
// Advance rounds (the rest): pick who went through.
// Third qualifying round: also mark every team that has played a European Cup / Champions League final.
// Last round (play-off): also name each team's biggest rival instead.
// A round can open with a story text and an animated draw (when the stage has an intro).
// Match results appear tie by tie as you complete them; whether your answers were right is revealed when the round is submitted.
import { answerHTML, bindCombos, comboHTML, focusField } from '../lib/combo.js';
import { countryName } from '../lib/countries.js';
import { esc, prefersReducedMotion, richText, shuffle, tieResult } from '../lib/util.js';
import { flagHTML } from '../lib/flags.js';

export const meta = { id: 'qualifying', title: 'Qualifying', short: 'Qualifying' };
export const available = (season) => season.stages.some((s) => s.type === 'qualifying');
export const steps = (season) => [...season.stages.filter((s) => s.type === 'qualifying').map((s) => s.name), 'Summary'];

const RIVAL_POINTS = 1;

// The qualifying set-up. The knockout phase reuses the same rounds engine with its own settings (see knockouts.js).
export const QUALIFYING = {
  type: 'qualifying',
  countryRounds: 2,
  pickPoints: () => 2,
  finalists: (r, last) => r !== last,
  rivals: (r, last) => r === last,
  autoDraw: false,
  doneTitle: 'Qualifying done',
};

export const play = (ctx) => playRounds(QUALIFYING, ctx);

export function playRounds(cfg, { el, season, start = 0, onStep }) {
  return new Promise((resolve) => {
    const ST = season.stages.filter((s) => s.type === cfg.type);
    const T = season.teams;
    const LAST = ST.length - 1;
    const nm = (t) => T[t].name;
    const COUNTRY_ROUNDS = cfg.countryRounds;
    const pickPts = (r) => cfg.pickPoints(r);
    const isCountry = (r) => r < COUNTRY_ROUNDS;
    const hasRival = (r) => !isCountry(r) && cfg.rivals(r, LAST);
    const hasFinalists = (r) => !isCountry(r) && cfg.finalists(r, LAST);
    // A slot is a fixed team or the winner of an earlier tie ("r16:0"); the real winner always goes through
    const STAGE = Object.fromEntries(season.stages.map((st) => [st.id, st]));
    const STAGE_IDX = Object.fromEntries(ST.map((st, i) => [st.id, i]));
    const realTeam = (s) => { if (s.team) return s.team; const [id, i] = s.from.split(':'); return STAGE[id].ties[+i].winner; };
    // Hidden mode (hard knockouts): your own picks go through to the next round, right or wrong
    const slotTeam = (s) => {
      if (s.team) return s.team;
      const [id, i] = s.from.split(':');
      return cfg.hidden && id in STAGE_IDX ? S.picks[STAGE_IDX[id]][+i] : STAGE[id].ties[+i].winner;
    };
    const realTeams = (r, i) => ST[r].ties[i].slots.map(realTeam);
    // Rounds shown as a results table (with story, draw and one tie in focus); the play-off still uses cards
    const isTable = () => true;
    const isFinalist = (t) => (T[t].finals || []).length > 0;
    const rivalsOf = (t) => T[t].rivals || [];

    const teamsIn = (r) => ST[r].ties.flatMap((tie) => tie.slots.map(slotTeam));
    // New teams per country round, in the order they appear
    const NEW = [];
    const seen = new Set();
    ST.forEach((st, r) => {
      NEW[r] = [];
      st.ties.flatMap((tie) => tie.slots.filter((x) => x.team).map((x) => x.team))
        .forEach((t) => { if (!seen.has(t)) { seen.add(t); NEW[r].push(t); } });
    });
    const rivalTeams = (r) => (hasRival(r) ? teamsIn(r).filter((t) => rivalsOf(t).length) : []);

    const roundMax = (r) => (isCountry(r)
      ? NEW[r].length
      : ST[r].ties.length * pickPts(r) + (hasFinalists(r) ? teamsIn(r).filter(isFinalist).length : 0) + rivalTeams(r).length * RIVAL_POINTS);
    const MAX = ST.reduce((s, _, r) => s + roundMax(r), 0);

    const S = { r: 0, drafts: {}, sel: {}, ans: {}, picks: ST.map(() => ({})), marks: ST.map(() => new Set()), submitted: [], summary: false, touched: {}, focus: 0, editing: {},
      phase: ST.map((st) => (st.intro ? 'intro' : 'play')), justDrew: false, justDone: null, picksIn: [], reveal: false };
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
      return { total: picks * pickPts(r) + marks + rivals * RIVAL_POINTS, picks, hit, wrong, marks, finalists: finalists.length, rivals };
    }
    // Results are shown per round, except in hidden mode where they are revealed round by round after the final
    const shown = (r) => (cfg.hidden ? S.reveal && r <= S.r : S.picksIn[r]);
    const points = () => ST.reduce((s, _, r) => s + (cfg.hidden ? (shown(r) ? score(r).total : 0)
      : S.submitted[r] ? score(r).total : S.picksIn[r] ? score(r).picks * pickPts(r) : 0), 0);

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
        S.picksIn[r] = true;
        S.phase[r] = 'play';
      }
      S.r = Math.min(start, LAST);
      S.summary = start > LAST;
      if (S.summary) S.reveal = true;
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

    // ---- Country rounds: one horizontal row per tie, like a results table, with one tie in focus ----
    const tieTeams = (r, i) => ST[r].ties[i].slots.map(slotTeam);
    const tieDone = (r, i) => tieTeams(r, i).every((t) => !NEW[r].includes(t) || (S.sel[t] && !S.editing[t]));
    const nextOpenTie = (r, from) => {
      const n = ST[r].ties.length;
      for (let k = 1; k <= n; k++) { const i = (from + k) % n; if (!tieDone(r, i)) return i; }
      return null;
    };
    const firstOpenTie = (r) => { for (let i = 0; i < ST[r].ties.length; i++) if (!tieDone(r, i)) return i; return 0; };

    // Penalties shown like "2–2 (10–11 p)", oriented team 1–team 2
    function aggText(tie) {
      const m = tie.note && tie.note.match(/(\d+)–(\d+) on penalties/);
      if (!m) return esc(tie.agg);
      const [hi, lo] = [m[1], m[2]];
      const p = tie.winner === slotTeam(tie.slots[0]) ? `${hi}–${lo}` : `${lo}–${hi}`;
      return `${esc(tie.agg)} <span class="pens">(${p} p)</span>`;
    }
    const legsOf = (tie) => (tie.legs ? tie.legs.split(', ') : []).concat(['', '']).slice(0, 2).map((l) => l.replace(' a.e.t.', ' <span class="aet">a.e.t.</span>'));

    function flagCell(r, i, t, focused) {
      const isNew = NEW[r].includes(t), sub = S.submitted[r];
      if (!isNew) return flagHTML(T[t].country);
      if (sub) {
        const given = S.ans[t]?.code, correct = T[t].country;
        if (given === correct) return `<span class="fl ok">${flagHTML(correct)}</span>`;
        return `<span class="fl no">${given ? flagHTML(given, 'given') : '<span class="flag flag-empty given"></span>'}${flagHTML(correct)}</span>`;
      }
      if (S.sel[t] && !S.editing[t]) {
        return focused
          ? `<button class="flagbtn" data-act="q-edit" data-t="${t}" aria-label="Change country of ${esc(nm(t))}">${flagHTML(S.sel[t])}</button>`
          : flagHTML(S.sel[t]);
      }
      return focused
        ? comboHTML({ key: t, draft: S.drafts[t], invalid: S.touched[t] && S.drafts[t] && !S.sel[t], label: `Country of ${nm(t)}` })
        : '<span class="flag flag-empty"></span>';
    }

    function countryTableHTML(r, draw = false) {
      const sub = S.submitted[r];
      const rows = ST[r].ties.map((tie, i) => {
        const [a, b] = tieTeams(r, i);
        if (draw) {
          return `<div class="mrow drawing">
            <div class="tc t1"><span class="tname drawslot" data-slot="${i}-0"></span></div>
            <div class="agg"><span class="vs">–</span></div>
            <div class="tc t2"><span class="tname drawslot" data-slot="${i}-1"></span></div>
            <div class="leg"></div><div class="leg"></div>
          </div>`;
        }
        const focused = !sub && S.focus === i;
        const played = sub || tieDone(r, i); // the result is shown as soon as both countries are picked
        const name = (t) => `<span class="tname ${played && t === tie.winner ? 'w' : ''}">${esc(nm(t))}</span>`;
        const [l1, l2] = played ? legsOf(tie) : ['', ''];
        const attrs = !sub && !focused ? ` data-act="q-focus" data-i="${i}" role="button" tabindex="0"` : '';
        const cls = [focused && 'focus', sub && 'done', !sub && played && 'filled played', S.justDone === i && 'reveal'].filter(Boolean).join(' ');
        return `<div class="mrow ${cls}"${attrs}>
          <div class="tc t1">${name(a)}${flagCell(r, i, a, focused)}</div>
          <div class="agg">${played ? aggText(tie) : '<span class="vs">–</span>'}${played ? `<span class="legs-m">${[l1, l2].filter(Boolean).join(', ')}</span>` : ''}</div>
          <div class="tc t2">${flagCell(r, i, b, focused)}${name(b)}</div>
          <div class="leg">${l1}</div><div class="leg">${l2}</div>
        </div>`;
      }).join('');
      return `<div class="mtable"><div class="mhead"><span class="t1">Team 1</span><span class="agg">Agg.</span><span class="t2">Team 2</span><span class="leg">1st leg</span><span class="leg">2nd leg</span></div>${rows}</div>`;
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
          ? 'Pick the country of both teams in a tie to see how the tie ended. Click any tie to jump to it, or a flag to change it. Whether your countries were right is revealed when you submit the round.'
          : 'Pick the country of every new team. Teams you have already seen show their flag.';
      }
      let h = `Pick which team went through in each tie (${pickPts(r)} pts).`;
      if (hasFinalists(r)) h += ' Mark every team that has ever played in a European Cup or Champions League final (+1 for each one found, −1 for each wrong mark).';
      if (hasRival(r)) h += ` Also name each team’s biggest rival (${RIVAL_POINTS} pt each).`;
      return h;
    }

    // ---- Third qualifying round: who went through, then who has played a final ----
    const firstUnpicked = (r) => { const i = ST[r].ties.findIndex((_, k) => !S.picks[r][k]); return i < 0 ? 0 : i; };
    const nextUnpicked = (r, from) => {
      const n = ST[r].ties.length;
      for (let k = 1; k <= n; k++) { const i = (from + k) % n; if (!S.picks[r][i]) return i; }
      return null;
    };

    function advTeam(r, i, t, tie, side) {
      const locked = S.picksIn[r], pickIn = shown(r), fin = S.submitted[r], pick = S.picks[r][i], marked = S.marks[r].has(t);
      const flag = flagHTML(T[t].country);
      const cls = ['tbtn'];
      let tick = '', badge = '';
      if (!pickIn) { if (pick === t) { cls.push('picked'); tick = '<span class="tick">✓</span>'; } }
      else {
        if (t === tie.winner) cls.push('w');
        if (pick === t) tick = `<span class="tick ${t === tie.winner ? 'ok' : 'no'}">${t === tie.winner ? '✓' : '✗'}</span>`;
        if (!fin && marked) { cls.push('marked'); tick += '<span class="trophy">🏆</span>'; }
        if (fin && hasFinalists(r)) { // final badges only belong to the "who has played in a final?" round
          const years = T[t].finals || [];
          if (years.length) badge = `<span class="badge ${marked ? 'ok' : 'miss'}" title="European Cup / Champions League final">🏆 ${years.length > 3 ? `${years.length} finals` : years.join(', ')}${marked ? ' ✓' : ''}</span>`;
          else if (marked) badge = '<span class="badge no">✗ No final</span>';
        }
      }
      const name = `<span class="tname">${esc(nm(t))}</span>`;
      // Name, flag and tick on the first line; the final badge on its own line underneath
      const main = side === 0 ? `${tick}${name}${flag}` : `${flag}${name}${tick}`;
      const inner = `<span class="tmain">${main}</span><span class="tsub">${badge}</span>`;
      let sub = badge;
      if (hasRival(r) && pickIn && rivalsOf(t).length) {
        const key = rk(t);
        if (fin) sub = `<span class="rv">${rivalAnswer(t)}</span>`;
        else if (S.focus === i) sub = comboHTML({ key, src: 'club', draft: S.drafts[key], invalid: S.touched[key] && S.drafts[key] && !S.sel[key], label: `Biggest rival of ${nm(t)}` });
        else sub = S.sel[key] ? `<span class="rv">vs ${esc(S.sel[key])}</span>` : '<span class="rv empty">Rival?</span>';
      }
      const inner2 = `<span class="tmain">${main}</span><span class="tsub">${sub}</span>`;
      const act = !locked ? `data-act="q-pickt" data-i="${i}" data-t="${t}" aria-pressed="${pick === t}"`
        : !pickIn ? ''
        : !fin && hasFinalists(r) ? `data-act="q-markt" data-t="${t}" aria-pressed="${marked}"` : '';
      return act ? `<button class="${cls.join(' ')} t${side + 1}" ${act}>${inner}</button>` : `<div class="${cls.join(' ')} t${side + 1}">${inner2}</div>`;
    }

    const rivalPhase = (r) => hasRival(r) && S.picksIn[r] && !S.submitted[r];
    const rivalTieDone = (r, i) => tieTeams(r, i).every((t) => !rivalsOf(t).length || S.sel[rk(t)]);
    const firstRivalOpen = (r) => { const i = ST[r].ties.findIndex((_, k) => !rivalTieDone(r, k)); return i < 0 ? 0 : i; };
    const nextRivalOpen = (r, from) => {
      const n = ST[r].ties.length;
      for (let k = 1; k <= n; k++) { const i = (from + k) % n; if (!rivalTieDone(r, i)) return i; }
      return null;
    };

    function advTableHTML(r) {
      const locked = S.picksIn[r], pickIn = shown(r);
      const rows = ST[r].ties.map((tie, i) => {
        const [a, b] = tieTeams(r, i);
        const rp = rivalPhase(r);
        const focused = (!locked || rp) && S.focus === i;
        // In hidden mode your bracket can differ from what really happened
        const real = realTeams(r, i), played = real.includes(a) && real.includes(b);
        const [l1, l2] = pickIn && played ? legsOf(tie) : ['', ''];
        const cls = [focused && 'focus', pickIn && 'done', ((!locked && S.picks[r][i]) || (locked && !pickIn) || (rp && rivalTieDone(r, i))) && 'filled'].filter(Boolean).join(' ');
        const attrs = rp && !focused ? ` data-act="q-focus" data-i="${i}" role="button" tabindex="0"` : '';
        const mid = !pickIn ? '<span class="vs">–</span>'
          : played ? `${aggText(tie)}<span class="legs-m">${[l1, l2].filter(Boolean).join(', ')}</span>`
            : `<span class="vs">–</span><span class="nreal">Never played. Real tie: ${esc(nm(real[0]))} v ${esc(nm(real[1]))}, ${esc(nm(tie.winner))} went through</span>`;
        return `<div class="mrow ${cls}${pickIn && !played ? ' unreal' : ''}"${attrs}>
          <div class="tc t1">${advTeam(r, i, a, tie, 0)}</div>
          <div class="agg">${mid}</div>
          <div class="tc t2">${advTeam(r, i, b, tie, 1)}</div>
          <div class="leg">${l1}</div><div class="leg">${l2}</div>
        </div>`;
      }).join('');
      return `<div class="mtable adv"><div class="mhead"><span class="t1">Team 1</span><span class="agg">Agg.</span><span class="t2">Team 2</span><span class="leg">1st leg</span><span class="leg">2nd leg</span></div>${rows}</div>`;
    }

    function advFoot(r) {
      const rn = rivalTeams(r).length, rf = rivalTeams(r).filter((t) => S.sel[rk(t)]).length;
      return `<span class="hint" style="margin:0">${rf} of ${rn} rivals</span><button class="btn" data-act="q-subrivals" ${rf === rn ? '' : 'disabled'}>Submit rivals</button>`;
    }

    function advRoundHTML(r) {
      const pickIn = S.picksIn[r], fin = S.submitted[r], s = score(r);
      const picked = Object.keys(S.picks[r]).length, n = ST[r].ties.length;
      let ask, hint, foot;
      if (!pickIn) {
        ask = n === 1 && cfg.type === 'knockout' ? 'Who won the final?' : 'Who went through?';
        hint = `Click the team that won each tie (${pickPts(r)} pts each). The results are revealed when you submit.`;
        foot = `<span class="hint" style="margin:0">${picked} of ${n} picks</span><button class="btn" data-act="q-subpicks" ${picked === n ? '' : 'disabled'}>Submit picks</button>`;
      } else if (cfg.hidden && !S.reveal) {
        ask = r < LAST ? 'Picks locked in' : `Your champion: ${nm(S.picks[r][0])}`;
        hint = r < LAST
          ? 'Your picks go through to the next round, right or wrong. The results are revealed after the final.'
          : 'Now let’s see how it really went, round by round.';
        foot = `<span></span><button class="btn" data-act="q-next">${r < LAST ? 'Next round' : 'Reveal the results'}</button>`;
      } else if (cfg.hidden && S.reveal) {
        const unreal = ST[r].ties.filter((_, i) => { const [a, b] = tieTeams(r, i), re = realTeams(r, i); return !(re.includes(a) && re.includes(b)); }).length;
        ask = r === LAST ? `${nm(ST[r].ties[0].winner)} are the champions!` : `${ST[r].name}: the results`;
        hint = `${s.picks} of ${n} pick${n === 1 ? '' : 's'} right. ${s.total} pts.${unreal ? ` ${unreal} of your ties never happened, because a team you picked earlier was already out.` : ''}`;
        foot = `<span></span><button class="btn" data-act="q-next">${r < LAST ? 'Next round' : 'See summary'}</button>`;
      } else if (!fin && hasRival(r)) {
        ask = 'Who are their biggest rivals?';
        hint = `You picked ${s.picks} of ${n} right. Now name each team’s biggest rival and pick it from the list (${RIVAL_POINTS} pt each).`;
        foot = advFoot(r);
      } else if (!fin) {
        ask = 'Who has played in a final?';
        hint = `You picked ${s.picks} of ${n} right. Now click every team that has ever played in a European Cup or Champions League final (+1 for each one found, −1 for each wrong mark).`;
        foot = `<span class="hint" style="margin:0">${S.marks[r].size} marked</span><button class="btn" data-act="q-subfinal">Submit finalists</button>`;
      } else {
        ask = '';
        hint = hasRival(r)
          ? `${s.picks} of ${n} picks right. Rivals: ${s.rivals} of ${rivalTeams(r).length}. ${s.total} pts this round.`
          : hasFinalists(r)
            ? `${s.picks} of ${n} picks right. Finalists: ${s.hit} of ${s.finalists} found${s.wrong ? `, ${s.wrong} wrongly marked` : ''}. ${s.total} pts this round.`
            : `${s.picks} of ${n} pick${n === 1 ? '' : 's'} right. ${s.total} pts this round.`;
        if (cfg.type === 'knockout' && r === LAST) ask = `${nm(ST[r].ties[0].winner)} are the champions!`;
        foot = `<span></span><button class="btn" data-act="q-next">${r < LAST ? 'Next round' : 'See summary'}</button>`;
      }
      return `<div class="bar"><h2>${esc(ST[r].name)}</h2><span class="score">${points()} pts</span></div>
        ${ask ? `<h3 class="ask ${S.justDrew || S.askAnim ? 'anim' : ''}">${ask}</h3>` : ''}
        <p class="hint">${hint}</p>${advTableHTML(r)}
        <div class="foot" id="q-foot">${foot}</div>`;
    }

    function introHTML(r) {
      return `<div class="bar"><h2>${esc(ST[r].name)}</h2><span class="score">${points()} pts</span></div>
        <div class="story">${richText(ST[r].intro)}</div>
        <div class="foot"><span></span><button class="btn" data-act="q-intro">Next</button></div>`;
    }

    function drawHTML(r) {
      return `<div class="bar"><h2>${esc(ST[r].name)}</h2><span class="score">${points()} pts</span></div>
        <h3 class="ask small">The draw</h3>
        ${r > 0 ? '<div class="tray" aria-live="polite"><div class="traylbl" id="tray-lbl"></div><div class="chips" id="tray"></div></div>' : ''}
        ${countryTableHTML(r, true)}
        <div class="foot"><span></span><button class="btn ghost" data-act="q-skip">Skip draw</button></div>`;
    }

    function roundHTML() {
      const r = S.r, st = ST[r], sub = S.submitted[r];
      if (isTable(r) && S.phase[r] === 'intro') return introHTML(r);
      if (isTable(r) && S.phase[r] === 'draw') return drawHTML(r);
      if (!isCountry(r)) return advRoundHTML(r);
      const ties = isCountry(r) ? null : st.ties.map((tie, i) => {
        const [a, b] = tie.slots.map((s) => s.team);
        const row = isCountry(r) ? (t) => countryRow(r, t, tie) : (t) => advanceRow(r, i, t, tie);
        let res = '';
        if (sub) {
          const verdict = isCountry(r) ? '' : `<b class="${S.picks[r][i] === tie.winner ? 'ok' : 'no'}">${S.picks[r][i] === tie.winner ? `Correct pick, +${pickPts(r)} pts` : 'Wrong pick'}.</b> `;
          res = `<div class="res">${verdict}${esc(tieResult(tie, T, a, b))}</div>`;
        }
        return `<div class="tie">${row(a)}${row(b)}${res}</div>`;
      }).join('');
      return `<div class="bar"><h2>${esc(st.name)}</h2><span class="score">${points()} pts</span></div>
        ${isCountry(r) && !sub ? `<h3 class="ask ${S.justDrew ? 'anim' : ''}">${r === 0 ? 'Where are these teams from?' : 'Where are the new teams from?'}</h3>` : ''}
        <p class="hint">${hintFor(r)}</p>${isCountry(r) ? countryTableHTML(r) : `<div class="ties">${ties}</div>`}
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
      const champ = cfg.type === 'knockout' ? ST[LAST].ties[0]?.winner : null;
      return `<div class="bar"><h2>${esc(cfg.doneTitle)}</h2><span class="score">${points()} / ${MAX} pts</span></div>
        <div class="rounds">${lines().map(([k, v]) => `<div class="rrow"><span>${esc(k)}</span><span>${esc(v)}</span></div>`).join('')}</div>
        ${champ ? `<p class="champ">${flagHTML(T[champ].country)} ${esc(nm(champ))} are the champions.</p>` : ''}
        ${champ && cfg.hidden && S.picks[LAST][0] ? `<p class="hint">Your champion: ${esc(nm(S.picks[LAST][0]))}${S.picks[LAST][0] === champ ? ' ✓' : ''}.</p>` : ''}
        ${misses ? `<h3 class="path">Countries you missed</h3>${misses}` : ''}
        <div class="foot"><span></span><button class="btn" data-act="q-done">Continue</button></div>`;
    }

    function render() {
      el.innerHTML = S.summary ? summaryHTML() : roundHTML();
      S.justDrew = false; S.justDone = null; S.askAnim = false;
      onStep?.(S.summary ? ST.length : S.r);
    }

    // The draw: teams appear one by one in random slots
    let drawTimer = null;
    function finishDraw() {
      clearInterval(drawTimer); drawTimer = null;
      if (S.phase[S.r] !== 'draw') return;
      S.phase[S.r] = 'play'; S.justDrew = true;
      S.focus = isCountry(S.r) ? firstOpenTie(S.r) : firstUnpicked(S.r);
      render(); focusTie();
    }
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    const drawing = (r) => el.isConnected && S.phase[r] === 'draw' && S.r === r;

    // Later rounds: winners from the previous round move into their ties, then the new teams are placed one by one
    function fly(chip, slot, name) {
      const fill = () => { slot.textContent = name; slot.classList.add('pop'); chip.classList.add('gone'); };
      if (!chip.animate || !slot.isConnected) { fill(); return; }
      const a = chip.getBoundingClientRect(), b = slot.getBoundingClientRect();
      const ghost = chip.cloneNode(true);
      ghost.classList.add('flyer');
      Object.assign(ghost.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px` });
      el.appendChild(ghost);
      chip.classList.add('gone');
      const dx = b.left - a.left + (slot.closest('.t1') ? b.width - a.width : 0), dy = b.top - a.top;
      ghost.animate([{ transform: 'translate(0, 0)' }, { transform: `translate(${dx}px, ${dy}px)` }],
        { duration: 520, easing: 'cubic-bezier(.3,.7,.2,1)' }).onfinish = () => { ghost.remove(); fill(); };
    }

    async function placeGroup(r, label, teams, withFlags, gap) {
      if (!drawing(r)) return;
      const tray = el.querySelector('#tray'), lbl = el.querySelector('#tray-lbl');
      lbl.textContent = label;
      tray.innerHTML = teams.map((t) => `<span class="chip" data-chip="${t}">${withFlags ? flagHTML(T[t].country) : ''}${esc(nm(t))}</span>`).join('');
      await sleep(900);
      for (const t of teams) {
        if (!drawing(r)) return;
        const i = ST[r].ties.findIndex((_, k) => tieTeams(r, k).includes(t));
        const side = tieTeams(r, i).indexOf(t);
        const slot = el.querySelector(`[data-slot="${i}-${side}"]`);
        const chip = tray.querySelector(`[data-chip="${t}"]`);
        if (slot && chip) fly(chip, slot, nm(t));
        await sleep(gap);
      }
      await sleep(700);
    }

    async function transitionDraw(r) {
      const carried = teamsIn(r).filter((t) => !NEW[r].includes(t));
      const prev = ST[r - 1]?.name || 'the previous round';
      if (carried.length) await placeGroup(r, `${cfg.hidden ? 'Your picks from the' : 'Winners of the'} ${prev.toLowerCase()}`, carried, true, 180);
      if (NEW[r].length) await placeGroup(r, cfg.newLabel || 'New teams entering in this round', NEW[r], !isCountry(r), 300);
      if (drawing(r)) finishDraw();
    }

    function startDraw() {
      const r = S.r;
      S.phase[r] = 'draw'; render(); scrollTo(0, 0);
      if (r > 0) { if (prefersReducedMotion()) finishDraw(); else transitionDraw(r); return; }
      const slots = shuffle(ST[r].ties.flatMap((tie, i) => [[i, 0], [i, 1]]));
      if (prefersReducedMotion()) { finishDraw(); return; }
      drawTimer = setInterval(() => {
        if (!el.isConnected || S.phase[r] !== 'draw') { clearInterval(drawTimer); return; }
        const next = slots.shift();
        if (!next) { clearInterval(drawTimer); setTimeout(() => { if (el.isConnected) finishDraw(); }, 700); return; }
        const [i, side] = next;
        const cell = el.querySelector(`[data-slot="${i}-${side}"]`);
        if (cell) { cell.textContent = nm(tieTeams(r, i)[side]); cell.classList.add('pop'); }
      }, 150);
    }
    const updateFooter = () => {
      const f = el.querySelector('#q-foot');
      if (!f || S.submitted[S.r]) return;
      if (rivalPhase(S.r)) f.innerHTML = advFoot(S.r);
      else if (isCountry(S.r)) f.innerHTML = footer(S.r);
    };
    const nextOpen = (after) => {
      const all = isCountry(S.r) ? NEW[S.r] : rivalTeams(S.r).map(rk);
      const i = after ? all.indexOf(after) + 1 : 0;
      return [...all.slice(i), ...all.slice(0, i)].find((k) => !S.sel[k]);
    };

    const focusTie = () => {
      const row = el.querySelector('.mrow.focus');
      const inputs = row ? [...row.querySelectorAll('input[data-cf], .tbtn')] : [];
      const input = inputs.find((x) => x.dataset.cf && !S.sel[x.dataset.cf]) || inputs[0];
      if (input) input.focus(); else if (row) el.querySelector('[data-act="q-submit"]')?.focus();
    };
    bindCombos(el, S, {
      onChange: (k) => { S.touched[k] = true; updateFooter(); },
      onDone: (k) => {
        if (!isCountry(S.r)) {
          if (rivalTieDone(S.r, S.focus)) { const n = nextRivalOpen(S.r, S.focus); if (n !== null) S.focus = n; }
          render(); focusTie(); return;
        }
        S.editing[k] = false;
        if (tieDone(S.r, S.focus)) { S.justDone = S.focus; const n = nextOpenTie(S.r, S.focus); if (n !== null) S.focus = n; }
        render(); focusTie();
      },
    });

    const setToggle = (btn, on, onText, offText) => { btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', on); btn.textContent = on ? onText : offText; };

    el.addEventListener('keydown', (e) => {
      const row = e.target.closest?.('.mrow[data-act="q-focus"]');
      if (row && e.target === row && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); row.click(); }
    });
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act^="q-"]');
      if (!b || b.disabled) return;
      const act = b.dataset.act, r = S.r;
      if (act === 'q-intro') { startDraw(); return; }
      if (act === 'q-skip') { finishDraw(); return; }
      if (act === 'q-focus') { S.focus = +b.dataset.i; render(); focusTie(); return; }
      if (act === 'q-pickt') {
        const i = +b.dataset.i;
        S.picks[r][i] = b.dataset.t;
        const n = nextUnpicked(r, i);
        if (n !== null) S.focus = n;
        render(); focusTie(); return;
      }
      if (act === 'q-markt') {
        const t = b.dataset.t;
        if (S.marks[r].has(t)) S.marks[r].delete(t); else S.marks[r].add(t);
        render(); el.querySelector(`[data-act="q-markt"][data-t="${t}"]`)?.focus(); return;
      }
      if (act === 'q-subpicks') {
        if (Object.keys(S.picks[r]).length !== ST[r].ties.length) return;
        S.picksIn[r] = true; S.askAnim = true;
        // Rounds with no second question are done as soon as the picks are in
        if (!hasRival(r) && !hasFinalists(r)) S.submitted[r] = true;
        if (hasRival(r)) S.focus = firstRivalOpen(r);
        render(); scrollTo(0, 0); if (hasRival(r)) focusTie(); return;
      }
      if (act === 'q-subfinal') { S.submitted[r] = true; render(); scrollTo(0, 0); return; }
      if (act === 'q-subrivals') {
        if (!rivalTeams(r).every((t) => S.sel[rk(t)])) return;
        S.submitted[r] = true; render(); scrollTo(0, 0); return;
      }
      if (act === 'q-edit') { S.editing[b.dataset.t] = true; render(); focusField(el, b.dataset.t); return; }
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
        if (cfg.hidden && S.reveal) {
          if (S.r < LAST) S.r++; else S.summary = true;
          render(); scrollTo(0, 0); return;
        }
        if (cfg.hidden && S.r === LAST) { S.reveal = true; S.r = 0; render(); scrollTo(0, 0); return; }
        if (S.r < LAST) {
          S.r++; S.focus = isCountry(S.r) ? firstOpenTie(S.r) : firstUnpicked(S.r);
          // Knockouts: the winners move into the next round with the draw animation, even without a story text
          if (cfg.autoDraw && S.phase[S.r] === 'play' && !S.submitted[S.r]) { startDraw(); return; }
          render(); scrollTo(0, 0);
          if (S.phase[S.r] === 'play') { if (isTable(S.r)) focusTie(); else focusField(el, nextOpen()); }
        }
        else { S.summary = true; render(); scrollTo(0, 0); }
      } else if (act === 'q-done') resolve({ score: points(), max: MAX, lines: lines() });
    });

    if (isCountry(S.r)) S.focus = firstOpenTie(S.r); else S.focus = firstUnpicked(S.r);
    render();
    if (!S.summary && !S.submitted[S.r] && S.phase[S.r] === 'play') { if (isTable(S.r)) focusTie(); else focusField(el, nextOpen()); }
  });
}
