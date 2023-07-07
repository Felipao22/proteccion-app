import axios from "axios";
import { getToken } from "./token";

const apiClient = axios.create({
  baseURL: "http://localhost:3001"
});

apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

export default apiClient;
