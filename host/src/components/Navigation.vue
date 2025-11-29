<script setup lang="ts">
import Menubar from "primevue/menubar";
const authStore = useAuthStore();

// Nach Login: Token setzen
const login = async (credentials: string) => {
  authStore.setToken(credentials);
  // Jetzt wird Token automatisch bei jedem Request mitgesendet!
};
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";

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
    label: "Login",
    icon: "pi pi-user",
    route: '/login',
  },
]);
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
    </Menubar>
  </div>
</template>

