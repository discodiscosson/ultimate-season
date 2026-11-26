// The knockout phase, played with the same rounds engine as qualifying: one results-table row per tie,
// one tie in focus, pick who went through, submit to see the results. The real winners move into the next round.
import { playRounds } from './qualifying.js';

export const meta = { id: 'knockouts', title: 'Knockout phase', short: 'Knockouts' };
export const available = (season) => season.stages.some((s) => s.type === 'knockout');
export const steps = (season) => [...season.stages.filter((s) => s.type === 'knockout').map((s) => s.name), 'Summary'];

export const KNOCKOUTS = {
  type: 'knockout',
  countryRounds: 0,
  pickPoints: (r) => r + 1, // play-offs 1, round of 16 2, quarter-finals 3, semi-finals 4, final 5
  finalists: () => false,
  rivals: () => false,
  autoDraw: true,
  newLabel: 'Straight from the league phase',
  doneTitle: 'Knockout phase done',
};

export const play = (ctx) => playRounds(KNOCKOUTS, ctx);
