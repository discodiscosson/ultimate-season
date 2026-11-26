export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export const formatDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// Result line for a two-legged tie or a final, e.g. "Monaco 4–5 Paris Saint-Germain (2–3, 2–2)"
export function tieResult(tie, teams, a, b) {
  const base = tie.legs ? `${teams[a].name} ${tie.agg} ${teams[b].name} (${tie.legs})` : `${teams[a].name} ${tie.agg} ${teams[b].name}`;
  return tie.note ? `${base}. ${tie.note}` : base;
}
