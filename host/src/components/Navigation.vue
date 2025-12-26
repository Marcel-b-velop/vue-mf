<script setup lang="ts">
import Menubar from "primevue/menubar";
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();

const items = ref([
  {
    label: "Home",
    icon: "pi pi-home",
    route: "/",
  },
  {
    label: "About",
    icon: "pi pi-star",
    route: "/about",
  },
  {
    label: "Wichteln",
    icon: "pi pi-star",
    route: "/wichteln",
  },
]);

const displayName = computed(() => {
  if (authStore.user?.userName) {
    return authStore.user.userName;
  }
  if (authStore.user?.email) {
    return authStore.user.email;
  }
  return "Login";
});

onMounted(async () => {
  await authStore.initialize();

  // Auf Auth-Änderungen reagieren
  window.addEventListener("auth:logout", () => {
    authStore.clearToken();
  });

  // Auf Storage-Änderungen reagieren (z.B. wenn Token in app-2 gesetzt wird)
  const handleStorageChange = async (e: StorageEvent) => {
    if (e.key === "accessToken") {
      if (e.newValue) {
        await authStore.fetchUser();
      } else {
        authStore.clearToken();
      }
    }
  };

  window.addEventListener("storage", handleStorageChange);
});
</script>

<template>
  <div class="card">
    <Menubar :model="items">
      <template #item="{ item, props, hasSubmenu }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
        </a>
      </template>
      <template #end>
        <router-link v-if="!authStore.isAuthenticated" to="/login" custom v-slot="{ href, navigate }">
          <a v-ripple :href="href" @click="navigate" class="p-menubar-root-list-item-link">
            <span class="pi pi-user" />
            <span>Login</span>
          </a>
        </router-link>
        <div v-else class="p-menubar-root-list-item-link">
          <span class="pi pi-user" />
          <span>{{ displayName }}</span>
        </div>
      </template>
    </Menubar>
  </div>
</template>
