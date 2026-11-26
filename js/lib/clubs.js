// European clubs for the club dropdown. Format: [name, country code, ...aliases].
// Not every club in Europe, but every top-flight regular in the big leagues and the main clubs elsewhere.
// Add clubs freely; the name is the id, so it must match answers in the season data (e.g. rivals).
import { norm } from './countries.js';

const RAW = {
  ENG: ['Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', ['Brighton & Hove Albion', 'brighton'], 'Burnley', 'Chelsea',
    'Crystal Palace', 'Everton', 'Fulham', 'Leeds United', 'Leicester City', 'Liverpool', ['Manchester City', 'man city'],
    ['Manchester United', 'man united', 'man utd'], 'Newcastle United', 'Nottingham Forest', 'Southampton', 'Sunderland',
    ['Tottenham Hotspur', 'tottenham', 'spurs'], 'West Ham United', ['Wolverhampton Wanderers', 'wolves'], 'Ipswich Town',
    'Middlesbrough', 'Sheffield United', 'Sheffield Wednesday', 'Blackburn Rovers', 'Derby County', 'Millwall',
    'West Bromwich Albion', 'Birmingham City', 'Coventry City', 'Stoke City', 'Norwich City', 'Portsmouth', 'Queens Park Rangers'],
  ESP: ['Real Madrid', 'Barcelona', ['Atlético Madrid', 'atletico'], ['Athletic Club', 'athletic bilbao'], 'Real Sociedad', 'Sevilla',
    'Real Betis', 'Valencia', 'Villarreal', 'Celta Vigo', 'Espanyol', 'Getafe', 'Osasuna', 'Rayo Vallecano', 'Mallorca', 'Girona',
    'Alavés', 'Elche', 'Levante', 'Real Oviedo', 'Deportivo La Coruña', 'Real Zaragoza', 'Las Palmas', 'Real Valladolid'],
  ITA: [['Inter', 'inter milan', 'internazionale'], ['AC Milan', 'milan'], 'Juventus', 'Napoli', 'Roma', 'Lazio', 'Atalanta', 'Fiorentina',
    'Bologna', 'Torino', 'Genoa', 'Sampdoria', 'Udinese', 'Lecce', 'Cagliari', 'Hellas Verona', 'Parma', 'Como', 'Sassuolo',
    'Cremonese', 'Pisa', 'Empoli', 'Monza', 'Palermo', 'Bari'],
  GER: [['Bayern München', 'bayern munich', 'bayern'], ['Borussia Dortmund', 'dortmund', 'bvb'], ['Bayer Leverkusen', 'leverkusen'],
    'RB Leipzig', 'Eintracht Frankfurt', 'VfB Stuttgart', ['Borussia Mönchengladbach', 'gladbach'], 'VfL Wolfsburg', 'Werder Bremen',
    'SC Freiburg', 'Union Berlin', 'Mainz 05', 'Hoffenheim', 'FC Augsburg', ['1. FC Köln', 'koln', 'cologne'], 'Hamburger SV',
    'Heidenheim', 'St. Pauli', 'Schalke 04', 'Hertha BSC', '1. FC Nürnberg', '1. FC Kaiserslautern', 'Hannover 96',
    'Fortuna Düsseldorf', '1860 München'],
  FRA: [['Paris Saint-Germain', 'psg', 'paris sg'], ['Marseille', 'olympique de marseille', 'om'], ['Lyon', 'olympique lyonnais', 'ol'],
    'Monaco', 'Lille', 'Nice', 'Lens', 'Rennes', 'Strasbourg', 'Nantes', 'Toulouse', 'Brest', 'Auxerre', 'Angers', 'Le Havre',
    'Lorient', 'Metz', 'Paris FC', 'Saint-Étienne', 'Bordeaux', 'Montpellier', 'Reims'],
  POR: ['Benfica', 'Porto', ['Sporting CP', 'sporting', 'sporting lisbon'], 'Braga', ['Vitória de Guimarães', 'guimaraes'], 'Boavista',
    'Rio Ave', 'Famalicão', 'Gil Vicente', 'Moreirense', 'Estoril', 'Casa Pia', 'Arouca', 'Santa Clara', 'Nacional', 'Marítimo', 'Belenenses'],
  NED: ['Ajax', 'PSV', 'Feyenoord', 'AZ', 'FC Twente', 'FC Utrecht', 'Sparta Rotterdam', 'Heerenveen', 'NEC', 'Go Ahead Eagles',
    'Vitesse', 'FC Groningen', 'Willem II', 'Fortuna Sittard', 'PEC Zwolle', 'Excelsior', 'Heracles Almelo'],
  BEL: ['Club Brugge', 'Anderlecht', ['Standard Liège', 'standard'], 'Genk', 'Gent', 'Antwerp', ['Union Saint-Gilloise', 'union sg'],
    'Cercle Brugge', 'Mechelen', 'Charleroi', 'Westerlo', 'OH Leuven', 'Sint-Truiden', 'Beerschot'],
  SCO: ['Celtic', 'Rangers', 'Aberdeen', ['Heart of Midlothian', 'hearts'], ['Hibernian', 'hibs'], 'Dundee United', 'Dundee', 'Motherwell',
    'Kilmarnock', 'St Mirren', 'Livingston', 'Falkirk', 'St Johnstone', 'Ross County'],
  TUR: ['Galatasaray', 'Fenerbahçe', 'Beşiktaş', 'Trabzonspor', 'Başakşehir', 'Samsunspor', 'Göztepe', 'Kasımpaşa', 'Konyaspor',
    'Antalyaspor', 'Kayserispor', 'Alanyaspor', 'Sivasspor', 'Bursaspor'],
  AUT: [['Red Bull Salzburg', 'salzburg'], 'Rapid Wien', 'Austria Wien', 'Sturm Graz', ['Grazer AK', 'gak'], 'LASK', 'Wolfsberger AC',
    'Hartberg', 'Rheindorf Altach', 'WSG Tirol', 'Blau-Weiß Linz', 'Admira Wacker'],
  SUI: ['Basel', 'Young Boys', ['FC Zürich', 'zurich', 'fcz'], ['Grasshoppers', 'grasshopper club zurich'], 'Servette', 'Lugano',
    'St. Gallen', 'Luzern', 'Lausanne-Sport', 'Sion', 'Thun', 'Winterthur'],
  DEN: [['Copenhagen', 'fc kobenhavn', 'fc copenhagen', 'kobenhavn'], 'Brøndby', 'Midtjylland', 'AGF', 'Nordsjælland', 'Randers',
    'Silkeborg', 'Viborg', 'OB', 'AaB', 'Vejle', 'Sønderjyske'],
  SWE: ['Malmö FF', 'AIK', 'Djurgården', 'Hammarby', 'IFK Göteborg', 'Häcken', 'Elfsborg', 'Mjällby', 'Sirius', 'GAIS',
    'IFK Norrköping', 'Kalmar FF', 'Halmstad', 'Örgryte', 'Västerås SK', 'Degerfors', 'Brommapojkarna', 'Helsingborg'],
  NOR: [['Bodø/Glimt', 'bodo glimt'], 'Rosenborg', 'Molde', 'Brann', 'Viking', 'Vålerenga', 'Lillestrøm', 'Tromsø', 'Sarpsborg 08',
    'Strømsgodset', 'Fredrikstad', 'Odd', 'Sandefjord', 'HamKam', 'KFUM Oslo'],
  FIN: ['HJK', 'KuPS', 'SJK', 'Inter Turku', 'Ilves', 'FC Lahti', 'Haka', 'VPS'],
  ISL: ['Breiðablik', 'Víkingur Reykjavík', 'KR', 'Valur', 'FH', 'Stjarnan'],
  IRL: ['Shelbourne', 'Shamrock Rovers', 'Bohemians', "St Patrick's Athletic", 'Derry City', 'Dundalk', 'Sligo Rovers'],
  NIR: ['Linfield', 'Glentoran', 'Larne', 'Cliftonville', 'Crusaders', 'Coleraine'],
  WAL: ['The New Saints', "Connah's Quay Nomads", 'Bala Town', 'Penybont', 'Caernarfon Town'],
  GRE: ['Olympiacos', 'Panathinaikos', 'AEK Athens', 'PAOK', 'Aris', 'Asteras Tripolis', 'OFI', 'Volos'],
  CYP: ['Pafos', 'APOEL', 'Omonia', 'AEL Limassol', 'Apollon Limassol', 'Anorthosis', 'Aris Limassol', 'AEK Larnaca'],
  ISR: ['Maccabi Tel Aviv', 'Maccabi Haifa', "Hapoel Be'er Sheva", 'Hapoel Tel Aviv', 'Beitar Jerusalem'],
  SRB: [['Red Star Belgrade', 'crvena zvezda', 'red star'], 'Partizan', 'Vojvodina', 'Čukarički', 'TSC'],
  CRO: ['Dinamo Zagreb', 'Hajduk Split', 'Rijeka', 'Osijek', 'Lokomotiva Zagreb'],
  HUN: ['Ferencváros', 'Újpest', 'Puskás Akadémia', 'Paks', 'MTK Budapest', 'Debrecen', 'Fehérvár', 'Győr'],
  POL: ['Lech Poznań', ['Legia Warsaw', 'legia warszawa'], 'Raków Częstochowa', 'Jagiellonia Białystok', 'Pogoń Szczecin',
    'Wisła Kraków', 'Cracovia', 'Górnik Zabrze', 'Śląsk Wrocław', 'Widzew Łódź'],
  CZE: [['Sparta Prague', 'sparta praha'], ['Slavia Prague', 'slavia praha'], 'Viktoria Plzeň', 'Baník Ostrava', 'Slovan Liberec',
    'Sigma Olomouc', 'Mladá Boleslav'],
  SVK: ['Slovan Bratislava', 'Spartak Trnava', 'DAC Dunajská Streda', 'Žilina', 'Podbrezová'],
  SVN: ['Olimpija Ljubljana', 'Maribor', 'Celje', 'Koper', 'Mura'],
  BIH: ['Zrinjski Mostar', 'Velež Mostar', 'Sarajevo', 'Željezničar', 'Borac Banja Luka'],
  MNE: ['Budućnost Podgorica', 'Sutjeska Nikšić', 'Dečić'],
  MKD: ['Shkëndija', 'Vardar', 'Struga', 'Shkupi'],
  ALB: ['Egnatia', 'Partizani', 'Tirana', 'Vllaznia', 'Skënderbeu'],
  KOS: ['Drita', 'Ballkani', 'Prishtina', 'Llapi'],
  BUL: ['Ludogorets Razgrad', 'CSKA Sofia', 'Levski Sofia', 'Lokomotiv Plovdiv', 'Botev Plovdiv'],
  ROU: ['FCSB', 'CFR Cluj', 'Universitatea Craiova', 'Rapid București', 'Dinamo București', 'Farul Constanța', 'Universitatea Cluj'],
  MDA: ['Milsami Orhei', 'Sheriff Tiraspol', 'Petrocub', 'Zimbru Chișinău'],
  UKR: ['Dynamo Kyiv', 'Shakhtar Donetsk', 'Zorya Luhansk', 'Polissya Zhytomyr', 'Oleksandriya', 'Metalist Kharkiv', 'Dnipro-1'],
  BLR: ['Dinamo Minsk', 'BATE Borisov', 'Shakhtyor Soligorsk', 'Neman Grodno'],
  RUS: [['Zenit', 'zenit st petersburg'], 'Spartak Moscow', 'CSKA Moscow', 'Lokomotiv Moscow', 'Dynamo Moscow', 'Krasnodar', 'Rostov'],
  GEO: ['Iberia 1999', 'Dinamo Tbilisi', 'Dinamo Batumi', 'Torpedo Kutaisi', 'Saburtalo'],
  ARM: ['Noah', 'Pyunik', 'Ararat-Armenia', 'Alashkert', 'Urartu'],
  AZE: ['Qarabağ', ['Neftçi', 'neftchi'], 'Sabah', 'Zira', 'Sumgayit'],
  KAZ: ['Kairat', 'Astana', 'Tobol', 'Ordabasy', 'Aktobe'],
  LTU: ['Žalgiris', 'Kauno Žalgiris', 'Hegelmann', 'Sūduva'],
  LVA: ['RFS', 'Riga FC', 'Valmiera', 'Auda'],
  EST: ['FCI Levadia', 'Flora Tallinn', 'Paide', 'Nõmme Kalju'],
  LUX: ['Differdange 03', 'F91 Dudelange', 'Progrès Niederkorn', 'Swift Hesperange'],
  FRO: ['Víkingur Gøta', 'KÍ Klaksvík', 'HB Tórshavn', 'B36 Tórshavn'],
  GIB: ['Lincoln Red Imps', 'Europa FC', "St Joseph's"],
  MLT: ['Hamrun Spartans', 'Valletta', 'Hibernians', 'Birkirkara', 'Floriana'],
  AND: ['Inter Club d’Escaldes', 'UE Santa Coloma', 'Atlètic Club d’Escaldes'],
  SMR: ['Virtus', 'Tre Penne', 'La Fiorita'],
  LIE: ['Vaduz'],
};

// [name, country, aliases[]]
export const CLUBS = Object.entries(RAW).flatMap(([country, list]) =>
  list.map((c) => (Array.isArray(c) ? [c[0], country, c.slice(1)] : [c, country, []])));

const BY_NAME = new Map(CLUBS.map((c) => [c[0], c]));
const ALIAS = CLUBS.flatMap(([name, , aliases]) => [name, ...aliases].map((a) => [norm(a), name]));
const SORTED = CLUBS.map((c) => c[0]).sort((a, b) => a.localeCompare(b, 'en'));

export const clubName = (id) => id;
export const clubCountry = (id) => BY_NAME.get(id)?.[1] ?? null;

export function exactClub(input) {
  const n = norm(input);
  return n ? ALIAS.find(([a]) => a === n)?.[1] ?? null : null;
}

export function suggestClubs(input) {
  const n = norm(input);
  if (!n) return SORTED;
  const rank = new Map();
  for (const [a, name] of ALIAS) {
    const r = a.startsWith(n) ? 0 : a.includes(n) ? 1 : null;
    if (r !== null && (!rank.has(name) || r < rank.get(name))) rank.set(name, r);
  }
  return SORTED.filter((c) => rank.has(c)).sort((a, b) => rank.get(a) - rank.get(b));
}

export function matchClub(input) {
  const exact = exactClub(input);
  if (exact) return exact;
  const s = suggestClubs(input);
  return norm(input).length >= 4 && s.length === 1 ? s[0] : null;
}
