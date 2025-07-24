import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set, get) => {
  // Define state properties
  const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refresh') || null,
    isRefreshing: false,
    isAuthLoading: true, // Start in a loading state
  };

  // Define actions separately
  const actions = {
    login: (user, token, refreshToken) => {
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refresh', refreshToken);
      }
      set({ user, token, refreshToken, isAuthLoading: false });
    },
    updateTokens: (token, refreshToken) => {
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refresh', refreshToken);
      }
      set({ token, refreshToken });
    },
    setRefreshing: (isRefreshing) => {
      set({ isRefreshing });
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      set({ user: null, token: null, refreshToken: null, isRefreshing: false, isAuthLoading: false });
    },
    checkAuth: async () => {
      const { token } = get();
      if (!token) {
        set({ isAuthLoading: false });
        return;
      }

      try {
        const response = await api.get('/me/');
        set({ user: response.data, isAuthLoading: false });
      } catch (error) {
        console.error("Auth check failed", error);
        // Call logout action via get() to avoid circular dependency issues
        get().logout(); 
      }
    },
  };

  return { ...initialState, ...actions };
});

export default useAuthStore;
