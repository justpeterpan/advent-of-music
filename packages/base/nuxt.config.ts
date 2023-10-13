// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss", "@nuxt/image"],
  supabase: {
    redirect: false,
  },
  nitro: {
    preset: "vercel",
    compressPublicAssets: {
      brotli: true,
      gzip: false,
    },
  },
  image: {
    domains: ["i.scdn.co"],
    densities: [1, 2],
  },
  runtimeConfig: {
    supabase: {
      key: process.env.SUPABASE_KEY,
      url: process.env.SUPABASE_URL,
    },
  },
});
