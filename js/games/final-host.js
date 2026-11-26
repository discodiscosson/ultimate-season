import { DATALIST, bindCountryField, fieldHTML, focusField, makeOptions, resultHTML } from '../lib/country-field.js';
import { countryName } from '../lib/countries.js';
import { esc, formatDate } from '../lib/util.js';

export const meta = { id: 'final-host', title: 'Finalorten', short: 'Finalort' };
export const available = (season) => !!season.final?.country;

const POINTS = 3;
// Länder som brukar arrangera stora finaler, används som svarsalternativ i easy
const HOSTS = ['ENG', 'ESP', 'ITA', 'GER', 'FRA', 'POR', 'NED', 'TUR', 'AUT', 'HUN', 'RUS', 'GRE', 'SCO', 'WAL', 'UKR', 'BEL', 'AZE', 'IRL', 'SWE'];

export function play({ el, season, difficulty }) {
  return new Promise((resolve) => {
    const F = season.final;
    const S = { ans: null, drafts: {}, err: {}, opts: makeOptions(F.country, HOSTS) };

    function render() {
      const answered = !!S.ans;
      const ok = answered && S.ans === F.country;
      const where = [F.venue, F.city].filter(Boolean).join(' i ');
      el.innerHTML = `${DATALIST}
        <div class="bar"><h2>Inför säsongen</h2><span class="score">${answered ? (ok ? POINTS : 0) : 0} p</span></div>
        <div class="tie q">
          <p class="qtext">I vilket land spelas finalen den här säsongen?</p>
          ${answered ? `<p>${resultHTML(S.ans, F.country)}</p>
            <div class="res"><b class="${ok ? 'ok' : 'no'}">${ok ? `Rätt, +${POINTS} p` : 'Fel'}.</b>
            Finalen spelades ${esc(where)}, ${esc(countryName(F.country))}${F.date ? `, ${esc(formatDate(F.date))}` : ''}.</div>`
          : fieldHTML({ key: 'final', difficulty, options: S.opts, draft: S.drafts.final, err: S.err.final, label: 'Finalens land' })}
        </div>
        <div class="foot"><span></span><button class="btn" data-act="fh-next" ${answered ? '' : 'disabled'}>Fortsätt</button></div>`;
      if (!answered) focusField(el, 'final');
    }

    bindCountryField(el, S, (key, code) => { if (!S.ans) { S.ans = code; render(); } }, render);
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-act="fh-next"]')) {
        const ok = S.ans === F.country;
        resolve({ score: ok ? POINTS : 0, max: POINTS, lines: [[ 'Finalens land', ok ? 'Rätt' : `Fel, ${countryName(F.country)}` ]] });
      }
    });
    render();
  });
}
