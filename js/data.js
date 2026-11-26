// Season data is served as static JSON files (generated from Supabase with scripts/export-season.mjs).
// In the preview build the data is embedded in window.__US_INDEX__ and window.__US_SEASONS__.
export async function loadIndex() {
  if (window.__US_INDEX__) return window.__US_INDEX__;
  const r = await fetch('data/index.json');
  if (!r.ok) throw new Error('Could not load the list of seasons');
  return r.json();
}

export async function loadSeason(id) {
  if (window.__US_SEASONS__?.[id]) return window.__US_SEASONS__[id];
  const r = await fetch(`data/seasons/${id}.json`);
  if (!r.ok) throw new Error('Could not load the season');
  return r.json();
}
