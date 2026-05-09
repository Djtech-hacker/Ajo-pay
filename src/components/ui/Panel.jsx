// =============================================
// PANEL COMPONENT
// Card-style container with optional header + action.
// =============================================

import './Panel.css';

export default function Panel({ title, action, children, className = '' }) {
  return (
    <div className={`panel ${className}`}>
      {title && (
        <div className="panel__head">
          <h3 className="panel__title">{title}</h3>
          {action && <div className="panel__action">{action}</div>}
        </div>
      )}
      <div className="panel__body">{children}</div>
    </div>
  );
}
