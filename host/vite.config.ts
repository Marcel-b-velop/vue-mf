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
      name: "host-app",
      filename: "remoteEntry.js",
      // Modules to expose
      remotes: {
        "remote-app1": "http://localhost:5174/assets/remoteEntry.js",
        "remote-lib": "http://localhost:5177/assets/remoteEntry.js",
      },
      shared: {
        vue: { singleton: true, eager: true },
        pinia: { singleton: true, eager: true },
        primevue: { requiredVersion: "^4.1.1", version: "^4.1.1", singleton: true },
        axios: { singleton: true }, 
      },
    }),
  ],
  server: {
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
  },
});

