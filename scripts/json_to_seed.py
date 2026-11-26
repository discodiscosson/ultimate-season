# Gör seed-SQL av en säsongs-JSON, för första importen till Supabase.
# Användning (från repots rot): python3 scripts/json_to_seed.py ucl-2025-26 > supabase/seed/ucl-2025-26.sql
import json, re, sys

sid = sys.argv[1]
S = json.load(open(f'data/seasons/{sid}.json'))
js = open('js/lib/countries.js', encoding='utf-8').read()
COUNTRIES = {code: re.findall(r"'([^']*)'", body) for code, body in re.findall(r"\b([A-Z]{3}): \[([^\]]*)\]", js)}

q = lambda v: 'null' if v is None else "'" + str(v).replace("'", "''") + "'"
arr = lambda xs: "array[" + ",".join(q(x) for x in xs) + "]::text[]" if xs else "'{}'::text[]"
out = ['begin;', '']

out.append('insert into ultimate_season.countries (code, name_sv, aliases) values')
out.append(',\n'.join(f"  ({q(c)}, {q(n[0])}, {arr(n[1:])})" for c, n in COUNTRIES.items()))
out.append('on conflict (code) do update set name_sv = excluded.name_sv, aliases = excluded.aliases;\n')

c = S['competition']
out.append(f"insert into ultimate_season.competitions (id, sport, name) values ({q(c['id'])}, {q(c['sport'])}, {q(c['name'])}) on conflict (id) do nothing;\n")

out.append('insert into ultimate_season.teams (id, name, country_code) values')
out.append(',\n'.join(f"  ({q(k)}, {q(v['name'])}, {q(v['country'])})" for k, v in S['teams'].items()))
out.append('on conflict (id) do update set name = excluded.name, country_code = excluded.country_code;\n')

F = S['final']
start_year = int(S['label'][:4])
out.append(f"delete from ultimate_season.seasons where id = {q(sid)};")
out.append(f"insert into ultimate_season.seasons (id, competition_id, label, start_year, final_date, final_city, final_country_code, final_venue) values "
           f"({q(sid)}, {q(c['id'])}, {q(S['label'])}, {start_year}, {q(F.get('date'))}, {q(F.get('city'))}, {q(F.get('country'))}, {q(F.get('venue'))});\n")

pos = S.get('leaguePosition', {})
out.append('insert into ultimate_season.season_teams (season_id, team_id, league_position) values')
out.append(',\n'.join(f"  ({q(sid)}, {q(k)}, {pos.get(k, 'null')})" for k in S['teams']))
out.append(';\n')

# Lös upp vilka lag som faktiskt möttes i varje plats
winners = {st['id']: [t['winner'] for t in st['ties']] for st in S['stages']}
def team_of(slot):
    if 'team' in slot: return slot['team']
    code, i = slot['from'].split(':'); return winners[code][int(i)]
def from_ref(slot):
    if 'team' in slot: return 'null'
    code, i = slot['from'].split(':')
    return (f"(select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id "
            f"where s.season_id = {q(sid)} and s.code = {q(code)} and t.sort_order = {int(i)})")

for n, st in enumerate(S['stages']):
    out.append(f"insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order) values "
               f"({q(sid)}, {q(st['id'])}, {q(st['type'])}, {q(st['name'])}, {q(st['short'])}, {n});")
    stage_ref = f"(select id from ultimate_season.stages where season_id = {q(sid)} and code = {q(st['id'])})"
    for i, t in enumerate(st['ties']):
        a, b = (team_of(s) for s in t['slots'])
        out.append(f"insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values "
                   f"({stage_ref}, {i}, {q(t.get('path'))}, {q(a)}, {q(b)}, {from_ref(t['slots'][0])}, {from_ref(t['slots'][1])}, "
                   f"{q(t['winner'])}, {q(t.get('agg'))}, {q(t.get('legs'))}, {q(t.get('note'))});")
    out.append('')

out.append('commit;')
print('\n'.join(out))
