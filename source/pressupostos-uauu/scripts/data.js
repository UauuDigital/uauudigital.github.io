

// ================================================================
//  TAULES DE PREUS — Editar aquí per configurar tarifes
//  Estructura: priceMatrix[any][diaDeLaSetmana] = llista de { months, price, minGuests }
//  diaDeLaSetmana: 0=Diumenge, 1=Dl, 2=Dm, 3=Dc, 4=Dj, 5=Dv, 6=Ds
//  extras[any] = llista de { id, label, price, optional }
//    optional: true = el client pot triar; false = sempre inclòs (obligatori)
//  minimumPenaltyPerPerson: preu/persona cobrat per sota del mínim
// ================================================================

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
        2026: [
          { id: 'ceremony',     label: 'Cerimònia',     price: 1190, optional: true  },
          { id: 'dj',           label: 'DJ',             price: 1195, optional: false },
          { id: 'bridal-suite', label: 'Suite Nupcial',  price: 290,  optional: true  },
        ],
        2027: [
          { id: 'ceremony',           label: 'Cerimònia',                price: 1740, optional: true  },
          { id: 'bridal-suite',       label: 'Suite Nupcial',            price: 295,  optional: true  },
          { id: 'essential-services', label: 'Quota serveis essencials', price: 890,  optional: false },
          { id: 'dj',                 label: 'DJ',                       price: 1250, optional: false },
        ],
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
        2026: [
          { id: 'ceremony',          label: 'Cerimònia',          price: 1690, optional: true  },
          { id: 'dj',                label: 'DJ',                  price: 1195, optional: false },
          { id: 'banquet-exterior',  label: 'Banquet a l\'exterior', price: 2500, optional: true  },
        ],
        2027: [
          { id: 'ceremony',          label: 'Cerimònia',                price: 1740, optional: true  },
          { id: 'essential-services',label: 'Quota serveis essencials', price: 1490, optional: false },
          { id: 'dj',                label: 'DJ',                       price: 1250, optional: false },
          { id: 'banquet-exterior',  label: 'Banquet a l\'exterior',    price: 2500, optional: true  },
        ],
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
        2026: [
          { id: 'ceremony',         label: 'Cerimònia',          price: 1190, optional: true  },
          { id: 'dj',               label: 'DJ',                  price: 1195, optional: false },
          // Allotjament: obligatori els dissabtes de Maig–Octubre, opcional la resta
          { id: 'accommodation',    label: 'Allotjament',         price: 1190, optional: true,
            mandatoryWhen: (dow, month) => dow === 6 && [5,6,7,8,9,10].includes(month) },
          // Banquet exterior: 10€/persona, mínim 1500€
          { id: 'banquet-exterior', label: "Banquet a l'exterior", pricePerPerson: 10, minPrice: 1500, optional: true },
        ],
        2027: [
          { id: 'ceremony',           label: 'Cerimònia',                price: 1740, optional: true  },
          { id: 'essential-services', label: 'Quota serveis essencials', price: 890,  optional: false },
          { id: 'dj',                 label: 'DJ',                       price: 1250, optional: false },
          { id: 'accommodation',      label: 'Allotjament',              price: 1290, optional: true,
            mandatoryWhen: (dow, month) => dow === 6 && [5,6,7,8,9,10].includes(month) },
          { id: 'banquet-exterior',   label: "Banquet a l'exterior",     pricePerPerson: 10, minPrice: 1500, optional: true },
        ],
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
        2026: [
          { id: 'ceremony',      label: 'Cerimònia',         price: 1690, optional: true  },
          { id: 'dj',            label: 'DJ',                 price: 1195, optional: false },
          { id: 'accommodation', label: 'Allotjament',        price: 1290, optional: true,
            mandatoryWhen: (dow, month) => dow === 6 && [5,6,7,8,9,10].includes(month) },
          { id: 'garden-aperitif', label: "Aperitiu al jardí", pricePerPerson: 10, minPrice: 1000, optional: true },
        ],
        2027: [
          { id: 'ceremony',           label: 'Cerimònia',                price: 1740, optional: true  },
          { id: 'essential-services', label: 'Quota serveis essencials', price: 1490, optional: false },
          { id: 'dj',                 label: 'DJ',                       price: 1250, optional: false },
          { id: 'accommodation',      label: 'Allotjament',              price: 1390, optional: true,
            mandatoryWhen: (dow, month) => dow === 6 && [5,6,7,8,9,10].includes(month) },
          { id: 'garden-aperitif',    label: "Aperitiu al jardí",        pricePerPerson: 10, minPrice: 1000, optional: true },
        ],
      },
    },
  },
};

// ================================================================
//  FI TAULES DE PREUS
// ================================================================

const VENUES = [
  { id: 'mas-vivencs',     name: 'Mas Vivencs',      logo: 'assets/logo-mas-vivencs.png',      type: 'Mas Rural'        },
  { id: 'castell-de-tous', name: 'Castell de Tous',  logo: 'assets/logo-castell-de-tous.png',  type: 'Castell Històric' },
  { id: 'can-macia',       name: 'Can Macià',         logo: 'assets/logo-can-macia.png',        type: 'Masia Rural'      },
  { id: 'ca-nalzina',      name: "Ca n'Alzina",       logo: 'assets/logo-ca-nalzina.png',       type: 'Masia Rural'      },
];

const MONTHS_CA = ['Gener','Febrer','Març','Abril','Maig','Juny','Juliol','Agost','Setembre','Octubre','Novembre','Desembre'];
const DAYS_CA   = ['Diumenge','Dilluns','Dimarts','Dimecres','Dijous','Divendres','Dissabte'];
const DAYS_SHORT = ['Dg','Dl','Dm','Dc','Dj','Dv','Ds'];

function eur(n) {
  return new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

// ── Translations ─────────────────────────────────────────────────
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
    pdfTitle:        'Pressupost Estimat',
    refLabel:        'Referència',
    coupleLabel:     'La Parella',
    dateLabel:       'Data de la Boda',
    venueLabel:      'Finca',
    guestsLabel:     'Convidats',
    guestsUnit:      n => `${n} persones`,
    detailLabel:     'Detall del Pressupost',
    conceptCol:      'Concepte',
    amountCol:       'Import',
    pdfMenuDetail:   (n, ppp) => `${n} convidats × ${eur(ppp)}/pers.`,
    pdfMinDetail:    (short, pen) => `${short} persones × ${eur(pen)}`,
    pdfMandatory:    'obligatori',
    footerNote:      'Pressupost orientatiu i no vinculant.',
    locale:          'ca-ES',
    months:          ['Gener','Febrer','Març','Abril','Maig','Juny','Juliol','Agost','Setembre','Octubre','Novembre','Desembre'],
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
    pdfTitle:        'Presupuesto Estimado',
    refLabel:        'Referencia',
    coupleLabel:     'La Pareja',
    dateLabel:       'Fecha de la Boda',
    venueLabel:      'Finca',
    guestsLabel:     'Invitados',
    guestsUnit:      n => `${n} personas`,
    detailLabel:     'Detalle del Presupuesto',
    conceptCol:      'Concepto',
    amountCol:       'Importe',
    pdfMenuDetail:   (n, ppp) => `${n} invitados × ${eur(ppp)}/pers.`,
    pdfMinDetail:    (short, pen) => `${short} personas × ${eur(pen)}`,
    pdfMandatory:    'obligatorio',
    footerNote:      'Presupuesto orientativo y no vinculante.',
    locale:          'es-ES',
    months:          ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
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
    pdfTitle:        'Estimated Budget',
    refLabel:        'Reference',
    coupleLabel:     'The Couple',
    dateLabel:       'Wedding Date',
    venueLabel:      'Venue',
    guestsLabel:     'Guests',
    guestsUnit:      n => `${n} people`,
    detailLabel:     'Budget Details',
    conceptCol:      'Item',
    amountCol:       'Amount',
    pdfMenuDetail:   (n, ppp) => `${n} guests × ${eur(ppp)}/person`,
    pdfMinDetail:    (short, pen) => `${short} persons × ${eur(pen)}`,
    pdfMandatory:    'mandatory',
    footerNote:      'Indicative and non-binding estimate.',
    locale:          'en-GB',
    months:          ['January','February','March','April','May','June','July','August','September','October','November','December'],
  },
};


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

function computeQuote({ venue, date, guests, selectedExtras }) {
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
  const extrasLines = allExtras.map(e => {
    const condMandatory = e.mandatoryWhen ? e.mandatoryWhen(dow, month) : false;
    const isMandatory = !e.optional || condMandatory;
    const included = isMandatory || selectedExtras[e.id] === true;
    const computedPrice = e.pricePerPerson
      ? Math.max(guests * e.pricePerPerson, e.minPrice || 0)
      : (e.price || 0);
    const priceDetail = e.pricePerPerson
      ? `${guests} pers. × ${eur(e.pricePerPerson)} (mínim ${eur(e.minPrice)})`
      : null;
    return { ...e, isMandatory, condMandatory, included, computedPrice, priceDetail };
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


