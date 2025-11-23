import { apiClient } from "remote-lib/apiClient";

export function useApi() {
  if (!apiClient) {
    throw new Error("apiClient not provided!");
  }

  const fetchTodos = () => {
    return apiClient.get("/");
  };

  const fetchTodo = (id: number) => {
    return apiClient.get(`/${id}`);
  };

  const postTodo = (data: any) => {
    return apiClient.post("/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  return {
    fetchTodos,
    fetchTodo,
    postTodo,
  };
}
