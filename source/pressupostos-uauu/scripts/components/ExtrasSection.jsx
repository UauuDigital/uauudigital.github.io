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
  const [optionalSelection, setOptionalSelection] = React.useState('');

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
  const optionalExtras = extras.filter(e => e.optional);
  const optionalOptions = React.useMemo(() => {
    const counts = new Map();
    return optionalExtras.map(e => {
      const baseLabel = String(getExtraLabel(e.id, lang) || e.label || '').trim();
      const condMandatory = e.mandatoryWhen && dow !== null ? e.mandatoryWhen(dow, month) : false;
      const nextCount = (counts.get(baseLabel) || 0) + 1;
      counts.set(baseLabel, nextCount);
      const uniqueLabel = nextCount > 1 ? `${baseLabel} (${nextCount})` : baseLabel;
      const displayLabel = condMandatory ? `${uniqueLabel} — obligatori` : uniqueLabel;
      return { extra: e, baseLabel, displayLabel, condMandatory };
    });
  }, [optionalExtras, lang, dow, month]);

  function parseOptionalSelectionValue(value) {
    const raw = String(value || '').trim();
    if (!raw) return null;

    const normalized = raw.toLowerCase();
    const exactDisplayMatch = optionalOptions.find(o => o.displayLabel.toLowerCase() === normalized);
    if (exactDisplayMatch) return exactDisplayMatch.extra;

    const exactBaseMatches = optionalOptions.filter(o => o.baseLabel.toLowerCase() === normalized);
    if (exactBaseMatches.length >= 1) return exactBaseMatches[0].extra;

    const partialMatches = optionalOptions.filter(o =>
      o.displayLabel.toLowerCase().includes(normalized) || o.baseLabel.toLowerCase().includes(normalized)
    );
    if (partialMatches.length >= 1) return partialMatches[0].extra;

    return null;
  }

  function handleOptionalInputCommit(rawValue) {
    const match = parseOptionalSelectionValue(rawValue);
    if (!match) return;
    handleOptionalSelect(match.id);
  }

  function isExtraSelected(extra) {
    if (extra.quantityBased) {
      const quantity = extraQuantities?.[extra.id] ?? 0;
      return quantity > 0;
    }
    return selectedExtras?.[extra.id] === true;
  }

  function handleOptionalSelect(selectionValue) {
    if (!selectionValue) return;
    const extraId = selectionValue;
    const extra = optionalExtras.find(e => e.id === extraId);
    if (!extra) return;
    const condMandatory = extra.mandatoryWhen && dow !== null ? extra.mandatoryWhen(dow, month) : false;
    const isMandatory = !extra.optional || condMandatory;
    const alreadySelected = isExtraSelected(extra);

    if (isMandatory) {
      setOptionalSelection('');
      return;
    }

    if (!alreadySelected) {
      if (extra.quantityBased) {
        const minQuantity = Math.max(1, Number(extra.minQuantity ?? 1));
        const currentQuantity = Number(extraQuantities?.[extra.id] ?? 0);
        if (currentQuantity < minQuantity) onQuantityChange(extra.id, minQuantity);
      } else {
        onChange(extra.id, true);
      }
    } else {
      if (extra.quantityBased) onQuantityChange(extra.id, 0);
      onChange(extra.id, false);
    }
    setOptionalSelection('');
  }

  function deactivateOptionalExtra(extra) {
    if (!extra || !extra.optional) return;
    if (extra.quantityBased) onQuantityChange(extra.id, 0);
    onChange(extra.id, false);
  }

  const visibleExtras = extras.filter(e => {
    const condMandatory = e.mandatoryWhen && dow !== null ? e.mandatoryWhen(dow, month) : false;
    const isMandatory = !e.optional || condMandatory;
    return isMandatory || isExtraSelected(e);
  });

  return (
    <div className="form-section">
      <div className="section-title">Serveis addicionals</div>
      {optionalExtras.length > 0 && (
        <div className="field optional-services-field" style={{ marginBottom: '16px' }}>
          <label htmlFor="optional-services-select">Afegir o treure servei opcional</label>
          <input
            id="optional-services-select"
            className="variant-select optional-services-combobox"
            list="optional-services-list"
            type="text"
            placeholder="Selecciona o escriu un servei..."
            value={optionalSelection}
            onChange={(ev) => setOptionalSelection(ev.target.value)}
            onBlur={(ev) => {
              handleOptionalInputCommit(ev.target.value);
              setOptionalSelection('');
            }}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter') {
                ev.preventDefault();
                handleOptionalInputCommit(optionalSelection);
                setOptionalSelection('');
              }
            }}
            aria-label="Desplegable amb cerca de serveis opcionals"
          />
          <datalist id="optional-services-list">
            {optionalOptions.map(({ extra, displayLabel }) => {
              const alreadySelected = isExtraSelected(extra);
              return (
                <option key={extra.id} value={displayLabel}>
                  {alreadySelected ? 'seleccionat' : 'no seleccionat'}
                </option>
              );
            })}
          </datalist>
        </div>
      )}
      {visibleExtras.map(e => {
        const condMandatory = e.mandatoryWhen && dow !== null ? e.mandatoryWhen(dow, month) : false;
        const isMandatory = !e.optional || condMandatory;
        const canDeactivate = e.optional && !isMandatory;
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
                ? `${eur(e.pricePerPerson)}/pers. (mÃ­nim ${eur(e.minPrice)}) + IVA`
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
              <div style={{ fontSize: 12, fontFamily: 'var(--font-sans)', letterSpacing: '0.1em', color: 'var(--color-muted)', textTransform: 'uppercase', marginLeft: 16 }}>InclÃ²s</div>
            ) : (
              <div />
            )}
            {canDeactivate && (
              <button
                className="extra-remove-btn"
                type="button"
                onClick={() => deactivateOptionalExtra(e)}
                aria-label={`Desactivar ${getExtraLabel(e.id, lang) || e.label}`}
                title="Desactivar servei"
              >
                ×
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

