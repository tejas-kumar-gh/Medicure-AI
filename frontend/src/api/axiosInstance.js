import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Send credentials (cookies) in cross-origin situations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor for handling errors centrally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract server error messages if available
    const errorMsg = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'An unexpected error occurred.';

    const isMeCheck = error.config?.url?.includes('/auth/me');
    const isGetProfile = error.config?.url?.endsWith('/profile') && error.config?.method === 'get';

    // We do NOT want to show errors when trying to fetch user auth status or profile on load
    if (error.response?.status !== 401 && !isMeCheck && !isGetProfile) {
      toast.error(errorMsg);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
