import React, { useState, useCallback } from 'react';
import Toast from './Toast';

let addToastHandler;

export function useToaster() {
  const [, setRerender] = useState(0);
  const addToast = useCallback((toast) => {
    if (addToastHandler) addToastHandler(toast);
    setRerender(x => x + 1); // force rerender
  }, []);
  return addToast;
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  addToastHandler = (toast) => {
    setToasts((prev) => [...prev, { ...toast, id: Math.random().toString(36).substr(2, 6) }]);
  };
  const removeToast = (id) => setToasts((prev) => prev.filter(t => t.id !== id));
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
      {toasts.map(t => (
        <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
}
