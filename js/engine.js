// The season engine: picks the games the season's data supports and runs them in order.
// To add a game, create a module in js/games/ exporting meta, available() and play(), and register it here.
import * as finalHost from './games/final-host.js';
import * as qualifying from './games/qualifying.js';
import * as bracket from './games/bracket.js';

const GAMES = [qualifying, finalHost, bracket];

export const momentsFor = (season) => GAMES.filter((g) => g.available(season));

export async function runSeason({ host, season, difficulty, onMoment }) {
  const moments = momentsFor(season);
  const results = [];
  for (let i = 0; i < moments.length; i++) {
    onMoment?.(i, moments);
    const el = document.createElement('div');
    host.replaceChildren(el);
    const r = await moments[i].play({ el, season, difficulty });
    results.push({ id: moments[i].meta.id, title: moments[i].meta.title, ...r });
    scrollTo(0, 0);
  }
  return results;
}
