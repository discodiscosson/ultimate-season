// Country field with a filtering dropdown (combobox). Typing filters the list of all countries;
// arrow keys move, Enter or a click picks. The field only stores the choice; answers are marked by the game.
import { countryName, exactCountry, matchCountry, suggestCountries } from './countries.js';
import { esc } from './util.js';

const safeId = (key) => String(key).replace(/[^a-zA-Z0-9_-]/g, '_');

export function comboHTML({ key, draft, invalid, label }) {
  const id = `cf-${safeId(key)}`;
  return `<div class="combo">
    <input data-cf="${esc(key)}" value="${esc(draft || '')}" placeholder="Country" aria-label="${esc(label)}"
      class="${invalid ? 'bad' : ''}" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${id}-lb"
      autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="next">
    <ul class="lb" id="${id}-lb" role="listbox" hidden></ul>
    ${invalid ? '<div class="err">Pick a country from the list</div>' : ''}
  </div>`;
}

export function resultHTML(given, correct) {
  if (!given) return `<span class="cty no"><s>No answer</s>${esc(countryName(correct))}</span>`;
  return given === correct
    ? `<span class="cty ok">${esc(countryName(correct))} ✓</span>`
    : `<span class="cty no"><s>${esc(countryName(given))}</s>${esc(countryName(correct))}</span>`;
}

export const focusField = (root, key) => root.querySelector(`input[data-cf="${CSS.escape(key)}"]`)?.focus();

// state needs { drafts: {}, sel: {} }. onChange(key) runs after every change; onDone(key) after a pick or Enter on a valid value.
export function bindCombos(root, state, { onChange, onDone }) {
  const listOf = (input) => input.parentElement.querySelector('.lb');
  const setErr = (input, bad) => {
    input.classList.toggle('bad', bad);
    let err = input.parentElement.querySelector('.err');
    if (bad && !err) input.parentElement.insertAdjacentHTML('beforeend', '<div class="err">Pick a country from the list</div>');
    if (!bad && err) err.remove();
  };

  function open(input) {
    const lb = listOf(input);
    const codes = suggestCountries(input.value);
    if (!codes.length) { close(input); return; }
    const selected = state.sel[input.dataset.cf];
    lb.innerHTML = codes.map((c, i) =>
      `<li role="option" id="${lb.id}-${c}" data-code="${c}" class="${i === 0 && input.value ? 'active' : ''}" aria-selected="${c === selected}">${esc(countryName(c))}</li>`).join('');
    lb.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    const act = lb.querySelector('.active');
    input.setAttribute('aria-activedescendant', act ? act.id : '');
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
    input.value = countryName(code);
    state.drafts[key] = input.value;
    state.sel[key] = code;
    setErr(input, false);
    close(input);
    onChange?.(key);
    onDone?.(key);
  }

  root.addEventListener('input', (e) => {
    const input = e.target;
    const key = input.dataset?.cf;
    if (!key) return;
    state.drafts[key] = input.value;
    state.sel[key] = exactCountry(input.value);
    if (state.sel[key]) setErr(input, false);
    open(input);
    onChange?.(key);
  });
  root.addEventListener('focusin', (e) => { if (e.target.dataset?.cf) open(e.target); });
  root.addEventListener('focusout', (e) => {
    const input = e.target;
    const key = input.dataset?.cf;
    if (!key) return;
    close(input);
    if (state.sel[key] && input.value !== countryName(state.sel[key])) {
      input.value = countryName(state.sel[key]); state.drafts[key] = input.value;
    }
    if (input.value.trim() && !state.sel[key]) {
      const code = matchCountry(input.value);
      if (code) { input.value = countryName(code); state.drafts[key] = input.value; state.sel[key] = code; setErr(input, false); }
      else setErr(input, true);
      onChange?.(key);
    }
  });
  root.addEventListener('keydown', (e) => {
    const input = e.target;
    const key = input.dataset?.cf;
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
