import { defineConfig } from "vite";
import federation from "@originjs/vite-plugin-federation";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "remote-lib",
      filename: "remoteEntry.js",
      // Modules to expose
      exposes: {
        "./Confirm": "./src/components/Confirm.vue",
      },
      shared: ["vue"],
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

