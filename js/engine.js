// Säsongsmotorn: väljer vilka spel säsongens data räcker till och kör dem i ordning.
// Ett nytt spel läggs till genom att skapa en modul i js/games/ med meta, available() och play() och lägga in den här.
import * as finalHost from './games/final-host.js';
import * as qualifying from './games/qualifying.js';
import * as bracket from './games/bracket.js';

const GAMES = [finalHost, qualifying, bracket];

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
