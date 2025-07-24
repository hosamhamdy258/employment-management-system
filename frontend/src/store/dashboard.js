import { create } from 'zustand';
import api from '../api/axios';

const useDashboardStore = create((set) => ({
  data: {
    stats: { companies: 0, departments: 0, employees: 0 },
    chart_data: { employees_per_company: [], departments_per_company: [] },
  },
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/api/dashboard-stats/');
      set({ data: response.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      set({ error: 'Failed to load dashboard data.', loading: false });
    }
  },
}));

export default useDashboardStore;
