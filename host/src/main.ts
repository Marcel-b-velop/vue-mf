import "./style.css";

import { createApp, defineAsyncComponent } from "vue";
import { createWebHistory, createRouter } from "vue-router";

import App from "./App.vue";
import Aura from "@primeuix/themes/aura";
import PrimeVue from "primevue/config";
import { createPinia } from "pinia";
import { routes } from "./router";

const remoteApp1 = defineAsyncComponent(() => import("remote-app1/App1"));
const remoteApp2 = defineAsyncComponent(() => import("remote-app2/App2"));
const confirmD = defineAsyncComponent(() => import("remote-lib/Confirm"));

const pinia = createPinia();
const app = createApp(App);

app.component("AppOne", remoteApp1);
app.component("AppTwo", remoteApp2);
app.component("Confirm", confirmD);

const router = createRouter({
  history: createWebHistory(),
  routes,
  strict: true,
  linkActiveClass: "active",
  scrollBehavior: () => ({ top: 0 }),
});

// Navigation Guard: Wenn /wichteln mit grp Query-Parameter aufgerufen wird, zu /wichteln/profil umleiten
router.beforeEach((to, _from, next) => {
  if (to.path === '/wichteln' && to.query.grp) {
    next({ path: '/wichteln/profil', query: { grp: to.query.grp } });
  } else {
    next();
  }
});

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      cssLayer: false,
    },
  },
});
app.use(pinia);
app.mount("#app");

