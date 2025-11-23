import axios from 'axios';
import type { ApiClient } from '../types';

const client = axios.create({
  baseURL: 'http://localhost:5282/todos',
  timeout: 10000,
});

// Interceptors für Error-Handling, Token-Refresh, etc.
client.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const apiClient: ApiClient = {
  get: <T,>(url: string) => client.get<T>(url).then(r => r.data),
  post: <T,>(url: string, data: any) => client.post<T>(url, data).then(r => r.data),
  put: <T,>(url: string, data: any) => client.put<T>(url, data).then(r => r.data),
  delete: <T,>(url: string) => client.delete<T>(url).then(r => r.data),
};

export { client }; // Falls jemand direkten Zugriff braucht