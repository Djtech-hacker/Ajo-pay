// =============================================
// BADGE COMPONENT
// Shows status chips across the app.
// =============================================

import './Badge.css';

export default function Badge({ status, label, dot = false }) {
  // Map status strings to colour variants
  const variantMap = {
    active:      'success',
    paid:        'success',
    completed:   'success',
    approved:    'success',
    present:     'success',
    pending:     'warn',
    processing:  'info',
    defaulter:   'danger',
    missed:      'danger',
    absent:      'danger',
    inactive:    'neutral',
    upcoming:    'info',
    cancelled:   'neutral',
  };
  const variant = variantMap[status] || 'neutral';
  const display = label || status;

  return (
    <span className={`badge badge--${variant}`}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {display}
    </span>
  );
}
