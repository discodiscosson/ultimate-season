// League table from results. Order: points, goal difference, goals scored, away goals scored, wins, away wins, name
// (the first steps of UEFA's league phase tie-breakers).
export function standings(teams, matches, names = {}) {
  const row = Object.fromEntries(teams.map((t) => [t, { t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, awayGf: 0, awayW: 0 }]));
  for (const { home, away, score: [h, a] } of matches) {
    const H = row[home], A = row[away];
    if (!H || !A) continue;
    H.p++; A.p++;
    H.gf += h; H.ga += a; A.gf += a; A.ga += h; A.awayGf += a;
    if (h > a) { H.w++; A.l++; } else if (h < a) { A.w++; H.l++; A.awayW++; } else { H.d++; A.d++; }
  }
  const list = Object.values(row).map((r) => ({ ...r, gd: r.gf - r.ga, pts: r.w * 3 + r.d }));
  list.sort((x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf || y.awayGf - x.awayGf || y.w - x.w || y.awayW - x.awayW
    || String(names[x.t] || x.t).localeCompare(String(names[y.t] || y.t)));
  return list.map((r, i) => ({ ...r, pos: i + 1 }));
}
