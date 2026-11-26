// The season engine: picks the games the season's data supports and runs them in order.
// To add a game, create a module in js/games/ exporting meta, available(), steps() and play(), and register it here.
import * as finalHost from './games/final-host.js';
import * as qualifying from './games/qualifying.js';
import * as knockouts from './games/knockouts.js';
import * as topScorers from './games/top-scorers.js';
import * as league from './games/league-phase.js';

const GAMES = [qualifying, finalHost, league, knockouts, topScorers];

export const momentsFor = (season) => GAMES.filter((g) => g.available(season));

// Every screen in the season as a flat list, used by review mode (Back and Jump to).
export const stepsFor = (season) => momentsFor(season).flatMap((m, mi) =>
  m.steps(season).map((label, li) => ({ mi, li, label, game: m.meta.title })));

// Runs the season from a given game (mi) and screen within it (li). onStep(mi, li) reports where the player is.
export async function runSeason({ host, season, difficulty, from = { mi: 0, li: 0 }, onStep, isCurrent = () => true }) {
  const moments = momentsFor(season);
  const results = [];
  for (let mi = from.mi; mi < moments.length; mi++) {
    const el = document.createElement('div');
    host.replaceChildren(el);
    const r = await moments[mi].play({
      el, season, difficulty, start: mi === from.mi ? from.li : 0,
      onStep: (li) => onStep?.(mi, li),
    });
    if (!isCurrent()) return null;
    results.push({ id: moments[mi].meta.id, title: moments[mi].meta.title, ...r });
    scrollTo(0, 0);
  }
  return results;
}
