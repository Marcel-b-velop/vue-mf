import "./style.css";

import App from "./App.vue";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import { createPinia } from "pinia";

const pinia = createPinia();

const app = createApp(App);

app.use(PrimeVue);
app.use(pinia);
app.mount("#app");

