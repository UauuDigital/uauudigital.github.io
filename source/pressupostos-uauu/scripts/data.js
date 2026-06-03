

// ================================================================
//  DATA CONFIGURATION FILE
//  Structure: priceMatrix, venues, extras, translations
//  diaDeLaSetmana: 0=Diumenge, 1=Dl, 2=Dm, 3=Dc, 4=Dj, 5=Dv, 6=Ds
// ================================================================

// ────────────────────────────────────────────────────────────────
// 1. BASIC CONSTANTS
// ────────────────────────────────────────────────────────────────

const MONTHS_CA = ['Gener','Febrer','Març','Abril','Maig','Juny','Juliol','Agost','Setembre','Octubre','Novembre','Desembre'];
const DAYS_CA   = ['Diumenge','Dilluns','Dimarts','Dimecres','Dijous','Divendres','Dissabte'];
const DAYS_SHORT = ['Dg','Dl','Dm','Dc','Dj','Dv','Ds'];
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTQJRPzbjDctU5oo8z1Q-ssJvgMiiCcFFICdBvlti5pYhUJW38GqDnNTMuzZMsN7pInxal1kBhNcLh3/pub?output=xlsx';

// ────────────────────────────────────────────────────────────────
// 2. UTILITY FUNCTIONS
// ────────────────────────────────────────────────────────────────

function eur(n) {
  return new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function normText(value) {
  return String(value ?? '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
}

function parseMoney(value) {
  if (value === null || value === undefined || value === '') return null;
  const normalized = String(value).replace(/\s/g, '').replace(',', '.').replace(/[^\d.-]/g, '');
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

function parseBool(value, defaultValue = false) {
  if (value === null || value === undefined || value === '') return defaultValue;
  const txt = normText(value);
  if (['1', 'true', 'yes', 'si', 's', 'y', 'sí', 'oui', 'x', 'checked', 'on', 'verdadero', 'v'].includes(txt)) return true;
  if (['0', 'false', 'no', 'n', 'falso', 'f'].includes(txt)) return false;
  return defaultValue;
}

function parseYearCell(value) {
  const year = Number(String(value ?? '').trim());
  return Number.isInteger(year) ? year : null;
}

function parseVenueIds(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return [];
  const normalizedRaw = normText(raw);
  if (
    raw === '*' ||
    normalizedRaw === 'totes' ||
    normalizedRaw === 'all' ||
    normalizedRaw.includes('totes') ||
    normalizedRaw.includes('all')
  ) {
    return VENUES.map(v => v.id);
  }
  const normalized = normalizedRaw;
  const rawTokens = normalized
    .split(/[,;/|+\n]/)
    .map(t => t.trim())
    .filter(Boolean);

  return VENUES
    .filter(v => {
      const venueName = normText(v.name);
      const venueId = normText(v.id);
      if (normalized.includes(venueName) || normalized.includes(venueId)) return true;
      return rawTokens.some(t => t === venueName || t === venueId || t.includes(venueName) || venueName.includes(t));
    })
    .map(v => v.id)
    .filter((id, idx, arr) => arr.indexOf(id) === idx);
}

function parseUnitStyle(value) {
  const txt = normText(value);
  if (txt.includes('person') || txt.includes('pers')) return 'person';
  if (txt.includes('pack')) return 'pack';
  if (txt.includes('unit')) return 'unit';
  return 'unit';
}

function buildServiceId(label, fallbackIndex) {
  const base = normText(label).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return base || `service-${fallbackIndex}`;
}

// ────────────────────────────────────────────────────────────────
// 3. VENUES REFERENCE DATA
// ────────────────────────────────────────────────────────────────

const VENUES = [
  { id: 'mas-vivencs',     name: 'Mas Vivencs',       logo: 'assets/logo-mas-vivencs.png',      type: 'Mas Rural'        },
  { id: 'castell-de-tous', name: 'Castell de Tous',   logo: 'assets/logo-castell-de-tous.png',  type: 'Castell Històric' },
  { id: 'can-macia',       name: 'Can Macià',         logo: 'assets/logo-can-macia.png',        type: 'Masia Rural'      },
  { id: 'ca-nalzina',      name: "Ca n'Alzina",       logo: 'assets/logo-ca-nalzina.png',       type: 'Masia Rural'      },
];

// ────────────────────────────────────────────────────────────────
// 4. SPREADSHEET-DRIVEN EXTRAS
// ────────────────────────────────────────────────────────────────

const SPREADSHEET_COLUMNS = {
  name: ['nom servei', 'servei', 'nom'],
  nameCa: ['nom servei', 'nomca', 'nom cat', 'nomcatala', 'nom català', 'nom catala'],
  nameEs: ['nomcast', 'nom cast', 'nom castellà', 'nom castella', 'nomcastellano', 'nom castella'],
  nameEn: ['nomeng', 'nom eng', 'nom anglès', 'nom angles', 'nom angles', 'name'],
  venue: ['masia', 'finca', 'venue'],
  year: ['any', 'curs'],
  price: ['preu', 'import'],
  unit: ['estil d\'unitat', 'unitat', 'unit style'],
  quantity: ['quantityBased'],
  optional: ['si es opcional', 'opcional', 'optional'],
  extraType: ['extres', 'extra type', 'tipus extres', 'tipus'],
  dropdown: ['desplegable', 'opcions desplegable', 'opciones desplegable'],
  extrasList: ['extresllista', 'extres llista', 'extraslist', 'extra list'],
  thresholdMain: ['llinda principal', 'llinda inici', 'llinda principi', 'llindar principal', 'umbral principal', 'llinda primer', 'llinda primera'],
  thresholdFinal: ['llinda final', 'llindar final', 'umbral final', 'llinda maxim', 'llinda màxim', 'llinda max', 'llinda màx'],
  thresholdPriceBelow: ['llinda preu x<0', 'llinda preu x < 0', 'preu llinda inferior', 'precio llinda inferior'],
  thresholdPriceAbove: ['llinda preu x>0', 'llinda preu x > 0', 'preu llinda superior', 'precio llinda superior', 'preu llinda max', 'preu llinda maxim', 'preu llinda màxim'],
  extraUnitValue: ['extraunitat'],
  extraExtresKind: ['extraextres', 'extra extres'],
  extraSwitch: ['extraswitch', 'extra switch', 'extralista switch', 'extraextresswitch', 'exrta switch'],
};

function parseExtraType(value) {
  const txt = normText(value).replace(/[^a-z0-9\s-]/g, ' ');
  if (!txt.trim()) return null;
  if (/(despleg|dropdown|select|selector|opcio|opcion|opciones)/.test(txt)) return 'desplegable';
  if (/(llinda|header|titol|titulo)/.test(txt)) return 'llinda';
  if (/(altres|otros|other)/.test(txt)) return 'altres-extres';
  return null;
}

function wantsDropdown(extraListCell) {
  const txt = normText(extraListCell);
  return /(^|[\s,;/|])despleg/.test(txt) || txt === 'desplegable';
}

function getOptionLabel(option, lang = 'ca') {
  return String(option?.labels?.[lang] || option?.labels?.ca || option?.label || '').trim();
}

function parseServiceNames(row) {
  const ca = pickColumn(row, SPREADSHEET_COLUMNS.nameCa) ?? pickColumn(row, SPREADSHEET_COLUMNS.name);
  const es = pickColumn(row, SPREADSHEET_COLUMNS.nameEs);
  const en = pickColumn(row, SPREADSHEET_COLUMNS.nameEn);
  const base = String(ca ?? es ?? en ?? '').trim();
  if (!base) return null;
  return {
    ca: String(ca ?? base).trim(),
    es: String(es ?? ca ?? base).trim(),
    en: String(en ?? ca ?? base).trim(),
  };
}

function parseJsonOptions(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    return arr.map((item, idx) => {
      if (!item || typeof item !== 'object') return null;
      const ca = String(item.CAT ?? item.ca ?? item.Ca ?? item.label ?? item.name ?? '').trim();
      const es = String(item.CAST ?? item.cast ?? item.es ?? item.ES ?? ca).trim();
      const en = String(item.ENG ?? item.eng ?? item.en ?? item.EN ?? ca).trim();
      const price = parseMoney(item.PREU ?? item.price ?? item.preu ?? item.amount);
      if (!ca) return null;
      return { id: `${buildServiceId(ca, idx)}-${idx + 1}`, labels: { ca, es, en }, label: ca, price: price ?? 0 };
    }).filter(Boolean);
  } catch {
    return [];
  }
}

function parseNamePricePair(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  const parts = raw.split(',').map(s => s.trim());
  if (parts.length < 2) return null;
  const label = parts[0];
  const price = parseMoney(parts[1]);
  if (!label) return null;
  return { label, price: price ?? 0 };
}

function parseExtraUnitValue(row) {
  for (const key of Object.keys(row || {})) {
    if (normText(key) === 'extraunitat') {
      return row[key];
    }
  }
  return '';
}

function parseExtraExtresValue(row) {
  const rawValue = pickColumn(row, SPREADSHEET_COLUMNS.extraExtresKind);
  const swValue =
    pickColumn(row, SPREADSHEET_COLUMNS.extraSwitch) ??
    pickColumnLoose(row, ['switch']) ??
    '';
  const isUsefulText = (value) => {
    const txt = String(value ?? '').trim();
    return !!txt && txt !== 'true' && txt !== 'false';
  };
  const splitTokens = (text) => String(text ?? '').trim().split(/[,\n;|]+/).map(s => s.trim()).filter(Boolean);
  const findSwitchText = () => {
    const directCandidates = [swValue, rawValue]
      .filter(isUsefulText)
      .map(v => String(v).trim());
    for (const candidate of directCandidates) {
      if (candidate.includes(',') && splitTokens(candidate).length >= 4) return candidate;
    }
    for (const key of Object.keys(row || {})) {
      const normalizedKey = normText(key);
      if (!normalizedKey.includes('switch') && !normalizedKey.includes('extra')) continue;
      const value = row[key];
      if (!isUsefulText(value)) continue;
      const candidate = String(value).trim();
      if (candidate.includes(',') && splitTokens(candidate).length >= 4) return candidate;
    }
    return '';
  };
  const raw = String(rawValue ?? '').trim();
  const sw = findSwitchText();
  const parseSwitch = (text) => {
    const rawText = String(text ?? '').trim();
    if (!rawText) return [];
    const tokens = splitTokens(rawText);
    if (tokens.length < 4) return [];
    const leftLabel = tokens[0];
    const leftPrice = parseMoney(tokens[1]);
    const rightLabel = tokens[2];
    const rightPrice = parseMoney(tokens[3]);
    if (!leftLabel || !rightLabel) return [];
    return [{
      id: `${buildServiceId(leftLabel, 0)}-${buildServiceId(rightLabel, 1)}-switch`,
      labels: { ca: leftLabel, es: leftLabel, en: leftLabel },
      label: leftLabel,
      leftLabel,
      leftPrice: leftPrice ?? 0,
      rightLabel,
      rightPrice: rightPrice ?? 0,
      defaultSide: 'right',
      switchMode: true,
    }];
  };
  const parsePairs = (text) => {
    const rawText = String(text ?? '').trim();
    if (!rawText) return [];
    const tokens = splitTokens(rawText);
    const out = [];
    for (let i = 0; i + 1 < tokens.length; i += 2) {
      const ca = tokens[i];
      const price = parseMoney(tokens[i + 1]);
      if (!ca) continue;
      out.push({ id: `${buildServiceId(ca, i)}-${(i / 2) + 1}`, labels: { ca, es: ca, en: ca }, label: ca, price: price ?? 0 });
    }
    return out;
  };
  return [...parsePairs(raw), ...parseSwitch(sw)];
}

function pickColumn(row, keys) {
  for (const key of Object.keys(row)) {
    const normalizedKey = normText(key);
    if (keys.some(alias => normalizedKey === normText(alias) || normalizedKey.includes(normText(alias)) || normText(alias).includes(normalizedKey))) {
      return row[key];
    }
  }
  return undefined;
}

function pickColumnStrict(row, keys) {
  for (const key of Object.keys(row)) {
    const normalizedKey = normText(key);
    if (keys.some(alias => normalizedKey === normText(alias))) {
      return row[key];
    }
  }
  return undefined;
}

function pickColumnExcluding(row, keys, excludedPatterns = []) {
  for (const key of Object.keys(row)) {
    const normalizedKey = normText(key);
    if (excludedPatterns.some(p => normalizedKey.includes(normText(p)))) continue;
    if (keys.some(alias => normalizedKey === normText(alias) || normalizedKey.includes(normText(alias)) || normText(alias).includes(normalizedKey))) {
      return row[key];
    }
  }
  return undefined;
}

function pickColumnExcludingStrict(row, keys, excludedPatterns = []) {
  for (const key of Object.keys(row)) {
    const normalizedKey = normText(key);
    if (excludedPatterns.some(p => normalizedKey.includes(normText(p)))) continue;
    if (keys.some(alias => {
      const a = normText(alias);
      return normalizedKey === a || normalizedKey.includes(a);
    })) {
      return row[key];
    }
  }
  return undefined;
}

function pickColumnLoose(row, patterns) {
  for (const key of Object.keys(row)) {
    const normalizedKey = normText(key);
    if (patterns.every(p => normalizedKey.includes(normText(p)))) {
      return row[key];
    }
  }
  return undefined;
}

function pickColumnLooseExcluding(row, patterns, excludedPatterns = []) {
  for (const key of Object.keys(row)) {
    const normalizedKey = normText(key);
    if (excludedPatterns.some(p => normalizedKey.includes(normText(p)))) continue;
    if (patterns.every(p => normalizedKey.includes(normText(p)))) {
      return row[key];
    }
  }
  return undefined;
}

function pickColumnRegex(row, regexList) {
  for (const key of Object.keys(row)) {
    const normalizedKey = normText(key);
    if (regexList.some(rx => rx.test(normalizedKey))) return row[key];
  }
  return undefined;
}

function pickColumnRegexExcluding(row, regexList, excludedPatterns = []) {
  for (const key of Object.keys(row)) {
    const normalizedKey = normText(key);
    if (excludedPatterns.some(p => normalizedKey.includes(normText(p)))) continue;
    if (regexList.some(rx => rx.test(normalizedKey))) return row[key];
  }
  return undefined;
}

function buildExtrasByVenue(rows) {
  const extrasByVenue = {};
  for (const venue of VENUES) extrasByVenue[venue.id] = {};
  const seen = new Set();

  rows.forEach((row, index) => {
    const labels = parseServiceNames(row);
    const venueCell = pickColumn(row, SPREADSHEET_COLUMNS.venue);
    const yearCell = pickColumn(row, SPREADSHEET_COLUMNS.year);
    const priceCell = pickColumn(row, SPREADSHEET_COLUMNS.price);
    const unitCell = pickColumn(row, SPREADSHEET_COLUMNS.unit);
    const quantityCell = pickColumn(row, SPREADSHEET_COLUMNS.quantity) ?? pickColumnLoose(row, ['quantity', 'based']);
    const optionalCell = pickColumn(row, SPREADSHEET_COLUMNS.optional);
    const extraTypeCell = pickColumnStrict(row, SPREADSHEET_COLUMNS.extraType);
    const dropdownCell = pickColumn(row, SPREADSHEET_COLUMNS.dropdown);
    const extrasListCell = pickColumnStrict(row, SPREADSHEET_COLUMNS.extrasList);
    const thresholdMainCell =
      pickColumnExcludingStrict(row, SPREADSHEET_COLUMNS.thresholdMain, ['extra']) ??
      pickColumnLooseExcluding(row, ['llinda', 'principi'], ['extra']) ??
      pickColumnLooseExcluding(row, ['llinda', 'princi'], ['extra']) ??
      pickColumnLooseExcluding(row, ['llind', 'principi'], ['extra']) ??
      pickColumnLooseExcluding(row, ['llinda', 'inici'], ['extra']) ??
      pickColumnLooseExcluding(row, ['umbral', 'inicio'], ['extra']) ??
      pickColumnRegexExcluding(row, [/llind.*princip/i, /llind.*principal/i, /llind.*inici/i, /llind.*start/i, /llind.*min/i], ['extra']);
    const thresholdFinalCell =
      pickColumnExcludingStrict(row, SPREADSHEET_COLUMNS.thresholdFinal, ['extra']) ??
      pickColumnLooseExcluding(row, ['llinda', 'final'], ['extra']) ??
      pickColumnLooseExcluding(row, ['llinda', 'max'], ['extra']) ??
      pickColumnLooseExcluding(row, ['umbral', 'final'], ['extra']) ??
      pickColumnRegexExcluding(row, [/llinda.*final/i, /llinda.*max/i], ['extra']);
    const thresholdPriceBelowCell =
      pickColumnExcludingStrict(row, SPREADSHEET_COLUMNS.thresholdPriceBelow, ['extra']) ??
      pickColumnLooseExcluding(row, ['llinda', 'preu', 'x<0'], ['extra']) ??
      pickColumnLooseExcluding(row, ['llinda', 'preu', 'inferior'], ['extra']) ??
      pickColumnLooseExcluding(row, ['umbral', 'precio', 'inferior'], ['extra']) ??
      pickColumnRegexExcluding(row, [/llinda.*preu.*x\s*<?\s*0/i, /llinda.*preu.*inferior/i], ['extra']);
    const thresholdPriceAboveCell =
      pickColumnExcludingStrict(row, SPREADSHEET_COLUMNS.thresholdPriceAbove, ['extra']) ??
      pickColumnLooseExcluding(row, ['llinda', 'preu', 'x>0'], ['extra']) ??
      pickColumnLooseExcluding(row, ['llinda', 'preu', '0<x'], ['extra']) ??
      pickColumnLooseExcluding(row, ['llinda', 'preu', 'superior'], ['extra']) ??
      pickColumnLooseExcluding(row, ['umbral', 'precio', 'superior'], ['extra']) ??
      pickColumnRegexExcluding(row, [/llinda.*preu.*x\s*>?\s*0/i, /llinda.*preu.*0\s*<\s*x/i, /llinda.*preu.*superior/i, /llinda.*preu.*max/i], ['extra']);

    if (!labels || !venueCell || !yearCell) return;
    const venueIds = parseVenueIds(venueCell);
    const year = parseYearCell(yearCell);
    const price = parseMoney(priceCell);
    if (!venueIds.length || !year) return;

    const id = buildServiceId(labels.ca || labels.es || labels.en, index);
    const quantityBased = parseBool(quantityCell, false) || ['quantity', 'quantitat', 'quantitat?', 'q', 'qty', 'quantitybased', 'yes', 'true', 'verdadero', 'vrai', 'si', 'sí'].includes(normText(quantityCell));
    const optional = parseBool(optionalCell, true);
    const unit = parseUnitStyle(unitCell);
    const dropdownOptions = parseJsonOptions(dropdownCell);
    const extraListType = normText(extrasListCell);
  const extraExtresOptions = parseExtraExtresValue(row);
    const extraUnitPair = parseNamePricePair(parseExtraUnitValue(row));
    const thresholdMain = parseMoney(thresholdMainCell);
    const thresholdFinal = parseMoney(thresholdFinalCell);
    const thresholdPriceBelow = parseMoney(thresholdPriceBelowCell);
    const thresholdPriceAbove = parseMoney(thresholdPriceAboveCell);
    const signature = `${id}|${year}|${venueIds.slice().sort().join(',')}|${quantityBased ? 1 : 0}|${optional ? 1 : 0}|${unit}|${price ?? ''}|${extraListType ?? ''}|${dropdownOptions.map(o => `${o.label}:${o.price}`).join(',')}|${extraExtresOptions.map(o => `${o.label}:${o.price}`).join(',')}|${thresholdMain ?? ''}|${thresholdFinal ?? ''}|${thresholdPriceBelow ?? ''}|${thresholdPriceAbove ?? ''}`;
    if (seen.has(signature)) return;
    seen.add(signature);

    const extra = {
      id,
      label: String(labels.ca).trim(),
      labels,
      optional,
      extraListCell: extrasListCell,
      year,
    };

    if (price !== null) extra.price = price;
    const hasThresholdData =
      thresholdMain !== null ||
      thresholdFinal !== null ||
      thresholdPriceBelow !== null ||
      thresholdPriceAbove !== null;

    if (dropdownOptions.length) {
      extra.dropdownOptions = dropdownOptions;
    }
    if (extraExtresOptions.length) {
      extra.extraExtresOptions = extraExtresOptions;
    }
    if (extraUnitPair) {
      extra.extraUnitPair = extraUnitPair;
      extra.hasExtraUnit = true;
    }
    if (wantsDropdown(extrasListCell) || extraListType.includes('despleg')) {
      extra.extraType = 'desplegable';
    } else if (extraListType.includes('llinda')) {
      extra.extraType = 'llinda';
    } else if (extraListType.includes('altres')) {
      extra.extraType = 'altres-extres';
    } else if (hasThresholdData) {
      extra.extraType = 'llinda';
    }
    if (extra.extraType === 'llinda' || hasThresholdData) {
      if (thresholdMain !== null) extra.thresholdMain = thresholdMain;
      if (thresholdFinal !== null) extra.thresholdFinal = thresholdFinal;
      if (thresholdPriceBelow !== null) extra.thresholdPriceBelow = thresholdPriceBelow;
      if (thresholdPriceAbove !== null) extra.thresholdPriceAbove = thresholdPriceAbove;
    }
    if (quantityBased) {
      extra.quantityBased = true;
      extra.unit = unit;
    } else if (unitCell) {
      extra.unit = unit;
    }

    for (const venueId of venueIds) {
      if (!extrasByVenue[venueId][year]) extrasByVenue[venueId][year] = [];
      extrasByVenue[venueId][year].push(extra);
    }
  });

  return extrasByVenue;
}

async function loadExtrasFromSpreadsheet() {
  if (typeof window === 'undefined' || typeof fetch !== 'function') return {};
  const response = await fetch(SPREADSHEET_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Spreadsheet fetch failed: ${response.status}`);
  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return {};
  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  return buildExtrasByVenue(rows);
}

// ────────────────────────────────────────────────────────────────
// 5. PRICE CONFIGURATION & VENUE-SPECIFIC PRICING
// ────────────────────────────────────────────────────────────────
//  priceMatrix[year][dayOfWeek] = list of { months, price, minGuests }
//  extras[year] = list of { id, label, price, optional }
//    optional: true = client can choose; false = always included (mandatory)
//    quantityBased: true = price calculated with input quantity
//    pricePerPerson = alternative pricing model (price per guest)
//  minimumPenaltyPerPerson = charge per person below minimum
// ────────────────────────────────────────────────────────────────

const PRICE_CONFIG = {
  vatRate: 0.10,  // IVA (10%)

  venues: {

    // ────────────────────────────────────────────────────────────
    // Dl–Dj (dies 1–4) sempre amb els mateixos preus i mínims que el Diumenge (dia 0)
    'mas-vivencs': {
      minimumPenaltyPerPerson: 75,
      priceMatrix: {
        2026: {
          6: [ // Dissabte
            { months: [6,7,9,10], price: 154, minGuests: 100 },
            { months: [5,8,11],   price: 154, minGuests: 80  },
            { months: [4],        price: 142, minGuests: 35  },
            { months: [1,2,3,12], price: 129, minGuests: 35  },
          ],
          5: [ // Divendres
            { months: [6,7,9,10],      price: 142, minGuests: 60 },
            { months: [5,8],           price: 142, minGuests: 35 },
            { months: [1,2,3,4,11,12], price: 129, minGuests: 35 },
          ],
          0: [ // Diumenge + Dl–Dj (dies 1–4, afegits al final)
            { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 129, minGuests: 35 },
          ],
          1: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 129, minGuests: 35 } ],
          2: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 129, minGuests: 35 } ],
          3: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 129, minGuests: 35 } ],
          4: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 129, minGuests: 35 } ],
        },
        2027: {
          6: [ // Dissabte
            { months: [6,7,9,10], price: 154, minGuests: 100 },
            { months: [5,8,11],   price: 154, minGuests: 80  },
            { months: [4],        price: 144, minGuests: 60  },
            { months: [1,2,3,12], price: 134, minGuests: 35  },
          ],
          5: [ // Divendres
            { months: [6,7,9,10],      price: 144, minGuests: 60 },
            { months: [5,8],           price: 144, minGuests: 35 },
            { months: [1,2,3,4,11,12], price: 134, minGuests: 35 },
          ],
          0: [ // Diumenge + Dl–Dj
            { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 134, minGuests: 35 },
          ],
          1: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 134, minGuests: 35 } ],
          2: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 134, minGuests: 35 } ],
          3: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 134, minGuests: 35 } ],
          4: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 134, minGuests: 35 } ],
        },
      },
      extras: {
        2026: [],
        2027: [],
      },
    },

    // ────────────────────────────────────────────────────────────
    'castell-de-tous': {
      minimumPenaltyPerPerson: 100,
      priceMatrix: {
        2026: {
          6: [ // Dissabte
            { months: [6,7,9,10], price: 160, minGuests: 80 },
            { months: [5,8,11],   price: 160, minGuests: 60 },
            { months: [4],        price: 147, minGuests: 35 },
            { months: [1,2,3,12], price: 135, minGuests: 35 },
          ],
          5: [ // Divendres
            { months: [6,7,9,10],      price: 147, minGuests: 45 },
            { months: [5,8],           price: 147, minGuests: 35 },
            { months: [1,2,3,4,11,12], price: 135, minGuests: 35 },
          ],
          0: [ // Diumenge + Dl–Dj
            { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 135, minGuests: 35 },
          ],
          1: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 135, minGuests: 35 } ],
          2: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 135, minGuests: 35 } ],
          3: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 135, minGuests: 35 } ],
          4: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 135, minGuests: 35 } ],
        },
        2027: {
          6: [ // Dissabte
            { months: [6,7,9,10], price: 160, minGuests: 80 },
            { months: [5,8,11],   price: 160, minGuests: 60 },
            { months: [4],        price: 150, minGuests: 45 },
            { months: [1,2,3,12], price: 140, minGuests: 35 },
          ],
          5: [ // Divendres
            { months: [6,7,9,10],      price: 150, minGuests: 45 },
            { months: [5,8],           price: 150, minGuests: 35 },
            { months: [1,2,3,4,11,12], price: 140, minGuests: 35 },
          ],
          0: [ // Diumenge + Dl–Dj
            { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 140, minGuests: 35 },
          ],
          1: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 140, minGuests: 35 } ],
          2: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 140, minGuests: 35 } ],
          3: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 140, minGuests: 35 } ],
          4: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 140, minGuests: 35 } ],
        },
      },
      extras: {
        2026: [],
        2027: [],
      },
    },

    // ────────────────────────────────────────────────────────────
    'can-macia': {
      minimumPenaltyPerPerson: 75,
      priceMatrix: {
        2026: {
          6: [ // Dissabte
            { months: [6,7,9,10], price: 154, minGuests: 120 },
            { months: [5,8,11],   price: 154, minGuests: 80  },
            { months: [4],        price: 142, minGuests: 35  },
            { months: [1,2,3,12], price: 129, minGuests: 35  },
          ],
          5: [ // Divendres
            { months: [6,7,9,10],      price: 142, minGuests: 60 },
            { months: [5,8],           price: 142, minGuests: 35 },
            { months: [1,2,3,4,11,12], price: 129, minGuests: 35 },
          ],
          0: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 129, minGuests: 35 } ],
          1: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 129, minGuests: 35 } ],
          2: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 129, minGuests: 35 } ],
          3: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 129, minGuests: 35 } ],
          4: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 129, minGuests: 35 } ],
        },
        2027: {
          6: [ // Dissabte
            { months: [6,7,9,10], price: 154, minGuests: 120 },
            { months: [5,8,11],   price: 154, minGuests: 80  },
            { months: [4],        price: 144, minGuests: 60  },
            { months: [1,2,3,12], price: 134, minGuests: 35  },
          ],
          5: [ // Divendres
            { months: [6,7,9,10],      price: 144, minGuests: 60 },
            { months: [5,8],           price: 144, minGuests: 35 },
            { months: [1,2,3,4,11,12], price: 134, minGuests: 35 },
          ],
          0: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 134, minGuests: 35 } ],
          1: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 134, minGuests: 35 } ],
          2: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 134, minGuests: 35 } ],
          3: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 134, minGuests: 35 } ],
          4: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 134, minGuests: 35 } ],
        },
      },
      extras: {
        2026: [],
        2027: [],
      },
    },

    // ────────────────────────────────────────────────────────────
    'ca-nalzina': {
      minimumPenaltyPerPerson: 75,
      priceMatrix: {
        2026: {
          6: [ // Dissabte
            { months: [6,7,9,10], price: 158, minGuests: 120 },
            { months: [5,8,11],   price: 158, minGuests: 80  },
            { months: [4],        price: 146, minGuests: 35  },
            { months: [1,2,3,12], price: 133, minGuests: 35  },
          ],
          5: [ // Divendres
            { months: [6,7,9,10],      price: 146, minGuests: 60 },
            { months: [5,8],           price: 146, minGuests: 35 },
            { months: [1,2,3,4,11,12], price: 133, minGuests: 35 },
          ],
          0: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 133, minGuests: 35 } ],
          1: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 133, minGuests: 35 } ],
          2: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 133, minGuests: 35 } ],
          3: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 133, minGuests: 35 } ],
          4: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 133, minGuests: 35 } ],
        },
        2027: {
          6: [ // Dissabte
            { months: [6,7,9,10], price: 158, minGuests: 120 },
            { months: [5,8,11],   price: 158, minGuests: 80  },
            { months: [4],        price: 148, minGuests: 60  },
            { months: [1,2,3,12], price: 138, minGuests: 35  },
          ],
          5: [ // Divendres
            { months: [6,7,9,10],      price: 148, minGuests: 60 },
            { months: [5,8],           price: 148, minGuests: 35 },
            { months: [1,2,3,4,11,12], price: 138, minGuests: 35 },
          ],
          0: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 138, minGuests: 35 } ],
          1: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 138, minGuests: 35 } ],
          2: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 138, minGuests: 35 } ],
          3: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 138, minGuests: 35 } ],
          4: [ { months: [1,2,3,4,5,6,7,8,9,10,11,12], price: 138, minGuests: 35 } ],
        },
      },
      extras: {
        2026: [],
        2027: [],
      },
    },
  },
};

const PDF_TEXT = {
  ca: {
    pdfTitle: 'Pressupost Estimat',
    refLabel: 'Referència',
    coupleLabel: 'La Parella',
    dateLabel: 'Data de la Boda',
    venueLabel: 'Finca',
    guestsLabel: 'Convidats',
    guestsUnit: n => `${n} persones`,
    detailLabel: 'Detall del Pressupost',
    conceptCol: 'Concepte',
    amountCol: 'Import',
    subtotal: 'Subtotal',
    vat: 'IVA',
    totalLabel: 'Total estimat',
    perGuest: pp => `${eur(pp)} per convidat`,
    footerNote: 'Pressupost orientatiu i no vinculant.',
    mandatory: 'obligatori',
    menuService: 'Menú i servei',
    minSupplement: 'Suplement mínim de convidats',
    dateFormat: (d, months) => `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`,
    menuDetail: (n, ppp) => `${n} convidats × ${eur(ppp)}/pers. + IVA`,
    minDetail: (short, min, pen) => `${short} pers. per sota el mínim (${min}) × ${eur(pen)}`,
    pdfMenuDetail: (n, ppp) => `${n} convidats × ${eur(ppp)}/pers.`,
    pdfMinDetail: (short, pen) => `${short} persones × ${eur(pen)}`,
    emptyState: 'Omple la finca, la data i el nombre de convidats per veure el pressupost en temps real.',
    months: MONTHS_CA,
  },
  es: {
    pdfTitle: 'Presupuesto Estimado',
    refLabel: 'Referencia',
    coupleLabel: 'La Pareja',
    dateLabel: 'Fecha de la Boda',
    venueLabel: 'Finca',
    guestsLabel: 'Invitados',
    guestsUnit: n => `${n} personas`,
    detailLabel: 'Detalle del Presupuesto',
    conceptCol: 'Concepto',
    amountCol: 'Importe',
    subtotal: 'Subtotal',
    vat: 'IVA',
    totalLabel: 'Total estimado',
    perGuest: pp => `${eur(pp)} por invitado`,
    footerNote: 'Presupuesto orientativo y no vinculante.',
    mandatory: 'obligatorio',
    menuService: 'Menú y servicio',
    minSupplement: 'Suplemento mínimo de invitados',
    dateFormat: (d, months) => `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`,
    menuDetail: (n, ppp) => `${n} invitados × ${eur(ppp)}/pers. + IVA`,
    minDetail: (short, min, pen) => `${short} pers. por debajo del mínimo (${min}) × ${eur(pen)}`,
    pdfMenuDetail: (n, ppp) => `${n} invitados × ${eur(ppp)}/pers.`,
    pdfMinDetail: (short, pen) => `${short} personas × ${eur(pen)}`,
    emptyState: 'Rellena la finca, la fecha y el número de invitados para ver el presupuesto en tiempo real.',
    months: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
  },
  en: {
    pdfTitle: 'Estimated Budget',
    refLabel: 'Reference',
    coupleLabel: 'The Couple',
    dateLabel: 'Wedding Date',
    venueLabel: 'Venue',
    guestsLabel: 'Guests',
    guestsUnit: n => `${n} people`,
    detailLabel: 'Budget Details',
    conceptCol: 'Item',
    amountCol: 'Amount',
    subtotal: 'Subtotal',
    vat: 'VAT',
    totalLabel: 'Estimated total',
    perGuest: pp => `${eur(pp)} per guest`,
    footerNote: 'Indicative and non-binding estimate.',
    mandatory: 'mandatory',
    menuService: 'Menu & service',
    minSupplement: 'Minimum guests supplement',
    dateFormat: (d, months) => `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
    menuDetail: (n, ppp) => `${n} guests × ${eur(ppp)}/person + VAT`,
    minDetail: (short, min, pen) => `${short} persons below minimum (${min}) × ${eur(pen)}`,
    pdfMenuDetail: (n, ppp) => `${n} guests × ${eur(ppp)}/person`,
    pdfMinDetail: (short, pen) => `${short} persons × ${eur(pen)}`,
    emptyState: 'Fill in the venue, date and number of guests to see the live estimate.',
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  },
};
// ────────────────────────────────────────────────────────────────
// 6. BUSINESS LOGIC & CALCULATION FUNCTIONS
// ────────────────────────────────────────────────────────────────

function lookupPrice(venueId, year, month, dow) {
  const v = PRICE_CONFIG.venues[venueId];
  if (!v || !v.priceMatrix) return null;
  // Find closest year ≤ selected
  const years = Object.keys(v.priceMatrix).map(Number).sort((a,b) => a-b);
  if (!years.length) return null;
  let usedYear = years[0];
  for (const y of years) { if (y <= year) usedYear = y; }
  const dayMatrix = v.priceMatrix[usedYear];
  if (!dayMatrix || !dayMatrix[dow]) return null;
  const row = dayMatrix[dow].find(r => r.months.includes(month));
  return row ? { ...row, year: usedYear } : null;
}

function getExtras(venueId, year) {
  const v = PRICE_CONFIG.venues[venueId];
  if (!v || !v.extras) return [];
  const years = Object.keys(v.extras).map(Number).sort((a,b) => a-b);
  if (!years.length) return [];
  let usedYear = years[0];
  for (const y of years) { if (y <= year) usedYear = y; }
  return v.extras[usedYear] || [];
}

function applySpreadsheetExtras(extrasByVenue) {
  for (const venue of VENUES) {
    const venueExtras = extrasByVenue?.[venue.id] || {};
    PRICE_CONFIG.venues[venue.id].extras = venueExtras;
  }
}

window.__uauuDataReady = loadExtrasFromSpreadsheet()
  .then(extrasByVenue => {
    applySpreadsheetExtras(extrasByVenue);
    return extrasByVenue;
  })
  .catch(err => {
    console.error('No s\'han pogut carregar els serveis des del full de càlcul:', err);
    applySpreadsheetExtras({});
    return {};
  });

function getExtraLabel(extra, lang = 'ca') {
  return String(extra?.labels?.[lang] || extra?.labels?.ca || extra?.label || '').trim();
}

function computeQuote({ venue, date, guests, selectedExtras = {}, extraQuantities, extraOptions = {}, extraVariants = {}, lang = 'ca' }) {
  if (!venue || !date || guests < 1) return null;
  const d = new Date(date + 'T12:00:00');
  const year = d.getFullYear(), month = d.getMonth() + 1, dow = d.getDay();
  const slot = lookupPrice(venue, year, month, dow);
  if (!slot) return null;

  const effectiveGuests = guests;
  const menuBase = slot.price * effectiveGuests;
  const shortfall = Math.max(0, slot.minGuests - guests);
  const penaltyAmt = shortfall > 0
    ? shortfall * (PRICE_CONFIG.venues[venue].minimumPenaltyPerPerson || 75)
    : 0;

  const allExtras = getExtras(venue, year);
  const quantities = extraQuantities || {};
  const options = extraOptions || {};
  const extrasLines = allExtras.map(e => {
    const condMandatory = e.mandatoryWhen ? e.mandatoryWhen(dow, month) : false;
    const isMandatory = !e.optional || condMandatory;
    const quantity = e.quantityBased
      ? Math.max(0, Math.round(Number(extraQuantities[e.id] || 0)))
      : null;
    const minQuantity = e.quantityBased ? (e.minQuantity ?? 0) : 0;
    const included = isMandatory || selectedExtras[e.id] === true || e.id === 'barlliure' || (e.quantityBased && quantity > 0);
    const hasQuantity = e.quantityBased ? quantity >= minQuantity : true;

    let computedPrice = 0;
    let priceDetail = null;

    let currentPrice = e.price || 0;
    let variantSuffix = "";
    const extraOpts = options[e.id] || {};
    const hasDropdownOptions = Array.isArray(e.dropdownOptions) && e.dropdownOptions.length > 0 && (e.extraType === 'desplegable' || wantsDropdown(e.extraListCell));
    const selectedDropdown = hasDropdownOptions
      ? e.dropdownOptions.find(opt => opt.id === extraOpts.dropdownSelection) || e.dropdownOptions[0]
      : null;

    if (selectedDropdown) {
      currentPrice = selectedDropdown.price;
      variantSuffix = ` (${getOptionLabel(selectedDropdown, lang)})`;
    }

    if (e.variants && extraVariants && extraVariants[e.id]) {
        const selectedVariant = e.variants.find(v => v.id === extraVariants[e.id]);
        if (selectedVariant) {
            currentPrice = selectedVariant.price;
            variantSuffix = ` (${selectedVariant.label})`;
        }
    }
    
    if (e.id === 'barlliure') {
      const extraHours = Math.min(3, Math.max(0, Number(extraOpts.hours ?? 0)));
      const hours = 2 + extraHours;
      const timing = 'advance';
      const premium = extraOpts.premium === true;
      const adults = Math.max(0, Number(extraOpts.adults ?? guests) || 0);
      const rate = year >= 2027 ? 9.5 : 9.1;
      const halfRate = year >= 2027 ? 5.5 : 5.2;
      const minRate = year >= 2027
        ? (adults <= 60 ? 630 : 0)
        : (adults <= 60 ? 550 : 0);
      const minHalfRate = year >= 2027
        ? (adults <= 60 ? 420 : 0)
        : (adults <= 60 ? 360 : 0);
      const premiumSurcharge = premium ? adults * extraHours * 2.5 : 0;
      const fullHours = Math.floor(extraHours);
      const halfHours = extraHours - fullHours >= 0.5 ? 1 : 0;
      const basePrice = (fullHours * rate + halfHours * halfRate) * adults;
      const minBase = fullHours > 0 ? minRate * fullHours : 0;
      const minHalf = halfHours > 0 ? minHalfRate : 0;
      const effectiveBase = Math.max(basePrice, minBase + minHalf);
      computedPrice = effectiveBase + premiumSurcharge;
      priceDetail = `2h incloses + ${extraHours}h extra × ${adults} adults${premium ? ' + premium' : ''}`;
    } else if (e.id === 'cookiebar') {
      computedPrice = currentPrice + (quantity * (e.extraPackPrice || 0));
      priceDetail = quantity > 0
        ? `${eur(currentPrice)} base + ${quantity} extres extra × ${eur(e.extraPackPrice || 0)}`
        : `${eur(currentPrice)} base`;
    } else if (e.extraExtresOptions && e.extraExtresOptions.length) {
      if (selectedExtras[e.id] !== true && !isMandatory) {
        computedPrice = 0;
        priceDetail = null;
      } else {
        const extraItem = e.extraExtresOptions.find(opt => opt && opt.switchMode) || e.extraExtresOptions[0];
        const rawSelection = String(extraOpts.extraSelection ?? extraOpts.switchSide ?? '').trim().toLowerCase();
        const selectedSide = rawSelection === 'left' || rawSelection === 'esquerra' || rawSelection === 'a' || rawSelection === '0'
          ? 'left'
          : rawSelection === 'right' || rawSelection === 'dreta' || rawSelection === 'b' || rawSelection === '1'
            ? 'right'
            : (extraItem.defaultSide || 'right');
        const switchPrice = selectedSide === 'left'
          ? Number(extraItem.leftPrice ?? 0)
          : Number(extraItem.rightPrice ?? 0);
        currentPrice = switchPrice;
        const leftLabel = extraItem.leftLabel || extraItem.label;
        const rightLabel = extraItem.rightLabel || extraItem.label;
        const currentLabel = selectedSide === 'left' ? leftLabel : rightLabel;
        priceDetail = `${getExtraLabel(e, lang)} · ${leftLabel} / ${rightLabel} (${currentLabel})`;
      }
    } else if (e.quantityBased) {
      const extraUnitQty = Math.max(0, Math.round(Number(extraOpts.extraUnitQty ?? 0)));
      const extraUnitPrice = Number(e.extraUnitPair?.price ?? 0);
      computedPrice = (quantity * currentPrice) + (extraUnitQty * extraUnitPrice);
      const unitLabel = e.unit === 'person' ? 'persones' : e.unit === 'pack' ? 'packs' : 'unitats';
      const extraUnitLabel = e.extraUnitPair ? ` + ${extraUnitQty} ${e.extraUnitPair.label} × ${eur(extraUnitPrice)}` : '';
      priceDetail = `${quantity} ${unitLabel}${variantSuffix} × ${eur(currentPrice)}${extraUnitLabel}`;
    } else if (e.extraUnitPair) {
      const extraUnitQty = Math.max(0, Math.round(Number(extraOpts.extraUnitQty ?? 0)));
      const extraUnitPrice = Number(e.extraUnitPair.price ?? 0);
      computedPrice = currentPrice + (extraUnitQty * extraUnitPrice);
      priceDetail = `${eur(currentPrice)}${extraUnitQty > 0 ? ` + ${extraUnitQty} ${e.extraUnitPair.label} × ${eur(extraUnitPrice)}` : ''}`;
    } else if (e.pricingFn) {
      computedPrice = e.pricingFn(guests) || 0;
      priceDetail = e.pricingFnDetail ? e.pricingFnDetail(guests) : null;
    } else if (e.pricePerPerson) {
      computedPrice = Math.max(guests * e.pricePerPerson, e.minPrice || 0);
      priceDetail = `${guests} pers. × ${eur(e.pricePerPerson)} (mínim ${eur(e.minPrice)})`;
    } else {
      computedPrice = currentPrice;
    }

    if (e.extraType === 'llinda') {
      const thresholdMain = Number(e.thresholdMain);
      const thresholdFinal = Number(e.thresholdFinal);
      const thresholdPriceBelow = Number(e.thresholdPriceBelow ?? currentPrice ?? 0);
      const thresholdPriceAbove = Number(e.thresholdPriceAbove ?? 0);
      const hasMain = Number.isFinite(thresholdMain);
      const hasFinal = Number.isFinite(thresholdFinal);

      if (hasMain && guests < thresholdMain) {
        computedPrice = Number.isFinite(thresholdPriceBelow) ? thresholdPriceBelow : 0;
        priceDetail = `Fixe (< ${thresholdMain} convidats)`;
      } else if (hasFinal && guests > thresholdFinal) {
        const diffGuests = guests - thresholdFinal;
        const basePrice = Number(e.price ?? currentPrice ?? 0);
        computedPrice = basePrice + (diffGuests * thresholdPriceAbove);
        priceDetail = `${eur(basePrice)} + (${diffGuests} × ${eur(thresholdPriceAbove)})`;
      }
    }
    
  return { ...e, isMandatory, condMandatory, included: included && hasQuantity, computedPrice, priceDetail };
  }).filter(e => e.included);

  const extrasTotal = extrasLines.reduce((s, e) => s + e.computedPrice, 0);
  const subtotal = menuBase + penaltyAmt + extrasTotal;
  const vat = subtotal * PRICE_CONFIG.vatRate;
  const total = subtotal + vat;

  return {
    year, month, dow, usedYear: slot.year,
    pricePerPerson: slot.price, minGuests: slot.minGuests,
    menuBase, shortfall, penaltyAmt,
    extrasLines: extrasLines.map(e => ({ ...e, label: getExtraLabel(e, lang) })),
    extrasTotal, subtotal, vat, total,
    perPerson: total / guests,
  };
}





