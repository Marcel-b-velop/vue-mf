import "./style.css";

import { createApp, defineAsyncComponent } from "vue";

import App from "./App.vue";
import Aura from "@primeuix/themes/aura";
import PrimeVue from "primevue/config";
import { routes } from "./router";
import { createMemoryHistory, createRouter } from "vue-router";

const remoteApp1 = defineAsyncComponent(() => import("remote-app1/App1"));
const confirmD = defineAsyncComponent(() => import("remote-lib/Confirm"));

const app = createApp(App);

app.component("AppOne", remoteApp1);
app.component("Confirm", confirmD);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
});

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

app.use(router);
app.mount("#app");

