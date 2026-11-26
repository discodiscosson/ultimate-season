begin;

insert into ultimate_season.countries (code, name, aliases) values
  ('AFG', 'Afghanistan', '{}'::text[]),
  ('ALB', 'Albania', array['albanien']::text[]),
  ('ALG', 'Algeria', array['algeriet']::text[]),
  ('AND', 'Andorra', '{}'::text[]),
  ('ANG', 'Angola', '{}'::text[]),
  ('ATG', 'Antigua and Barbuda', '{}'::text[]),
  ('ARG', 'Argentina', '{}'::text[]),
  ('ARM', 'Armenia', array['armenien']::text[]),
  ('AUS', 'Australia', array['australien']::text[]),
  ('AUT', 'Austria', array['österrike']::text[]),
  ('AZE', 'Azerbaijan', array['azerbajdzjan']::text[]),
  ('BAH', 'Bahamas', '{}'::text[]),
  ('BHR', 'Bahrain', '{}'::text[]),
  ('BAN', 'Bangladesh', '{}'::text[]),
  ('BRB', 'Barbados', '{}'::text[]),
  ('BLR', 'Belarus', array['vitryssland']::text[]),
  ('BEL', 'Belgium', array['belgien']::text[]),
  ('BLZ', 'Belize', '{}'::text[]),
  ('BEN', 'Benin', '{}'::text[]),
  ('BHU', 'Bhutan', '{}'::text[]),
  ('BOL', 'Bolivia', '{}'::text[]),
  ('BIH', 'Bosnia and Herzegovina', array['bosnia','bosnien och hercegovina','bosnien']::text[]),
  ('BOT', 'Botswana', '{}'::text[]),
  ('BRA', 'Brazil', array['brasilien']::text[]),
  ('BRU', 'Brunei', '{}'::text[]),
  ('BUL', 'Bulgaria', array['bulgarien']::text[]),
  ('BFA', 'Burkina Faso', '{}'::text[]),
  ('BDI', 'Burundi', '{}'::text[]),
  ('CAM', 'Cambodia', array['kambodja']::text[]),
  ('CMR', 'Cameroon', array['kamerun']::text[]),
  ('CAN', 'Canada', array['kanada']::text[]),
  ('CPV', 'Cape Verde', array['cabo verde','kap verde']::text[]),
  ('CTA', 'Central African Republic', '{}'::text[]),
  ('CHA', 'Chad', array['tchad']::text[]),
  ('CHI', 'Chile', '{}'::text[]),
  ('CHN', 'China', array['kina']::text[]),
  ('COL', 'Colombia', '{}'::text[]),
  ('COM', 'Comoros', '{}'::text[]),
  ('CGO', 'Congo', array['republic of the congo','kongo']::text[]),
  ('COD', 'DR Congo', array['democratic republic of the congo','congo kinshasa','kongo kinshasa']::text[]),
  ('CRC', 'Costa Rica', '{}'::text[]),
  ('CRO', 'Croatia', array['kroatien']::text[]),
  ('CUB', 'Cuba', array['kuba']::text[]),
  ('CYP', 'Cyprus', array['cypern']::text[]),
  ('CZE', 'Czechia', array['czech republic','tjeckien']::text[]),
  ('DEN', 'Denmark', array['danmark']::text[]),
  ('DJI', 'Djibouti', '{}'::text[]),
  ('DMA', 'Dominica', '{}'::text[]),
  ('DOM', 'Dominican Republic', array['dominikanska republiken']::text[]),
  ('ECU', 'Ecuador', '{}'::text[]),
  ('EGY', 'Egypt', array['egypten']::text[]),
  ('SLV', 'El Salvador', '{}'::text[]),
  ('ENG', 'England', '{}'::text[]),
  ('EQG', 'Equatorial Guinea', '{}'::text[]),
  ('ERI', 'Eritrea', '{}'::text[]),
  ('EST', 'Estonia', array['estland']::text[]),
  ('SWZ', 'Eswatini', array['swaziland']::text[]),
  ('ETH', 'Ethiopia', array['etiopien']::text[]),
  ('FRO', 'Faroe Islands', array['faroes','färöarna']::text[]),
  ('FIJ', 'Fiji', '{}'::text[]),
  ('FIN', 'Finland', '{}'::text[]),
  ('FRA', 'France', array['frankrike']::text[]),
  ('GAB', 'Gabon', '{}'::text[]),
  ('GAM', 'Gambia', '{}'::text[]),
  ('GEO', 'Georgia', array['georgien']::text[]),
  ('GER', 'Germany', array['tyskland']::text[]),
  ('GHA', 'Ghana', '{}'::text[]),
  ('GIB', 'Gibraltar', '{}'::text[]),
  ('GRE', 'Greece', array['grekland']::text[]),
  ('GRN', 'Grenada', '{}'::text[]),
  ('GUA', 'Guatemala', '{}'::text[]),
  ('GUI', 'Guinea', '{}'::text[]),
  ('GNB', 'Guinea-Bissau', '{}'::text[]),
  ('GUY', 'Guyana', '{}'::text[]),
  ('HAI', 'Haiti', '{}'::text[]),
  ('HON', 'Honduras', '{}'::text[]),
  ('HUN', 'Hungary', array['ungern']::text[]),
  ('ISL', 'Iceland', array['island']::text[]),
  ('IND', 'India', array['indien']::text[]),
  ('IDN', 'Indonesia', array['indonesien']::text[]),
  ('IRN', 'Iran', '{}'::text[]),
  ('IRQ', 'Iraq', array['irak']::text[]),
  ('IRL', 'Ireland', array['republic of ireland','irland']::text[]),
  ('ISR', 'Israel', '{}'::text[]),
  ('ITA', 'Italy', array['italien']::text[]),
  ('CIV', 'Ivory Coast', array['cote d ivoire','elfenbenskusten']::text[]),
  ('JAM', 'Jamaica', '{}'::text[]),
  ('JPN', 'Japan', '{}'::text[]),
  ('JOR', 'Jordan', array['jordanien']::text[]),
  ('KAZ', 'Kazakhstan', array['kazakstan']::text[]),
  ('KEN', 'Kenya', '{}'::text[]),
  ('KIR', 'Kiribati', '{}'::text[]),
  ('KOS', 'Kosovo', '{}'::text[]),
  ('KUW', 'Kuwait', '{}'::text[]),
  ('KGZ', 'Kyrgyzstan', array['kirgizistan']::text[]),
  ('LAO', 'Laos', '{}'::text[]),
  ('LVA', 'Latvia', array['lettland']::text[]),
  ('LBN', 'Lebanon', array['libanon']::text[]),
  ('LES', 'Lesotho', '{}'::text[]),
  ('LBR', 'Liberia', '{}'::text[]),
  ('LBY', 'Libya', array['libyen']::text[]),
  ('LIE', 'Liechtenstein', '{}'::text[]),
  ('LTU', 'Lithuania', array['litauen']::text[]),
  ('LUX', 'Luxembourg', array['luxemburg']::text[]),
  ('MAD', 'Madagascar', '{}'::text[]),
  ('MWI', 'Malawi', '{}'::text[]),
  ('MAS', 'Malaysia', '{}'::text[]),
  ('MDV', 'Maldives', array['maldiverna']::text[]),
  ('MLI', 'Mali', '{}'::text[]),
  ('MLT', 'Malta', '{}'::text[]),
  ('MHL', 'Marshall Islands', '{}'::text[]),
  ('MTN', 'Mauritania', array['mauretanien']::text[]),
  ('MRI', 'Mauritius', '{}'::text[]),
  ('MEX', 'Mexico', array['mexiko']::text[]),
  ('FSM', 'Micronesia', '{}'::text[]),
  ('MDA', 'Moldova', array['moldavien']::text[]),
  ('MCO', 'Monaco', '{}'::text[]),
  ('MNG', 'Mongolia', array['mongoliet']::text[]),
  ('MNE', 'Montenegro', '{}'::text[]),
  ('MAR', 'Morocco', array['marocko']::text[]),
  ('MOZ', 'Mozambique', array['moçambique']::text[]),
  ('MYA', 'Myanmar', array['burma']::text[]),
  ('NAM', 'Namibia', '{}'::text[]),
  ('NRU', 'Nauru', '{}'::text[]),
  ('NEP', 'Nepal', '{}'::text[]),
  ('NED', 'Netherlands', array['holland','nederländerna']::text[]),
  ('NZL', 'New Zealand', array['nya zeeland']::text[]),
  ('NCA', 'Nicaragua', '{}'::text[]),
  ('NIG', 'Niger', '{}'::text[]),
  ('NGA', 'Nigeria', '{}'::text[]),
  ('PRK', 'North Korea', array['nordkorea']::text[]),
  ('MKD', 'North Macedonia', array['macedonia','nordmakedonien']::text[]),
  ('NIR', 'Northern Ireland', array['nordirland']::text[]),
  ('NOR', 'Norway', array['norge']::text[]),
  ('OMA', 'Oman', '{}'::text[]),
  ('PAK', 'Pakistan', '{}'::text[]),
  ('PLW', 'Palau', '{}'::text[]),
  ('PLE', 'Palestine', array['palestina']::text[]),
  ('PAN', 'Panama', '{}'::text[]),
  ('PNG', 'Papua New Guinea', '{}'::text[]),
  ('PAR', 'Paraguay', '{}'::text[]),
  ('PER', 'Peru', '{}'::text[]),
  ('PHI', 'Philippines', array['filippinerna']::text[]),
  ('POL', 'Poland', array['polen']::text[]),
  ('POR', 'Portugal', '{}'::text[]),
  ('QAT', 'Qatar', '{}'::text[]),
  ('ROU', 'Romania', array['rumänien']::text[]),
  ('RUS', 'Russia', array['ryssland']::text[]),
  ('RWA', 'Rwanda', '{}'::text[]),
  ('SKN', 'Saint Kitts and Nevis', '{}'::text[]),
  ('LCA', 'Saint Lucia', '{}'::text[]),
  ('VIN', 'Saint Vincent and the Grenadines', '{}'::text[]),
  ('SAM', 'Samoa', '{}'::text[]),
  ('SMR', 'San Marino', '{}'::text[]),
  ('STP', 'São Tomé and Príncipe', '{}'::text[]),
  ('KSA', 'Saudi Arabia', array['saudiarabien']::text[]),
  ('SCO', 'Scotland', array['skottland']::text[]),
  ('SEN', 'Senegal', '{}'::text[]),
  ('SRB', 'Serbia', array['serbien']::text[]),
  ('SEY', 'Seychelles', '{}'::text[]),
  ('SLE', 'Sierra Leone', '{}'::text[]),
  ('SGP', 'Singapore', '{}'::text[]),
  ('SVK', 'Slovakia', array['slovakien']::text[]),
  ('SVN', 'Slovenia', array['slovenien']::text[]),
  ('SOL', 'Solomon Islands', '{}'::text[]),
  ('SOM', 'Somalia', '{}'::text[]),
  ('RSA', 'South Africa', array['sydafrika']::text[]),
  ('KOR', 'South Korea', array['korea','sydkorea']::text[]),
  ('SSD', 'South Sudan', array['sydsudan']::text[]),
  ('ESP', 'Spain', array['spanien']::text[]),
  ('SRI', 'Sri Lanka', '{}'::text[]),
  ('SDN', 'Sudan', '{}'::text[]),
  ('SUR', 'Suriname', '{}'::text[]),
  ('SWE', 'Sweden', array['sverige']::text[]),
  ('SUI', 'Switzerland', array['schweiz']::text[]),
  ('SYR', 'Syria', array['syrien']::text[]),
  ('TPE', 'Taiwan', '{}'::text[]),
  ('TJK', 'Tajikistan', array['tadzjikistan']::text[]),
  ('TAN', 'Tanzania', '{}'::text[]),
  ('THA', 'Thailand', '{}'::text[]),
  ('TLS', 'Timor-Leste', array['east timor','östtimor']::text[]),
  ('TOG', 'Togo', '{}'::text[]),
  ('TGA', 'Tonga', '{}'::text[]),
  ('TRI', 'Trinidad and Tobago', '{}'::text[]),
  ('TUN', 'Tunisia', array['tunisien']::text[]),
  ('TUR', 'Turkey', array['turkiye','turkiet']::text[]),
  ('TKM', 'Turkmenistan', '{}'::text[]),
  ('TUV', 'Tuvalu', '{}'::text[]),
  ('UGA', 'Uganda', '{}'::text[]),
  ('UKR', 'Ukraine', array['ukraina']::text[]),
  ('UAE', 'United Arab Emirates', array['uae','förenade arabemiraten']::text[]),
  ('GBR', 'United Kingdom', array['uk','great britain','storbritannien']::text[]),
  ('USA', 'United States', array['usa','united states of america']::text[]),
  ('URU', 'Uruguay', '{}'::text[]),
  ('UZB', 'Uzbekistan', '{}'::text[]),
  ('VAN', 'Vanuatu', '{}'::text[]),
  ('VAT', 'Vatican City', array['holy see','vatikanstaten']::text[]),
  ('VEN', 'Venezuela', '{}'::text[]),
  ('VIE', 'Vietnam', '{}'::text[]),
  ('WAL', 'Wales', '{}'::text[]),
  ('YEM', 'Yemen', array['jemen']::text[]),
  ('ZAM', 'Zambia', '{}'::text[]),
  ('ZIM', 'Zimbabwe', '{}'::text[])
on conflict (code) do update set name = excluded.name, aliases = excluded.aliases;

insert into ultimate_season.competitions (id, sport, name) values ('ucl', 'football', 'Champions League') on conflict (id) do nothing;

insert into ultimate_season.teams (id, name, country_code, european_cup_finals, rivals) values
  ('zal', 'Žalgiris', 'LTU', null, null),
  ('ham', 'Hamrun Spartans', 'MLT', null, null),
  ('kup', 'KuPS', 'FIN', null, null),
  ('mil', 'Milsami Orhei', 'MDA', null, null),
  ('tns', 'The New Saints', 'WAL', null, null),
  ('shk', 'Shkëndija', 'MKD', null, null),
  ('ibe', 'Iberia 1999', 'GEO', null, null),
  ('mal', 'Malmö FF', 'SWE', array[1979]::int[], null),
  ('lvd', 'FCI Levadia', 'EST', null, null),
  ('rfs', 'RFS', 'LVA', null, null),
  ('dri', 'Drita', 'KOS', null, null),
  ('dif', 'Differdange 03', 'LUX', null, null),
  ('vik', 'Víkingur Gøta', 'FRO', null, null),
  ('lin', 'Lincoln Red Imps', 'GIB', null, null),
  ('egn', 'Egnatia', 'ALB', null, null),
  ('bre', 'Breiðablik', 'ISL', null, null),
  ('she', 'Shelbourne', 'IRL', null, null),
  ('lfd', 'Linfield', 'NIR', null, null),
  ('fcs', 'FCSB', 'ROU', null, null),
  ('esc', 'Inter Club d’Escaldes', 'AND', null, null),
  ('vir', 'Virtus', 'SMR', null, null),
  ('zri', 'Zrinjski Mostar', 'BIH', null, null),
  ('oli', 'Olimpija Ljubljana', 'SVN', null, null),
  ('kai', 'Kairat', 'KAZ', null, array['Astana']::text[]),
  ('noa', 'Noah', 'ARM', null, null),
  ('bud', 'Budućnost Podgorica', 'MNE', null, null),
  ('lud', 'Ludogorets Razgrad', 'BUL', null, null),
  ('din', 'Dinamo Minsk', 'BLR', null, null),
  ('dyn', 'Dynamo Kyiv', 'UKR', null, null),
  ('paf', 'Pafos', 'CYP', null, array['AEL Limassol','Apollon Limassol','APOEL']::text[]),
  ('mac', 'Maccabi Tel Aviv', 'ISR', null, null),
  ('rsb', 'Red Star Belgrade', 'SRB', array[1991]::int[], array['Partizan']::text[]),
  ('fer', 'Ferencváros', 'HUN', null, array['Újpest']::text[]),
  ('lec', 'Lech Poznań', 'POL', null, null),
  ('cop', 'Copenhagen', 'DEN', null, array['Brøndby']::text[]),
  ('rij', 'Rijeka', 'CRO', null, null),
  ('slo', 'Slovan Bratislava', 'SVK', null, null),
  ('qar', 'Qarabağ', 'AZE', null, array['Neftçi']::text[]),
  ('bra', 'Brann', 'NOR', null, null),
  ('sal', 'Red Bull Salzburg', 'AUT', null, null),
  ('plz', 'Viktoria Plzeň', 'CZE', null, null),
  ('ser', 'Servette', 'SUI', null, null),
  ('ran', 'Rangers', 'SCO', null, array['Celtic']::text[]),
  ('pan', 'Panathinaikos', 'GRE', array[1971]::int[], null),
  ('bru', 'Club Brugge', 'BEL', array[1978]::int[], array['Anderlecht','Cercle Brugge']::text[]),
  ('nic', 'Nice', 'FRA', null, null),
  ('ben', 'Benfica', 'POR', array[1961,1962,1963,1965,1968,1988,1990]::int[], array['Sporting CP','Porto']::text[]),
  ('fey', 'Feyenoord', 'NED', array[1970]::int[], null),
  ('fen', 'Fenerbahçe', 'TUR', null, array['Galatasaray']::text[]),
  ('bod', 'Bodø/Glimt', 'NOR', null, array['Tromsø','Rosenborg']::text[]),
  ('stu', 'Sturm Graz', 'AUT', null, array['Grazer AK','Rapid Wien']::text[]),
  ('cel', 'Celtic', 'SCO', array[1967,1970]::int[], array['Rangers']::text[]),
  ('bas', 'Basel', 'SUI', null, array['FC Zürich','Grasshoppers']::text[]),
  ('psg', 'Paris Saint-Germain', 'FRA', array[2020,2025,2026]::int[], null),
  ('mon', 'Monaco', 'FRA', array[2004]::int[], null),
  ('gal', 'Galatasaray', 'TUR', null, null),
  ('juv', 'Juventus', 'ITA', array[1973,1983,1985,1996,1997,1998,2003,2015,2017]::int[], null),
  ('rma', 'Real Madrid', 'ESP', array[1956,1957,1958,1959,1960,1962,1964,1966,1981,1998,2000,2002,2014,2016,2017,2018,2022,2024]::int[], null),
  ('bvb', 'Borussia Dortmund', 'GER', array[1997,2013,2024]::int[], null),
  ('ata', 'Atalanta', 'ITA', null, null),
  ('new', 'Newcastle United', 'ENG', null, null),
  ('atm', 'Atlético Madrid', 'ESP', array[1974,2014,2016]::int[], null),
  ('int', 'Inter', 'ITA', array[1964,1965,1967,1972,2010,2023,2025]::int[], null),
  ('oly', 'Olympiacos', 'GRE', null, null),
  ('b04', 'Bayer Leverkusen', 'GER', array[2002]::int[], null),
  ('che', 'Chelsea', 'ENG', array[2008,2012,2021]::int[], null),
  ('liv', 'Liverpool', 'ENG', array[1977,1978,1981,1984,1985,2005,2007,2018,2019,2022]::int[], null),
  ('mci', 'Manchester City', 'ENG', array[2021,2023]::int[], null),
  ('bay', 'Bayern München', 'GER', array[1974,1975,1976,1982,1987,1999,2001,2010,2012,2013,2020]::int[], null),
  ('bar', 'Barcelona', 'ESP', array[1961,1986,1992,1994,2006,2009,2011,2015]::int[], null),
  ('tot', 'Tottenham Hotspur', 'ENG', array[2019]::int[], null),
  ('spo', 'Sporting CP', 'POR', null, null),
  ('ars', 'Arsenal', 'ENG', array[2006,2026]::int[], null)
on conflict (id) do update set name = excluded.name, country_code = excluded.country_code,
  european_cup_finals = excluded.european_cup_finals, rivals = excluded.rivals;

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

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order, intro) values ('ucl-2025-26', 'q1', 'qualifying', 'First qualifying round', 'Q1', 0, 'The draw for the first qualifying round was held on 17 June 2025. The first legs were played on 8 and 9 July, and the second legs were played on 15 and 16 July 2025.

The winners of the ties advanced to the Champions Path second qualifying round. Twelve of the losing teams were transferred to the [Conference League second qualifying round](https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Conference_League#Second_qualifying_round), and the other two losing teams (selected via a draw) were transferred to the [Conference League third qualifying round](https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Conference_League#Third_qualifying_round).');
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

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order, intro) values ('ucl-2025-26', 'q2', 'qualifying', 'Second qualifying round', 'Q2', 1, 'The draw for the second qualifying round was held on 18 June 2025. The first legs were played on 22 and 23 July, and the second legs were played on 29 and 30 July 2025.

The winners of the ties advanced to the third qualifying round. The losers were transferred to the [Europa League third qualifying round](https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Europa_League#Third_qualifying_round).');
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

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order, intro) values ('ucl-2025-26', 'q3', 'qualifying', 'Third qualifying round', 'Q3', 2, 'The draw for the third qualifying round was held on 21 July 2025. The first legs were played on 5 and 6 August, and the second legs were played on 12 August 2025.

The winners of the ties advanced to the play-off round. The losers of the Champions Path were transferred to the [Europa League play-off round](https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Europa_League#Play-off_round). The losers of the League Path were transferred to the [Europa League league phase](https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Europa_League#League_phase).');
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

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order, intro) values ('ucl-2025-26', 'q_po', 'qualifying', 'Play-off round', 'PO', 3, 'The draw for the play-off round was held on 4 August 2025. The first legs were played on 19 and 20 August, and the second legs were played on 26 and 27 August 2025.

The winners of the ties advanced to the league phase. The losers were transferred to the [Europa League league phase](https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Europa_League_league_phase).');
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q_po'), 0, 'champions', 'fer', 'qar', null, null, 'qar', '4–5', '1–3, 3–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q_po'), 1, 'champions', 'rsb', 'paf', null, null, 'paf', '2–3', '1–2, 1–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q_po'), 2, 'champions', 'bod', 'stu', null, null, 'bod', '6–2', '5–0, 1–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q_po'), 3, 'champions', 'cel', 'kai', null, null, 'kai', '0–0', '0–0, 0–0 a.e.t.', 'Kairat won 3–2 on penalties');
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q_po'), 4, 'champions', 'bas', 'cop', null, null, 'cop', '1–3', '1–1, 0–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q_po'), 5, 'league', 'fen', 'ben', null, null, 'ben', '0–1', '0–0, 0–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'q_po'), 6, 'league', 'ran', 'bru', null, null, 'bru', '1–9', '1–3, 0–6', null);

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order, intro) values ('ucl-2025-26', 'ko_po', 'knockout', 'Knockout phase play-offs', 'KO PO', 4, null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 0, null, 'mon', 'psg', null, null, 'psg', '4–5', '2–3, 2–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 1, null, 'gal', 'juv', null, null, 'gal', '7–5', '5–2, 2–3 a.e.t.', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 2, null, 'ben', 'rma', null, null, 'rma', '1–3', '0–1, 1–2', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 3, null, 'bvb', 'ata', null, null, 'ata', '3–4', '2–0, 1–4', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 4, null, 'qar', 'new', null, null, 'new', '3–9', '1–6, 2–3', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 5, null, 'bru', 'atm', null, null, 'atm', '4–7', '3–3, 1–4', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 6, null, 'bod', 'int', null, null, 'bod', '5–2', '3–1, 2–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'ko_po'), 7, null, 'oly', 'b04', null, null, 'b04', '0–2', '0–2, 0–0', null);

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order, intro) values ('ucl-2025-26', 'r16', 'knockout', 'Round of 16', 'R16', 5, null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 0, null, 'psg', 'che', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 0), null, 'psg', '8–2', '5–2, 3–0', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 1, null, 'gal', 'liv', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 1), null, 'liv', '1–4', '1–0, 0–4', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 2, null, 'rma', 'mci', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 2), null, 'rma', '5–1', '3–0, 2–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 3, null, 'ata', 'bay', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 3), null, 'bay', '2–10', '1–6, 1–4', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 4, null, 'new', 'bar', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 4), null, 'bar', '3–8', '1–1, 2–7', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 5, null, 'atm', 'tot', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 5), null, 'atm', '7–5', '5–2, 2–3', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 6, null, 'bod', 'spo', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 6), null, 'spo', '3–5', '3–0, 0–5 a.e.t.', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'r16'), 7, null, 'b04', 'ars', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'ko_po' and t.sort_order = 7), null, 'ars', '1–3', '1–1, 0–2', null);

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order, intro) values ('ucl-2025-26', 'qf', 'knockout', 'Quarter-finals', 'QF', 6, null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'qf'), 0, null, 'psg', 'liv', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 0), (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 1), 'psg', '4–0', '2–0, 2–0', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'qf'), 1, null, 'rma', 'bay', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 2), (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 3), 'bay', '4–6', '1–2, 3–4', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'qf'), 2, null, 'bar', 'atm', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 4), (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 5), 'atm', '2–3', '0–2, 2–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'qf'), 3, null, 'spo', 'ars', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 6), (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'r16' and t.sort_order = 7), 'ars', '0–1', '0–1, 0–0', null);

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order, intro) values ('ucl-2025-26', 'sf', 'knockout', 'Semi-finals', 'SF', 7, null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'sf'), 0, null, 'psg', 'bay', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'qf' and t.sort_order = 0), (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'qf' and t.sort_order = 1), 'psg', '6–5', '5–4, 1–1', null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'sf'), 1, null, 'atm', 'ars', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'qf' and t.sort_order = 2), (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'qf' and t.sort_order = 3), 'ars', '1–2', '1–1, 0–1', null);

insert into ultimate_season.stages (season_id, code, type, name, short_name, sort_order, intro) values ('ucl-2025-26', 'final', 'knockout', 'Final', 'Final', 8, null);
insert into ultimate_season.ties (stage_id, sort_order, path, team1, team2, team1_from, team2_from, winner, agg_score, legs, note) values ((select id from ultimate_season.stages where season_id = 'ucl-2025-26' and code = 'final'), 0, null, 'psg', 'ars', (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'sf' and t.sort_order = 0), (select t.id from ultimate_season.ties t join ultimate_season.stages s on s.id = t.stage_id where s.season_id = 'ucl-2025-26' and s.code = 'sf' and t.sort_order = 1), 'psg', '1–1', null, 'PSG won 4–3 on penalties');

commit;
