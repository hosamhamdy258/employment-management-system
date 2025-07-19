import { create } from 'zustand';
import api from '../api/axios';

const useEmployeeStore = create((set) => ({
  employees: [],
  loading: false,
  error: '',
  fetchEmployees: async () => {
    set({ loading: true, error: '' });
    try {
      const res = await api.get('/employees/');
      set({ employees: res.data, loading: false });
    } catch {
      set({ error: 'Failed to load employees', loading: false });
    }
  },
}));

export default useEmployeeStore;
