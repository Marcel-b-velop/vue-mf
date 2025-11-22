import "./style.css";

import { createApp, defineAsyncComponent } from "vue";

import App from "./App.vue";
import PrimeVue from "primevue/config";

const confirmD = defineAsyncComponent(() => import("remote-lib/Confirm"));

const app = createApp(App);
app.use(PrimeVue);
app.component("Confirm", confirmD);

app.mount("#app");

