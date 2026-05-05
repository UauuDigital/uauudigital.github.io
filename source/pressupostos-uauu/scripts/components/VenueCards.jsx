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
