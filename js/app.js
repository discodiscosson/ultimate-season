import { loadIndex, loadSeason } from './data.js';
import { momentsFor, runSeason, stepsFor } from './engine.js';
import { saveRun } from './lib/supabase.js';
import { esc } from './lib/util.js';

const DIFF = {
  easy: { name: 'Easy', desc: 'Multiple choice and instant answers.' },
  medium: { name: 'Medium', desc: 'Type with suggestions. Five checks in the knockout phase.' },
  hard: { name: 'Hard', desc: 'Free text, no suggestions. Knockouts are marked at the end.' },
};

// Only hard mode for now. Set to true to show the difficulty picker again.
const SHOW_DIFFICULTY = false;
// Review mode: Back and Jump to controls during play, for testing the flow. Set to false before launch.
const REVIEW_MODE = true;

const app = document.getElementById('app');
let INDEX = null;
let runId = 0;
let current = null; // { season, steps, pos } while playing
const sel = { comp: null, season: null, diff: 'hard' };
const comp = () => INDEX.competitions.find((c) => c.id === sel.comp);

function band(sub, ladder) {
  return `<header class="band">
    <div class="band-top"><a class="home" href="https://www.disco.games">disco.games</a>${ladder ? '<button class="quit" data-act="app-quit">Quit</button>' : ''}</div>
    <h1 class="title">Ultimate Season</h1><p class="sub">${sub}</p>
    ${ladder ? `<div class="ladder">${ladder.map((s) => `<span class="${s.state}">${esc(s.label)}</span>`).join('')}</div>` : ''}
    ${ladder && REVIEW_MODE && current ? reviewNav() : ''}
  </header>`;
}

function reviewNav() {
  const { steps } = current;
  let game = '';
  const opts = steps.map((s, i) => {
    let o = '';
    if (s.game !== game) { o += `${game ? '</optgroup>' : ''}<optgroup label="${esc(s.game)}">`; game = s.game; }
    return o + `<option value="${i}">${esc(s.label)}</option>`;
  }).join('') + '</optgroup>';
  return `<div class="review"><button class="rv-back" data-act="app-back" aria-label="Back one step">◀ Back</button>
    <select id="jump" aria-label="Jump to step">${opts}</select></div>`;
}

function syncReview() {
  if (!current) return;
  const back = app.querySelector('.rv-back');
  const jump = app.querySelector('#jump');
  if (back) back.disabled = current.pos <= 0;
  if (jump) jump.value = String(current.pos);
}

function renderStart() {
  const c = comp();
  app.innerHTML = band('Sports trivia built around a single season.') + `
    <section class="panel">
      <h3 class="lbl">Sport</h3>
      <div class="chips"><button class="chip on" aria-pressed="true">Football</button><button class="chip" disabled>More sports soon</button></div>
      <h3 class="lbl">Competition</h3>
      <div class="chips">${INDEX.competitions.map((x) => `<button class="chip ${x.id === sel.comp ? 'on' : ''}" data-act="app-comp" data-id="${x.id}">${esc(x.name)}</button>`).join('')}</div>
      <h3 class="lbl">Season</h3>
      <div class="seasonrow">
        <select id="season" aria-label="Season">${c.seasons.map((s) => `<option value="${s.id}" ${s.id === sel.season ? 'selected' : ''}>${esc(s.label)}</option>`).join('')}</select>
        <button class="btn ghost" data-act="app-random">Random</button>
      </div>
      ${SHOW_DIFFICULTY ? `<h3 class="lbl">Difficulty</h3>
      <div class="modes">${Object.entries(DIFF).map(([k, d]) => `<button class="mode ${sel.diff === k ? 'on' : ''}" data-act="app-diff" data-d="${k}" aria-pressed="${sel.diff === k}"><h4>${d.name}</h4><p>${d.desc}</p></button>`).join('')}</div>` : ''}
    </section>
    <div class="foot"><span></span><button class="btn" data-act="app-start">Start the season</button></div>`;
}

async function play(fromPos = 0) {
  const myRun = ++runId;
  app.innerHTML = band('Loading the season…');
  let season;
  try { season = await loadSeason(sel.season); }
  catch (e) { app.innerHTML = band(esc(e.message)) + '<div class="foot"><button class="btn" data-act="app-home">Back</button></div>'; return; }
  if (myRun !== runId) return;

  const title = SHOW_DIFFICULTY ? `${season.competition.name} ${season.label}, ${DIFF[sel.diff].name}` : `${season.competition.name} ${season.label}`;
  const moments = momentsFor(season);
  const steps = stepsFor(season);
  current = { season, steps, pos: fromPos };
  const from = steps[fromPos];
  app.innerHTML = band(esc(title), moments.map((m) => ({ label: m.meta.short, state: '' }))) + '<div id="stage"></div>';
  const results = await runSeason({
    host: app.querySelector('#stage'), season, difficulty: sel.diff, from: { mi: from.mi, li: from.li },
    isCurrent: () => myRun === runId,
    onStep: (mi, li) => {
      if (myRun !== runId) return;
      current.pos = steps.findIndex((s) => s.mi === mi && s.li === li);
      app.querySelectorAll('.ladder span').forEach((s, k) => { s.className = k < mi ? 'past' : k === mi ? 'now' : ''; });
      syncReview();
    },
  });
  if (!results || myRun !== runId) return;
  current = null;
  summary(season, title, results, fromPos > 0);
}

async function summary(season, title, results, partial = false) {
  const score = results.reduce((s, r) => s + r.score, 0), max = results.reduce((s, r) => s + r.max, 0);
  app.innerHTML = band(esc(title)) + `
    <p class="total">${score} / ${max} pts</p>
    <p class="hint" id="saved">${partial ? 'Review run: started part-way through, so earlier games are not included and the result is not saved.' : ''}</p>
    ${results.map((r) => `<h3 class="path">${esc(r.title)} <span class="muted">${r.score} / ${r.max} pts</span></h3>
      <div class="rounds">${(r.lines || []).map(([a, b]) => `<div class="rrow"><span>${esc(a)}</span><span>${esc(b)}</span></div>`).join('')}</div>`).join('')}
    <div class="foot" style="justify-content:flex-start">
      <button class="btn" data-act="app-again">Play again</button>
      <button class="btn ghost" data-act="app-home">Change season or difficulty</button>
    </div>`;
  if (partial) return;
  const res = await saveRun({
    season_id: season.id, difficulty: sel.diff, score, max_score: max,
    details: results.map(({ id, score: s, max: m, lines }) => ({ id, score: s, max: m, lines })),
  }).catch((e) => ({ status: 'error', message: e.message }));
  const msg = { saved: 'Your result has been saved.', guest: 'Sign in to save your result.', error: `Could not save: ${res.message || ''}` }[res.status];
  const el = app.querySelector('#saved');
  if (el && msg) el.textContent = msg;
}

app.addEventListener('change', (e) => {
  if (e.target.id === 'season') sel.season = e.target.value;
  if (e.target.id === 'jump') { play(+e.target.value); scrollTo(0, 0); }
});
app.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act^="app-"]');
  if (!b) return;
  const act = b.dataset.act;
  if (act === 'app-comp') { sel.comp = b.dataset.id; sel.season = comp().seasons[0].id; renderStart(); }
  else if (act === 'app-diff') { sel.diff = b.dataset.d; renderStart(); }
  else if (act === 'app-random') { const s = comp().seasons; sel.season = s[Math.floor(Math.random() * s.length)].id; renderStart(); }
  else if (act === 'app-start' || act === 'app-again') { play(); scrollTo(0, 0); }
  else if (act === 'app-back') { if (current && current.pos > 0) { play(current.pos - 1); scrollTo(0, 0); } }
  else if (act === 'app-home' || act === 'app-quit') { runId++; current = null; renderStart(); scrollTo(0, 0); }
});

(async () => {
  try {
    INDEX = await loadIndex();
    sel.comp = INDEX.competitions[0].id;
    sel.season = INDEX.competitions[0].seasons[0].id;
    renderStart();
  } catch (e) {
    app.innerHTML = band(esc(e.message));
  }
})();
