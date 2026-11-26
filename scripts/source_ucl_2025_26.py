# Source data for UCL 2025/26 (entered from Wikipedia). Generates data/seasons/ucl-2025-26.json and data/index.json.
# Run from the repo root: python3 scripts/source_ucl_2025_26.py
import json

TEAMS = {
 # qualifying
 'zal':('Žalgiris','LTU'),'ham':('Hamrun Spartans','MLT'),'kup':('KuPS','FIN'),'mil':('Milsami Orhei','MDA'),
 'tns':('The New Saints','WAL'),'shk':('Shkëndija','MKD'),'ibe':('Iberia 1999','GEO'),'mal':('Malmö FF','SWE'),
 'lvd':('FCI Levadia','EST'),'rfs':('RFS','LVA'),'dri':('Drita','KOS'),'dif':('Differdange 03','LUX'),
 'vik':('Víkingur Gøta','FRO'),'lin':('Lincoln Red Imps','GIB'),'egn':('Egnatia','ALB'),'bre':('Breiðablik','ISL'),
 'she':('Shelbourne','IRL'),'lfd':('Linfield','NIR'),'fcs':('FCSB','ROU'),'esc':('Inter Club d’Escaldes','AND'),
 'vir':('Virtus','SMR'),'zri':('Zrinjski Mostar','BIH'),'oli':('Olimpija Ljubljana','SVN'),'kai':('Kairat','KAZ'),
 'noa':('Noah','ARM'),'bud':('Budućnost Podgorica','MNE'),'lud':('Ludogorets Razgrad','BUL'),'din':('Dinamo Minsk','BLR'),
 'dyn':('Dynamo Kyiv','UKR'),'paf':('Pafos','CYP'),'mac':('Maccabi Tel Aviv','ISR'),'rsb':('Red Star Belgrade','SRB'),
 'fer':('Ferencváros','HUN'),'lec':('Lech Poznań','POL'),'cop':('Copenhagen','DEN'),'rij':('Rijeka','CRO'),
 'slo':('Slovan Bratislava','SVK'),'qar':('Qarabağ','AZE'),'bra':('Brann','NOR'),'sal':('Red Bull Salzburg','AUT'),
 'plz':('Viktoria Plzeň','CZE'),'ser':('Servette','SUI'),'ran':('Rangers','SCO'),'pan':('Panathinaikos','GRE'),
 'bru':('Club Brugge','BEL'),'nic':('Nice','FRA'),'ben':('Benfica','POR'),'fey':('Feyenoord','NED'),'fen':('Fenerbahçe','TUR'),
 'bod':('Bodø/Glimt','NOR'),'stu':('Sturm Graz','AUT'),'cel':('Celtic','SCO'),'bas':('Basel','SUI'),
 # knockout phase
 'psg':('Paris Saint-Germain','FRA'),'mon':('Monaco','FRA'),'gal':('Galatasaray','TUR'),'juv':('Juventus','ITA'),
 'rma':('Real Madrid','ESP'),'bvb':('Borussia Dortmund','GER'),'ata':('Atalanta','ITA'),'new':('Newcastle United','ENG'),
 'atm':('Atlético Madrid','ESP'),'int':('Inter','ITA'),'oly':('Olympiacos','GRE'),'b04':('Bayer Leverkusen','GER'),
 'che':('Chelsea','ENG'),'liv':('Liverpool','ENG'),'mci':('Manchester City','ENG'),'bay':('Bayern München','GER'),
 'bar':('Barcelona','ESP'),'tot':('Tottenham Hotspur','ENG'),'spo':('Sporting CP','POR'),'ars':('Arsenal','ENG'),
 # league phase only
 'nap':('Napoli','ITA'),'ath':('Athletic Club','ESP'),'vil':('Villarreal','ESP'),'sge':('Eintracht Frankfurt','GER'),
 'om':('Marseille','FRA'),'psv':('PSV Eindhoven','NED'),'aja':('Ajax','NED'),'usg':('Union Saint-Gilloise','BEL'),
 'sla':('Slavia Prague','CZE'),
}

# Home city and stadium coordinates (lat, lon) for the map. Qarabağ play their home games in Baku.
CITY = {
 'liv':('Liverpool',53.431,-2.961),'ars':('London',51.555,-0.108),'che':('London',51.482,-0.191),'tot':('London',51.604,-0.066),
 'mci':('Manchester',53.483,-2.200),'new':('Newcastle',54.976,-1.622),
 'rma':('Madrid',40.453,-3.688),'atm':('Madrid',40.436,-3.599),'bar':('Barcelona',41.381,2.123),'ath':('Bilbao',43.264,-2.949),
 'vil':('Villarreal',39.944,-0.103),
 'nap':('Naples',40.828,14.193),'int':('Milan',45.478,9.124),'juv':('Turin',45.109,7.641),'ata':('Bergamo',45.709,9.681),
 'bay':('Munich',48.219,11.625),'b04':('Leverkusen',51.038,7.002),'bvb':('Dortmund',51.493,7.452),'sge':('Frankfurt',50.069,8.645),
 'psg':('Paris',48.841,2.253),'om':('Marseille',43.270,5.396),'mon':('Monaco',43.728,7.416),
 'psv':('Eindhoven',51.442,5.467),'aja':('Amsterdam',52.314,4.942),
 'spo':('Lisbon',38.761,-9.161),'ben':('Lisbon',38.753,-9.185),
 'usg':('Brussels',50.818,4.329),'bru':('Bruges',51.193,3.181),
 'gal':('Istanbul',41.103,28.991),'sla':('Prague',50.068,14.471),'oly':('Piraeus',37.946,23.664),'cop':('Copenhagen',55.703,12.572),
 'bod':('Bodø',67.276,14.383),'qar':('Baku',40.430,49.920),'paf':('Paphos',34.772,32.424),'kai':('Almaty',43.240,76.920),
}
# League phase results: (home, home goals, away goals, away). Line-ups go in LINEUPS (see below) when added.
MATCHDAYS = [
 (1, 'Matchday 1', [
  ('ath',0,2,'ars'),('psv',1,3,'usg'),('juv',4,4,'bvb'),('rma',2,1,'om'),('ben',2,3,'qar'),('tot',1,0,'vil'),
  ('oly',0,0,'paf'),('sla',2,2,'bod'),('aja',0,2,'int'),('bay',3,1,'che'),('liv',3,2,'atm'),('psg',4,0,'ata'),
  ('bru',4,1,'mon'),('cop',2,2,'b04'),('sge',5,1,'gal'),('mci',2,0,'nap'),('new',1,2,'bar'),('spo',4,1,'kai')]),
 (2, 'Matchday 2', [
  ('ata',2,1,'bru'),('kai',0,5,'rma'),('atm',5,1,'sge'),('che',1,0,'ben'),('int',3,0,'sla'),('bod',2,2,'tot'),
  ('gal',1,0,'liv'),('om',4,0,'aja'),('paf',1,5,'bay'),('qar',2,0,'cop'),('usg',0,4,'new'),('ars',2,0,'oly'),
  ('mon',2,2,'mci'),('b04',1,1,'psv'),('bvb',4,1,'ath'),('bar',1,2,'psg'),('nap',2,1,'spo'),('vil',2,2,'juv')]),
 (3, 'Matchday 3', [
  ('bar',6,1,'oly'),('kai',0,0,'paf'),('ars',4,0,'atm'),('b04',2,7,'psg'),('cop',2,4,'bvb'),('new',3,0,'ben'),
  ('psv',6,2,'nap'),('usg',0,4,'int'),('vil',0,2,'mci'),('ath',3,1,'qar'),('gal',3,1,'bod'),('mon',0,0,'tot'),
  ('ata',0,0,'sla'),('che',5,1,'aja'),('sge',1,5,'liv'),('bay',4,0,'bru'),('rma',1,0,'juv'),('spo',2,1,'om')]),
 (4, 'Matchday 4', [
  ('sla',0,3,'ars'),('nap',0,0,'sge'),('atm',3,1,'usg'),('bod',0,1,'mon'),('juv',1,1,'spo'),('liv',1,0,'rma'),
  ('oly',1,1,'psv'),('psg',1,2,'bay'),('tot',4,0,'cop'),('paf',1,0,'vil'),('qar',2,2,'che'),('aja',0,3,'gal'),
  ('bru',3,3,'bar'),('int',2,1,'kai'),('mci',4,1,'bvb'),('new',2,0,'ath'),('om',0,1,'ata'),('ben',0,1,'b04')]),
 (5, 'Matchday 5', [
  ('aja',0,2,'ben'),('gal',0,1,'usg'),('bvb',4,0,'vil'),('che',3,0,'bar'),('bod',2,3,'juv'),('mci',0,2,'b04'),
  ('om',2,1,'new'),('sla',0,0,'ath'),('nap',2,0,'qar'),('cop',3,2,'kai'),('paf',2,2,'mon'),('ars',3,1,'bay'),
  ('atm',2,1,'int'),('sge',0,3,'ata'),('liv',1,4,'psv'),('oly',3,4,'rma'),('psg',5,3,'tot'),('spo',3,0,'bru')]),
 (6, 'Matchday 6', [
  ('kai',0,1,'oly'),('bay',3,1,'spo'),('mon',1,0,'gal'),('ata',2,1,'che'),('bar',2,1,'sge'),('int',0,1,'liv'),
  ('psv',2,3,'atm'),('usg',2,3,'om'),('tot',3,0,'sla'),('qar',2,4,'aja'),('vil',2,3,'cop'),('ath',0,0,'psg'),
  ('b04',2,2,'new'),('bvb',2,2,'bod'),('bru',0,3,'ars'),('juv',2,0,'paf'),('rma',1,2,'mci'),('ben',2,0,'nap')]),
 (7, 'Matchday 7', [
  ('kai',1,4,'bru'),('bod',3,1,'mci'),('cop',1,1,'nap'),('int',1,3,'ars'),('oly',2,0,'b04'),('rma',6,1,'mon'),
  ('spo',2,1,'psg'),('tot',2,0,'bvb'),('vil',1,2,'aja'),('gal',1,1,'atm'),('qar',3,2,'sge'),('ata',2,3,'ath'),
  ('che',1,0,'paf'),('bay',2,0,'usg'),('juv',2,0,'ben'),('new',3,0,'psv'),('om',0,3,'liv'),('sla',2,4,'bar')]),
 (8, 'Matchday 8', [
  ('aja',1,2,'oly'),('ars',3,2,'kai'),('mon',0,0,'juv'),('ath',2,3,'spo'),('atm',1,2,'bod'),('b04',3,0,'vil'),
  ('bvb',0,2,'int'),('bru',3,0,'om'),('sge',0,2,'tot'),('bar',4,1,'cop'),('liv',6,0,'qar'),('mci',2,0,'gal'),
  ('paf',4,1,'sla'),('psg',1,1,'new'),('psv',1,2,'bay'),('usg',1,0,'ata'),('ben',4,2,'rma'),('nap',2,3,'che')]),
]
# Starting XIs per match, keyed by (matchday, home, away): {'home': [11 names], 'away': [11 names]}, goalkeeper first.
# Empty for now: the Missing XI game shows a placeholder until a match has line-ups.
LINEUPS = {}

# Top goalscorers (whole competition proper): rank, player, nationality, team, goals, minutes, accepted answers
TOP_SCORERS = [
 (1,'Kylian Mbappé','FRA','rma',15,912,['mbappe','kylian mbappe']),
 (2,'Harry Kane','ENG','bay',14,1039,['kane','harry kane']),
 (3,'Anthony Gordon','ENG','new',10,771,['gordon','anthony gordon']),
 (3,'Khvicha Kvaratskhelia','GEO','psg',10,1141,['kvaratskhelia','kvara','khvicha kvaratskhelia']),
 (3,'Julián Alvarez','ARG','atm',10,1240,['alvarez','julian alvarez']),
 (6,'Erling Haaland','NOR','mci',8,756,['haaland','erling haaland']),
 (6,'Ousmane Dembélé','FRA','psg',8,827,['dembele','ousmane dembele']),
 (8,'Victor Osimhen','NGA','gal',7,841,['osimhen','victor osimhen']),
 (8,'Luis Díaz','COL','bay',7,980,['diaz','luis diaz']),
]

LEAGUE_TEAMS = ['liv','ars','mci','che','new','tot','rma','bar','atm','ath','vil','nap','int','juv','ata',
 'bay','b04','bvb','sge','psg','om','mon','psv','aja','spo','ben','usg','bru','gal','sla','oly','cop','bod','qar','paf','kai']
# European Cup / Champions League finals played (years of the final). Only teams with at least one final are listed.
FINALS = {'ben':[1961,1962,1963,1965,1968,1988,1990],'cel':[1967,1970],'fey':[1970],'pan':[1971],
 'bru':[1978],'mal':[1979],'rsb':[1991],
 'psg':[2020,2025,2026],'ars':[2006,2026],'bay':[1974,1975,1976,1982,1987,1999,2001,2010,2012,2013,2020],
 'rma':[1956,1957,1958,1959,1960,1962,1964,1966,1981,1998,2000,2002,2014,2016,2017,2018,2022,2024],
 'bar':[1961,1986,1992,1994,2006,2009,2011,2015],'atm':[1974,2014,2016],'liv':[1977,1978,1981,1984,1985,2005,2007,2018,2019,2022],
 'che':[2008,2012,2021],'mci':[2021,2023],'tot':[2019],'juv':[1973,1983,1985,1996,1997,1998,2003,2015,2017],
 'int':[1964,1965,1967,1972,2010,2023,2025],'bvb':[1997,2013,2024],'b04':[2002],'mon':[2004]}
# Biggest rival(s): accepted answers in the rival game. Names must match js/lib/clubs.js.
RIVALS = {'fer':['Újpest'],'qar':['Neftçi'],'rsb':['Partizan'],'paf':['AEL Limassol','Apollon Limassol','APOEL'],
 'bod':['Tromsø','Rosenborg'],'stu':['Grazer AK','Rapid Wien'],'cel':['Rangers'],'kai':['Astana'],
 'bas':['FC Zürich','Grasshoppers'],'cop':['Brøndby'],'fen':['Galatasaray'],'ben':['Sporting CP','Porto'],
 'ran':['Celtic'],'bru':['Anderlecht','Cercle Brugge']}

# League phase position (only known for the teams that reached the knockout phase so far)
POS = {'ars':1,'bay':2,'liv':3,'tot':4,'bar':5,'che':6,'spo':7,'mci':8,'rma':9,'int':10,'psg':11,'new':12,'juv':13,
 'atm':14,'ata':15,'b04':16,'bvb':17,'oly':18,'bru':19,'gal':20,'mon':21,'qar':22,'bod':23,'ben':24}

# Rows: (team 1, team 2, winner, aggregate team1–team2, legs team1–team2, [note])
def fixed(rows, path=None):
    return [dict(path=path, slots=[{'team':a},{'team':b}], winner=w, agg=agg, legs=legs, note=(n[0] if n else None))
            for a,b,w,agg,legs,*n in rows]

def ko(rows, slots):
    return [dict(path=None, slots=s, winner=w, agg=agg, legs=legs, note=(n[0] if n else None))
            for s,(w,agg,legs,*n) in zip(slots, rows)]

Q = [
 ('q1','First qualifying round','Q1', fixed([
  ('zal','ham','ham','2–2','2–0, 0–2 a.e.t.','Hamrun Spartans won 11–10 on penalties'),('kup','mil','kup','1–0','1–0, 0–0'),
  ('tns','shk','shk','1–2','0–0, 1–2 a.e.t.'),('ibe','mal','mal','2–6','1–3, 1–3'),('lvd','rfs','rfs','0–2','0–1, 0–1'),
  ('dri','dif','dri','4–2','1–0, 3–2'),('vik','lin','lin','2–4','2–3, 0–1'),('egn','bre','bre','1–5','1–0, 0–5'),
  ('she','lfd','she','2–1','1–0, 1–1'),('fcs','esc','fcs','4–3','3–1, 1–2'),('vir','zri','zri','1–4','0–2, 1–2'),
  ('oli','kai','kai','1–3','1–1, 0–2'),('noa','bud','noa','3–2','1–0, 2–2'),('lud','din','lud','3–2','1–0, 2–2 a.e.t.')])),
 ('q2','Second qualifying round','Q2', fixed([
  ('rfs','mal','mal','1–5','1–4, 0–1'),('ham','dyn','dyn','0–6','0–3, 0–3'),('paf','mac','paf','2–1','1–1, 1–0'),
  ('lin','rsb','rsb','1–6','0–1, 1–5'),('noa','fer','fer','4–6','1–2, 3–4'),('lec','bre','lec','8–1','7–1, 1–0'),
  ('cop','dri','cop','3–0','2–0, 1–0'),('rij','lud','lud','1–3','0–0, 1–3 a.e.t.'),('shk','fcs','shk','3–1','1–0, 2–1'),
  ('slo','zri','slo','6–2','4–0, 2–2'),('she','qar','qar','0–4','0–3, 0–1'),('kup','kai','kai','2–3','2–0, 0–3')],'champions')
  + fixed([('bra','sal','sal','2–5','1–4, 1–1'),('plz','ser','plz','3–2','0–1, 3–1'),('ran','pan','ran','3–1','2–0, 1–1')],'league')),
 ('q3','Third qualifying round','Q3', fixed([
  ('mal','cop','cop','0–5','0–0, 0–5'),('kai','slo','kai','1–1','1–0, 0–1 a.e.t.','Kairat won 4–3 on penalties'),
  ('lec','rsb','rsb','2–4','1–3, 1–1'),('lud','fer','fer','0–3','0–0, 0–3'),('dyn','paf','paf','0–3','0–1, 0–2'),
  ('shk','qar','qar','1–6','0–1, 1–5')],'champions')
  + fixed([('sal','bru','bru','2–4','0–1, 2–3'),('ran','plz','ran','4–2','3–0, 1–2'),('nic','ben','ben','0–4','0–2, 0–2'),
  ('fey','fen','fen','4–6','2–1, 2–5')],'league')),
 ('q_po','Play-off round','PO', fixed([
  ('fer','qar','qar','4–5','1–3, 3–2'),('rsb','paf','paf','2–3','1–2, 1–1'),('bod','stu','bod','6–2','5–0, 1–2'),
  ('cel','kai','kai','0–0','0–0, 0–0 a.e.t.','Kairat won 3–2 on penalties'),('bas','cop','cop','1–3','1–1, 0–2')],'champions')
  + fixed([('fen','ben','ben','0–1','0–0, 0–1'),('ran','bru','bru','1–9','1–3, 0–6')],'league')),
]

# Story text shown before a round. Paragraphs are separated by a blank line; links use [text](url).
INTROS = {
 'q1': "The draw for the first qualifying round was held on 17 June 2025. The first legs were played on 8 and 9 July, "
       "and the second legs were played on 15 and 16 July 2025.\n\n"
       "The winners of the ties advanced to the Champions Path second qualifying round. Twelve of the losing teams were "
       "transferred to the [Conference League second qualifying round](https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Conference_League#Second_qualifying_round), "
       "and the other two losing teams (selected via a draw) were transferred to the "
       "[Conference League third qualifying round](https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Conference_League#Third_qualifying_round).",
 'q2': "The draw for the second qualifying round was held on 18 June 2025. The first legs were played on 22 and 23 July, "
       "and the second legs were played on 29 and 30 July 2025.\n\n"
       "The winners of the ties advanced to the third qualifying round. The losers were transferred to the "
       "[Europa League third qualifying round](https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Europa_League#Third_qualifying_round).",
 'q3': "The draw for the third qualifying round was held on 21 July 2025. The first legs were played on 5 and 6 August, "
       "and the second legs were played on 12 August 2025.\n\n"
       "The winners of the ties advanced to the play-off round. The losers of the Champions Path were transferred to the "
       "[Europa League play-off round](https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Europa_League#Play-off_round). "
       "The losers of the League Path were transferred to the "
       "[Europa League league phase](https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Europa_League#League_phase).",
 'q_po': "The draw for the play-off round was held on 4 August 2025. The first legs were played on 19 and 20 August, "
         "and the second legs were played on 26 and 27 August 2025.\n\n"
         "The winners of the ties advanced to the league phase. The losers were transferred to the "
         "[Europa League league phase](https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Europa_League_league_phase).",
}

SEEDED = ['che','liv','mci','bay','bar','tot','spo','ars']
KO = [
 ('ko_po','Knockout phase play-offs','KO PO', fixed([
  ('mon','psg','psg','4–5','2–3, 2–2'),('gal','juv','gal','7–5','5–2, 2–3 a.e.t.'),('ben','rma','rma','1–3','0–1, 1–2'),
  ('bvb','ata','ata','3–4','2–0, 1–4'),('qar','new','new','3–9','1–6, 2–3'),('bru','atm','atm','4–7','3–3, 1–4'),
  ('bod','int','bod','5–2','3–1, 2–1'),('oly','b04','b04','0–2','0–2, 0–0')])),
 ('r16','Round of 16','R16', ko([('psg','8–2','5–2, 3–0'),('liv','1–4','1–0, 0–4'),('rma','5–1','3–0, 2–1'),
  ('bay','2–10','1–6, 1–4'),('bar','3–8','1–1, 2–7'),('atm','7–5','5–2, 2–3'),('spo','3–5','3–0, 0–5 a.e.t.'),('ars','1–3','1–1, 0–2')],
  [[{'from':f'ko_po:{i}'},{'team':SEEDED[i]}] for i in range(8)])),
 ('qf','Quarter-finals','QF', ko([('psg','4–0','2–0, 2–0'),('bay','4–6','1–2, 3–4'),('atm','2–3','0–2, 2–1'),('ars','0–1','0–1, 0–0')],
  [[{'from':f'r16:{2*i}'},{'from':f'r16:{2*i+1}'}] for i in range(4)])),
 ('sf','Semi-finals','SF', ko([('psg','6–5','5–4, 1–1'),('ars','1–2','1–1, 0–1')],
  [[{'from':f'qf:{2*i}'},{'from':f'qf:{2*i+1}'}] for i in range(2)])),
 ('final','Final','Final', ko([('psg','1–1',None,'PSG won 4–3 on penalties')],[[{'from':'sf:0'},{'from':'sf:1'}]])),
]

season = {
 'id':'ucl-2025-26','label':'2025/26',
 'competition':{'id':'ucl','name':'Champions League','sport':'football'},
 'final':{'date':'2026-05-30','city':'Budapest','country':'HUN','venue':'Puskás Aréna'},
 'teams':{k:{'name':v[0],'country':v[1], **({'finals':FINALS[k]} if k in FINALS else {}), **({'rivals':RIVALS[k]} if k in RIVALS else {}),
              **({'city':CITY[k][0],'lat':CITY[k][1],'lon':CITY[k][2]} if k in CITY else {})}
          for k,v in TEAMS.items()},
 'topScorers':[{'rank':r,'name':n,'nat':c,'team':t,'goals':g,'minutes':m,'aliases':al} for r,n,c,t,g,m,al in TOP_SCORERS],
 'leaguePhase':{'teams':LEAGUE_TEAMS,'matchdays':[{'n':n,'name':name,'matches':[
     {'home':h,'away':a,'score':[hg,ag], **({'lineups':LINEUPS[(n,h,a)]} if (n,h,a) in LINEUPS else {})} for h,hg,ag,a in ms]}
   for n,name,ms in MATCHDAYS]},
 'leaguePosition':POS,
 'stages':[{'id':i,'type':'qualifying','name':n,'short':s,**({'intro':INTROS[i]} if i in INTROS else {}),'ties':t} for i,n,s,t in Q]
         +[{'id':i,'type':'knockout','name':n,'short':s,**({'intro':INTROS[i]} if i in INTROS else {}),'ties':t} for i,n,s,t in KO],
}

if __name__ == '__main__':
    json.dump(season, open('data/seasons/ucl-2025-26.json','w'), ensure_ascii=False, indent=1)
    json.dump({'competitions':[{'id':'ucl','sport':'football','name':'Champions League',
               'seasons':[{'id':'ucl-2025-26','label':'2025/26'}]}]},
              open('data/index.json','w'), ensure_ascii=False, indent=1)
    print('ok', len(TEAMS), 'teams')
