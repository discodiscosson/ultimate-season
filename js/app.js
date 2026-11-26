import { loadIndex, loadSeason } from './data.js';
import { momentsFor, runSeason } from './engine.js';
import { saveRun } from './lib/supabase.js';
import { esc } from './lib/util.js';

const DIFF = {
  easy: { name: 'Easy', desc: 'Svarsalternativ och facit direkt.' },
  medium: { name: 'Medium', desc: 'Skriv själv med förslag. Fem kontroller i slutspelet.' },
  hard: { name: 'Hard', desc: 'Fritext utan förslag. Slutspelet rättas först i slutet.' },
};

const app = document.getElementById('app');
let INDEX = null;
let runId = 0;
const sel = { comp: null, season: null, diff: 'medium' };
const comp = () => INDEX.competitions.find((c) => c.id === sel.comp);

function band(sub, ladder) {
  return `<header class="band">
    <div class="band-top"><a class="home" href="https://www.disco.games">disco.games</a>${ladder ? '<button class="quit" data-act="app-quit">Avsluta</button>' : ''}</div>
    <h1 class="title">Ultimate Season</h1><p class="sub">${sub}</p>
    ${ladder ? `<div class="ladder">${ladder.map((s) => `<span class="${s.state}">${esc(s.label)}</span>`).join('')}</div>` : ''}
  </header>`;
}

function renderStart() {
  const c = comp();
  app.innerHTML = band('Sporttrivia där allt kretsar kring en enda säsong.') + `
    <section class="panel">
      <h3 class="lbl">Sport</h3>
      <div class="chips"><button class="chip on" aria-pressed="true">Fotboll</button><button class="chip" disabled>Fler sporter snart</button></div>
      <h3 class="lbl">Turnering</h3>
      <div class="chips">${INDEX.competitions.map((x) => `<button class="chip ${x.id === sel.comp ? 'on' : ''}" data-act="app-comp" data-id="${x.id}">${esc(x.name)}</button>`).join('')}</div>
      <h3 class="lbl">Säsong</h3>
      <div class="seasonrow">
        <select id="season" aria-label="Säsong">${c.seasons.map((s) => `<option value="${s.id}" ${s.id === sel.season ? 'selected' : ''}>${esc(s.label)}</option>`).join('')}</select>
        <button class="btn ghost" data-act="app-random">Slumpa</button>
      </div>
      <h3 class="lbl">Svårighet</h3>
      <div class="modes">${Object.entries(DIFF).map(([k, d]) => `<button class="mode ${sel.diff === k ? 'on' : ''}" data-act="app-diff" data-d="${k}" aria-pressed="${sel.diff === k}"><h4>${d.name}</h4><p>${d.desc}</p></button>`).join('')}</div>
    </section>
    <div class="foot"><span></span><button class="btn" data-act="app-start">Starta säsongen</button></div>`;
}

async function play() {
  const myRun = ++runId;
  app.innerHTML = band('Laddar säsongen…');
  let season;
  try { season = await loadSeason(sel.season); }
  catch (e) { app.innerHTML = band(esc(e.message)) + '<div class="foot"><button class="btn" data-act="app-home">Tillbaka</button></div>'; return; }
  if (myRun !== runId) return;

  const title = `${season.competition.name} ${season.label}, ${DIFF[sel.diff].name}`;
  const moments = momentsFor(season);
  app.innerHTML = band(esc(title), moments.map((m, k) => ({ label: m.meta.short, state: k === 0 ? 'now' : '' }))) + '<div id="stage"></div>';
  const results = await runSeason({
    host: app.querySelector('#stage'), season, difficulty: sel.diff,
    onMoment: (i) => app.querySelectorAll('.ladder span').forEach((s, k) => { s.className = k < i ? 'past' : k === i ? 'now' : ''; }),
  });
  if (myRun !== runId) return;
  summary(season, title, results);
}

async function summary(season, title, results) {
  const score = results.reduce((s, r) => s + r.score, 0), max = results.reduce((s, r) => s + r.max, 0);
  app.innerHTML = band(esc(title)) + `
    <p class="total">${score} / ${max} p</p>
    <p class="hint" id="saved"></p>
    ${results.map((r) => `<h3 class="path">${esc(r.title)} <span class="muted">${r.score} / ${r.max} p</span></h3>
      <div class="rounds">${(r.lines || []).map(([a, b]) => `<div class="rrow"><span>${esc(a)}</span><span>${esc(b)}</span></div>`).join('')}</div>`).join('')}
    <div class="foot" style="justify-content:flex-start">
      <button class="btn" data-act="app-again">Spela igen</button>
      <button class="btn ghost" data-act="app-home">Byt säsong eller svårighet</button>
    </div>`;
  const res = await saveRun({
    season_id: season.id, difficulty: sel.diff, score, max_score: max,
    details: results.map(({ id, score: s, max: m, lines }) => ({ id, score: s, max: m, lines })),
  }).catch((e) => ({ status: 'error', message: e.message }));
  const msg = { saved: 'Resultatet är sparat.', guest: 'Logga in för att spara resultatet.', error: `Kunde inte spara: ${res.message || ''}` }[res.status];
  const el = app.querySelector('#saved');
  if (el && msg) el.textContent = msg;
}

app.addEventListener('change', (e) => { if (e.target.id === 'season') sel.season = e.target.value; });
app.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act^="app-"]');
  if (!b) return;
  const act = b.dataset.act;
  if (act === 'app-comp') { sel.comp = b.dataset.id; sel.season = comp().seasons[0].id; renderStart(); }
  else if (act === 'app-diff') { sel.diff = b.dataset.d; renderStart(); }
  else if (act === 'app-random') { const s = comp().seasons; sel.season = s[Math.floor(Math.random() * s.length)].id; renderStart(); }
  else if (act === 'app-start' || act === 'app-again') { play(); scrollTo(0, 0); }
  else if (act === 'app-home' || act === 'app-quit') { runId++; renderStart(); scrollTo(0, 0); }
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
