

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
  venue: ['masia', 'finca', 'venue'],
  year: ['any', 'curs'],
  price: ['preu', 'import'],
  unit: ['estil d\'unitat', 'unitat', 'unit style'],
  quantity: ['quantityBased'],
  optional: ['si es opcional', 'opcional', 'optional'],
};

function pickColumn(row, keys) {
  for (const key of Object.keys(row)) {
    const normalizedKey = normText(key);
    if (keys.some(alias => normalizedKey === normText(alias) || normalizedKey.includes(normText(alias)) || normText(alias).includes(normalizedKey))) {
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

function buildExtrasByVenue(rows) {
  const extrasByVenue = {};
  for (const venue of VENUES) extrasByVenue[venue.id] = {};
  const seen = new Set();

  rows.forEach((row, index) => {
    const label = pickColumn(row, SPREADSHEET_COLUMNS.name);
    const venueCell = pickColumn(row, SPREADSHEET_COLUMNS.venue);
    const yearCell = pickColumn(row, SPREADSHEET_COLUMNS.year);
    const priceCell = pickColumn(row, SPREADSHEET_COLUMNS.price);
    const unitCell = pickColumn(row, SPREADSHEET_COLUMNS.unit);
    const quantityCell = pickColumn(row, SPREADSHEET_COLUMNS.quantity) ?? pickColumnLoose(row, ['quantity', 'based']);
    const optionalCell = pickColumn(row, SPREADSHEET_COLUMNS.optional);

    if (!label || !venueCell || !yearCell) return;
    const venueIds = parseVenueIds(venueCell);
    const year = parseYearCell(yearCell);
    const price = parseMoney(priceCell);
    if (!venueIds.length || !year) return;

    const id = buildServiceId(label, index);
    const quantityBased = parseBool(quantityCell, false) || ['quantity', 'quantitat', 'quantitat?', 'q', 'qty', 'quantitybased', 'yes', 'true', 'verdadero', 'vrai', 'si', 'sí'].includes(normText(quantityCell));
    const optional = parseBool(optionalCell, true);
    const unit = parseUnitStyle(unitCell);
    const signature = `${id}|${year}|${venueIds.slice().sort().join(',')}|${quantityBased ? 1 : 0}|${optional ? 1 : 0}|${unit}|${price ?? ''}`;
    if (seen.has(signature)) return;
    seen.add(signature);

    const extra = {
      id,
      label: String(label).trim(),
      optional,
      year,
    };

    if (price !== null) extra.price = price;
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

// ────────────────────────────────────────────────────────────────
// 6. TRANSLATIONS
// ────────────────────────────────────────────────────────────────

const T = {
  ca: {
    exportBtn:       'Exportar PDF',
    weddingDate:     'Data de la boda',
    pending:         '— pendent —',
    emptyState:      'Omple la finca, la data i el nombre de convidats per veure el pressupost en temps real.',
    menuService:     'Menú i servei',
    guestsX:         (n, ppp) => `${n} convidats × ${eur(ppp)}/pers. + IVA`,
    minSupplement:   'Suplement mínim de convidats',
    minDetail:       (short, min, pen) => `${short} pers. per sota el mínim (${min}) × ${eur(pen)}`,
    mandatory:       'obligatori',
    subtotal:        'Subtotal',
    vat:             'IVA',
    totalLabel:      'Total estimat',
    perGuest:        pp => `${eur(pp)} per convidat`,
    minWarn:         (min, pen) => `Per sota del mínim de ${min} convidats. S'aplica suplement de ${eur(pen)}/pers.`,
    note:            'Pressupost orientatiu i no vinculant.',
    // PDF
    pdfTitle:            'Pressupost Estimat',
    refLabel:            'Referència',
    coupleLabel:         'La Parella',
    dateLabel:           'Data de la Boda',
    venueLabel:          'Finca',
    guestsLabel:         'Convidats',
    guestsUnit:          n => `${n} persones`,
    detailLabel:         'Detall del Pressupost',
    conceptCol:          'Concepte',
    amountCol:           'Import',
    pdfMenuDetail:       (n, ppp) => `${n} convidats × ${eur(ppp)}/pers.`,
    pdfMinDetail:        (short, pen) => `${short} persones × ${eur(pen)}`,
    pdfMandatory:        'obligatori',
    footerNote:          'Pressupost orientatiu i no vinculant.',
    locale:              'ca-ES',
    months:              ['Gener','Febrer','Març','Abril','Maig','Juny','Juliol','Agost','Setembre','Octubre','Novembre','Desembre'],
    supper:              'Ressopó',
    staffmenu:           'Menú Staff',
    childrenmenu:        'Menú infantil',
    essentialQuota:      'Quota serveis essencials',
    ceremony:            'Cerimònia',
    bridalsuite:         'La Suite',
    banquetexterior:     'Banquet a l\'exterior',
    accommodation:       'Allotjament',
    gardenaperitif:      'Aperitiu al jardí',
    espatllaibericacebo: 'Espatlla ibèrica de cebo',
    espatllaibericagla:  'Espatlla ibèrica de gla 5J',
    pernilibericcebo:    'Pernil ibèric de cebo',
    pernilibericgla:     'Pernil ibèric de gla 5J',
    pernil:              'Pernil amb pa amb tomàquet',
  },
  es: {
    exportBtn:       'Exportar PDF',
    weddingDate:     'Fecha de la boda',
    pending:         '— pendiente —',
    emptyState:      'Rellena la finca, la fecha y el número de invitados para ver el presupuesto en tiempo real.',
    menuService:     'Menú y servicio',
    guestsX:         (n, ppp) => `${n} invitados × ${eur(ppp)}/pers. + IVA`,
    minSupplement:   'Suplemento mínimo de invitados',
    minDetail:       (short, min, pen) => `${short} pers. por debajo del mínimo (${min}) × ${eur(pen)}`,
    mandatory:       'obligatorio',
    subtotal:        'Subtotal',
    vat:             'IVA',
    totalLabel:      'Total estimado',
    perGuest:        pp => `${eur(pp)} por invitado`,
    minWarn:         (min, pen) => `Por debajo del mínimo de ${min} invitados. Se aplica suplemento de ${eur(pen)}/pers.`,
    note:            'Presupuesto orientativo y no vinculante.',
    // PDF
    pdfTitle:            'Presupuesto Estimado',
    refLabel:            'Referencia',
    coupleLabel:         'La Pareja',
    dateLabel:           'Fecha de la Boda',
    venueLabel:          'Finca',
    guestsLabel:         'Invitados',
    guestsUnit:          n => `${n} personas`,
    detailLabel:         'Detalle del Presupuesto',
    conceptCol:          'Concepto',
    amountCol:           'Importe',
    pdfMenuDetail:       (n, ppp) => `${n} invitados × ${eur(ppp)}/pers.`,
    pdfMinDetail:        (short, pen) => `${short} personas × ${eur(pen)}`,
    pdfMandatory:        'obligatorio',
    footerNote:          'Presupuesto orientativo y no vinculante.',
    locale:              'es-ES',
    months:              ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    supper:              'Resopó',
    staffmenu:           'Menú Staff',
    childrenmenu:        'Menú infantil',
    essentialQuota:      'Cuota servicios esenciales',
    ceremony:            'Cerimonia',
    bridalsuite:         'La Suite',
    banquetexterior:     'Banquete al exterior',
    accommodation:       'Alojamiento',
    gardenaperitif:      'Aperitiu al jardí',
    espatllaibericacebo: 'Paletilla ibérica de cebo',
    espatllaibericagla:  'Paletilla ibérica de bellotaj 5J',
    pernilibericcebo:    'Jamón ibérico de cebo',
    pernilibericgla:     'Jamón ibérico 5J de bellota',
    pernil:              'Jamón con pan con tomate',
  },
  en: {
    exportBtn:       'Export PDF',
    weddingDate:     'Wedding date',
    pending:         '— pending —',
    emptyState:      'Fill in the venue, date and number of guests to see the live estimate.',
    menuService:     'Menu & service',
    guestsX:         (n, ppp) => `${n} guests × ${eur(ppp)}/person + VAT`,
    minSupplement:   'Minimum guests supplement',
    minDetail:       (short, min, pen) => `${short} persons below minimum (${min}) × ${eur(pen)}`,
    mandatory:       'mandatory',
    subtotal:        'Subtotal',
    vat:             'VAT',
    totalLabel:      'Estimated total',
    perGuest:        pp => `${eur(pp)} per guest`,
    minWarn:         (min, pen) => `Below minimum of ${min} guests. A supplement of ${eur(pen)}/person applies.`,
    note:            'Indicative and non-binding estimate.',
    // PDF
    pdfTitle:            'Estimated Budget',
    refLabel:            'Reference',
    coupleLabel:         'The Couple',
    dateLabel:           'Wedding Date',
    venueLabel:          'Venue',
    guestsLabel:         'Guests',
    guestsUnit:          n => `${n} people`,
    detailLabel:         'Budget Details',
    conceptCol:          'Item',
    amountCol:           'Amount',
    pdfMenuDetail:       (n, ppp) => `${n} guests × ${eur(ppp)}/person`,
    pdfMinDetail:        (short, pen) => `${short} persons × ${eur(pen)}`,
    pdfMandatory:        'mandatory',
    footerNote:          'Indicative and non-binding estimate.',
    locale:              'en-GB',
    months:              ['January','February','March','April','May','June','July','August','September','October','November','December'],
    supper:              'Late night snack',
    staffmenu:           'Staff menu',
    childrenmenu:        'Children menu',
    essentialQuota:      'Essential services fee',
    ceremony:            'Ceremony',
    bridalsuite:         'The Suite',
    banquetexterior:     'Outdoor banquet',
    accommodation:       'Accommodation',
    gardenaperitif:      'Garden Aperitif',
    gardenaperitif:      'Aperitiu al jardí',
    espatllaibericacebo: 'Iberian shoulder ham',
    espatllaibericagla:  '5J Iberian shoulder ham',
    pernilibericcebo:    'Iberian ham',
    pernilibericgla:     '5J Iberian ham',
    pernil:              'Ham with tomato bread',
  },
};

// ────────────────────────────────────────────────────────────────
// 7. BUSINESS LOGIC & CALCULATION FUNCTIONS
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

function computeQuote({ venue, date, guests, selectedExtras = {}, extraQuantities, extraOptions = {}, extraVariants = {} }) {
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
    } else if (e.quantityBased) {
      computedPrice = quantity * currentPrice;
      const unitLabel = e.unit === 'person' ? 'persones' : e.unit === 'pack' ? 'packs' : 'unitats';
      priceDetail = `${quantity} ${unitLabel}${variantSuffix} × ${eur(currentPrice)}`;
    } else if (e.pricingFn) {
      computedPrice = e.pricingFn(guests) || 0;
      priceDetail = e.pricingFnDetail ? e.pricingFnDetail(guests) : null;
    } 
    else if (e.pricePerPerson) {
      computedPrice = Math.max(guests * e.pricePerPerson, e.minPrice || 0);
      priceDetail = `${guests} pers. × ${eur(e.pricePerPerson)} (mínim ${eur(e.minPrice)})`;
    } 
    else {
      computedPrice = currentPrice;
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
    extrasLines, extrasTotal, subtotal, vat, total,
    perPerson: total / guests,
  };
}

function getExtraLabel(extraId, variantIdOrLang, maybeLang) {
  const lang = maybeLang ?? variantIdOrLang;
  const idToKey = {
    'ressopo': 'supper',
    'staffmenu': 'staffmenu',
    'childrenmenu': 'childrenmenu',
    'essential-services': 'essentialQuota',
    'ceremony': 'ceremony',
    'bridalsuite': 'bridalsuite',
    'banquetexterior': 'banquetexterior',
    'accommodation': 'accommodation',
    'gardenaperitif': 'gardenaperitif',
    'espatllaibericacebo': 'espatllaibericacebo',
    'espatllaibericagla': 'espatllaibericagla',
    'pernilibericcebo': 'pernilibericcebo',
    'pernilibericgla': 'pernilibericgla',
    'pernil': 'pernil',
  };
  const key = idToKey[extraId];
  return key ? T[lang]?.[key] : null;
}
