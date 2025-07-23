import React from 'react';
import Toast from './Toast';
import useToastStore from '../store/toast';
import useThemeStore from '../store/theme';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  const { theme } = useThemeStore();

  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: theme.zIndex?.toast || 9999 }}
    >
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
}
