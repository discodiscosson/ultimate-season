// Countries: the first name is displayed, the rest are accepted aliases (English and Swedish).
export const COUNTRIES = {
  ALB: ['Albania', 'albanien'], AND: ['Andorra'], ARM: ['Armenia', 'armenien'], AUT: ['Austria', 'österrike'],
  AZE: ['Azerbaijan', 'azerbajdzjan', 'azerbajdjan', 'azerbaidjan'], BEL: ['Belgium', 'belgien'],
  BIH: ['Bosnia and Herzegovina', 'bosnia', 'bosnia herzegovina', 'bosnien och hercegovina', 'bosnien'],
  BLR: ['Belarus', 'vitryssland'], BUL: ['Bulgaria', 'bulgarien'], CRO: ['Croatia', 'kroatien'], CYP: ['Cyprus', 'cypern'],
  CZE: ['Czechia', 'czech republic', 'tjeckien'], DEN: ['Denmark', 'danmark'], ENG: ['England'], ESP: ['Spain', 'spanien'],
  EST: ['Estonia', 'estland'], FIN: ['Finland'], FRA: ['France', 'frankrike'], FRO: ['Faroe Islands', 'faroes', 'faroe', 'färöarna'],
  GEO: ['Georgia', 'georgien'], GER: ['Germany', 'tyskland'], GIB: ['Gibraltar'], GRE: ['Greece', 'grekland'],
  HUN: ['Hungary', 'ungern'], IRL: ['Ireland', 'republic of ireland', 'eire', 'irland'], ISL: ['Iceland', 'island'],
  ISR: ['Israel'], ITA: ['Italy', 'italien'], KAZ: ['Kazakhstan', 'kazakstan'], KOS: ['Kosovo'],
  LIE: ['Liechtenstein'], LTU: ['Lithuania', 'litauen'], LUX: ['Luxembourg', 'luxemburg'], LVA: ['Latvia', 'lettland'],
  MDA: ['Moldova', 'moldavien'], MKD: ['North Macedonia', 'macedonia', 'nordmakedonien', 'makedonien'], MLT: ['Malta'],
  MNE: ['Montenegro'], NED: ['Netherlands', 'holland', 'nederländerna'], NIR: ['Northern Ireland', 'nordirland'],
  NOR: ['Norway', 'norge'], POL: ['Poland', 'polen'], POR: ['Portugal'], ROU: ['Romania', 'rumänien'],
  RUS: ['Russia', 'ryssland'], SCO: ['Scotland', 'skottland'], SMR: ['San Marino'], SRB: ['Serbia', 'serbien'],
  SUI: ['Switzerland', 'schweiz'], SVK: ['Slovakia', 'slovakien'], SVN: ['Slovenia', 'slovenien'], SWE: ['Sweden', 'sverige'],
  TUR: ['Turkey', 'turkiye', 'turkiet'], UKR: ['Ukraine', 'ukraina'], WAL: ['Wales'],
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

// Returns a country code or null. Exact match first, otherwise the closest unique match within a small typo margin.
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
