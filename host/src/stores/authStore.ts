import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authService, type UserInfo } from "../services/authService";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<UserInfo | null>(null);

  const isAuthenticated = computed(() => {
    return !!user.value && authService.isAuthenticated();
  });

  async function fetchUser() {
    try {
      if (!authService.isAuthenticated()) {
        user.value = null;
        return;
      }
      user.value = await authService.getCurrentUser();
    } catch (err) {
      user.value = null;
    }
  }

  function setToken(newToken: string) {
    localStorage.setItem("accessToken", newToken);
    fetchUser();
  }

  function clearToken() {
    localStorage.removeItem("accessToken");
    user.value = null;
  }

  // Beim Start prüfen, ob bereits ein Token vorhanden ist
  async function initialize() {
    if (authService.isAuthenticated()) {
      await fetchUser();
    }
  }

  return {
    user,
    isAuthenticated,
    setToken,
    clearToken,
    fetchUser,
    initialize,
  };
});

