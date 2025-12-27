import { defineConfig } from "vite";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
    federation({
      name: "remote-wichteln",
      filename: "remoteEntry.js",
      // Modules to expose
      exposes: {
        "./WichtelnGruppeErstellen": "./src/views/GruppeErstellenView.vue",
        "./WichtelnProfilErstellen": "./src/views/GruppeBeitretenView.vue",
        "./WichtelnProfil": "./src/views/ProfilView.vue",
      },
      remotes: {
        "remote-lib": "http://localhost:5177/assets/remoteEntry.js",
      },
      shared: {
        vue: { generate: false, import: false },
        "vue-router": { generate: false, import: false },
        pinia: { generate: false, import: false },
        primevue: { generate: false, import: false },
        axios: { generate: false, import: false },
        "vee-validate": { generate: false, import: false },
        yup: { generate: false, import: false },
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
    port: 5176,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
  },
});

