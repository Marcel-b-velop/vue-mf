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
        vue: { generate: false, import: false },
        pinia: { generate: false, import: false },
        primevue: { generate: false, import: false },
        axios: { generate: false, import: false },
      },
    }),
  ],

  build: {
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: false,
    chunkSizeWarningLimit: 500, // Warnung auf 1 MB erhöhen
       experimental: {
        renderBuiltUrl(filename: string) {
          const url = env.VITE_APP_URL;
          return `${url}/${filename}`;
        },
      },
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

