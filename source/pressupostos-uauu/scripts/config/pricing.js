// ================================================================
//  TAULES DE PREUS — Editar aquí per configurar tarifes
//  Estructura: priceMatrix[any][diaDeLaSetmana] = llista de { months, price, minGuests }
//  diaDeLaSetmana: 0=Diumenge, 1=Dl, 2=Dm, 3=Dc, 4=Dj, 5=Dv, 6=Ds
//  extras[any] = llista de { id, label, price, optional }
//    optional: true = el client pot triar; false = sempre inclòs (obligatori)
//    quantityBased: true = el preu es calcula amb una quantitat introduïda
//  minimumPenaltyPerPerson: preu/persona cobrat per sota del mínim
// ================================================================

const QUANTITY_EXTRAS = {
  2026: [
    { id: 'ressopo',       label: 'Ressopó',        price: 265, unit: 'pack',   quantityBased: true, optional: true },
    { id: 'menu-staff',    label: 'Menú Staff',     price: 85,  unit: 'person', quantityBased: true, optional: true },
    { id: 'menu-infantil', label: 'Menú infantil',  price: 65,  unit: 'person', quantityBased: true, optional: true },
  ],
  2027: [
    { id: 'ressopo',       label: 'Ressopó',        price: 275, unit: 'pack',   quantityBased: true, optional: true },
    { id: 'menu-staff',    label: 'Menú Staff',     price: 85,  unit: 'person', quantityBased: true, optional: true },
    { id: 'menu-infantil', label: 'Menú infantil',  price: 68,  unit: 'person', quantityBased: true, optional: true },
  ],
};

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
          ...QUANTITY_EXTRAS[2026],
        ],
        2027: [
          { id: 'ceremony',           label: 'Cerimònia',                price: 1740, optional: true  },
          { id: 'bridal-suite',       label: 'Suite Nupcial',            price: 295,  optional: true  },
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
          { id: 'banquet-exterior',  label: 'Banquet a l\'exterior', price: 2500, optional: true  },
          ...QUANTITY_EXTRAS[2026],
        ],
        2027: [
          { id: 'ceremony',          label: 'Cerimònia',                price: 1740, optional: true  },
          { id: 'essential-services',label: 'Quota serveis essencials', price: 1490, optional: false },
          { id: 'dj',                label: 'DJ',                       price: 1250, optional: false },
          { id: 'banquet-exterior',  label: 'Banquet a l\'exterior',    price: 2500, optional: true  },
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
          { id: 'banquet-exterior', label: "Banquet a l'exterior", pricePerPerson: 10, minPrice: 1500, optional: true },
          ...QUANTITY_EXTRAS[2026],
        ],
        2027: [
          { id: 'ceremony',           label: 'Cerimònia',                price: 1740, optional: true  },
          { id: 'essential-services', label: 'Quota serveis essencials', price: 890,  optional: false },
          { id: 'dj',                 label: 'DJ',                       price: 1250, optional: false },
          { id: 'accommodation',      label: 'Allotjament',              price: 1290, optional: true,
            mandatoryWhen: (dow, month) => dow === 6 && [5,6,7,8,9,10].includes(month) },
          { id: 'banquet-exterior',   label: "Banquet a l'exterior",     pricePerPerson: 10, minPrice: 1500, optional: true },
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
          { id: 'garden-aperitif', label: "Aperitiu al jardí", pricePerPerson: 10, minPrice: 1000, optional: true },
          ...QUANTITY_EXTRAS[2026],
        ],
        2027: [
          { id: 'ceremony',           label: 'Cerimònia',                price: 1740, optional: true  },
          { id: 'essential-services', label: 'Quota serveis essencials', price: 1490, optional: false },
          { id: 'dj',                 label: 'DJ',                       price: 1250, optional: false },
          { id: 'accommodation',      label: 'Allotjament',              price: 1390, optional: true,
            mandatoryWhen: (dow, month) => dow === 6 && [5,6,7,8,9,10].includes(month) },
          { id: 'garden-aperitif',    label: "Aperitiu al jardí",        pricePerPerson: 10, minPrice: 1000, optional: true },
          ...QUANTITY_EXTRAS[2027],
        ],
      },
    },
  },
};

// ================================================================
//  FI TAULES DE PREUS
// ================================================================
