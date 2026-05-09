// =============================================
// TOAST / NOTIFICATION COMPONENT
// Auto-dismissing feedback messages.
// =============================================

import { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, type = 'success', onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss?.(), 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = {
    success: '✓',
    error:   '✕',
    warn:    '!',
    info:    'i',
  };

  return (
    <div className={`toast toast--${type} slide-up`} role="alert" aria-live="polite">
      <span className="toast__icon">{icons[type]}</span>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={onDismiss} aria-label="Dismiss">×</button>
    </div>
  );
}
