import axios from "axios";

const API_BASE_URL = "http://localhost:5283/api/identity";

export interface UserInfo {
  id: string;
  email: string;
  userName: string;
  roles: string[];
}

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Token zu Requests hinzufügen
authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: 401 Handling
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async getCurrentUser(): Promise<UserInfo> {
    const response = await authClient.get<UserInfo>("/me");
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  },
};

