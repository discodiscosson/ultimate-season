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
}
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
 'teams':{k:{'name':v[0],'country':v[1]} for k,v in TEAMS.items()},
 'leaguePosition':POS,
 'stages':[{'id':i,'type':'qualifying','name':n,'short':s,'ties':t} for i,n,s,t in Q]
         +[{'id':i,'type':'knockout','name':n,'short':s,'ties':t} for i,n,s,t in KO],
}

if __name__ == '__main__':
    json.dump(season, open('data/seasons/ucl-2025-26.json','w'), ensure_ascii=False, indent=1)
    json.dump({'competitions':[{'id':'ucl','sport':'football','name':'Champions League',
               'seasons':[{'id':'ucl-2025-26','label':'2025/26'}]}]},
              open('data/index.json','w'), ensure_ascii=False, indent=1)
    print('ok', len(TEAMS), 'teams')
