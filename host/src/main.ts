import "./style.css";

import { createApp, defineAsyncComponent } from "vue";

import App from "./App.vue";
import Aura from "@primeuix/themes/aura";
import PrimeVue from "primevue/config";

const remoteApp1 = defineAsyncComponent(() => import("remote-app1/App1"));
const confirmD = defineAsyncComponent(() => import("remote-lib/Confirm"));

const app = createApp(App);

app.component("AppOne", remoteApp1);
app.component("Confirm", confirmD);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.mount("#app");

