import { inject } from 'vue';
import type { ApiClient } from 'remote-lib/types';

export function useApi() {
  const apiClient = inject<ApiClient | null>('apiClient', null);

  if (!apiClient) {
    throw new Error('apiClient not provided!');
  }

  const fetchTodos = () => {
    return apiClient.get('/');
  }

  const fetchTodo = (id: number) => {
    return apiClient.get(`/${id}`);
  }

  return {
    fetchTodos,
    fetchTodo
  };
}