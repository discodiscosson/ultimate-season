// The knockout bracket. easy: instant answers and the right team advances. medium: hidden answers but a number of checks
// that reveal the answer and send the right team through. hard: your picks advance, everything is marked at the end.
import { esc, tieResult } from '../lib/util.js';

export const meta = { id: 'bracket', title: 'Knockout phase', short: 'Knockouts' };
export const available = (season) => season.stages.some((s) => s.type === 'knockout');

const CHECKS = 5;

export function play({ el, season, difficulty }) {
  return new Promise((resolve) => {
    const KS = season.stages.filter((s) => s.type === 'knockout');
    const LAST = KS.length - 1;
    const IDX = Object.fromEntries(KS.map((s, k) => [s.id, k]));
    const T = season.teams, POS = season.leaguePosition || {};
    const PTS = KS.map((_, k) => k + 1);
    const nm = (t) => T[t].name;
    const parseFrom = (f) => { const [s, i] = f.split(':'); return [IDX[s], +i]; };

    const build = (k, src) => KS[k].ties.map((tie) => tie.slots.map((s) => (s.team ? s.team : src(...parseFrom(s.from)))));
    const REAL = KS.map((st) => st.ties.map((t) => t.winner));
    const key = (a, b) => [a, b].sort().join('|');
    const RES = {};
    KS.forEach((st, k) => build(k, (kk, i) => REAL[kk][i]).forEach(([a, b], i) => { RES[key(a, b)] = { tie: st.ties[i], a, b }; }));
    const MAX = KS.reduce((s, st, k) => s + st.ties.length * PTS[k], 0);

    const S = { r: 0, picks: KS.map(() => []), checked: KS.map(() => []), checks: CHECKS, summary: false };
    const src = () => (difficulty === 'easy' ? (k, i) => REAL[k][i] : (k, i) => (S.checked[k][i] ? REAL[k][i] : S.picks[k][i]));
    const adv = (k, i) => (S.picks[k][i] ? src()(k, i) : null);
    const points = () => S.picks.reduce((s, row, k) => s + row.filter((t, i) => t && t === REAL[k][i]).length * PTS[k], 0);
    const isRevealed = (r, i) => (difficulty === 'easy' && !!S.picks[r][i]) || !!S.checked[r][i];

    function teamBtn(r, i, t, pick, revealed, real) {
      let cls = 'team', mark = '';
      if (revealed) { if (t === real) { cls += ' win'; mark = '✓'; } else if (t === pick) { cls += ' wrong'; mark = '✗'; } else cls += ' dim'; }
      else if (pick === t) cls += ' picked';
      return `<button class="${cls}" data-act="b-pick" data-r="${r}" data-i="${i}" data-t="${t}" ${revealed ? 'disabled' : ''}>
        <span class="seed">${POS[t] ?? ''}</span><span class="name">${esc(nm(t))}</span><span class="cc">${T[t].country}</span><span class="mark">${mark}</span></button>`;
    }

    function tieHTML(r, i, a, b) {
      const pick = S.picks[r][i], real = REAL[r][i], rev = isRevealed(r, i);
      let res = '';
      if (rev) {
        const ok = pick === real, hit = RES[key(a, b)];
        const txt = hit && hit.tie === KS[r].ties[i] ? tieResult(hit.tie, T, hit.a, hit.b) : `This tie never happened. ${nm(real)} went through from here.`;
        res = `<div class="res"><b class="${ok ? 'ok' : 'no'}">${ok ? `Correct, +${PTS[r]} pts` : 'Wrong'}.</b> ${esc(txt)}</div>`;
      } else if (difficulty === 'medium') {
        res = `<button class="chk" data-act="b-check" data-r="${r}" data-i="${i}" ${pick && S.checks > 0 ? '' : 'disabled'}>Check answer</button>`;
      }
      return `<div class="tie">${teamBtn(r, i, a, pick, rev, real)}${teamBtn(r, i, b, pick, rev, real)}${res}</div>`;
    }

    const slotTeam = (t) => `<div class="st${t ? '' : ' unk'}">${t ? esc(nm(t)) : '?'}</div>`;

    function treeHTML(r, ties) {
      let h = `<div class="thead"><span>${esc(KS[r].name)}</span><span></span><span>${r < LAST ? esc(KS[r + 1].name) : 'Champion'}</span></div>`;
      if (r === LAST) {
        h += ties.map((t, i) => `<div class="grp"><div class="c1">${t}</div><div class="conn"></div><div class="slot">${slotTeam(adv(r, i))}</div></div>`).join('');
      } else {
        for (const nt of KS[r + 1].ties) {
          const froms = nt.slots.filter((s) => s.from && parseFrom(s.from)[0] === r).map((s) => parseFrom(s.from)[1]);
          const slot = `<div class="slot">${nt.slots.map((s) => slotTeam(s.team ? s.team : adv(r, parseFrom(s.from)[1]))).join('')}</div>`;
          if (froms.length === 2) {
            h += `<div class="grp pair"><div class="t1">${ties[froms[0]]}</div><div class="ct"></div>${slot}<div class="t2">${ties[froms[1]]}</div><div class="cb"></div></div>`;
          } else if (froms.length === 1) {
            h += `<div class="grp"><div class="c1">${ties[froms[0]]}</div><div class="conn"></div>${slot}</div>`;
          }
        }
      }
      return `<div class="tree">${h}</div>`;
    }

    function roundHTML() {
      const r = S.r, ms = build(r, src()), row = S.picks[r];
      const ties = ms.map(([a, b], i) => tieHTML(r, i, a, b));
      const all = ms.every((_, i) => row[i]);
      const left = ms.filter((_, i) => !row[i]).length;
      const intro = {
        easy: 'Pick which team went through. You see the answer right away, and the right team always advances.',
        medium: `Pick which team went through. You have ${CHECKS} checks for the whole knockout phase that reveal the answer and send the right team through.`,
        hard: 'Pick which team went through. Your picks advance, and everything is marked once the final is picked.',
      }[difficulty];
      const status = difficulty === 'easy' ? `${points()} pts` : difficulty === 'medium' ? `${S.checks} of ${CHECKS} checks left` : '';
      return `<div class="bar"><h2>${esc(KS[r].name)}</h2><span class="score">${status}</span></div>
        <p class="hint">${r === 0 ? intro + ' The number before each team is its league phase position.' : ''}</p>
        ${treeHTML(r, ties)}
        <div class="foot"><span class="hint" style="margin:0">${left ? `${left} left to pick` : ''}</span>
        <button class="btn" data-act="b-next" ${all ? '' : 'disabled'}>${r < LAST ? 'Next round' : 'See results'}</button></div>`;
    }

    function lines() {
      return KS.map((st, k) => {
        const c = S.picks[k].filter((t, i) => t === REAL[k][i]).length;
        return [st.name, `${c}/${st.ties.length} correct`];
      });
    }

    function summaryHTML() {
      let detail = '';
      KS.forEach((st, k) => {
        const ms = build(k, src());
        detail += `<h3 class="path">${esc(st.name)}</h3>` + ms.map(([a, b], i) => {
          const pick = S.picks[k][i], real = REAL[k][i], ok = pick === real;
          const both = !ok && a !== real && b !== real;
          return `<div class="item"><div class="m">${esc(nm(a))} – ${esc(nm(b))}${both ? '<span class="tag">Both teams wrong</span>' : ''}${S.checked[k][i] ? '<span class="tag info">Checked</span>' : ''}</div>
            <div class="p">Your pick: ${esc(nm(pick))}${ok ? '' : `. Went through: ${esc(nm(real))}`}</div>
            <div class="pt ${ok ? 'ok' : 'no'}">${ok ? '+' + PTS[k] : '0'} pts</div></div>`;
        }).join('');
      });
      return `<div class="bar"><h2>Knockout phase done</h2><span class="score">${points()} / ${MAX} pts</span></div>
        <p class="hint">Champion: ${esc(nm(REAL[LAST][0]))}. Your champion: ${esc(nm(S.picks[LAST][0]))}.</p>
        <div class="rounds">${lines().map(([a, b]) => `<div class="rrow"><span>${esc(a)}</span><span>${esc(b)}</span></div>`).join('')}</div>
        <div class="foot"><span></span><button class="btn" data-act="b-done">See season results</button></div>${detail}`;
    }

    function render() { el.innerHTML = S.summary ? summaryHTML() : roundHTML(); }

    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act^="b-"]');
      if (!b || b.disabled) return;
      const act = b.dataset.act, r = +b.dataset.r, i = +b.dataset.i;
      if (act === 'b-pick') {
        if (r !== S.r || isRevealed(r, i)) return;
        S.picks[r][i] = b.dataset.t; render();
      } else if (act === 'b-check') {
        if (r !== S.r || !S.picks[r][i] || S.checked[r][i] || S.checks < 1) return;
        S.checked[r][i] = true; S.checks--; render();
      } else if (act === 'b-next') {
        if (S.r < LAST) S.r++; else S.summary = true;
        render(); scrollTo(0, 0);
      } else if (act === 'b-done') resolve({ score: points(), max: MAX, lines: lines() });
    });

    render();
  });
}
