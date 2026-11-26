# Ultimate Season

Sporttrivia där allt kretsar kring en enda säsong. Version 0.1: Champions League 2025/26 med tre spel i säsongens ordning.

1. **Finalorten** – i vilket land spelas finalen?
2. **Kvalet** – gissa landet för varje nytt lag från första kvalomgången till kvalets playoff, och välj vilka lag som gick till ligafasen.
3. **Slutspelet** – tippa hela trädet från utslagsfasens playoff till final.

Svårighet väljs på startsidan och gäller alla spel:

| | Länder | Slutspelet |
|---|---|---|
| Easy | Fyra svarsalternativ | Facit direkt, rätt lag går vidare |
| Medium | Fritext med förslagslista | Dolt facit, 5 kontroller som visar svaret och skickar rätt lag vidare |
| Hard | Fritext utan förslag | Dina val går vidare, allt rättas i slutet |

## Struktur

```
index.html                  Sidan (ES-moduler, inget byggsteg)
css/style.css
js/app.js                   Startsida, flöde och sammanfattning
js/engine.js                Säsongsmotorn: väljer och kör spelen i ordning
js/games/*.js               Ett spel per fil
js/lib/                     Länder och fritextmatchning, svarsfält, Supabase
data/index.json             Turneringar och säsonger på startsidan
data/seasons/<id>.json      En fil per säsong (genereras från Supabase)
supabase/migrations/        Schemat ultimate_season
supabase/seed/              Första importen av säsongsdata
scripts/                    Källdata, seed-generator, export och förhandsversion
```

## Kom igång

1. **GitHub:** skapa repot `discodiscosson/ultimate-season` och pusha den här mappen.
2. **Supabase (guessthecareer-projektet):**
   - Kör `supabase/migrations/20261126000000_ultimate_season.sql` i SQL Editor.
   - Kör `supabase/seed/ucl-2025-26.sql`.
   - Lägg till `ultimate_season` under Project Settings > API > Exposed schemas.
   - Kontroll: `select ultimate_season.season_json('ucl-2025-26');` ska ge säsongen som JSON.
3. **Inloggning:** fyll i `js/config.js` med samma URL och anon key som Guess the Career. Byt gärna ut klienten i `js/lib/supabase.js` mot er gemensamma inloggningsmodul så att sessionen delas mellan subdomänerna. Utan config fungerar spelet ändå, men resultat sparas inte.
4. **Vercel:** importera repot som statisk sajt (inget byggkommando, output = roten). Domän: `ultimateseason.disco.games` med CNAME i Cloudflare, eller lägg spelet under `www.disco.games/ultimate-season` via en rewrite om du går över till undermappar.
5. **Lokalt:** ES-moduler kräver en server, t.ex. `npx serve .`. För en fristående testfil: `npm install` och `npm run preview` (skriver `dist/preview.html`).

## Lägga till en säsong

Supabase är sanningen och JSON-filerna är en cache som spelet läser.

1. Lägg in säsongen i tabellerna (`seasons`, `season_teams`, `stages`, `ties`). Det enklaste är att kopiera `scripts/source_ucl_2025_26.py`, köra den så att JSON skapas och sedan `python3 scripts/json_to_seed.py <id> > supabase/seed/<id>.sql` och köra den filen.
2. Exportera: `SUPABASE_URL=... SUPABASE_ANON_KEY=... npm run export -- <id>`.
3. Lägg till säsongen i `data/index.json`.

Dataformat i korthet: varje möte har två `slots`, antingen `{ "team": "psg" }` eller `{ "from": "r16:0" }` (vinnaren av möte 0 i omgången r16). `agg` och `legs` anges från lag 1:s perspektiv.

## Lägga till ett spel

Skapa `js/games/<namn>.js` som exporterar:

- `meta = { id, title, short }`
- `available(season)`: om säsongens data räcker för spelet
- `play({ el, season, difficulty })`: renderar i `el` och returnerar ett Promise som löses med `{ score, max, lines }`

Registrera modulen i `GAMES` i `js/engine.js`. Ordningen där är ordningen i säsongen. Tabellerna `matches`, `lineups` och `top_scorers` finns redan för "vem saknas i startelvan" och "skytteligan".

## Kända begränsningar i v0.1

- Poängen räknas i webbläsaren, så topplistor kan fuskas. Nästa steg är en RPC som rättar på servern, samma princip som `submit_guess` i Guess the Career.
- Ligafasen saknas i datan (bara placeringarna för de 24 lag som gick vidare finns).
- Lagnamn som "Malmö FF" och "Dynamo Kyiv" avslöjar landet. Överväg kortnamn i hard.
