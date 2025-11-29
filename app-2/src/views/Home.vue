<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "../stores/authStore";
import Card from "primevue/card";
import Button from "primevue/button";

const authStore = useAuthStore();

// Navigation-Helper - verwendet window.location da Router im Host verwaltet wird
const navigate = (path: string) => {
  window.location.href = path;
};

const goToLogin = () => navigate("/login");
const goToRegister = () => navigate("/register");

const userInfo = computed(() => {
  if (!authStore.user) return null;
  return {
    email: authStore.user.email,
    userName: authStore.user.userName,
    roles: authStore.user.roles.join(", "),
    id: authStore.user.id,
  };
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card>
      <template #title>Willkommen in App 2</template>
      <template #content>
        <div class="flex flex-col gap-4">
          <p class="text-gray-600">
            Dies ist die Authentifizierungs-App mit Login, Registrierung und Logout-Funktionalität.
          </p>

          <div v-if="authStore.isAuthenticated && userInfo" class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold text-green-900 mb-2">Angemeldet als:</h3>
            <div class="space-y-1 text-sm">
              <p><span class="font-medium">E-Mail:</span> {{ userInfo.email }}</p>
              <p v-if="userInfo.userName">
                <span class="font-medium">Benutzername:</span> {{ userInfo.userName }}
              </p>
              <p><span class="font-medium">Rollen:</span> {{ userInfo.roles }}</p>
              <p class="text-xs text-gray-500">ID: {{ userInfo.id }}</p>
            </div>
          </div>

          <div v-else class="bg-yellow-50 p-4 rounded-lg">
            <p class="text-yellow-900">
              Sie sind nicht angemeldet. Bitte melden Sie sich an oder registrieren Sie sich.
            </p>
            <div class="flex gap-2 mt-3">
              <Button label="Anmelden" @click="goToLogin" />
              <Button label="Registrieren" severity="secondary" @click="goToRegister" />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

