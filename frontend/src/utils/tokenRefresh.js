import axios from 'axios';
import useAuthStore from '../store/auth';
import { baseURL } from '../config/api';

export const refreshAccessToken = async () => {
  const { refreshToken, logout } = useAuthStore.getState();
  
  if (!refreshToken) {
    logout();
    window.location.href = '/login';
    throw new Error('No refresh token');
  }

  try {
    const response = await axios.post(`${baseURL}api/auth/token/refresh/`, {
      refresh: refreshToken
    });
    
    const { access, refresh } = response.data;
    localStorage.setItem('token', access);
    if (refresh) {
      localStorage.setItem('refresh', refresh);
    }
    
    return access;
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout();
    window.location.href = '/login';
    throw error;
  }
};
