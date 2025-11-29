import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({}),
  actions: {
    setToken(newToken: string) {
      localStorage.setItem("accessToken", newToken);
    },
    clearToken() {
      localStorage.removeItem("accessToken");
    },
  },
  getters: {
    token: () => localStorage.getItem("accessToken"),
    isAuthenticated: () => !!localStorage.getItem("accessToken"),
  },
});

