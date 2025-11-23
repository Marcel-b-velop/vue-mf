import { inject } from 'vue';
import type { ApiClient } from 'remote-lib/types';

export function useApi() {
  const apiClient = inject<ApiClient>('apiClient');

  if (!apiClient) {
    throw new Error('apiClient not provided!');
  }

  const fetchTodos = () => {
    return apiClient.get('/');
  }

  return {
    fetchTodos
  };
}