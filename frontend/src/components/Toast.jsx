import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast align-items-center text-bg-${type} border-0 mb-2 show`} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={onClose}></button>
      </div>
    </div>
  );
}
