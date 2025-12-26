import "./style.css";

import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import { createPinia } from "pinia";
import router from "@/router";

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(PrimeVue);
app.use(router);
app.mount("#app");

