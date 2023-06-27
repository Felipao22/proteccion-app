import axios from "axios";
import { getToken } from "./token";

const apiClient = axios.create({
  // URL para variable de entorno
  baseURL: "http://localhost:3001"
});

apiClient.interceptors.request.use((request) => {
  request.headers= {
    Authorization: `Bearer ${getToken()}`
  };
  return request;
})

export default apiClient;