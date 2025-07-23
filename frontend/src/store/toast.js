import { create } from 'zustand';

const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

export const withToast = async (fn, opts = {}) => {
  const { addToast } = useToastStore.getState();
  try {
    const result = await fn();
    if (opts.success) {
      addToast({ type: 'success', message: opts.success });
    }
    return result;
  } catch (err) {
    if (opts.error) {
      addToast({ type: 'error', message: opts.error });
    }
    throw err;
  }
};

export default useToastStore;
