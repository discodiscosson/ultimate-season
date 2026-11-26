-- Player name search for the answer dropdowns in Ultimate Season.
-- Returns only display names (and club) from Guess the Career's players table, so the rest of that table
-- (the career rows, i.e. the answers) stays private. security definer lets it read the table without opening it up.

create or replace function public.search_player_names(q text)
returns table (name text, club text)
language sql stable security definer
set search_path = public
as $$
  select p.display_name as name, min(p.club_name) as club
  from public.players p
  where length(trim(q)) >= 2
    and p.display_name ilike '%' || trim(q) || '%'
  group by p.display_name
  order by (p.display_name ilike trim(q) || '%') desc, p.display_name
  limit 25;
$$;

revoke all on function public.search_player_names(text) from public;
grant execute on function public.search_player_names(text) to anon, authenticated;
