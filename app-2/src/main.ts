import "./style.css";

import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

// Router nur für standalone-Modus (wenn app-2 direkt verwendet wird)
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("./views/Home.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("./views/Register.vue"),
    },
  ],
});

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(PrimeVue);
app.use(router);
app.mount("#app");

