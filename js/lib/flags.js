// Flags for the UEFA countries, self-hosted in assets/flags (from flag-icons, MIT licence).
import { countryName } from './countries.js';
import { esc } from './util.js';

const ISO = {
  ALB: 'al', AND: 'ad', ARM: 'am', AUT: 'at', AZE: 'az', BLR: 'by', BEL: 'be', BIH: 'ba', BUL: 'bg', CRO: 'hr', CYP: 'cy',
  CZE: 'cz', DEN: 'dk', ENG: 'gb-eng', EST: 'ee', FRO: 'fo', FIN: 'fi', FRA: 'fr', GEO: 'ge', GER: 'de', GIB: 'gi', GRE: 'gr',
  HUN: 'hu', ISL: 'is', IRL: 'ie', ISR: 'il', ITA: 'it', KAZ: 'kz', KOS: 'xk', LVA: 'lv', LIE: 'li', LTU: 'lt', LUX: 'lu',
  MLT: 'mt', MDA: 'md', MNE: 'me', NED: 'nl', MKD: 'mk', NIR: 'gb-nir', NOR: 'no', POL: 'pl', POR: 'pt', ROU: 'ro', RUS: 'ru',
  SMR: 'sm', SCO: 'gb-sct', SRB: 'rs', SVK: 'sk', SVN: 'si', ESP: 'es', SWE: 'se', SUI: 'ch', TUR: 'tr', UKR: 'ua', WAL: 'gb-wls',
};

// The preview build inlines the flags in window.__US_FLAGS__; the site loads them from assets/flags.
export function flagSrc(code) {
  const iso = ISO[code];
  if (!iso) return null;
  return window.__US_FLAGS__?.[iso] || `assets/flags/${iso}.svg`;
}

export function flagHTML(code, cls = '') {
  const src = flagSrc(code);
  const name = countryName(code);
  return src
    ? `<img class="flag ${cls}" src="${src}" alt="${esc(name)}" title="${esc(name)}" width="24" height="18" loading="lazy">`
    : `<span class="flag flag-none ${cls}" title="${esc(name)}"></span>`;
}
