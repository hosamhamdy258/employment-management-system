import axios from "axios";
import { refreshAccessToken } from '../utils/tokenRefresh';
import { baseURL } from '../config/api';

const api = axios.create({
  baseURL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors with token refresh (skip for login requests)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Skip token refresh for login requests
    const isLoginRequest = originalRequest.url?.includes('/auth/login/');
    
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isLoginRequest
    ) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
