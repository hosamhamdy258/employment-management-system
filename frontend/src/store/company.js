import { create } from 'zustand';
import api from '../api/axios';

const useCompanyStore = create((set, get) => ({
  companies: [],
  loading: false,
  error: '',
  fetchCompanies: async () => {
    set({ loading: true, error: '' });
    try {
      const res = await api.get('/companies/');
      set({ companies: res.data, loading: false });
    } catch {
      set({ error: 'Failed to load companies', loading: false });
    }
  },
}));

export default useCompanyStore;
