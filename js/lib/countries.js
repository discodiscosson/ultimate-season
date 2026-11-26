// All countries in the world, plus the UK home nations and football territories used in UEFA.
// Answers and the dropdown are limited to the UEFA members (see UEFA below).
// Format: CODE: [display name, ...accepted aliases]. Swedish names are kept as aliases.
export const COUNTRIES = {
  AFG: ['Afghanistan'], ALB: ['Albania', 'albanien'], ALG: ['Algeria', 'algeriet'], AND: ['Andorra'], ANG: ['Angola'],
  ATG: ['Antigua and Barbuda'], ARG: ['Argentina'], ARM: ['Armenia', 'armenien'], AUS: ['Australia', 'australien'],
  AUT: ['Austria', 'österrike'], AZE: ['Azerbaijan', 'azerbajdzjan'], BAH: ['Bahamas'], BHR: ['Bahrain'],
  BAN: ['Bangladesh'], BRB: ['Barbados'], BLR: ['Belarus', 'vitryssland'], BEL: ['Belgium', 'belgien'], BLZ: ['Belize'],
  BEN: ['Benin'], BHU: ['Bhutan'], BOL: ['Bolivia'], BIH: ['Bosnia and Herzegovina', 'bosnia', 'bosnien och hercegovina', 'bosnien'],
  BOT: ['Botswana'], BRA: ['Brazil', 'brasilien'], BRU: ['Brunei'], BUL: ['Bulgaria', 'bulgarien'], BFA: ['Burkina Faso'],
  BDI: ['Burundi'], CAM: ['Cambodia', 'kambodja'], CMR: ['Cameroon', 'kamerun'], CAN: ['Canada', 'kanada'],
  CPV: ['Cape Verde', 'cabo verde', 'kap verde'], CTA: ['Central African Republic'], CHA: ['Chad', 'tchad'],
  CHI: ['Chile'], CHN: ['China', 'kina'], COL: ['Colombia'], COM: ['Comoros'], CGO: ['Congo', 'republic of the congo', 'kongo'],
  COD: ['DR Congo', 'democratic republic of the congo', 'congo kinshasa', 'kongo kinshasa'], CRC: ['Costa Rica'],
  CRO: ['Croatia', 'kroatien'], CUB: ['Cuba', 'kuba'], CYP: ['Cyprus', 'cypern'], CZE: ['Czechia', 'czech republic', 'tjeckien'],
  DEN: ['Denmark', 'danmark'], DJI: ['Djibouti'], DMA: ['Dominica'], DOM: ['Dominican Republic', 'dominikanska republiken'],
  ECU: ['Ecuador'], EGY: ['Egypt', 'egypten'], SLV: ['El Salvador'], ENG: ['England'], EQG: ['Equatorial Guinea'],
  ERI: ['Eritrea'], EST: ['Estonia', 'estland'], SWZ: ['Eswatini', 'swaziland'], ETH: ['Ethiopia', 'etiopien'],
  FRO: ['Faroe Islands', 'faroes', 'färöarna'], FIJ: ['Fiji'], FIN: ['Finland'], FRA: ['France', 'frankrike'],
  GAB: ['Gabon'], GAM: ['Gambia'], GEO: ['Georgia', 'georgien'], GER: ['Germany', 'tyskland'], GHA: ['Ghana'],
  GIB: ['Gibraltar'], GRE: ['Greece', 'grekland'], GRN: ['Grenada'], GUA: ['Guatemala'], GUI: ['Guinea'],
  GNB: ['Guinea-Bissau'], GUY: ['Guyana'], HAI: ['Haiti'], HON: ['Honduras'], HUN: ['Hungary', 'ungern'],
  ISL: ['Iceland', 'island'], IND: ['India', 'indien'], IDN: ['Indonesia', 'indonesien'], IRN: ['Iran'], IRQ: ['Iraq', 'irak'],
  IRL: ['Ireland', 'republic of ireland', 'irland'], ISR: ['Israel'], ITA: ['Italy', 'italien'],
  CIV: ['Ivory Coast', 'cote d ivoire', 'elfenbenskusten'], JAM: ['Jamaica'], JPN: ['Japan'], JOR: ['Jordan', 'jordanien'],
  KAZ: ['Kazakhstan', 'kazakstan'], KEN: ['Kenya'], KIR: ['Kiribati'], KOS: ['Kosovo'], KUW: ['Kuwait'],
  KGZ: ['Kyrgyzstan', 'kirgizistan'], LAO: ['Laos'], LVA: ['Latvia', 'lettland'], LBN: ['Lebanon', 'libanon'],
  LES: ['Lesotho'], LBR: ['Liberia'], LBY: ['Libya', 'libyen'], LIE: ['Liechtenstein'], LTU: ['Lithuania', 'litauen'],
  LUX: ['Luxembourg', 'luxemburg'], MAD: ['Madagascar'], MWI: ['Malawi'], MAS: ['Malaysia'], MDV: ['Maldives', 'maldiverna'],
  MLI: ['Mali'], MLT: ['Malta'], MHL: ['Marshall Islands'], MTN: ['Mauritania', 'mauretanien'], MRI: ['Mauritius'],
  MEX: ['Mexico', 'mexiko'], FSM: ['Micronesia'], MDA: ['Moldova', 'moldavien'], MCO: ['Monaco'], MNG: ['Mongolia', 'mongoliet'],
  MNE: ['Montenegro'], MAR: ['Morocco', 'marocko'], MOZ: ['Mozambique', 'moçambique'], MYA: ['Myanmar', 'burma'],
  NAM: ['Namibia'], NRU: ['Nauru'], NEP: ['Nepal'], NED: ['Netherlands', 'holland', 'nederländerna'],
  NZL: ['New Zealand', 'nya zeeland'], NCA: ['Nicaragua'], NIG: ['Niger'], NGA: ['Nigeria'],
  PRK: ['North Korea', 'nordkorea'], MKD: ['North Macedonia', 'macedonia', 'nordmakedonien'],
  NIR: ['Northern Ireland', 'nordirland'], NOR: ['Norway', 'norge'], OMA: ['Oman'], PAK: ['Pakistan'], PLW: ['Palau'],
  PLE: ['Palestine', 'palestina'], PAN: ['Panama'], PNG: ['Papua New Guinea'], PAR: ['Paraguay'], PER: ['Peru'],
  PHI: ['Philippines', 'filippinerna'], POL: ['Poland', 'polen'], POR: ['Portugal'], QAT: ['Qatar'],
  ROU: ['Romania', 'rumänien'], RUS: ['Russia', 'ryssland'], RWA: ['Rwanda'], SKN: ['Saint Kitts and Nevis'],
  LCA: ['Saint Lucia'], VIN: ['Saint Vincent and the Grenadines'], SAM: ['Samoa'], SMR: ['San Marino'],
  STP: ['São Tomé and Príncipe'], KSA: ['Saudi Arabia', 'saudiarabien'], SCO: ['Scotland', 'skottland'],
  SEN: ['Senegal'], SRB: ['Serbia', 'serbien'], SEY: ['Seychelles'], SLE: ['Sierra Leone'], SGP: ['Singapore'],
  SVK: ['Slovakia', 'slovakien'], SVN: ['Slovenia', 'slovenien'], SOL: ['Solomon Islands'], SOM: ['Somalia'],
  RSA: ['South Africa', 'sydafrika'], KOR: ['South Korea', 'korea', 'sydkorea'], SSD: ['South Sudan', 'sydsudan'],
  ESP: ['Spain', 'spanien'], SRI: ['Sri Lanka'], SDN: ['Sudan'], SUR: ['Suriname'], SWE: ['Sweden', 'sverige'],
  SUI: ['Switzerland', 'schweiz'], SYR: ['Syria', 'syrien'], TPE: ['Taiwan'], TJK: ['Tajikistan', 'tadzjikistan'],
  TAN: ['Tanzania'], THA: ['Thailand'], TLS: ['Timor-Leste', 'east timor', 'östtimor'], TOG: ['Togo'], TGA: ['Tonga'],
  TRI: ['Trinidad and Tobago'], TUN: ['Tunisia', 'tunisien'], TUR: ['Turkey', 'turkiye', 'turkiet'],
  TKM: ['Turkmenistan'], TUV: ['Tuvalu'], UGA: ['Uganda'], UKR: ['Ukraine', 'ukraina'],
  UAE: ['United Arab Emirates', 'uae', 'förenade arabemiraten'], GBR: ['United Kingdom', 'uk', 'great britain', 'storbritannien'],
  USA: ['United States', 'usa', 'united states of america'], URU: ['Uruguay'], UZB: ['Uzbekistan'],
  VAN: ['Vanuatu'], VAT: ['Vatican City', 'holy see', 'vatikanstaten'], VEN: ['Venezuela'], VIE: ['Vietnam'],
  WAL: ['Wales'], YEM: ['Yemen', 'jemen'], ZAM: ['Zambia'], ZIM: ['Zimbabwe'],
};

export const countryName = (code) => COUNTRIES[code]?.[0] ?? code;

// The 55 UEFA member associations. The country dropdown only offers these.
export const UEFA = ['ALB', 'AND', 'ARM', 'AUT', 'AZE', 'BLR', 'BEL', 'BIH', 'BUL', 'CRO', 'CYP', 'CZE', 'DEN', 'ENG', 'EST', 'FRO',
  'FIN', 'FRA', 'GEO', 'GER', 'GIB', 'GRE', 'HUN', 'ISL', 'IRL', 'ISR', 'ITA', 'KAZ', 'KOS', 'LVA', 'LIE', 'LTU', 'LUX', 'MLT',
  'MDA', 'MNE', 'NED', 'MKD', 'NIR', 'NOR', 'POL', 'POR', 'ROU', 'RUS', 'SMR', 'SCO', 'SRB', 'SVK', 'SVN', 'ESP', 'SWE', 'SUI',
  'TUR', 'UKR', 'WAL'];
const UEFA_SET = new Set(UEFA);

export const norm = (s) => String(s ?? '').toLowerCase().replace(/ø/g, 'o').replace(/æ/g, 'ae')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');

// Only UEFA members are offered and accepted as answers; the full list stays available for display.
const ALIAS = Object.entries(COUNTRIES).filter(([code]) => UEFA_SET.has(code)).flatMap(([code, names]) => names.map((n) => [norm(n), code]));
const BY_NAME = UEFA.slice().sort((a, b) => countryName(a).localeCompare(countryName(b), 'en'));

// Exact match on a name or alias, otherwise null.
export function exactCountry(input) {
  const n = norm(input);
  return n ? ALIAS.find(([a]) => a === n)?.[1] ?? null : null;
}

// Countries for the dropdown, filtered by what has been typed. Names starting with the text come first.
export function suggestCountries(input) {
  const n = norm(input);
  if (!n) return BY_NAME;
  const rank = new Map();
  for (const [a, code] of ALIAS) {
    const r = a.startsWith(n) ? 0 : a.includes(n) ? 1 : null;
    if (r !== null && (!rank.has(code) || r < rank.get(code))) rank.set(code, r);
  }
  return BY_NAME.filter((c) => rank.has(c)).sort((a, b) => rank.get(a) - rank.get(b));
}

function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

// Exact match first, otherwise the closest unique match within a small typo margin. Returns a code or null.
export function matchCountry(input) {
  const n = norm(input);
  if (n.length < 3) return null;
  const exact = exactCountry(input);
  if (exact) return exact;
  let best = 99, codes = new Set();
  for (const [a, code] of ALIAS) {
    const d = lev(n, a);
    if (d < best) { best = d; codes = new Set([code]); } else if (d === best) codes.add(code);
  }
  return best <= Math.max(1, Math.floor(n.length / 5)) && codes.size === 1 ? [...codes][0] : null;
}
