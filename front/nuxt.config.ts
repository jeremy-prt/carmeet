import "dotenv/config";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", "mapbox-gl/dist/mapbox-gl.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    },
  },

  routeRules: {
    "/accueil": { redirect: "/" },
  },

  modules: ["@nuxt/icon"],
});
