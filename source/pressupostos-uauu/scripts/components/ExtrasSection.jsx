function ExtrasSection({
  venueId,
  year,
  date,
  guests,
  selectedExtras,
  extraQuantities,
  extraVariants,
  onChange,
  onQuantityChange,
  onVariantChange,
  lang
}) {
  if (!venueId || !year) return null;
  const extras = getExtras(venueId, year).filter(e => !['menu-staff', 'menu-infantil'].includes(e.id));
  if (!extras.length) return null;

  const t = T[lang] || T.ca;
  const dow = date ? new Date(date + 'T12:00:00').getDay() : null;
  const month = date ? new Date(date + 'T12:00:00').getMonth() + 1 : null;

  return (
    <div className="form-section">
      <div className="section-title">Serveis addicionals</div>
      {extras.map(e => {
        const condMandatory = e.mandatoryWhen && dow !== null ? e.mandatoryWhen(dow, month) : false;
        const isMandatory = !e.optional || condMandatory;
        const quantity = e.quantityBased ? (extraQuantities?.[e.id] ?? 0) : null;
        const isCookieBar = e.id === 'cookiebar';

        let currentPrice = e.price || 0;
        if (e.variants && extraVariants?.[e.id]) {
          const variant = e.variants.find(v => v.id === extraVariants[e.id]);
          if (variant) currentPrice = variant.price;
        } else if (e.pricingFn) {
          currentPrice = e.pricingFn(guests) || 0;
        }

        const priceLabel = isCookieBar
          ? `${eur(currentPrice)} base + ${eur(e.extraPackPrice || 0)}/extra + IVA`
          : e.quantityBased
            ? `${eur(currentPrice)}/${e.unit === 'unit' ? 'unit.' : 'pack'} + IVA`
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

            {isCookieBar ? (
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
                  value={quantity}
                  onChange={ev => onQuantityChange(e.id, normalizeQuantity(ev.target.value))}
                  aria-label={`${e.label} quantitat`}
                />
                <span className="extra-quantity-unit">{e.unit === 'unit' ? 'unit.' : 'pack'}</span>
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