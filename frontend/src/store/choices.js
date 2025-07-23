import { create } from 'zustand';
import api from '../api/axios';

const useChoicesStore = create((set) => ({
  statusChoices: [],
  loading: false,
  error: '',
  fetchStatusChoices: async () => {
    set({ loading: true, error: '' });
    try {
      const res = await api.get('/api/employee-status-choices/');
      set({
        statusChoices: res.data,
        loading: false,
      });
    } catch {
      set({ error: 'Failed to load status choices', loading: false });
    }
  },
}));

export default useChoicesStore;
