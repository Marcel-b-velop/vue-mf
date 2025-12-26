import axios from "axios";
import type { ApiClient } from "../types";


const client = axios.create({
  baseURL: "http://localhost:5282/todos",
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors für Error-Handling, Token-Refresh, etc.
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);

    // 401: Token ungültig → Redirect zu Login
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const apiClient: ApiClient = {
  get: <T>(url: string, config = {}) => client.get<T>(url, config).then((r) => r.data),
  post: <T>(url: string, data: any, config = {}) =>
    client.post<T>(url, data, {...config}).then((r) => r.data),
  put: <T>(url: string, data: any, config = {}) =>
    client.put<T>(url, data, config).then((r) => r.data),
  delete: <T>(url: string, config = {}) => client.delete<T>(url, config).then((r) => r.data),
};

export { client }; // Falls jemand direkten Zugriff braucht
