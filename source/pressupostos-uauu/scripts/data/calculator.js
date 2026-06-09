// ================================================================
//  CALCULATOR / BUSINESS LOGIC
//  Price lookups, quote generation, core calculations
// ================================================================

function lookupPrice(venueId, year, month, dow) {
  const v = PRICE_CONFIG.venues[venueId];
  if (!v || !v.priceMatrix) return null;
  
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
        const leftLabel = getOptionLabel({ labels: extraItem.leftLabels, label: extraItem.leftLabel || extraItem.label }, lang) || extraItem.leftLabel || extraItem.label;
        const rightLabel = getOptionLabel({ labels: extraItem.rightLabels, label: extraItem.rightLabel || extraItem.label }, lang) || extraItem.rightLabel || extraItem.label;
        const currentLabel = selectedSide === 'left' ? leftLabel : rightLabel;
        computedPrice = currentPrice;
        priceDetail = currentLabel;
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
