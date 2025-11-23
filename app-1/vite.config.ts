import { defineConfig } from "vite";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    federation({
      name: "remote-app1",
      filename: "remoteEntry.js",
      // Modules to expose
      exposes: {
        "./App1": "./src/App.vue",
      },
      remotes: {
        "remote-lib": "http://localhost:5177/assets/remoteEntry.js",
      },
      shared: {
        vue: { singleton: true },
        pinia: { singleton: true },
        primevue: { singleton: true },
        "primevue/config": { singleton: true },
        axios: { singleton: true }, 
      },
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false, // WICHTIG damit Tailwind-Klassen in der Host-App funktionieren
  },
  server: {
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
  },
});

