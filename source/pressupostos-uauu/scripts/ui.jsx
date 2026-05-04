// ── Components ──────────────────────────────────────────────────
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function GuestsControl({ value, onChange }) {
  const [draft, setDraft] = React.useState(String(value));
  const skipNextBlurCommit = React.useRef(false);

  React.useEffect(() => {
    setDraft(String(value));
  }, [value]);

  function commit(nextValue) {
    const next = Number(nextValue);
    if (!Number.isFinite(next)) {
      setDraft(String(value));
      return;
    }
    const clamped = clamp(Math.round(next), 10, 400);
    setDraft(String(clamped));
    onChange(clamped);
  }

  function handleWheel(e) {
    if (!e.currentTarget.matches(':hover')) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    const next = clamp(value + delta, 10, 400);
    setDraft(String(next));
    onChange(next);
  }

  return (
    <div className="guests-control">
      <input
        className="guests-display guests-input"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft}
        onChange={e => setDraft(e.target.value.replace(/[^\d]/g, ''))}
        onBlur={() => {
          if (skipNextBlurCommit.current) {
            skipNextBlurCommit.current = false;
            return;
          }
          commit(draft);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.currentTarget.blur();
          }
          if (e.key === 'Escape') {
            skipNextBlurCommit.current = true;
            setDraft(String(value));
            e.currentTarget.blur();
          }
        }}
        onFocus={e => e.target.select()}
        aria-label="Nombre de convidats"
        title="Escriu un número i prem Enter o surt del camp"
      />
      <div className="guests-sub">convidats</div>
    </div>
  );
}

function VenueCards({ value, onChange }) {
  return (
    <div className="venue-grid">
      {VENUES.map(v => (
        <div key={v.id} className={`venue-card ${value === v.id ? 'selected' : ''}`} onClick={() => onChange(v.id)}>
          <span className="venue-card-name">{v.name}</span>
        </div>
      ))}
    </div>
  );
}

function Toggle({ value, onChange, options }) {
  return (
    <div className="toggle-group">
      {options.map(o => (
        <button key={o.value} className={`toggle-btn ${value === o.value ? 'active' : ''}`} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ExtrasSection({ venueId, year, date, guests, selectedExtras, onChange }) {
  if (!venueId || !year) return null;
  const extras = getExtras(venueId, year);
  if (!extras.length) return null;

  const dow = date ? new Date(date + 'T12:00:00').getDay() : null;
  const month = date ? new Date(date + 'T12:00:00').getMonth() + 1 : null;

  return (
    <div className="form-section">
      <div className="section-title">Serveis addicionals</div>
      {extras.map(e => {
        const condMandatory = e.mandatoryWhen && dow !== null ? e.mandatoryWhen(dow, month) : false;
        const isMandatory = !e.optional || condMandatory;
        const priceLabel = e.pricePerPerson
          ? `${eur(e.pricePerPerson)}/pers. (mínim ${eur(e.minPrice)}) + IVA`
          : `${eur(e.price || 0)} + IVA`;
        const mandatoryLabel = condMandatory ? 'Obligatori (data sel.)' : 'Obligatori';

        return (
          <div key={e.id} className="extra-item">
            <div className="extra-info">
              <div className="extra-label">
                {e.label}
                {isMandatory && <span className="extra-badge badge-mandatory">{mandatoryLabel}</span>}
              </div>
              <div className="extra-price">{priceLabel}</div>
            </div>
            {isMandatory ? (
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

function DateInfoStrip({ venueId, date }) {
  if (!venueId || !date) return null;
  const d = new Date(date + 'T12:00:00');
  const year = d.getFullYear(), month = d.getMonth() + 1, dow = d.getDay();
  const slot = lookupPrice(venueId, year, month, dow);
  const unavailable = !slot && Object.keys(PRICE_CONFIG.venues[venueId]?.priceMatrix || {}).length > 0;
  const notConfigured = Object.keys(PRICE_CONFIG.venues[venueId]?.priceMatrix || {}).length === 0;

  if (notConfigured) return (
    <div className="alert alert-info">Preus d'aquesta finca pendents de configurar.</div>
  );
  if (unavailable) return (
    <div className="alert alert-error">
      {DAYS_CA[dow]} no és un dia disponible per a {VENUES.find(v => v.id === venueId)?.name}. Tria divendres, dissabte o diumenge.
    </div>
  );
  if (!slot) return null;

  return (
    <div>
      <div className="info-strip">
        <div className="info-strip-item">
          <div className="info-strip-label">Dia</div>
          <div className="info-strip-value">{DAYS_CA[dow]}</div>
        </div>
        <div className="info-strip-item">
          <div className="info-strip-label">Mes</div>
          <div className="info-strip-value">{MONTHS_CA[month - 1]}</div>
        </div>
        <div className="info-strip-item">
          <div className="info-strip-label">Preu/persona</div>
          <div className="info-strip-value">{eur(slot.price)} + IVA</div>
        </div>
        <div className="info-strip-item">
          <div className="info-strip-label">Mínim finca</div>
          <div className="info-strip-value">{slot.minGuests} convidats</div>
        </div>
      </div>
      {slot.year < year && (
        <div className="alert alert-info" style={{ marginTop: 12 }}>
          Preus {slot.year} aplicats — tarifes {year} encara no disponibles.
        </div>
      )}
    </div>
  );
}

function SummaryPanel({ form, quote, lang }) {
  const t = T[lang];
  const venue = VENUES.find(v => v.id === form.venue);
  const dateObj = form.date ? new Date(form.date + 'T12:00:00') : null;
  const dateStr = dateObj
    ? `${dateObj.getDate()} de ${t.months[dateObj.getMonth()].toLowerCase()} de ${dateObj.getFullYear()}`
    : null;
  const ready = form.venue && form.date && form.guests >= 1 && quote;

  function handleExport() {
    const coupleStr = form.coupleName || t.coupleLabel;
    const refNum = `UAUU-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const today = new Date().toLocaleDateString(t.locale, { day: 'numeric', month: 'long', year: 'numeric' });
    const w = window.open('', '_blank');
    w.document.write(pdfHTML({ form, quote, venue, dateStr, coupleStr, refNum, today, t }));
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 700);
  }

  return (
    <div className="summary-panel">
      <div className="summary-venue-name">
        {venue ? venue.name : <span style={{ opacity: 0 }}>—</span>}
      </div>

      <div className="s-label">{t.weddingDate}</div>
      <div className="s-date">
        {dateStr || <span style={{ color: 'var(--color-muted)' }}>{t.pending}</span>}
      </div>

      {!ready && (
        <div className="empty-state">
          <p>{t.emptyState}</p>
        </div>
      )}

      {ready && (
        <>
          <div style={{ flex: 1 }}>
            <div className="line-item">
              <div className="li-left">
                <div className="li-label">{t.menuService}</div>
                <div className="li-detail">{t.guestsX(form.guests, quote.pricePerPerson)}</div>
              </div>
              <div className="li-amount">{eur(quote.menuBase)}</div>
            </div>

            {quote.shortfall > 0 && (
              <div className="line-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-divider)' }}>
                <div className="li-left">
                  <div className="li-label" style={{ color: '#a05030' }}>{t.minSupplement}</div>
                  <div className="li-detail" style={{ color: '#c07050' }}>{t.minDetail(quote.shortfall, quote.minGuests, PRICE_CONFIG.venues[form.venue].minimumPenaltyPerPerson)}</div>
                </div>
                <div className="li-amount" style={{ color: '#a05030' }}>{eur(quote.penaltyAmt)}</div>
              </div>
            )}

            {quote.extrasLines.map(e => (
              <div key={e.id} className="line-item">
                <div className="li-left">
                  <div className="li-label">{e.label} {e.isMandatory && <span className="li-mandatory-tag">{t.mandatory}</span>}</div>
                  {e.priceDetail && <div className="li-detail">{e.priceDetail}</div>}
                </div>
                <div className="li-amount">{eur(e.computedPrice)}</div>
              </div>
            ))}

            <div className="s-divider" />

            <div className="line-item li-muted">
              <div className="li-left"><div className="li-label">{t.subtotal}</div></div>
              <div className="li-amount">{eur(quote.subtotal)}</div>
            </div>
            <div className="line-item li-muted">
              <div className="li-left"><div className="li-label">{t.vat} ({Math.round(PRICE_CONFIG.vatRate * 100)}%)</div></div>
              <div className="li-amount">{eur(quote.vat)}</div>
            </div>

            <div className="s-divider" />

            <div className="total-block">
              <div className="total-label">{t.totalLabel}</div>
              <div className="total-amount">{eur(quote.total)}</div>
              <div className="total-per-person">{t.perGuest(quote.perPerson)}</div>
            </div>

            {quote.shortfall > 0 && (
              <div className="alert alert-warn" style={{ marginTop: 16 }}>
                {t.minWarn(quote.minGuests, PRICE_CONFIG.venues[form.venue].minimumPenaltyPerPerson)}
              </div>
            )}

            <p className="summary-note">{t.note}</p>
          </div>

          <button className="export-btn" onClick={handleExport}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {t.exportBtn}
          </button>
        </>
      )}
    </div>
  );
}

// ── PDF template ─────────────────────────────────────────────────
function pdfHTML({ form, quote, venue, dateStr, coupleStr, refNum, today, t }) {
  const vatPct = Math.round(PRICE_CONFIG.vatRate * 100);
  const linesRows = [
    `<tr><td class="td-l">${t.menuService}<div class="td-sub">${t.pdfMenuDetail(form.guests, quote.pricePerPerson)}</div></td><td class="td-r">${eur(quote.menuBase)}</td></tr>`,
    ...(quote.shortfall > 0 ? [`<tr><td class="td-l" style="color:#a05030">${t.minSupplement}<div class="td-sub" style="color:#c07050">${t.pdfMinDetail(quote.shortfall, PRICE_CONFIG.venues[form.venue].minimumPenaltyPerPerson)}</div></td><td class="td-r" style="color:#a05030">${eur(quote.penaltyAmt)}</td></tr>`] : []),
    ...quote.extrasLines.map(e => `<tr><td class="td-l">${e.label}${e.isMandatory ? ` <span style="font-size:10px;color:#999;font-style:normal">${t.pdfMandatory}</span>` : ''}${e.priceDetail ? `<div class="td-sub">${e.priceDetail}</div>` : ''}</td><td class="td-r">${eur(e.computedPrice)}</td></tr>`),
  ].join('');

  return `<!DOCTYPE html><html lang="ca"><head><meta charset="UTF-8"/>
<title>${t.pdfTitle} ${coupleStr} — UAUU</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:17px;line-height:1.55;color:#1c1c1a;background:#fff;-webkit-font-smoothing:antialiased}
.wrap{max-width:620px;margin:0 auto;padding:64px 60px 80px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px}
.brand{font-family:system-ui,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#7e8c8d;margin-bottom:6px}
.title-pdf{font-size:28px;font-weight:300;font-style:italic}
.ref-label{font-family:system-ui,sans-serif;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#7e8c8d;margin-bottom:3px;text-align:right}
.ref-val{font-size:14px;font-weight:400;text-align:right}
.ref-date{font-family:system-ui,sans-serif;font-size:11px;color:#7e8c8d;margin-top:3px;text-align:right}
.divider{height:1px;background:#eaeced;margin:32px 0}
.meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px 48px;margin-bottom:40px}
.meta-label{font-family:system-ui,sans-serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#7e8c8d;margin-bottom:5px}
.meta-val{font-size:18px;font-weight:400}
.meta-val-i{font-size:18px;font-weight:300;font-style:italic}
.tbl-label{font-family:system-ui,sans-serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#7e8c8d;margin-bottom:10px}
table{width:100%;border-collapse:collapse}
th{font-family:system-ui,sans-serif;font-size:10px;letter-spacing:0.13em;text-transform:uppercase;color:#7e8c8d;font-weight:400;padding-bottom:10px;border-bottom:1px solid #1c1c1a;text-align:left}
th:last-child{text-align:right}
.td-l{padding:12px 0;border-bottom:1px solid #eaeced;font-size:16px;font-weight:300;color:#515856;vertical-align:top}
.td-sub{font-family:system-ui,sans-serif;font-size:11px;color:#7e8c8d;margin-top:3px;letter-spacing:0.05em}
.td-r{padding:12px 0;border-bottom:1px solid #eaeced;text-align:right;font-size:16px;font-weight:400;white-space:nowrap;vertical-align:top}
.td-muted{font-size:14px;color:#7e8c8d;padding:8px 0;border-bottom:1px solid #eaeced}
.td-muted-r{font-size:14px;color:#7e8c8d;padding:8px 0;border-bottom:1px solid #eaeced;text-align:right}
.total-td{padding:20px 0;border-top:2px solid #1c1c1a}
.t-label{font-family:system-ui,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#7e8c8d;margin-bottom:4px}
.t-amount{font-size:33px;font-weight:300}
.t-pp{font-size:13px;font-style:italic;color:#7e8c8d;margin-top:3px}
.notes{margin-top:28px;padding:18px;background:#f5f2ed;border-radius:4px;font-size:14px;font-style:italic;color:#515856;line-height:1.6}
.footer{margin-top:52px;padding-top:20px;border-top:1px solid #eaeced;display:flex;justify-content:space-between;align-items:flex-end}
.footer-l{font-family:system-ui,sans-serif;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#7e8c8d;margin-bottom:4px}
.footer-v{font-size:13px;font-style:italic;color:#7e8c8d}
.footer-r{font-family:system-ui,sans-serif;font-size:10px;color:#7e8c8d;text-align:right;line-height:1.6}
@page{size:A4;margin:0}
@media print{html,body{width:210mm}}
</style></head><body>
<div class="wrap">
  <div class="hdr">
    <div><div class="brand">UAUU weddings &amp; events</div><div class="title-pdf">${t.pdfTitle}</div></div>
    <div><div class="ref-label">${t.refLabel}</div><div class="ref-val">${refNum}</div><div class="ref-date">${today}</div></div>
  </div>
  <div class="divider"></div>
  <div class="meta-grid">
    <div><div class="meta-label">${t.coupleLabel}</div><div class="meta-val">${coupleStr}</div></div>
    <div><div class="meta-label">${t.dateLabel}</div><div class="meta-val-i">${dateStr || '—'}</div></div>
    <div><div class="meta-label">${t.venueLabel}</div><div class="meta-val">${venue?.name || '—'}</div></div>
    <div><div class="meta-label">${t.guestsLabel}</div><div class="meta-val">${t.guestsUnit(form.guests)}</div></div>
  </div>
  <div class="tbl-label">${t.detailLabel}</div>
  <table>
    <thead><tr><th>${t.conceptCol}</th><th>${t.amountCol}</th></tr></thead>
    <tbody>
      ${linesRows}
      <tr><td class="td-muted">${t.subtotal}</td><td class="td-muted-r">${eur(quote.subtotal)}</td></tr>
      <tr><td class="td-muted">${t.vat} (${vatPct}%)</td><td class="td-muted-r">${eur(quote.vat)}</td></tr>
    </tbody>
    <tfoot>
      <tr>
        <td class="total-td"><div class="t-label">${t.totalLabel}</div><div class="t-amount">${eur(quote.total)}</div><div class="t-pp">${t.perGuest(quote.perPerson)}</div></td>
        <td class="total-td"></td>
      </tr>
    </tfoot>
  </table>
  ${form.notes ? `<div class="notes">${form.notes}</div>` : ''}
  <div class="footer">
    <div><div class="footer-l">UAUU weddings &amp; events</div><div class="footer-v">Avda. Mestre Montaner, 44-45, Igualada (Barcelona)</div><div class="footer-v">info@uauu.cat · +34 634 438 736</div></div>
    <div class="footer-r">${t.footerNote}</div>
  </div>
</div></body></html>`;
}

// ── Main App ─────────────────────────────────────────────────────
function App() {
  const [form, setForm] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('uauu-v2-form') || 'null') || defaultForm(); }
    catch { return defaultForm(); }
  });
  const [lang, setLang] = React.useState(() => localStorage.getItem('uauu-lang') || 'ca');

  function defaultForm() {
    return { venue: '', date: '', guests: 80, selectedExtras: {}, coupleName: '', notes: '' };
  }

  React.useEffect(() => { localStorage.setItem('uauu-v2-form', JSON.stringify(form)); }, [form]);
  React.useEffect(() => { localStorage.setItem('uauu-lang', lang); }, [lang]);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function setExtra(id, val) { setForm(f => ({ ...f, selectedExtras: { ...f.selectedExtras, [id]: val } })); }

  const dateYear = form.date ? new Date(form.date + 'T12:00:00').getFullYear() : null;
  React.useEffect(() => { setForm(f => ({ ...f, selectedExtras: {} })); }, [form.venue, dateYear]);

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
            <div className="field-row">
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
            onChange={setExtra}
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

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
