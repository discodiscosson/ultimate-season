// Länder: första namnet visas, resten är godkända alias (svenska och engelska).
export const COUNTRIES = {
  ALB: ['Albanien', 'albania'], AND: ['Andorra'], ARM: ['Armenien', 'armenia'], AUT: ['Österrike', 'austria'],
  AZE: ['Azerbajdzjan', 'azerbaijan', 'azerbajdjan', 'azerbajdsjan'], BEL: ['Belgien', 'belgium'],
  BIH: ['Bosnien och Hercegovina', 'bosnien', 'bosnia', 'bosnia and herzegovina', 'bosnien hercegovina', 'bosnia herzegovina'],
  BLR: ['Belarus', 'vitryssland'], BUL: ['Bulgarien', 'bulgaria'], CRO: ['Kroatien', 'croatia'], CYP: ['Cypern', 'cyprus'],
  CZE: ['Tjeckien', 'czechia', 'czech republic'], DEN: ['Danmark', 'denmark'], ENG: ['England'], ESP: ['Spanien', 'spain'],
  EST: ['Estland', 'estonia'], FIN: ['Finland'], FRA: ['Frankrike', 'france'], FRO: ['Färöarna', 'faroe islands', 'faroes', 'faroe'],
  GEO: ['Georgien', 'georgia'], GER: ['Tyskland', 'germany'], GIB: ['Gibraltar'], GRE: ['Grekland', 'greece'],
  HUN: ['Ungern', 'hungary'], IRL: ['Irland', 'ireland', 'republic of ireland', 'eire'], ISL: ['Island', 'iceland'],
  ISR: ['Israel'], ITA: ['Italien', 'italy'], KAZ: ['Kazakstan', 'kazakhstan', 'kazachstan'], KOS: ['Kosovo'],
  LIE: ['Liechtenstein'], LTU: ['Litauen', 'lithuania'], LUX: ['Luxemburg', 'luxembourg'], LVA: ['Lettland', 'latvia'],
  MDA: ['Moldavien', 'moldova'], MKD: ['Nordmakedonien', 'makedonien', 'north macedonia', 'macedonia'], MLT: ['Malta'],
  MNE: ['Montenegro'], NED: ['Nederländerna', 'holland', 'netherlands'], NIR: ['Nordirland', 'northern ireland'],
  NOR: ['Norge', 'norway'], POL: ['Polen', 'poland'], POR: ['Portugal'], ROU: ['Rumänien', 'romania'],
  RUS: ['Ryssland', 'russia'], SCO: ['Skottland', 'scotland'], SMR: ['San Marino'], SRB: ['Serbien', 'serbia'],
  SUI: ['Schweiz', 'switzerland'], SVK: ['Slovakien', 'slovakia'], SVN: ['Slovenien', 'slovenia'], SWE: ['Sverige', 'sweden'],
  TUR: ['Turkiet', 'turkey', 'turkiye'], UKR: ['Ukraina', 'ukraine'], WAL: ['Wales'],
};

export const countryName = (code) => COUNTRIES[code]?.[0] ?? code;

const norm = (s) => s.toLowerCase().replace(/ø/g, 'o').replace(/æ/g, 'ae')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');

const ALIAS = Object.entries(COUNTRIES).flatMap(([code, names]) => names.map((n) => [norm(n), code]));

function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

// Returnerar landskod eller null. Exakt träff först, annars närmaste unika träff inom en liten stavfelsmarginal.
export function matchCountry(input) {
  const n = norm(input || '');
  if (n.length < 3) return null;
  const exact = ALIAS.find(([a]) => a === n);
  if (exact) return exact[1];
  let best = 99, codes = new Set();
  for (const [a, code] of ALIAS) {
    const d = lev(n, a);
    if (d < best) { best = d; codes = new Set([code]); } else if (d === best) codes.add(code);
  }
  return best <= Math.max(1, Math.floor(n.length / 5)) && codes.size === 1 ? [...codes][0] : null;
}
