-- Ultimate Season: eget schema i guessthecareer-projektet.
-- Kör i SQL Editor (eller via supabase db push). Lägg sedan till "ultimate_season" under
-- Project Settings > API > Exposed schemas.

create schema if not exists ultimate_season;
grant usage on schema ultimate_season to anon, authenticated, service_role;

-- Grunddata ---------------------------------------------------------------

create table ultimate_season.countries (
  code     text primary key,               -- t.ex. SWE, ENG
  name_sv  text not null,
  aliases  text[] not null default '{}'
);

create table ultimate_season.competitions (
  id     text primary key,                 -- t.ex. ucl
  sport  text not null,                    -- football
  name   text not null
);

create table ultimate_season.teams (
  id            text primary key,          -- kort id, t.ex. psg
  name          text not null,
  country_code  text not null references ultimate_season.countries(code)
);

create table ultimate_season.seasons (
  id                  text primary key,    -- t.ex. ucl-2025-26
  competition_id      text not null references ultimate_season.competitions(id),
  label               text not null,       -- 2025/26
  start_year          int  not null,
  final_date          date,
  final_city          text,
  final_country_code  text references ultimate_season.countries(code),
  final_venue         text
);

create table ultimate_season.season_teams (
  season_id        text not null references ultimate_season.seasons(id) on delete cascade,
  team_id          text not null references ultimate_season.teams(id),
  league_position  int,                    -- placering i liga- eller gruppfasen om den finns
  primary key (season_id, team_id)
);

create table ultimate_season.stages (
  id          bigint generated always as identity primary key,
  season_id   text not null references ultimate_season.seasons(id) on delete cascade,
  code        text not null,               -- q1, q2, ko_po, r16, qf, sf, final ...
  type        text not null check (type in ('qualifying','league','knockout')),
  name        text not null,
  short_name  text not null,
  sort_order  int  not null,
  unique (season_id, code)
);

-- Ett möte (dubbelmöte eller final). Varje plats är antingen ett fast lag eller vinnaren av ett tidigare möte.
create table ultimate_season.ties (
  id           bigint generated always as identity primary key,
  stage_id     bigint not null references ultimate_season.stages(id) on delete cascade,
  sort_order   int  not null,              -- 0-baserad, avgör trädets ordning
  path         text check (path in ('champions','league')),
  team1        text not null references ultimate_season.teams(id),
  team2        text not null references ultimate_season.teams(id),
  team1_from   bigint references ultimate_season.ties(id),
  team2_from   bigint references ultimate_season.ties(id),
  winner       text not null references ultimate_season.teams(id),
  agg_score    text,                       -- sammanlagt, lag1–lag2
  legs         text,                       -- matcherna, lag1–lag2
  note         text,                       -- t.ex. straffar
  unique (stage_id, sort_order),
  check (winner in (team1, team2))
);

-- Kommande spel: enskilda matcher, uppställningar och skytteliga ------------

create table ultimate_season.matches (
  id          bigint generated always as identity primary key,
  tie_id      bigint references ultimate_season.ties(id) on delete cascade,
  stage_id    bigint not null references ultimate_season.stages(id) on delete cascade,
  played_on   date,
  home_team   text not null references ultimate_season.teams(id),
  away_team   text not null references ultimate_season.teams(id),
  home_goals  int,
  away_goals  int,
  extra_time  boolean not null default false,
  pens_home   int,
  pens_away   int,
  venue       text,
  city        text
);

create table ultimate_season.lineups (
  match_id     bigint not null references ultimate_season.matches(id) on delete cascade,
  team_id      text not null references ultimate_season.teams(id),
  player_name  text not null,
  player_ref   bigint,                     -- kan peka på public.players.id i Guess the Career
  is_starter   boolean not null default true,
  position     text,
  shirt_number int,
  primary key (match_id, team_id, player_name)
);

create table ultimate_season.top_scorers (
  season_id    text not null references ultimate_season.seasons(id) on delete cascade,
  rank         int  not null,
  player_name  text not null,
  team_id      text references ultimate_season.teams(id),
  goals        int  not null,
  primary key (season_id, player_name)
);

-- Spelarnas resultat ------------------------------------------------------

create table ultimate_season.runs (
  id          bigint generated always as identity primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  season_id   text not null references ultimate_season.seasons(id),
  difficulty  text not null check (difficulty in ('easy','medium','hard')),
  score       int  not null check (score >= 0),
  max_score   int  not null check (max_score >= score),
  details     jsonb not null default '[]',
  created_at  timestamptz not null default now()
);
create index runs_season_idx on ultimate_season.runs (season_id, difficulty, score desc);

-- Behörigheter ------------------------------------------------------------
-- Säsongsdata är publik (den serveras ändå som statiska filer). Resultat: bara egna rader.

alter table ultimate_season.countries     enable row level security;
alter table ultimate_season.competitions  enable row level security;
alter table ultimate_season.teams         enable row level security;
alter table ultimate_season.seasons       enable row level security;
alter table ultimate_season.season_teams  enable row level security;
alter table ultimate_season.stages        enable row level security;
alter table ultimate_season.ties          enable row level security;
alter table ultimate_season.matches       enable row level security;
alter table ultimate_season.lineups       enable row level security;
alter table ultimate_season.top_scorers   enable row level security;
alter table ultimate_season.runs          enable row level security;

do $$
declare t text;
begin
  foreach t in array array['countries','competitions','teams','seasons','season_teams','stages','ties','matches','lineups','top_scorers']
  loop
    execute format('create policy "public read" on ultimate_season.%I for select to anon, authenticated using (true)', t);
    execute format('grant select on ultimate_season.%I to anon, authenticated', t);
  end loop;
end $$;

create policy "insert own runs" on ultimate_season.runs for insert to authenticated with check (user_id = auth.uid());
create policy "read own runs"   on ultimate_season.runs for select to authenticated using (user_id = auth.uid());
grant select, insert on ultimate_season.runs to authenticated;

-- Säsongen som JSON i exakt det format som frontend läser --------------------

create or replace function ultimate_season.season_json(p_season text)
returns jsonb
language sql stable security invoker
set search_path = ultimate_season
as $$
  with slot as (
    select t.id,
      case when t.team1_from is null then jsonb_build_object('team', t.team1)
           else (select jsonb_build_object('from', s2.code || ':' || f.sort_order)
                 from ties f join stages s2 on s2.id = f.stage_id where f.id = t.team1_from) end as s1,
      case when t.team2_from is null then jsonb_build_object('team', t.team2)
           else (select jsonb_build_object('from', s2.code || ':' || f.sort_order)
                 from ties f join stages s2 on s2.id = f.stage_id where f.id = t.team2_from) end as s2
    from ties t join stages st on st.id = t.stage_id
    where st.season_id = p_season
  )
  select jsonb_build_object(
    'id', s.id,
    'label', s.label,
    'competition', (select jsonb_build_object('id', c.id, 'name', c.name, 'sport', c.sport)
                    from competitions c where c.id = s.competition_id),
    'final', jsonb_build_object('date', s.final_date, 'city', s.final_city,
                                'country', s.final_country_code, 'venue', s.final_venue),
    'teams', (select jsonb_object_agg(tm.id, jsonb_build_object('name', tm.name, 'country', tm.country_code))
              from season_teams sx join teams tm on tm.id = sx.team_id where sx.season_id = s.id),
    'leaguePosition', coalesce((select jsonb_object_agg(sx.team_id, sx.league_position)
              from season_teams sx where sx.season_id = s.id and sx.league_position is not null), '{}'::jsonb),
    'stages', (select jsonb_agg(jsonb_build_object(
                  'id', st.code, 'type', st.type, 'name', st.name, 'short', st.short_name,
                  'ties', (select jsonb_agg(jsonb_build_object(
                              'path', t.path, 'slots', jsonb_build_array(sl.s1, sl.s2),
                              'winner', t.winner, 'agg', t.agg_score, 'legs', t.legs, 'note', t.note)
                            order by t.sort_order)
                           from ties t join slot sl on sl.id = t.id where t.stage_id = st.id))
                order by st.sort_order)
               from stages st where st.season_id = s.id)
  )
  from seasons s where s.id = p_season;
$$;

grant execute on function ultimate_season.season_json(text) to anon, authenticated;
