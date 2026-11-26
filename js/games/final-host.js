import { DATALIST, bindCountryField, fieldHTML, focusField, makeOptions, resultHTML } from '../lib/country-field.js';
import { countryName } from '../lib/countries.js';
import { esc, formatDate } from '../lib/util.js';

export const meta = { id: 'final-host', title: 'The final', short: 'Final venue' };
export const available = (season) => !!season.final?.country;

const POINTS = 3;
// Countries that often host big finals, used as options in easy mode
const HOSTS = ['ENG', 'ESP', 'ITA', 'GER', 'FRA', 'POR', 'NED', 'TUR', 'AUT', 'HUN', 'RUS', 'GRE', 'SCO', 'WAL', 'UKR', 'BEL', 'AZE', 'IRL', 'SWE'];

export function play({ el, season, difficulty }) {
  return new Promise((resolve) => {
    const F = season.final;
    const S = { ans: null, drafts: {}, err: {}, opts: makeOptions(F.country, HOSTS) };

    function render() {
      const answered = !!S.ans;
      const ok = answered && S.ans === F.country;
      const where = [F.venue, F.city].filter(Boolean).join(', ');
      el.innerHTML = `${DATALIST}
        <div class="bar"><h2>Before the season</h2><span class="score">${answered ? (ok ? POINTS : 0) : 0} pts</span></div>
        <div class="tie q">
          <p class="qtext">Which country hosts this season’s final?</p>
          ${answered ? `<p>${resultHTML(S.ans, F.country)}</p>
            <div class="res"><b class="${ok ? 'ok' : 'no'}">${ok ? `Correct, +${POINTS} pts` : 'Wrong'}.</b>
            The final was played at ${esc(where)}, ${esc(countryName(F.country))}${F.date ? `, ${esc(formatDate(F.date))}` : ''}.</div>`
          : fieldHTML({ key: 'final', difficulty, options: S.opts, draft: S.drafts.final, err: S.err.final, label: 'Country of the final' })}
        </div>
        <div class="foot"><span></span><button class="btn" data-act="fh-next" ${answered ? '' : 'disabled'}>Continue</button></div>`;
      if (!answered) focusField(el, 'final');
    }

    bindCountryField(el, S, (key, code) => { if (!S.ans) { S.ans = code; render(); } }, render);
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-act="fh-next"]')) {
        const ok = S.ans === F.country;
        resolve({ score: ok ? POINTS : 0, max: POINTS, lines: [[ 'Host country', ok ? 'Correct' : `Wrong, ${countryName(F.country)}` ]] });
      }
    });
    render();
  });
}
