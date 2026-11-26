// Which country hosts the final? Pick from the list, submit, then see the answer.
import { bindCombos, comboHTML, focusField, resultHTML } from '../lib/country-field.js';
import { countryName } from '../lib/countries.js';
import { esc, formatDate } from '../lib/util.js';

export const meta = { id: 'final-host', title: 'The final', short: 'Final venue' };
export const available = (season) => !!season.final?.country;

const POINTS = 3;

export function play({ el, season }) {
  return new Promise((resolve) => {
    const F = season.final;
    const S = { drafts: {}, sel: {}, ans: undefined };
    const ok = () => S.ans === F.country;

    function render() {
      const done = S.ans !== undefined;
      const where = [F.venue, F.city].filter(Boolean).join(', ');
      el.innerHTML = `
        <div class="bar"><h2>The final</h2><span class="score">${done && ok() ? POINTS : 0} pts</span></div>
        <div class="tie q">
          <p class="qtext">Which country hosts this season’s final?</p>
          ${done ? `<p>${resultHTML(S.ans, F.country)}</p>
            <div class="res"><b class="${ok() ? 'ok' : 'no'}">${ok() ? `Correct, +${POINTS} pts` : 'Wrong'}.</b>
            The final was played at ${esc(where)}, ${esc(countryName(F.country))}${F.date ? `, ${esc(formatDate(F.date))}` : ''}.</div>`
          : comboHTML({ key: 'final', draft: S.drafts.final, label: 'Country of the final' })}
        </div>
        <div class="foot" id="fh-foot">${footer()}</div>`;
    }
    const footer = () => (S.ans !== undefined
      ? '<span></span><button class="btn" data-act="fh-next">Continue</button>'
      : `<span></span><button class="btn" data-act="fh-submit" ${S.sel.final ? '' : 'disabled'}>Submit answer</button>`);
    const updateFooter = () => { el.querySelector('#fh-foot').innerHTML = footer(); };

    bindCombos(el, S, { onChange: updateFooter, onDone: () => el.querySelector('[data-act="fh-submit"]')?.focus() });
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act^="fh-"]');
      if (!b || b.disabled) return;
      if (b.dataset.act === 'fh-submit') { S.ans = S.sel.final; render(); }
      else resolve({ score: ok() ? POINTS : 0, max: POINTS, lines: [['Host country', ok() ? 'Correct' : `Wrong, ${countryName(F.country)}`]] });
    });
    render();
    focusField(el, 'final');
  });
}
