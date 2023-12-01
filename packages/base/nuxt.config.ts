// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss", "@vueuse/nuxt"],
  supabase: {
    redirect: false,
    redirectOptions: {
      login: "/login",
      callback: "/callback",
      exclude: ["/", "cal/*", "cals/*"],
    },
  },
  nitro: {
    preset: "vercel",
    compressPublicAssets: {
      brotli: true,
      gzip: false,
    },
  },
});
