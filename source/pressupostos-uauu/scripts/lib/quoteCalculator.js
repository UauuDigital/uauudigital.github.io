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

function computeQuote({ venue, date, guests, selectedExtras = {}, extraQuantities = {} }) {
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
    const quantity = e.quantityBased ? Math.max(0, Math.round(Number(quantities[e.id] || 0))) : null;
    const included = e.quantityBased
      ? true
      : (isMandatory || selectedExtras[e.id] === true);
    const computedPrice = e.quantityBased
      ? quantity * (e.price || 0)
      : (e.pricePerPerson
        ? Math.max(guests * e.pricePerPerson, e.minPrice || 0)
        : (e.price || 0));
    const priceDetail = e.quantityBased
      ? `${quantity} ${quantity === 1 ? 'pack' : 'packs'} × ${eur(e.price)}`
      : (e.pricePerPerson
        ? `${guests} pers. × ${eur(e.pricePerPerson)} (mínim ${eur(e.minPrice)})`
        : null);
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

// ================================================================
//  TRADUCCIONS DELS EXTRAS PER QUANTITAT
// ================================================================

function getExtraLabel(extraId, lang) {
  const idToKey = {
    'ressopo': 'supper',
    'menu-staff': 'staffmenu',
    'menu-infantil': 'childrenmenu',
  };
  const key = idToKey[extraId];
  return key ? T[lang]?.[key] : null;
}
