// Svarsfält för "vilket land?" som används av flera spel.
// easy: fyra svarsalternativ, medium: fritext med förslagslista, hard: fritext utan förslag.
import { COUNTRIES, countryName, matchCountry } from './countries.js';
import { esc, shuffle } from './util.js';

export const DATALIST = `<datalist id="us-countries">${Object.values(COUNTRIES)
  .map((v) => `<option value="${esc(v[0])}"></option>`).join('')}</datalist>`;

export function makeOptions(correct, pool, n = 4) {
  let others = shuffle([...new Set(pool)].filter((c) => c !== correct)).slice(0, n - 1);
  if (others.length < n - 1) {
    const extra = shuffle(Object.keys(COUNTRIES).filter((c) => c !== correct && !others.includes(c)));
    others = others.concat(extra.slice(0, n - 1 - others.length));
  }
  return shuffle([correct, ...others]);
}

export function fieldHTML({ key, difficulty, options, draft, err, label }) {
  if (difficulty === 'easy') {
    return `<div class="choices">${options.map((c) =>
      `<button class="choice" data-act="cf-choice" data-key="${esc(key)}" data-code="${c}">${esc(countryName(c))}</button>`).join('')}</div>`;
  }
  return `<div><div class="inp"><input data-cf="${esc(key)}" value="${esc(draft || '')}" placeholder="Land" aria-label="${esc(label)}"
    ${difficulty === 'medium' ? 'list="us-countries"' : ''} autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done">
    <button class="ok" data-act="cf-submit" data-key="${esc(key)}">OK</button></div>${err ? `<div class="err">${esc(err)}</div>` : ''}</div>`;
}

export function resultHTML(given, correct) {
  return given === correct
    ? `<span class="cty ok">${esc(countryName(correct))} ✓</span>`
    : `<span class="cty no"><s>${esc(countryName(given))}</s>${esc(countryName(correct))}</span>`;
}

export const focusField = (root, key) => root.querySelector(`[data-cf="${CSS.escape(key)}"]`)?.focus();

// Kopplar inmatning, Enter, OK-knapp och svarsalternativ. onAnswer(key, code) anropas med en giltig landskod.
export function bindCountryField(root, state, onAnswer, rerender) {
  const submit = (key) => {
    const v = (state.drafts[key] || '').trim();
    if (!v) return;
    const code = matchCountry(v);
    if (!code) { state.err[key] = 'Hittar inget land med det namnet. Prova igen.'; rerender(); focusField(root, key); return; }
    delete state.err[key];
    onAnswer(key, code);
  };
  root.addEventListener('input', (e) => { const k = e.target.dataset?.cf; if (k) state.drafts[k] = e.target.value; });
  root.addEventListener('keydown', (e) => {
    const k = e.target.dataset?.cf;
    if (k && e.key === 'Enter') { e.preventDefault(); submit(k); }
  });
  root.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act^="cf-"]');
    if (!el) return;
    if (el.dataset.act === 'cf-submit') submit(el.dataset.key);
    else onAnswer(el.dataset.key, el.dataset.code);
  });
}
