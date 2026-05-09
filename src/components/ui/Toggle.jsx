// =============================================
// TOGGLE SWITCH COMPONENT
// =============================================

import './Toggle.css';

export default function Toggle({ checked, onChange, label, description, id }) {
  return (
    <div className="toggle-row">
      <div className="toggle-row__info">
        {label && <div className="toggle-row__label">{label}</div>}
        {description && <div className="toggle-row__desc">{description}</div>}
      </div>
      <label className="toggle" htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={e => onChange?.(e.target.checked)}
          className="toggle__input"
        />
        <span className="toggle__slider" />
      </label>
    </div>
  );
}
