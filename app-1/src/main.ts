import "./style.css";

import { createApp, defineAsyncComponent } from "vue";

import App from "./App.vue";
import PrimeVue from "primevue/config";
import { createPinia } from "pinia";
import { apiClient } from 'remote-lib/apiClient';

const pinia = createPinia();
const confirmD = defineAsyncComponent(() => import("remote-lib/Confirm"));

const app = createApp(App);
app.use(pinia);
app.use(PrimeVue);
app.component("Confirm", confirmD);
console.log('apiClient:', apiClient); // ← Was ist das??
console.log('apiClient.get:', apiClient?.get); 
// apiClient kann jetzt überall in app-1 genutzt werden
app.provide('apiClient', apiClient);
app.mount("#app");

