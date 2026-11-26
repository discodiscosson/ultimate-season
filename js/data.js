// Säsongsdata serveras som statiska JSON-filer (genereras från Supabase med scripts/export-season.mjs).
// I förhandsversionen ligger datan inbäddad i window.__US_INDEX__ och window.__US_SEASONS__.
export async function loadIndex() {
  if (window.__US_INDEX__) return window.__US_INDEX__;
  const r = await fetch('data/index.json');
  if (!r.ok) throw new Error('Kunde inte ladda listan över säsonger');
  return r.json();
}

export async function loadSeason(id) {
  if (window.__US_SEASONS__?.[id]) return window.__US_SEASONS__[id];
  const r = await fetch(`data/seasons/${id}.json`);
  if (!r.ok) throw new Error('Kunde inte ladda säsongen');
  return r.json();
}
