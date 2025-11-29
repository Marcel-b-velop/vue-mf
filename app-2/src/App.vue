<script setup lang="ts">
import { onMounted, computed, getCurrentInstance } from "vue";
import { useAuthStore } from "./stores/authStore";
import Button from "primevue/button";
import Avatar from "primevue/avatar";

const authStore = useAuthStore();

// Prüfen ob Router verfügbar ist (nur für standalone-Modus)
const hasRouter = computed(() => {
  try {
    const instance = getCurrentInstance();
    return instance?.appContext.config.globalProperties.$router !== undefined;
  } catch {
    return false;
  }
});

onMounted(async () => {
  await authStore.initialize();
});

// Logout-Event Listener
window.addEventListener("auth:logout", () => {
  authStore.logout();
  window.location.href = "/login";
});

const handleLogout = () => {
  authStore.logout();
  window.location.href = "/login";
};

const goToLogin = () => {
  window.location.href = "/login";
};

const goToRegister = () => {
  window.location.href = "/register";
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header mit Auth-Status -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">App 2 - Authentifizierung</h1>
          </div>

          <div class="flex items-center gap-4">
            <template v-if="authStore.isAuthenticated">
              <div class="flex items-center gap-3">
                <Avatar
                  :label="authStore.user?.userName?.charAt(0).toUpperCase() || 'U'"
                  shape="circle"
                  class="bg-primary text-white"
                />
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-gray-900">
                    {{ authStore.user?.userName || authStore.user?.email }}
                  </span>
                  <span v-if="authStore.isAdmin" class="text-xs text-blue-600">Admin</span>
                </div>
              </div>
              <Button label="Abmelden" severity="secondary" @click="handleLogout" />
            </template>
            <template v-else>
              <Button label="Anmelden" @click="goToLogin" />
              <Button label="Registrieren" severity="secondary" @click="goToRegister" />
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content - nur wenn Router vorhanden (standalone) -->
    <main v-if="hasRouter" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
