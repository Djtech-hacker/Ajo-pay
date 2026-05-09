// =============================================
// METRIC CARD COMPONENT
// Used on Dashboard and other summary pages.
// =============================================

import './MetricCard.css';

export default function MetricCard({ label, value, delta, deltaType = 'up', accent = false }) {
  return (
    <div className={`metric-card ${accent ? 'metric-card--accent' : ''}`}>
      <div className="metric-card__label">{label}</div>
      <div className="metric-card__value">{value}</div>
      {delta && (
        <div className={`metric-card__delta metric-card__delta--${deltaType}`}>
          {deltaType === 'up' ? '↑' : deltaType === 'down' ? '↓' : '·'} {delta}
        </div>
      )}
    </div>
  );
}
