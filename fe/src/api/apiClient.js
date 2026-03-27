import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('empiros_user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = JSON.parse(localStorage.getItem('empiros_user'));
        if (!user?.refreshToken) {
           throw new Error('No refresh token');
        }

        const response = await axios.post('http://localhost:5000/api/auth/refresh', {
          refreshToken: user.refreshToken,
        });

        const { accessToken, refreshToken } = response.data;
        
        // Update user in localStorage
        const updatedUser = { ...user, token: accessToken, refreshToken };
        localStorage.setItem('empiros_user', JSON.stringify(updatedUser));
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed -> logout
        localStorage.removeItem('empiros_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
