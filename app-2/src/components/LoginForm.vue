<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Message from "primevue/message";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();

// Navigation-Helper - verwendet window.location da Router im Host verwaltet wird
const navigate = (path: string) => {
  window.location.href = path;
};

const email = ref("");
const password = ref("");
const showError = ref(false);

const handleLogin = async () => {
  try {
    showError.value = false;
    await authStore.login(email.value, password.value);
    navigate("/");
  } catch (error: any) {
    showError.value = true;
  }
};
</script>

<template>
  <div class="flex flex-col gap-4 p-6 max-w-md mx-auto">
    <h2 class="text-2xl font-bold">Anmelden</h2>

    <Message v-if="showError" severity="error" :closable="false">
      {{ authStore.error || "Anmeldung fehlgeschlagen" }}
    </Message>

    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-2">
        <label for="email" class="font-medium">E-Mail</label>
        <InputText
          id="email"
          v-model="email"
          type="email"
          placeholder="ihre@email.de"
          :disabled="authStore.isLoading"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="password" class="font-medium">Passwort</label>
        <Password
          id="password"
          v-model="password"
          placeholder="Passwort"
          :feedback="false"
          :disabled="authStore.isLoading"
          toggleMask
        />
      </div>

      <Button
        label="Anmelden"
        @click="handleLogin"
        :loading="authStore.isLoading"
        :disabled="!email || !password"
        class="w-full"
      />
    </div>
  </div>
</template>

