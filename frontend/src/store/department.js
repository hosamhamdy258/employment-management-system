import { create } from 'zustand';
import api from '../api/axios';

const useDepartmentStore = create((set) => ({
  departments: [],
  loading: false,
  error: '',
  fetchDepartments: async () => {
    set({ loading: true, error: '' });
    try {
      const res = await api.get('/departments/');
      set({ departments: res.data, loading: false });
    } catch {
      set({ error: 'Failed to load departments', loading: false });
    }
  },
}));

export default useDepartmentStore;
