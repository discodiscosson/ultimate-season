// Slutspelsträdet. easy: direkt facit och rätt lag går vidare. medium: dolt facit men ett antal kontroller
// som visar svaret och skickar rätt lag vidare. hard: dina val går vidare, allt rättas i slutet.
import { esc, tieResult } from '../lib/util.js';

export const meta = { id: 'bracket', title: 'Slutspelet', short: 'Slutspel' };
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
        const txt = hit && hit.tie === KS[r].ties[i] ? tieResult(hit.tie, T, hit.a, hit.b) : `Mötet spelades aldrig. ${nm(real)} gick vidare härifrån.`;
        res = `<div class="res"><b class="${ok ? 'ok' : 'no'}">${ok ? `Rätt, +${PTS[r]} p` : 'Fel'}.</b> ${esc(txt)}</div>`;
      } else if (difficulty === 'medium') {
        res = `<button class="chk" data-act="b-check" data-r="${r}" data-i="${i}" ${pick && S.checks > 0 ? '' : 'disabled'}>Kolla svaret</button>`;
      }
      return `<div class="tie">${teamBtn(r, i, a, pick, rev, real)}${teamBtn(r, i, b, pick, rev, real)}${res}</div>`;
    }

    const slotTeam = (t) => `<div class="st${t ? '' : ' unk'}">${t ? esc(nm(t)) : '?'}</div>`;

    function treeHTML(r, ties) {
      let h = `<div class="thead"><span>${esc(KS[r].name)}</span><span></span><span>${r < LAST ? esc(KS[r + 1].name) : 'Mästare'}</span></div>`;
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
        easy: 'Välj vilket lag som gick vidare. Du ser svaret direkt, och rätt lag går alltid vidare.',
        medium: `Välj vilket lag som gick vidare. Du har ${CHECKS} kontroller för hela slutspelet som visar svaret och skickar rätt lag vidare.`,
        hard: 'Välj vilket lag som gick vidare. Dina val går vidare, och allt rättas när finalen är tippad.',
      }[difficulty];
      const status = difficulty === 'easy' ? `${points()} p` : difficulty === 'medium' ? `${S.checks} av ${CHECKS} kontroller kvar` : '';
      return `<div class="bar"><h2>${esc(KS[r].name)}</h2><span class="score">${status}</span></div>
        <p class="hint">${r === 0 ? intro + ' Siffran framför laget är placeringen i ligafasen.' : ''}</p>
        ${treeHTML(r, ties)}
        <div class="foot"><span class="hint" style="margin:0">${left ? `${left} kvar att tippa` : ''}</span>
        <button class="btn" data-act="b-next" ${all ? '' : 'disabled'}>${r < LAST ? 'Nästa runda' : 'Se resultat'}</button></div>`;
    }

    function lines() {
      return KS.map((st, k) => {
        const c = S.picks[k].filter((t, i) => t === REAL[k][i]).length;
        return [st.name, `${c}/${st.ties.length} rätt`];
      });
    }

    function summaryHTML() {
      let detail = '';
      KS.forEach((st, k) => {
        const ms = build(k, src());
        detail += `<h3 class="path">${esc(st.name)}</h3>` + ms.map(([a, b], i) => {
          const pick = S.picks[k][i], real = REAL[k][i], ok = pick === real;
          const both = !ok && a !== real && b !== real;
          return `<div class="item"><div class="m">${esc(nm(a))} – ${esc(nm(b))}${both ? '<span class="tag">Båda lagen fel</span>' : ''}${S.checked[k][i] ? '<span class="tag info">Kontrollerad</span>' : ''}</div>
            <div class="p">Ditt val: ${esc(nm(pick))}${ok ? '' : `. Gick vidare: ${esc(nm(real))}`}</div>
            <div class="pt ${ok ? 'ok' : 'no'}">${ok ? '+' + PTS[k] : '0'} p</div></div>`;
        }).join('');
      });
      return `<div class="bar"><h2>Slutspelet klart</h2><span class="score">${points()} / ${MAX} p</span></div>
        <p class="hint">Mästare: ${esc(nm(REAL[LAST][0]))}. Din mästare: ${esc(nm(S.picks[LAST][0]))}.</p>
        <div class="rounds">${lines().map(([a, b]) => `<div class="rrow"><span>${esc(a)}</span><span>${esc(b)}</span></div>`).join('')}</div>
        <div class="foot"><span></span><button class="btn" data-act="b-done">Se säsongens resultat</button></div>${detail}`;
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
