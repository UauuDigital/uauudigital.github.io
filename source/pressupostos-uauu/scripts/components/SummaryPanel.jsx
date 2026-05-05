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
    w.document.write(pdfHTML({ form, quote, venue, dateStr, coupleStr, refNum, today, t, lang }));
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
                  <div className="li-label">{getExtraLabel(e.id, lang) || e.label} {e.isMandatory && <span className="li-mandatory-tag">{t.mandatory}</span>}</div>
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
