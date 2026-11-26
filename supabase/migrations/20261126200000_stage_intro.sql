-- Story text shown before a round (paragraphs separated by a blank line, links as [text](url)).
alter table ultimate_season.stages add column if not exists intro text;

-- season_json now includes "intro" on stages that have one
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
    'teams', (select jsonb_object_agg(tm.id,
                jsonb_build_object('name', tm.name, 'country', tm.country_code)
                || case when cardinality(tm.european_cup_finals) > 0 then jsonb_build_object('finals', to_jsonb(tm.european_cup_finals)) else '{}'::jsonb end
                || case when cardinality(tm.rivals) > 0 then jsonb_build_object('rivals', to_jsonb(tm.rivals)) else '{}'::jsonb end)
              from season_teams sx join teams tm on tm.id = sx.team_id where sx.season_id = s.id),
    'leaguePosition', coalesce((select jsonb_object_agg(sx.team_id, sx.league_position)
              from season_teams sx where sx.season_id = s.id and sx.league_position is not null), '{}'::jsonb),
    'stages', (select jsonb_agg(jsonb_build_object(
                  'id', st.code, 'type', st.type, 'name', st.name, 'short', st.short_name)
                  || case when st.intro is not null then jsonb_build_object('intro', st.intro) else '{}'::jsonb end
                  || jsonb_build_object(
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
