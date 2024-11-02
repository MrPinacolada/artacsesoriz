import Aura from "@primevue/themes/aura";
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  // css: ["~/assets/styles/_global.scss"],
  modules: ["@primevue/nuxt-module"],
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
  css: ["~/assets/styles/_global.scss"],

  experimental: {
    asyncContext: true,
  },
  app: {
    baseURL: "/artacsesoriz/",
    buildAssetsDir: "/artacsesoriz/_nuxt/",
  },
  router: {
    base: "/artacsesoriz/",
  },
  target: "static",
  ssr: false,
});
