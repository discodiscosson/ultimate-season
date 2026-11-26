begin;

insert into ultimate_season.countries (code, name, aliases) values
  ('ALB', 'Albania', array['albanien']::text[]),
  ('AND', 'Andorra', '{}'::text[]),
  ('ARM', 'Armenia', array['armenien']::text[]),
  ('AUT', 'Austria', array['österrike']::text[]),
  ('AZE', 'Azerbaijan', array['azerbajdzjan','azerbajdjan','azerbaidjan']::text[]),
  ('BEL', 'Belgium', array['belgien']::text[]),
  ('BIH', 'Bosnia and Herzegovina', array['bosnia','bosnia herzegovina','bosnien och hercegovina','bosnien']::text[]),
  ('BLR', 'Belarus', array['vitryssland']::text[]),
  ('BUL', 'Bulgaria', array['bulgarien']::text[]),
  ('CRO', 'Croatia', array['kroatien']::text[]),
  ('CYP', 'Cyprus', array['cypern']::text[]),
  ('CZE', 'Czechia', array['czech republic','tjeckien']::text[]),
  ('DEN', 'Denmark', array['danmark']::text[]),
  ('ENG', 'England', '{}'::text[]),
  ('ESP', 'Spain', array['spanien']::text[]),
  ('EST', 'Estonia', array['estland']::text[]),
  ('FIN', 'Finland', '{}'::text[]),
  ('FRA', 'France', array['frankrike']::text[]),
  ('FRO', 'Faroe Islands', array['faroes','faroe','färöarna']::text[]),
  ('GEO', 'Georgia', array['georgien']::text[]),
  ('GER', 'Germany', array['tyskland']::text[]),
  ('GIB', 'Gibraltar', '{}'::text[]),
  ('GRE', 'Greece', array['grekland']::text[]),
  ('HUN', 'Hungary', array['ungern']::text[]),
  ('IRL', 'Ireland', array['republic of ireland','eire','irland']::text[]),
  ('ISL', 'Iceland', array['island']::text[]),
  ('ISR', 'Israel', '{}'::text[]),
  ('ITA', 'Italy', array['italien']::text[]),
  ('KAZ', 'Kazakhstan', array['kazakstan']::text[]),
  ('KOS', 'Kosovo', '{}'::text[]),
  ('LIE', 'Liechtenstein', '{}'::text[]),
  ('LTU', 'Lithuania', array['litauen']::text[]),
  ('LUX', 'Luxembourg', array['luxemburg']::text[]),
  ('LVA', 'Latvia', array['lettland']::text[]),
  ('MDA', 'Moldova', array['moldavien']::text[]),
  ('MKD', 'North Macedonia', array['macedonia','nordmakedonien','makedonien']::text[]),
  ('MLT', 'Malta', '{}'::text[]),
  ('MNE', 'Montenegro', '{}'::text[]),
  ('NED', 'Netherlands', array['holland','nederländerna']::text[]),
  ('NIR', 'Northern Ireland', array['nordirland']::text[]),
  ('NOR', 'Norway', array['norge']::text[]),
  ('POL', 'Poland', array['polen']::text[]),
  ('POR', 'Portugal', '{}'::text[]),
  ('ROU', 'Romania', array['rumänien']::text[]),
  ('RUS', 'Russia', array['ryssland']::text[]),
  ('SCO', 'Scotland', array['skottland']::text[]),
  ('SMR', 'San Marino', '{}'::text[]),
  ('SRB', 'Serbia', array['serbien']::text[]),
  ('SUI', 'Switzerland', array['schweiz']::text[]),
  ('SVK', 'Slovakia', array['slovakien']::text[]),
  ('SVN', 'Slovenia', array['slovenien']::text[]),
  ('SWE', 'Sweden', array['sverige']::text[]),
  ('TUR', 'Turkey', array['turkiye','turkiet']::text[]),
  ('UKR', 'Ukraine', array['ukraina']::text[]),
  ('WAL', 'Wales', '{}'::text[])
on conflict (code) do update set name = excluded.name, aliases = excluded.aliases;

insert into ultimate_season.competitions (id, sport, name) values ('ucl', 'football', 'Champions League') on conflict (id) do nothing;

insert into ultimate_season.teams (id, name, country_code) values
  ('zal', 'Žalgiris', 'LTU'),
  ('ham', 'Hamrun Spartans', 'MLT'),
  ('kup', 'KuPS', 'FIN'),
  ('mil', 'Milsami Orhei', 'MDA'),
  ('tns', 'The New Saints', 'WAL'),
  ('shk', 'Shkëndija', 'MKD'),
  ('ibe', 'Iberia 1999', 'GEO'),
  ('mal', 'Malmö FF', 'SWE'),
  ('lvd', 'FCI Levadia', 'EST'),
  ('rfs', 'RFS', 'LVA'),
  ('dri', 'Drita', 'KOS'),
  ('dif', 'Differdange 03', 'LUX'),
  ('vik', 'Víkingur Gøta', 'FRO'),
  ('lin', 'Lincoln Red Imps', 'GIB'),
  ('egn', 'Egnatia', 'ALB'),
  ('bre', 'Breiðablik', 'ISL'),
  ('she', 'Shelbourne', 'IRL'),
  ('lfd', 'Linfield', 'NIR'),
  ('fcs', 'FCSB', 'ROU'),
  ('esc', 'Inter Club d’Escaldes', 'AND'),
  ('vir', 'Virtus', 'SMR'),
  ('zri', 'Zrinjski Mostar', 'BIH'),
  ('oli', 'Olimpija Ljubljana', 'SVN'),
  ('kai', 'Kairat', 'KAZ'),
  ('noa', 'Noah', 'ARM'),
  ('bud', 'Budućnost Podgorica', 'MNE'),
  ('lud', 'Ludogorets Razgrad', 'BUL'),
  ('din', 'Dinamo Minsk', 'BLR'),
  ('dyn', 'Dynamo Kyiv', 'UKR'),
  ('paf', 'Pafos', 'CYP'),
  ('mac', 'Maccabi Tel Aviv', 'ISR'),
  ('rsb', 'Red Star Belgrade', 'SRB'),
  ('fer', 'Ferencváros', 'HUN'),
  ('lec', 'Lech Poznań', 'POL'),
  ('cop', 'Copenhagen', 'DEN'),
  ('rij', 'Rijeka', 'CRO'),
  ('slo', 'Slovan Bratislava', 'SVK'),
  ('qar', 'Qarabağ', 'AZE'),
  ('bra', 'Brann', 'NOR'),
  ('sal', 'Red Bull Salzburg', 'AUT'),
  ('plz', 'Viktoria Plzeň', 'CZE'),
  ('ser', 'Servette', 'SUI'),
  ('ran', 'Rangers', 'SCO'),
  ('pan', 'Panathinaikos', 'GRE'),
  ('bru', 'Club Brugge', 'BEL'),
  ('nic', 'Nice', 'FRA'),
  ('ben', 'Benfica', 'POR'),
  ('fey', 'Feyenoord', 'NED'),
  ('fen', 'Fenerbahçe', 'TUR'),
  ('bod', 'Bodø/Glimt', 'NOR'),
  ('stu', 'Sturm Graz', 'AUT'),
  ('cel', 'Celtic', 'SCO'),
  ('bas', 'Basel', 'SUI'),
  ('psg', 'Paris Saint-Germain', 'FRA'),
  ('mon', 'Monaco', 'FRA'),
  ('gal', 'Galatasaray', 'TUR'),
  ('juv', 'Juventus', 'ITA'),
  ('rma', 'Real Madrid', 'ESP'),
  ('bvb', 'Borussia Dortmund', 'GER'),
  ('ata', 'Atalanta', 'ITA'),
  ('new', 'Newcastle United', 'ENG'),
  ('atm', 'Atlético Madrid', 'ESP'),
  ('int', 'Inter', 'ITA'),
  ('oly', 'Olympiacos', 'GRE'),
  ('b04', 'Bayer Leverkusen', 'GER'),
  ('che', 'Chelsea', 'ENG'),
  ('liv', 'Liverpool', 'ENG'),
  ('mci', 'Manchester City', 'ENG'),
  ('bay', 'Bayern München', 'GER'),
  ('bar', 'Barcelona', 'ESP'),
  ('tot', 'Tottenham Hotspur', 'ENG'),
  ('spo', 'Sporting CP', 'POR'),
  ('ars', 'Arsenal', 'ENG')
on conflict (id) do update set name = excluded.name, country_code = excluded.country_code;

delete from ultimate_season.seasons where id = 'ucl-2025-26';
insert into ultimate_season.seasons (id, competition_id, label, start_year, final_date, final_city, final_country_code, final_venue) values ('ucl-2025-26', 'ucl', '2025/26', 2025, '2026-05-30', 'Budapest', 'HUN', 'Puskás Aréna');

insert into ultimate_season.season_teams (season_id, team_id, league_position) values
  ('ucl-2025-26', 'zal', null),
  ('ucl-2025-26', 'ham', null),
  ('ucl-2025-26', 'kup', null),
  ('ucl-2025-26', 'mil', null),
  ('ucl-2025-26', 'tns', null),
  ('ucl-2025-26', 'shk', null),
  ('ucl-2025-26', 'ibe', null),
  ('ucl-2025-26', 'mal', null),
  ('ucl-2025-26', 'lvd', null),
  ('ucl-2025-26', 'rfs', null),
  ('ucl-2025-26', 'dri', null),
  ('ucl-2025-26', 'dif', null),
  ('ucl-2025-26', 'vik', null),
  ('ucl-2025-26', 'lin', null),
  ('ucl-2025-26', 'egn', null),
  ('ucl-2025-26', 'bre', null),
  ('ucl-2025-26', 'she', null),
  ('ucl-2025-26', 'lfd', null),
  ('ucl-2025-26', 'fcs', null),
  ('ucl-2025-26', 'esc', null),
  ('ucl-2025-26', 'vir', null),
  ('ucl-2025-26', 'zri', null),
  ('ucl-2025-26', 'oli', null),
  ('ucl-2025-26', 'kai', null),
  ('ucl-2025-26', 'noa', null),
  ('ucl-2025-26', 'bud', null),
  ('ucl-2025-26', 'lud', null),
  ('ucl-2025-26', 'din', null),
  ('ucl-2025-26', 'dyn', null),
  ('ucl-2025-26', 'paf', null),
  ('ucl-2025-26', 'mac', null),
  ('ucl-2025-26', 'rsb', null),
  ('ucl-2025-26', 'fer', null),
  ('ucl-2025-26', 'lec', null),
  ('ucl-2025-26', 'cop', null),
  ('ucl-2025-26', 'rij', null),
  ('ucl-2025-26', 'slo', null),
  ('ucl-2025-26', 'qar', 22),
  ('ucl-2025-26', 'bra', null),
  ('ucl-2025-26', 'sal', null),
  ('ucl-2025-26', 'plz', null),
  ('ucl-2025-26', 'ser', null),
  ('ucl-2025-26', 'ran', null),
  ('ucl-2025-26', 'pan', null),
  ('ucl-2025-26', 'bru', 19),
  ('ucl-2025-26', 'nic', null),
  ('ucl-2025-26', 'ben', 24),
  ('ucl-2025-26', 'fey', null),
  ('ucl-2025-26', 'fen', null),
  ('ucl-2025-26', 'bod', 23),
  ('ucl-2025-26', 'stu', null),
  ('ucl-2025-26', 'cel', null),
  ('ucl-2025-26', 'bas', null),
  ('ucl-2025-26', 'psg', 11),
  ('ucl-2025-26', 'mon', 21),
  ('ucl-2025-26', 'gal', 20),
  ('ucl-2025-26', 'juv', 13),
  ('ucl-2025-26', 'rma', 9),
  ('ucl-2025-26', 'bvb', 17),
  ('ucl-2025-26', 'ata', 15),
  ('ucl-2025-26', 'new', 12),
  ('ucl-2025-26', 'atm', 14),
  ('ucl-2025-26', 'int', 10),
  ('ucl-2025-26', 'oly', 18),
  ('ucl-2025-26', 'b04', 16),
  ('ucl-2025-26', 'che', 6),
  ('ucl-2025-26', 'liv', 3),
  ('ucl-2025-26', 'mci', 8),
  ('ucl-2025-26', 'bay', 2),
  ('ucl-2025-26', 'bar', 5),
  ('ucl-2025-26', 'tot', 4),
  ('ucl-2025-26', 'spo', 7),
  ('ucl-2025-26', 'ars', 1)
;

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order) values ('ucl-2025-26', 'q1', 'qualifying', 'First qualifying round', 'Q1', 0);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q1'), 0, null, 'zal', 'ham', null, null, 'ham', '2–2', '2–0, 0–2 a.e.t.', 'Hamrun Spartans won 11–10 on penalties');
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q1'), 1, null, 'kup', 'mil', null, null, 'kup', '1–0', '1–0, 0–0', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q1'), 2, null, 'tns', 'shk', null, null, 'shk', '1–2', '0–0, 1–2 a.e.t.', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q1'), 3, null, 'ibe', 'mal', null, null, 'mal', '2–6', '1–3, 1–3', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q1'), 4, null, 'lvd', 'rfs', null, null, 'rfs', '0–2', '0–1, 0–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q1'), 5, null, 'dri', 'dif', null, null, 'dri', '4–2', '1–0, 3–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q1'), 6, null, 'vik', 'lin', null, null, 'lin', '2–4', '2–3, 0–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q1'), 7, null, 'egn', 'bre', null, null, 'bre', '1–5', '1–0, 0–5', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q1'), 8, null, 'she', 'lfd', null, null, 'she', '2–1', '1–0, 1–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q1'), 9, null, 'fcs', 'esc', null, null, 'fcs', '4–3', '3–1, 1–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q1'), 10, null, 'vir', 'zri', null, null, 'zri', '1–4', '0–2, 1–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q1'), 11, null, 'oli', 'kai', null, null, 'kai', '1–3', '1–1, 0–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q1'), 12, null, 'noa', 'bud', null, null, 'noa', '3–2', '1–0, 2–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q1'), 13, null, 'lud', 'din', null, null, 'lud', '3–2', '1–0, 2–2 a.e.t.', null);

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order) values ('ucl-2025-26', 'q2', 'qualifying', 'Second qualifying round', 'Q2', 1);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q2'), 0, 'champions', 'rfs', 'mal', null, null, 'mal', '1–5', '1–4, 0–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q2'), 1, 'champions', 'ham', 'dyn', null, null, 'dyn', '0–6', '0–3, 0–3', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q2'), 2, 'champions', 'paf', 'mac', null, null, 'paf', '2–1', '1–1, 1–0', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q2'), 3, 'champions', 'lin', 'rsb', null, null, 'rsb', '1–6', '0–1, 1–5', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q2'), 4, 'champions', 'noa', 'fer', null, null, 'fer', '4–6', '1–2, 3–4', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q2'), 5, 'champions', 'lec', 'bre', null, null, 'lec', '8–1', '7–1, 1–0', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q2'), 6, 'champions', 'cop', 'dri', null, null, 'cop', '3–0', '2–0, 1–0', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q2'), 7, 'champions', 'rij', 'lud', null, null, 'lud', '1–3', '0–0, 1–3 a.e.t.', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q2'), 8, 'champions', 'shk', 'fcs', null, null, 'shk', '3–1', '1–0, 2–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q2'), 9, 'champions', 'slo', 'zri', null, null, 'slo', '6–2', '4–0, 2–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q2'), 10, 'champions', 'she', 'qar', null, null, 'qar', '0–4', '0–3, 0–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q2'), 11, 'champions', 'kup', 'kai', null, null, 'kai', '2–3', '2–0, 0–3', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q2'), 12, 'league', 'bra', 'sal', null, null, 'sal', '2–5', '1–4, 1–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q2'), 13, 'league', 'plz', 'ser', null, null, 'plz', '3–2', '0–1, 3–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q2'), 14, 'league', 'ran', 'pan', null, null, 'ran', '3–1', '2–0, 1–1', null);

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order) values ('ucl-2025-26', 'q3', 'qualifying', 'Third qualifying round', 'Q3', 2);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q3'), 0, 'champions', 'mal', 'cop', null, null, 'cop', '0–5', '0–0, 0–5', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q3'), 1, 'champions', 'kai', 'slo', null, null, 'kai', '1–1', '1–0, 0–1 a.e.t.', 'Kairat won 4–3 on penalties');
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q3'), 2, 'champions', 'lec', 'rsb', null, null, 'rsb', '2–4', '1–3, 1–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q3'), 3, 'champions', 'lud', 'fer', null, null, 'fer', '0–3', '0–0, 0–3', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q3'), 4, 'champions', 'dyn', 'paf', null, null, 'paf', '0–3', '0–1, 0–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q3'), 5, 'champions', 'shk', 'qar', null, null, 'qar', '1–6', '0–1, 1–5', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q3'), 6, 'league', 'sal', 'bru', null, null, 'bru', '2–4', '0–1, 2–3', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q3'), 7, 'league', 'ran', 'plz', null, null, 'ran', '4–2', '3–0, 1–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q3'), 8, 'league', 'nic', 'ben', null, null, 'ben', '0–4', '0–2, 0–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q3'), 9, 'league', 'fey', 'fen', null, null, 'fen', '4–6', '2–1, 2–5', null);

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order) values ('ucl-2025-26', 'q_po', 'qualifying', 'Play-off round', 'PO', 3);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q_po'), 0, 'champions', 'fer', 'qar', null, null, 'qar', '4–5', '1–3, 3–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q_po'), 1, 'champions', 'rsb', 'paf', null, null, 'paf', '2–3', '1–2, 1–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q_po'), 2, 'champions', 'bod', 'stu', null, null, 'bod', '6–2', '5–0, 1–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q_po'), 3, 'champions', 'cel', 'kai', null, null, 'kai', '0–0', '0–0, 0–0 a.e.t.', 'Kairat won 3–2 on penalties');
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q_po'), 4, 'champions', 'bas', 'cop', null, null, 'cop', '1–3', '1–1, 0–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q_po'), 5, 'league', 'fen', 'ben', null, null, 'ben', '0–1', '0–0, 0–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q_po'), 6, 'league', 'ran', 'bru', null, null, 'bru', '1–9', '1–3, 0–6', null);

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order) values ('ucl-2025-26', 'ko_po', 'knockout', 'Knockout phase play-offs', 'KO PO', 4);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 0, null, 'mon', 'psg', null, null, 'psg', '4–5', '2–3, 2–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 1, null, 'gal', 'juv', null, null, 'gal', '7–5', '5–2, 2–3 a.e.t.', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 2, null, 'ben', 'rma', null, null, 'rma', '1–3', '0–1, 1–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 3, null, 'bvb', 'ata', null, null, 'ata', '3–4', '2–0, 1–4', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 4, null, 'qar', 'new', null, null, 'new', '3–9', '1–6, 2–3', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 5, null, 'bru', 'atm', null, null, 'atm', '4–7', '3–3, 1–4', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 6, null, 'bod', 'int', null, null, 'bod', '5–2', '3–1, 2–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 7, null, 'oly', 'b04', null, null, 'b04', '0–2', '0–2, 0–0', null);

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order) values ('ucl-2025-26', 'r16', 'knockout', 'Round of 16', 'R16', 5);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 0, null, 'psg', 'che', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 0), null, 'psg', '8–2', '5–2, 3–0', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 1, null, 'gal', 'liv', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 1), null, 'liv', '1–4', '1–0, 0–4', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 2, null, 'rma', 'mci', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 2), null, 'rma', '5–1', '3–0, 2–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 3, null, 'ata', 'bay', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 3), null, 'bay', '2–10', '1–6, 1–4', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 4, null, 'new', 'bar', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 4), null, 'bar', '3–8', '1–1, 2–7', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 5, null, 'atm', 'tot', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 5), null, 'atm', '7–5', '5–2, 2–3', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 6, null, 'bod', 'spo', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 6), null, 'spo', '3–5', '3–0, 0–5 a.e.t.', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 7, null, 'b04', 'ars', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 7), null, 'ars', '1–3', '1–1, 0–2', null);

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order) values ('ucl-2025-26', 'qf', 'knockout', 'Quarter-finals', 'QF', 6);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'qf'), 0, null, 'psg', 'liv', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 0), (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 1), 'psg', '4–0', '2–0, 2–0', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'qf'), 1, null, 'rma', 'bay', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 2), (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 3), 'bay', '4–6', '1–2, 3–4', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'qf'), 2, null, 'bar', 'atm', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 4), (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 5), 'atm', '2–3', '0–2, 2–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'qf'), 3, null, 'spo', 'ars', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 6), (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 7), 'ars', '0–1', '0–1, 0–0', null);

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order) values ('ucl-2025-26', 'sf', 'knockout', 'Semi-finals', 'SF', 7);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'sf'), 0, null, 'psg', 'bay', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'qf' and t.sort_order = 0), (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'qf' and t.sort_order = 1), 'psg', '6–5', '5–4, 1–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'sf'), 1, null, 'atm', 'ars', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'qf' and t.sort_order = 2), (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'qf' and t.sort_order = 3), 'ars', '1–2', '1–1, 0–1', null);

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order) values ('ucl-2025-26', 'final', 'knockout', 'Final', 'Final', 8);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'final'), 0, null, 'psg', 'ars', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'sf' and t.sort_order = 0), (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'sf' and t.sort_order = 1), 'psg', '1–1', null, 'PSG won 4–3 on penalties');

commit;
