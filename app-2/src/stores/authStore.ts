import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authService, type UserInfo } from "../services/authService";

export const useAuthStore = defineStore("app2Auth", () => {
  const user = ref<UserInfo | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => {
    return !!user.value && authService.isAuthenticated();
  });

  const isAdmin = computed(() => {
    return user.value?.roles.includes("Admin") ?? false;
  });

  async function login(email: string, password: string) {
    try {
      isLoading.value = true;
      error.value = null;
      await authService.login({ email, password });
      await fetchUser();
    } catch (err: any) {
      error.value = err.message || err.response?.data?.message || "Anmeldung fehlgeschlagen";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(email: string, password: string, userName?: string) {
    try {
      isLoading.value = true;
      error.value = null;
      await authService.register({ email, password, userName });
      await fetchUser();
    } catch (err: any) {
      error.value = err.response?.data?.message || "Registrierung fehlgeschlagen";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUser() {
    try {
      if (!authService.isAuthenticated()) {
        user.value = null;
        return;
      }
      user.value = await authService.getCurrentUser();
    } catch (err) {
      user.value = null;
      authService.logout();
    }
  }

  function logout() {
    authService.logout();
    user.value = null;
    error.value = null;
  }

  // Beim Start prüfen, ob bereits ein Token vorhanden ist
  async function initialize() {
    if (authService.isAuthenticated()) {
      await fetchUser();
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchUser,
    initialize,
  };
});

