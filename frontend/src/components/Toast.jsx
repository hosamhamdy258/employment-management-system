import React, { useEffect } from 'react';
import { Toast as BootstrapToast } from 'react-bootstrap';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <BootstrapToast show={true} bg={type} className="border-0">
      <div className="d-flex align-items-center">
        <div className="toast-body fw-semibold">{message}</div>
        <button
          type="button"
          className="btn-close me-2 m-auto"
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
    </BootstrapToast>
  );
};

export default Toast;