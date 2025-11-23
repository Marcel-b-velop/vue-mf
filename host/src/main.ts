import "./style.css";

import { createApp, defineAsyncComponent } from "vue";
import { createWebHistory, createRouter } from "vue-router";

import App from "./App.vue";
import Aura from "@primeuix/themes/aura";
import PrimeVue from "primevue/config";
import { createPinia } from "pinia";
import { routes } from "./router";

const remoteApp1 = defineAsyncComponent(() => import("remote-app1/App1"));
const confirmD = defineAsyncComponent(() => import("remote-lib/Confirm"));

const pinia = createPinia();
const app = createApp(App);

app.component("AppOne", remoteApp1);
app.component("Confirm", confirmD);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: "system",
      cssLayer: false,
    },
  },
});
app.use(pinia);
app.mount("#app");

