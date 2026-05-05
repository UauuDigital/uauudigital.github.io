// ── PDF CSS Styles ──────────────────────────────────────────────
// Estils per a la presentació del pressupost en PDF
const PDF_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 300;
    font-size: 17px;
    line-height: 1.55;
    color: #1c1c1a;
    background: #fff;
    -webkit-font-smoothing: antialiased;
  }

  /* Layout */
  .wrap { max-width: 620px; margin: 0 auto; padding: 40px 50px 35px; }
  .divider { height: 1px; background: #eaeced; margin: 20px 0; }

  /* Header */
  .hdr {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 48px;
  }
  .brand { font-family: system-ui, sans-serif; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #7e8c8d; margin-bottom: 6px; }
  .title-pdf { font-size: 28px; font-weight: 300; font-style: italic; }
  .ref-label { font-family: system-ui, sans-serif; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #7e8c8d; margin-bottom: 3px; text-align: right; }
  .ref-val { font-size: 14px; font-weight: 400; text-align: right; }
  .ref-date { font-family: system-ui, sans-serif; font-size: 11px; color: #7e8c8d; margin-top: 3px; text-align: right; }

  /* Metadata grid */
  .meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 48px;
    margin-bottom: 25px;
  }
  .meta-label { font-family: system-ui, sans-serif; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #7e8c8d; margin-bottom: 3px; }
  .meta-val { font-size: 17px; font-weight: 400; }
  .meta-val-i { font-size: 17px; font-weight: 300; font-style: italic; }

  /* Table */
  .tbl-label { font-family: system-ui, sans-serif; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #7e8c8d; margin-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; }
  th {
    font-family: system-ui, sans-serif;
    font-size: 10px;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: #7e8c8d;
    font-weight: 400;
    padding-bottom: 10px;
    border-bottom: 1px solid #1c1c1a;
    text-align: left;
  }
  th:last-child { text-align: right; }

  /* Table cells */
  .td-l { padding: 8px 0; border-bottom: 1px solid #eaeced; font-size: 15px; font-weight: 300; color: #515856; vertical-align: top; }
  .td-sub { font-family: system-ui, sans-serif; font-size: 10px; color: #7e8c8d; margin-top: 2px; letter-spacing: 0.05em; }
  .td-r { padding: 8px 0; border-bottom: 1px solid #eaeced; text-align: right; font-size: 15px; font-weight: 400; white-space: nowrap; vertical-align: top; }
  .td-muted { font-size: 13px; color: #7e8c8d; padding: 6px 0; border-bottom: 1px solid #eaeced; }
  .td-muted-r { font-size: 13px; color: #7e8c8d; padding: 6px 0; border-bottom: 1px solid #eaeced; text-align: right; }

  /* Total row */
  .total-td { padding: 15px 0; border-top: 2px solid #1c1c1a; }
  .t-label { font-family: system-ui, sans-serif; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #7e8c8d; margin-bottom: 3px; }
  .t-amount { font-size: 28px; font-weight: 300; }
  .t-pp { font-size: 12px; font-style: italic; color: #7e8c8d; margin-top: 2px; }

  /* Notes & Footer */
  .notes { margin-top: 18px; padding: 12px; background: #f5f2ed; border-radius: 4px; font-size: 13px; font-style: italic; color: #515856; line-height: 1.5; }
  .footer { margin-top: 25px; padding-top: 12px; border-top: 1px solid #eaeced; display: flex; justify-content: space-between; align-items: flex-end; }
  .footer-l { font-family: system-ui, sans-serif; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: #7e8c8d; margin-bottom: 2px; }
  .footer-v { font-size: 11px; font-style: italic; color: #7e8c8d; }
  .footer-r { font-family: system-ui, sans-serif; font-size: 9px; color: #7e8c8d; text-align: right; line-height: 1.5; }

  /* Print */
  @page { size: A4; margin: 0; }
  @media print { html, body { width: 210mm; } }
`;

// ── Build PDF table rows ─────────────────────────────────────────
function buildPdfTableRows(form, quote, lang) {
  const menuRow = `
    <tr>
      <td class="td-l">
        ${T[lang].menuService}
        <div class="td-sub">${T[lang].pdfMenuDetail(form.guests, quote.pricePerPerson)}</div>
      </td>
      <td class="td-r">${eur(quote.menuBase)}</td>
    </tr>
  `;

  const shortfallRow = quote.shortfall > 0 ? `
    <tr>
      <td class="td-l" style="color:#a05030">
        ${T[lang].minSupplement}
        <div class="td-sub" style="color:#c07050">
          ${T[lang].pdfMinDetail(quote.shortfall, PRICE_CONFIG.venues[form.venue].minimumPenaltyPerPerson)}
        </div>
      </td>
      <td class="td-r" style="color:#a05030">${eur(quote.penaltyAmt)}</td>
    </tr>
  ` : '';

  const extrasRows = quote.extrasLines.map(e => {
    const label = getExtraLabel(e.id, lang) || e.label;
    const mandatoryTag = e.isMandatory ? ` <span style="font-size:10px;color:#999;font-style:normal">${T[lang].pdfMandatory}</span>` : '';
    const priceDetail = e.priceDetail ? `<div class="td-sub">${e.priceDetail}</div>` : '';
    return `
      <tr>
        <td class="td-l">${label}${mandatoryTag}${priceDetail}</td>
        <td class="td-r">${eur(e.computedPrice)}</td>
      </tr>
    `;
  }).join('');

  return [menuRow, shortfallRow, extrasRows].join('');
}

// ── Build PDF HTML ──────────────────────────────────────────────
// Genera l'HTML complet del pressupost en PDF
function pdfHTML({ form, quote, venue, dateStr, coupleStr, refNum, today, t, lang }) {
  const vatPct = Math.round(PRICE_CONFIG.vatRate * 100);
  const tableRows = buildPdfTableRows(form, quote, lang);

  // Construir la secció de metadades (parella, data, finca, convidats)
  const metadataSection = `
    <div class="meta-grid">
      <div><div class="meta-label">${t.coupleLabel}</div><div class="meta-val">${coupleStr}</div></div>
      <div><div class="meta-label">${t.dateLabel}</div><div class="meta-val-i">${dateStr || '—'}</div></div>
      <div><div class="meta-label">${t.venueLabel}</div><div class="meta-val">${venue?.name || '—'}</div></div>
      <div><div class="meta-label">${t.guestsLabel}</div><div class="meta-val">${t.guestsUnit(form.guests)}</div></div>
    </div>
  `;

  // Construir la taula de detalls (articles, preus, total)
  const detailsTable = `
    <div class="tbl-label">${t.detailLabel}</div>
    <table>
      <thead>
        <tr>
          <th>${t.conceptCol}</th>
          <th>${t.amountCol}</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
        <tr><td class="td-muted">${t.subtotal}</td><td class="td-muted-r">${eur(quote.subtotal)}</td></tr>
        <tr><td class="td-muted">${t.vat} (${vatPct}%)</td><td class="td-muted-r">${eur(quote.vat)}</td></tr>
      </tbody>
      <tfoot>
        <tr>
          <td class="total-td">
            <div class="t-label">${t.totalLabel}</div>
            <div class="t-amount">${eur(quote.total)}</div>
            <div class="t-pp">${t.perGuest(quote.perPerson)}</div>
          </td>
          <td class="total-td"></td>
        </tr>
      </tfoot>
    </table>
  `;

  // Construir la secció de notes (si n'hi ha)
  const notesSection = form.notes ? `<div class="notes">${form.notes}</div>` : '';

  // Construir el peu de pàgina
  const footer = `
    <div class="footer">
      <div>
        <div class="footer-l">UAUU weddings &amp; events</div>
        <div class="footer-v">Avda. Mestre Montaner, 44-45, Igualada (Barcelona)</div>
        <div class="footer-v">info@uauu.cat · +34 634 438 736</div>
      </div>
      <div class="footer-r">${t.footerNote}</div>
    </div>
  `;

  // Construir el HTML final complet
  return `<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8"/>
  <title>${t.pdfTitle} ${coupleStr} — UAUU</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap"/>
  <style>${PDF_STYLES}</style>
</head>
<body>
  <div class="wrap">
    <!-- Header: Brand + Title + Reference Number -->
    <div class="hdr">
      <div>
        <div class="brand">UAUU weddings &amp; events</div>
        <div class="title-pdf">${t.pdfTitle}</div>
      </div>
      <div>
        <div class="ref-label">${t.refLabel}</div>
        <div class="ref-val">${refNum}</div>
        <div class="ref-date">${today}</div>
      </div>
    </div>

    <div class="divider"></div>

    <!-- Metadata: Couple, Date, Venue, Guests -->
    ${metadataSection}

    <!-- Details Table: Menu, Extras, Totals -->
    ${detailsTable}

    <!-- Optional Notes -->
    ${notesSection}

    <!-- Footer: Contact Info -->
    ${footer}
  </div>
</body>
</html>`;
}
