// lib/axios.js (or wherever your axiosInstance is)
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Add interceptor to attach Clerk token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get token from Clerk
    if (window.Clerk) {
      try {
        const token = await window.Clerk.session?.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error getting Clerk token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);