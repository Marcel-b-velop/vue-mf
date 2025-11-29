import axios from "axios";

const API_BASE_URL = "http://localhost:5283/api/identity";

export interface RegisterRequest {
  email: string;
  password: string;
  userName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  userId: string;
}

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
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await authClient.post<AuthResponse>("/register", data);
    if (response.data.token) {
      localStorage.setItem("accessToken", response.data.token);
    }
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await authClient.post<AuthResponse>("/login", data);
      if (response.data.token) {
        localStorage.setItem("accessToken", response.data.token);
      }
      return response.data;
    } catch (error: any) {
      if (error.code === "ECONNREFUSED" || error.message?.includes("Network Error")) {
        throw new Error("IdentityServer ist nicht erreichbar. Bitte starten Sie den IdentityServer.");
      }
      // Spezifische Fehlermeldung für 401
      if (error.response?.status === 401) {
        const serverMessage = error.response?.data?.message || "Ungültige E-Mail oder Passwort.";
        throw new Error(serverMessage);
      }
      throw error;
    }
  },

  async getCurrentUser(): Promise<UserInfo> {
    const response = await authClient.get<UserInfo>("/me");
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("accessToken");
    window.dispatchEvent(new CustomEvent("auth:logout"));
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  },

  getToken(): string | null {
    return localStorage.getItem("accessToken");
  },
};

