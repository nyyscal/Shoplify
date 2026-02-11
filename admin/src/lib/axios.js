// lib/axios.js (or wherever your axiosInstance is)
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
