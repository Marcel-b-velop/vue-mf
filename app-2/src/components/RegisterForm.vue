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
const confirmPassword = ref("");
const userName = ref("");
const showError = ref(false);
const errorMessage = ref("");

const validatePassword = () => {
  if (password.value.length < 6) {
    return "Passwort muss mindestens 6 Zeichen lang sein";
  }
  if (!/[A-Z]/.test(password.value)) {
    return "Passwort muss mindestens einen Großbuchstaben enthalten";
  }
  if (!/[a-z]/.test(password.value)) {
    return "Passwort muss mindestens einen Kleinbuchstaben enthalten";
  }
  if (!/[0-9]/.test(password.value)) {
    return "Passwort muss mindestens eine Ziffer enthalten";
  }
  if (password.value !== confirmPassword.value) {
    return "Passwörter stimmen nicht überein";
  }
  return null;
};

const handleRegister = async () => {
  try {
    showError.value = false;
    errorMessage.value = "";

    const validationError = validatePassword();
    if (validationError) {
      errorMessage.value = validationError;
      showError.value = true;
      return;
    }

    await authStore.register(email.value, password.value, userName.value || undefined);
    navigate("/");
  } catch (error) {
    showError.value = true;
  }
};
</script>

<template>
  <div class="flex flex-col gap-4 p-6 max-w-md mx-auto">
    <h2 class="text-2xl font-bold">Registrieren</h2>

    <Message v-if="showError" severity="error" :closable="false">
      {{ errorMessage || authStore.error || "Registrierung fehlgeschlagen" }}
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
        <label for="userName" class="font-medium">Benutzername (optional)</label>
        <InputText
          id="userName"
          v-model="userName"
          placeholder="Benutzername"
          :disabled="authStore.isLoading"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="password" class="font-medium">Passwort</label>
        <Password
          id="password"
          v-model="password"
          placeholder="Passwort"
          :feedback="true"
          :disabled="authStore.isLoading"
          toggleMask
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="confirmPassword" class="font-medium">Passwort bestätigen</label>
        <Password
          id="confirmPassword"
          v-model="confirmPassword"
          placeholder="Passwort bestätigen"
          :feedback="false"
          :disabled="authStore.isLoading"
          toggleMask
        />
      </div>

      <Button
        label="Registrieren"
        @click="handleRegister"
        :loading="authStore.isLoading"
        :disabled="!email || !password || !confirmPassword"
        class="w-full"
      />
    </div>
  </div>
</template>

