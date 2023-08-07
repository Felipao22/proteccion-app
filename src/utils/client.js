import axios from "axios";
import { getToken } from "./token";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const apiClient = axios.create({
  baseURL: apiBaseUrl
});

apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

export default apiClient;
