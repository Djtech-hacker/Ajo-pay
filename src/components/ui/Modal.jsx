// =============================================
// MODAL COMPONENT
// A reusable, accessible dialog component.
// =============================================

import { useEffect } from 'react';
import Button from './Button';
import './Modal.css';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,          // custom footer content
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  onConfirm,
  loading = false,
  size = 'md',     // sm | md | lg
}) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`modal modal--${size} slide-up`}>
        {/* Header */}
        <div className="modal__header">
          <h2 className="modal__title" id="modal-title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close dialog">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">{children}</div>

        {/* Footer */}
        {footer !== null && (
          <div className="modal__footer">
            {footer || (
              <>
                <Button variant="secondary" onClick={onClose}>{cancelLabel}</Button>
                {onConfirm && (
                  <Button variant="primary" onClick={onConfirm} loading={loading}>
                    {confirmLabel}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
