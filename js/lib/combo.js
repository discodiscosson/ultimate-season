// Searchable dropdown (combobox) for countries and clubs. The list opens when you type, click the field
// or press the down arrow (not just on focus); arrow keys move, Enter or a click picks. The field only stores the choice; answers are marked by the game.
import { countryName, exactCountry, matchCountry, suggestCountries } from './countries.js';
import { clubCountry, exactClub, matchClub, suggestClubs } from './clubs.js';
import { esc } from './util.js';
import { flagHTML } from './flags.js';

const SOURCES = {
  country: { suggest: suggestCountries, exact: exactCountry, match: matchCountry, name: countryName, sub: () => '', icon: (c) => flagHTML(c), placeholder: 'Country' },
  club: { suggest: suggestClubs, exact: exactClub, match: matchClub, name: (c) => c, sub: (c) => countryName(clubCountry(c)), icon: (c) => flagHTML(clubCountry(c)), placeholder: 'Club' },
};
const MSG = { country: 'Pick a country from the list', club: 'Pick a club from the list' };
const safeId = (key) => String(key).replace(/[^a-zA-Z0-9_-]/g, '_');

export function comboHTML({ key, src = 'country', draft, invalid, label }) {
  const id = `cb-${safeId(key)}`;
  return `<div class="combo">
    <input data-cf="${esc(key)}" data-src="${src}" value="${esc(draft || '')}" placeholder="${SOURCES[src].placeholder}" aria-label="${esc(label)}"
      class="${invalid ? 'bad' : ''}" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${id}-lb"
      autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="next">
    <ul class="lb" id="${id}-lb" role="listbox" hidden></ul>
    ${invalid ? `<div class="err">${MSG[src]}</div>` : ''}
  </div>`;
}

// Marked answer: the right answer in green, or the given answer struck through followed by the right one.
export function answerHTML(given, correct, name = countryName) {
  if (given && given === correct) return `<span class="cty ok">${esc(name(correct))} ✓</span>`;
  return `<span class="cty no"><s>${given ? esc(name(given)) : 'No answer'}</s>${esc(name(correct))}</span>`;
}
export const resultHTML = (given, correct) => answerHTML(given, correct, countryName);

export const focusField = (root, key) => key && root.querySelector(`input[data-cf="${CSS.escape(key)}"]`)?.focus();

// state needs { drafts: {}, sel: {} }. onChange(key) runs after every change; onDone(key) after a pick or Enter on a valid value.
export function bindCombos(root, state, { onChange, onDone } = {}) {
  const srcOf = (input) => SOURCES[input.dataset.src || 'country'];
  const listOf = (input) => input.parentElement.querySelector('.lb');
  const setErr = (input, bad) => {
    input.classList.toggle('bad', bad);
    const err = input.parentElement.querySelector('.err');
    if (bad && !err) input.parentElement.insertAdjacentHTML('beforeend', `<div class="err">${MSG[input.dataset.src || 'country']}</div>`);
    if (!bad && err) err.remove();
  };

  function open(input) {
    const lb = listOf(input), src = srcOf(input);
    const items = src.suggest(input.value).slice(0, 300);
    if (!items.length) { close(input); return; }
    const selected = state.sel[input.dataset.cf];
    lb.innerHTML = items.map((c, i) => {
      const sub = src.sub(c);
      return `<li role="option" id="${lb.id}-${i}" data-code="${esc(c)}" class="${i === 0 && input.value ? 'active' : ''}" aria-selected="${c === selected}">${src.icon ? src.icon(c) : ''}<span class="nm">${esc(src.name(c))}</span>${sub ? `<span class="sub">${esc(sub)}</span>` : ''}</li>`;
    }).join('');
    lb.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    const act = lb.querySelector('.active');
    if (act) input.setAttribute('aria-activedescendant', act.id); else input.removeAttribute('aria-activedescendant');
  }
  function close(input) {
    const lb = listOf(input);
    lb.hidden = true; lb.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }
  function move(input, dir) {
    const lb = listOf(input);
    if (lb.hidden) { open(input); return; }
    const items = [...lb.children];
    if (!items.length) return;
    let i = items.findIndex((li) => li.classList.contains('active'));
    items[i]?.classList.remove('active');
    i = i < 0 ? (dir > 0 ? 0 : items.length - 1) : (i + dir + items.length) % items.length;
    items[i].classList.add('active');
    items[i].scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', items[i].id);
  }
  function choose(input, code) {
    const key = input.dataset.cf;
    input.value = srcOf(input).name(code);
    state.drafts[key] = input.value;
    state.sel[key] = code;
    setErr(input, false);
    close(input);
    onChange?.(key);
    onDone?.(key);
  }

  root.addEventListener('input', (e) => {
    const input = e.target, key = input.dataset?.cf;
    if (!key) return;
    state.drafts[key] = input.value;
    state.sel[key] = srcOf(input).exact(input.value);
    if (state.sel[key]) setErr(input, false);
    open(input);
    onChange?.(key);
  });
  root.addEventListener('click', (e) => { if (e.target.dataset?.cf && listOf(e.target).hidden) open(e.target); });
  root.addEventListener('focusout', (e) => {
    const input = e.target, key = input.dataset?.cf;
    if (!key) return;
    close(input);
    const src = srcOf(input);
    if (state.sel[key] && input.value !== src.name(state.sel[key])) { input.value = src.name(state.sel[key]); state.drafts[key] = input.value; }
    if (input.value.trim() && !state.sel[key]) {
      const code = src.match(input.value);
      if (code) { input.value = src.name(code); state.drafts[key] = input.value; state.sel[key] = code; setErr(input, false); }
      else setErr(input, true);
      onChange?.(key);
    }
  });
  root.addEventListener('keydown', (e) => {
    const input = e.target, key = input.dataset?.cf;
    if (!key) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); move(input, 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(input, -1); }
    else if (e.key === 'Escape') close(input);
    else if (e.key === 'Enter') {
      e.preventDefault();
      const act = listOf(input).querySelector('.active');
      if (act) choose(input, act.dataset.code);
      else if (state.sel[key]) { close(input); onDone?.(key); }
    }
  });
  // mousedown keeps focus in the input so the list does not close before the click lands
  root.addEventListener('mousedown', (e) => {
    const li = e.target.closest('.lb li');
    if (!li) return;
    e.preventDefault();
    choose(li.closest('.combo').querySelector('input'), li.dataset.code);
  });
}
