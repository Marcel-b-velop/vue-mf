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
      name: "remote-app2",
      filename: "remoteEntry.js",
      // Modules to expose
      exposes: {
        "./App2": "./src/App.vue", // Für standalone-Modus
        "./Home": "./src/views/Home.vue",
        "./LoginForm": "./src/components/LoginForm.vue",
        "./RegisterForm": "./src/components/RegisterForm.vue",
      },
      remotes: {
        "remote-lib": "http://localhost:5177/assets/remoteEntry.js",
      },
      shared: {
        vue: { generate: false, import: false },
        pinia: { generate: false, import: false },
        primevue: { generate: false, import: false },
        axios: { generate: true, import: true },
      },
    }),
  ],

  build: {
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: false,
    chunkSizeWarningLimit: 500,
  },
  server: {
    port: 5175,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
  },
});

