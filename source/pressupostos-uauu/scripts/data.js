

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

// ────────────────────────────────────────────────────────────────
// 2. UTILITY FUNCTIONS
// ────────────────────────────────────────────────────────────────

function eur(n) {
  return new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
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
// 4. QUANTITY-BASED EXTRAS (used in pricing config)
// ────────────────────────────────────────────────────────────────

const QUANTITY_EXTRAS = {
  2026: [
    { id: 'ressopo',      label: 'Ressopó',        price: 265, unit: 'pack',   quantityBased: true, optional: true },
    { id: 'staffmenu',    label: 'Menú Staff',     price: 85,  unit: 'person', quantityBased: true, optional: true },
    { id: 'childrenmenu', label: 'Menú infantil',  price: 65,  unit: 'person', quantityBased: true, optional: true },
    { id: 'sushi',        label: 'Sushi',          price: 750,                                      optional: true,
      pricingFn: guests => {
        if (guests < 35) return 0;
        if (guests <= 80) return 750;
        return 750 + (guests - 80) * 4;
      },
      pricingFnDetail: guests => {
       if (guests < 35) return null;
       if (guests <= 80) return '750€';
       return `750€ + ${guests - 80}pers. × 4€`;  
      }
    },
    { id: 'pernil',       label: 'Pernil amb pa amb tomàquet', unit: 'unit',                        optional: true,
      variants: [
        { id: 'res',                  labelKey: ' ',                          price: 0    },
        { id: 'espatllaibericacebo',  labelKey: 'Espatlla ibèrica de cebo',   price: 580  },
        { id: 'espatllaibericagla',   labelKey: 'Espatlla ibèrica de gla 5J', price: 690  },
        { id: 'pernilibericcebo',     labelKey: 'Pernil ibèric de cebo:',     price: 765  },
        { id: 'pernilibericgla',      labelKey: 'Pernil ibèric de gla 5J',    price: 1150 }
      ]
    },
    { id: 'baobar',       label: 'Bao bar',        price: 590,                                      optional: true,
      pricingFn: guests => {
        if (guests < 35) return 0;
        if (guests <= 80) return 590;
        return 590 + (guests - 80) * 2.5;
      },
      pricingFnDetail: guests => {
       if (guests < 35) return null;
       if (guests <= 80) return '590';
       return `590€ + ${guests - 80}pers. × 2.5€`;  
      }
    },
    { id: 'candybar',     label: 'Candy bar',      price: 420,                                      optional: true },
    { id: 'cookiebar',    label: 'Cookie bar',     price: 320, extraPackPrice: 50, unit: 'pack', quantityBased: true, optional: true },

  ],
  2027: [
    { id: 'ressopo',      label: 'Ressopó',        price: 275, unit: 'pack',   quantityBased: true, optional: true },
    { id: 'staffmenu',    label: 'Menú Staff',     price: 85,  unit: 'person', quantityBased: true, optional: true },
    { id: 'childrenmenu', label: 'Menú infantil',  price: 68,  unit: 'person', quantityBased: true, optional: true },
    { id: 'sushi',        label: 'Sushi',          price: 750,                                      optional: true,
      pricingFn: guests => {
        if (guests < 35) return 0;
        if (guests <= 80) return 750;
        return 750 + (guests - 80) * 4;
      },
      pricingFnDetail: guests => {
       if (guests < 35) return null;
       if (guests <= 80) return '750€';
       return `750€ + ${guests - 80}pers. × 4€`;  
      }
    },
    { id: 'pernil',       label: 'Pernil amb pa amb tomàquet', unit: 'unit',                        optional: true,
      variants: [
        { id: 'res',                  labelKey: ' ',                          price: 0    },
        { id: 'espatllaibericacebo',  labelKey: 'Espatlla ibèrica de cebo',   price: 620  },
        { id: 'espatllaibericagla',   labelKey: 'Espatlla ibèrica de gla 5J', price: 730  },
        { id: 'pernilibericcebo',     labelKey: 'Pernil ibèric de cebo:',     price: 790  },
        { id: 'pernilibericgla',      labelKey: 'Pernil ibèric de gla 5J',    price: 1195 }
      ]
    },
    { id: 'candybar',     label: 'Candy bar',      price: 420,                                      optional: true },
  ],
};

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
        2026: [
          { id: 'ceremony',     label: 'Cerimònia',     price: 1190, optional: true  },
          { id: 'dj',           label: 'DJ',             price: 1195, optional: false },
          { id: 'bridalsuite', label: 'Suite Nupcial',  price: 290,  optional: true  },
          ...QUANTITY_EXTRAS[2026],
        ],
        2027: [
          { id: 'ceremony',           label: 'Cerimònia',                price: 1740, optional: true  },
          { id: 'bridalsuite',       label: 'Suite Nupcial',            price: 295,  optional: true  },
          { id: 'essential-services', label: 'Quota serveis essencials', price: 890,  optional: false },
          { id: 'dj',                 label: 'DJ',                       price: 1250, optional: false },
          ...QUANTITY_EXTRAS[2027],
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
          { id: 'banquetexterior',  label: 'Banquet a l\'exterior', price: 2500, optional: true  },
          ...QUANTITY_EXTRAS[2026],
        ],
        2027: [
          { id: 'ceremony',          label: 'Cerimònia',                price: 1740, optional: true  },
          { id: 'essential-services',label: 'Quota serveis essencials', price: 1490, optional: false },
          { id: 'dj',                label: 'DJ',                       price: 1250, optional: false },
          { id: 'banquetexterior',  label: 'Banquet a l\'exterior',    price: 2500, optional: true  },
          ...QUANTITY_EXTRAS[2027],
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
          { id: 'banquetexterior', label: "Banquet a l'exterior", pricePerPerson: 10, minPrice: 1500, optional: true },
          ...QUANTITY_EXTRAS[2026],
        ],
        2027: [
          { id: 'ceremony',           label: 'Cerimònia',                price: 1740, optional: true  },
          { id: 'essential-services', label: 'Quota serveis essencials', price: 890,  optional: false },
          { id: 'dj',                 label: 'DJ',                       price: 1250, optional: false },
          { id: 'accommodation',      label: 'Allotjament',              price: 1290, optional: true,
            mandatoryWhen: (dow, month) => dow === 6 && [5,6,7,8,9,10].includes(month) },
          { id: 'banquetexterior',   label: "Banquet a l'exterior",     pricePerPerson: 10, minPrice: 1500, optional: true },
          ...QUANTITY_EXTRAS[2027],
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
          { id: 'gardenaperitif', label: "Aperitiu al jardí", pricePerPerson: 10, minPrice: 1000, optional: true },
          ...QUANTITY_EXTRAS[2026],
        ],
        2027: [
          { id: 'ceremony',           label: 'Cerimònia',                price: 1740, optional: true  },
          { id: 'essential-services', label: 'Quota serveis essencials', price: 1490, optional: false },
          { id: 'dj',                 label: 'DJ',                       price: 1250, optional: false },
          { id: 'accommodation',      label: 'Allotjament',              price: 1390, optional: true,
            mandatoryWhen: (dow, month) => dow === 6 && [5,6,7,8,9,10].includes(month) },
          { id: 'gardenaperitif',    label: "Aperitiu al jardí",        pricePerPerson: 10, minPrice: 1000, optional: true },
          ...QUANTITY_EXTRAS[2027],
        ],
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

function computeQuote({ venue, date, guests, selectedExtras = {}, extraQuantities, extraVariants = {} }) {
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
  const extrasLines = allExtras.map(e => {
    const condMandatory = e.mandatoryWhen ? e.mandatoryWhen(dow, month) : false;
    const isMandatory = !e.optional || condMandatory;
    const quantity = e.quantityBased
      ? Math.max(0, Math.round(Number(extraQuantities[e.id] || 0)))
      : null;
    const minQuantity = e.quantityBased ? (e.minQuantity ?? 0) : 0;
    const included = isMandatory || selectedExtras[e.id] === true;
    const hasQuantity = e.quantityBased ? quantity >= minQuantity : true;

    let computedPrice = 0;
    let priceDetail = null;

    let currentPrice = e.price || 0;
    let variantSuffix = "";

    if (e.variants && extraVariants && extraVariants[e.id]) {
        const selectedVariant = e.variants.find(v => v.id === extraVariants[e.id]);
        if (selectedVariant) {
            currentPrice = selectedVariant.price;
            variantSuffix = ` (${selectedVariant.label})`;
        }
    }
    
    if (e.id === 'cookiebar') {
      computedPrice = currentPrice + (quantity * (e.extraPackPrice || 0));
      priceDetail = quantity > 0
        ? `${eur(currentPrice)} base + ${quantity} extres extra × ${eur(e.extraPackPrice || 0)}`
        : `${eur(currentPrice)} base`;
    } else if (e.quantityBased) {
      computedPrice = quantity * currentPrice;
      // Actualitzem el detall amb el nom de la variant si existeix
      priceDetail = `${quantity} ${e.unit === 'unit' ? 'unit.' : 'pack/s'}${variantSuffix} × ${eur(currentPrice)}`;
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
