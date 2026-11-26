# Ultimate Season

Sports trivia built around a single season. Version 0.2: Champions League 2025/26 with three games played in season order.

1. **The final** – which country hosts the final?
2. **Qualifying** – guess the country of every new team from the first qualifying round to the play-off round, then pick which teams reached the league phase.
3. **Knockout phase** – pick the whole bracket from the knockout play-offs to the final.

Difficulty is chosen on the start page and applies to every game:

| | Countries | Knockout phase |
|---|---|---|
| Easy | Four options | Instant answers, the right team advances |
| Medium | Free text with suggestions | Hidden answers, 5 checks that reveal the answer and send the right team through |
| Hard | Free text, no suggestions | Your picks advance, everything is marked at the end |

Country answers accept English and Swedish names and small typos.

## Structure

```
index.html                  The page (ES modules, no build step)
css/style.css
js/app.js                   Start page, flow and summary
js/engine.js                The season engine: picks and runs the games in order
js/games/*.js               One game per file
js/lib/                     Countries and fuzzy matching, answer field, Supabase
js/config.js                Supabase URL and publishable key
data/index.json             Competitions and seasons on the start page
data/seasons/<id>.json      One file per season (generated from Supabase)
supabase/migrations/        The ultimate_season schema
supabase/seed/              Season data imports
scripts/                    Source data, seed generator, export and preview build
```

## Setup

1. **Supabase (guess-the-career project):** run the files in `supabase/migrations/` in order, then `supabase/seed/ucl-2025-26.sql`. Add `ultimate_season` under Project Settings > Data API > Exposed schemas. Check with `select ultimate_season.season_json('ucl-2025-26');`.
2. **Config:** `js/config.js` holds the project URL and the publishable key. Never put a secret key there.
3. **Vercel:** static site, framework preset Other, no build command. Domain `ultimateseason.disco.games` via a CNAME in Cloudflare (DNS only).
4. **Local:** ES modules need a server, e.g. `npx serve .`. For a standalone test file: `npm install` and `npm run preview` (writes `dist/preview.html`).

## Adding a season

Supabase is the source of truth and the JSON files are a cache the game reads.

1. Add the season to the tables (`seasons`, `season_teams`, `stages`, `ties`). The easiest way is to copy `scripts/source_ucl_2025_26.py`, run it to create the JSON, then run `python3 scripts/json_to_seed.py <id> > supabase/seed/<id>.sql` and run that file in Supabase.
2. Export: `SUPABASE_URL=... SUPABASE_ANON_KEY=... npm run export -- <id>`.
3. Add the season to `data/index.json`.

Data format in short: each tie has two `slots`, either `{ "team": "psg" }` or `{ "from": "r16:0" }` (the winner of tie 0 in the round r16). `agg` and `legs` are given from team 1's perspective.

## Adding a game

Create `js/games/<name>.js` exporting:

- `meta = { id, title, short }`
- `available(season)`: whether the season's data supports the game
- `play({ el, season, difficulty })`: renders into `el` and returns a Promise resolving to `{ score, max, lines }`

Register the module in `GAMES` in `js/engine.js`. The order there is the order in the season. The tables `matches`, `lineups` and `top_scorers` already exist for "who's missing from the starting XI" and "top scorer".

## Known limitations

- Scores are calculated in the browser, so leaderboards could be cheated. Next step is an RPC that marks answers on the server, like `submit_guess` in Guess the Career.
- The league phase is not in the data yet (only the positions of the 24 teams that reached the knockouts).
- Shared sign-in and the games menu from the other disco.games games are not wired in yet.
- Team names like "Malmö FF" and "Dynamo Kyiv" give away the country. Consider short names in hard mode.
