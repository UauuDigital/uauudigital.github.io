function App() {
  const [form, setForm] = React.useState(() => {
    try {
      localStorage.removeItem('uauu-v2-form');
    }
    catch { }
    return defaultForm();
  });
  const [lang, setLang] = React.useState(() => localStorage.getItem('uauu-lang') || 'ca');

  function defaultForm() {
    return { venue: '', date: '', guests: 80, selectedExtras: {}, extraQuantities: {}, coupleName: '', notes: '' };
  }

  function defaultForm() {
  return { 
    venue: '', 
    date: '', 
    guests: 80, 
    selectedExtras: {}, 
    extraQuantities: {}, 
    extraOptions: {},
    extraVariants: { pernil: 'res' }, // Estil per defecte
    coupleName: '', 
    notes: '' 
  };
}

// Afegeix aquesta funció a prop de setExtra
function setVariant(id, variantId) {
  setForm(f => ({ 
    ...f, 
    extraVariants: { ...f.extraVariants, [id]: variantId } 
  }));
}

  React.useEffect(() => { localStorage.setItem('uauu-lang', lang); }, [lang]);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function setExtra(id, val) {
    setForm(f => ({
      ...f,
      selectedExtras: { ...f.selectedExtras, [id]: val },
      extraQuantities: val || id !== 'cookiebar'
        ? f.extraQuantities
        : { ...f.extraQuantities, [id]: 0 }
    }));
  }
  function setQuantity(id, val) { setForm(f => ({ ...f, extraQuantities: { ...f.extraQuantities, [id]: val } })); }
  function setExtraOption(id, key, value) {
    setForm(f => ({
      ...f,
      extraOptions: {
        ...f.extraOptions,
        [id]: { ...(f.extraOptions?.[id] || {}), [key]: value }
      }
    }));
  }

  const dateYear = form.date ? new Date(form.date + 'T12:00:00').getFullYear() : null;
  const menuStaffExtra = getQuantityExtra(form.venue, dateYear, 'menu-staff');
  const menuInfantilExtra = getQuantityExtra(form.venue, dateYear, 'menu-infantil');
  const hasMountedRef = React.useRef(false);
  React.useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    setForm(f => ({ ...f, selectedExtras: {}, extraQuantities: {} }));
  }, [form.venue, dateYear]);

  const quote = React.useMemo(() => computeQuote(form), [form]);

  return (
    <div>
      <header className="page-header">
        <div className="page-header-side page-header-left">
          <img
            className="page-logo"
            src={(window.__resources && window.__resources.uauuLogo) || 'assets/logo-uauu-black.png'}
            alt="UAUU weddings & events"
          />
        </div>
        <div className="page-header-center">
          <span className="page-header-label">Configurador de Pressupostos</span>
          <div className="lang-selector">
            {['ca', 'es', 'en'].map(l => (
              <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="page-header-side page-header-right" aria-hidden="true" />
      </header>

      <div className="app-body">
        <div className="form-panel">

          {/* Venue */}
          <div className="form-section">
            <div className="section-title">Finca de la boda</div>
            <VenueCards value={form.venue} onChange={v => set('venue', v)} />
          </div>

          {/* Date & Guests */}
          <div className="form-section">
            <div className="section-title">Detalls de l'esdeveniment</div>
            <div className="event-details-list">
              <div className="field">
                <label>Data de la boda</label>
                <input type="date" value={form.date} className={form.date ? 'filled' : ''}
                  min={`${new Date().getFullYear()}-01-01`}
                  onChange={e => set('date', e.target.value)} />
              </div>
              <div className="field">
                <label>Nombre de convidats</label>
                <GuestsControl value={form.guests} onChange={val => set('guests', val)} />
                <input type="range" min={10} max={400} step={1} value={form.guests}
                  onChange={e => set('guests', Number(e.target.value))} />
                <div className="range-labels"><span>10</span><span>400</span></div>
              </div>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {menuStaffExtra && (
                  <div className="field" style={{ flex: 1 }}>
                    <label>{getExtraLabel('menu-staff', lang)}</label>
                    <div className="event-extra-price" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>{eur(menuStaffExtra.price)}/pers. + IVA:</span>
                      <input
                        className="extra-quantity-input"
                        type="number"
                        min={0}
                        step={1}
                        value={form.extraQuantities[menuStaffExtra.id] ?? 0}
                        onChange={e => setQuantity(menuStaffExtra.id, normalizeQuantity(e.target.value))}
                        aria-label={`${getExtraLabel('menu-staff', lang)} quantitat`}
                      />
                      <span className="extra-quantity-unit">pers.</span>
                    </div>
                  </div>
                )}

                {menuInfantilExtra && (
                  <div className="field" style={{ flex: 1 }}>
                    <label>{getExtraLabel('menu-infantil', lang)}</label>
                    <div className="event-extra-price" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>{eur(menuInfantilExtra.price)}/pers. + IVA:</span>
                      <input
                        className="extra-quantity-input"
                        type="number"
                        min={0}
                        step={1}
                        value={form.extraQuantities[menuInfantilExtra.id] ?? 0}
                        onChange={e => setQuantity(menuInfantilExtra.id, normalizeQuantity(e.target.value))}
                        aria-label={`${getExtraLabel('menu-infantil', lang)} quantitat`}
                      />
                      <span className="extra-quantity-unit">pers.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DateInfoStrip venueId={form.venue} date={form.date} />
          </div>

          {/* Dynamic extras */}
          <ExtrasSection
            venueId={form.venue}
            year={dateYear}
            date={form.date}
            guests={form.guests}
            selectedExtras={form.selectedExtras}
            extraQuantities={form.extraQuantities}
            extraOptions={form.extraOptions}
            extraVariants={form.extraVariants}
            onChange={setExtra}
            onQuantityChange={setQuantity}
            onOptionChange={setExtraOption}
            onVariantChange={setVariant}
            lang={lang}
          />

          {/* Client info */}
          <div className="form-section">
            <div className="section-title">Dades de la parella</div>
            <div className="field-row full" style={{ marginBottom: 20 }}>
              <div className="field">
                <label>Noms de la parella</label>
                <input type="text" placeholder="p. ex. Anna & Marc"
                  value={form.coupleName} className={form.coupleName ? 'filled' : ''}
                  onChange={e => set('coupleName', e.target.value)} />
              </div>
            </div>
            <div className="field-row full">
              <div className="field">
                <label>Notes addicionals</label>
                <textarea rows={3} placeholder="Requisits especials, al·lèrgies, observacions..."
                  value={form.notes} onChange={e => set('notes', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <SummaryPanel form={form} quote={quote} lang={lang} />
      </div>
    </div>
  );
}

const mountApp = () => ReactDOM.createRoot(document.getElementById('root')).render(<App />);

if (window.__uauuDataReady && typeof window.__uauuDataReady.then === 'function') {
  window.__uauuDataReady.then(mountApp).catch(() => mountApp());
} else {
  mountApp();
}
