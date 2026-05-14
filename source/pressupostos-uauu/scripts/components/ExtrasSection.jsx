function ExtrasSection({
  venueId,
  year,
  date,
  guests,
  selectedExtras,
  extraQuantities,
  extraOptions,
  extraVariants,
  onChange,
  onQuantityChange,
  onOptionChange,
  onVariantChange,
  lang
}) {
  if (!venueId || !year) return null;
  const extras = getExtras(venueId, year).filter(e => !['menu-staff', 'menu-infantil'].includes(e.id));
  if (!extras.length) return null;

  function quantityUnitLabel(extra) {
    if (extra.unit === 'person') return 'persones';
    if (extra.unit === 'pack') return 'packs';
    return 'unitats';
  }

  function quantityInputLabel(extra) {
    if (extra.unit === 'person') return 'Quantes persones?';
    if (extra.unit === 'pack') return 'Quants packs?';
    return 'Quantes unitats?';
  }

  const dow = date ? new Date(date + 'T12:00:00').getDay() : null;
  const month = date ? new Date(date + 'T12:00:00').getMonth() + 1 : null;

  return (
    <div className="form-section">
      <div className="section-title">Serveis addicionals</div>
      {extras.map(e => {
        const condMandatory = e.mandatoryWhen && dow !== null ? e.mandatoryWhen(dow, month) : false;
        const isMandatory = !e.optional || condMandatory;
        const quantity = e.quantityBased ? (extraQuantities?.[e.id] ?? 0) : null;
        const opts = extraOptions?.[e.id] || {};
        const isCookieBar = e.id === 'cookiebar';
        const isBarLliure = e.id === 'barlliure';

        let currentPrice = e.price || 0;
        if (e.variants && extraVariants?.[e.id]) {
          const variant = e.variants.find(v => v.id === extraVariants[e.id]);
          if (variant) currentPrice = variant.price;
        } else if (e.pricingFn) {
          currentPrice = e.pricingFn(guests) || 0;
        }

        const priceLabel = isCookieBar
          ? `${eur(currentPrice)} base + ${eur(e.extraPackPrice || 0)}/extra + IVA`
          : isBarLliure
            ? `2h incloses`
            : e.quantityBased
              ? `${eur(currentPrice)}/${quantityUnitLabel(e)} + IVA`
              : e.pricePerPerson
                ? `${eur(e.pricePerPerson)}/pers. (mínim ${eur(e.minPrice)}) + IVA`
                : `${eur(currentPrice)} + IVA`;

        const mandatoryLabel = condMandatory ? 'Obligatori (data sel.)' : 'Obligatori';

        return (
          <div key={e.id} className="extra-item">
            <div className="extra-info">
              <div className="extra-label">
                {getExtraLabel(e.id, lang) || e.label}
                {isMandatory && <span className="extra-badge badge-mandatory">{mandatoryLabel}</span>}
              </div>

              {e.variants && (e.quantityBased ? quantity > 0 : selectedExtras[e.id]) && (
                <select
                  className="variant-select"
                  value={extraVariants?.[e.id] || e.variants[0].id}
                  onChange={(ev) => onVariantChange(e.id, ev.target.value)}
                  style={{ marginTop: '8px', display: 'block' }}
                >
                  {e.variants.map(v => (
                    <option key={v.id} value={v.id}>
                      {getExtraLabel(v.id, lang) || v.label || v.labelKey || v.id} ({eur(v.price)})
                    </option>
                  ))}
                </select>
              )}

              <div className="extra-price">{priceLabel}</div>
            </div>

            {isBarLliure ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div className="extra-quantity" style={{ marginLeft: 0 }}>
                  <input
                    className="extra-quantity-input"
                    type="number"
                    min={0}
                    step={1}
                    value={opts.adults ?? guests}
                    onChange={ev => onOptionChange(e.id, 'adults', Math.max(0, Number(ev.target.value) || 0))}
                    aria-label="Nombre d'adults barra lliure"
                  />
                  <span className="extra-quantity-unit">adults</span>
                </div>
                <div className="extra-quantity" style={{ marginLeft: 0 }}>
                  <input
                    className="extra-quantity-input"
                    type="number"
                    min={0}
                    max={3}
                    step={0.5}
                    value={opts.hours ?? 0}
                    onChange={ev => onOptionChange(e.id, 'hours', Math.max(0, Math.min(3, Number(ev.target.value) || 0)))}
                    aria-label="Hores extres de barra lliure"
                  />
                  <span className="extra-quantity-unit">hores extres</span>
                </div>
                <div className="extra-toggle" style={{ marginLeft: 0 }}>
                  <button className={`toggle-btn ${opts.premium ? 'active' : ''}`} onClick={() => onOptionChange(e.id, 'premium', true)}>Premium</button>
                  <button className={`toggle-btn ${!opts.premium ? 'active' : ''}`} onClick={() => onOptionChange(e.id, 'premium', false)}>Normal</button>
                </div>
              </div>
            ) : isCookieBar ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div className="extra-toggle">
                  <button className={`toggle-btn ${selectedExtras[e.id] ? 'active' : ''}`} onClick={() => onChange(e.id, true)}>Sí</button>
                  <button className={`toggle-btn ${!selectedExtras[e.id] ? 'active' : ''}`} onClick={() => onChange(e.id, false)}>No</button>
                </div>
                {selectedExtras[e.id] && (
                  <div className="extra-quantity" style={{ marginLeft: 0 }}>
                    <input
                      className="extra-quantity-input"
                      type="number"
                      min={0}
                      step={1}
                      value={quantity}
                      onChange={ev => onQuantityChange(e.id, normalizeQuantity(ev.target.value))}
                      aria-label={`${e.label} extres`}
                    />
                    <span className="extra-quantity-unit">extres</span>
                  </div>
                )}
              </div>
            ) : e.quantityBased ? (
              <div className="extra-quantity">
                <input
                  className="extra-quantity-input"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  placeholder="0"
                  value={quantity}
                  onChange={ev => onQuantityChange(e.id, normalizeQuantity(ev.target.value))}
                  aria-label={quantityInputLabel(e)}
                  title={quantityInputLabel(e)}
                />
                <span className="extra-quantity-unit">{quantityUnitLabel(e)}</span>
              </div>
            ) : isMandatory ? (
              <div style={{ fontSize: 12, fontFamily: 'var(--font-sans)', letterSpacing: '0.1em', color: 'var(--color-muted)', textTransform: 'uppercase', marginLeft: 16 }}>Inclòs</div>
            ) : (
              <div className="extra-toggle">
                <button className={`toggle-btn ${selectedExtras[e.id] ? 'active' : ''}`} onClick={() => onChange(e.id, true)}>Sí</button>
                <button className={`toggle-btn ${!selectedExtras[e.id] ? 'active' : ''}`} onClick={() => onChange(e.id, false)}>No</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
