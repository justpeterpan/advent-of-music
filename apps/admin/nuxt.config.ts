// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase'],
  runtimeConfig: {
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      tokenUrl: process.env.SPOTIFY_TOKEN_URL,
    },
    supabase: {
      key: process.env.SUPABASE_KEY,
      url: process.env.SUPABASE_URL,
    },
  },
  supabase: {
    redirect: false,
  },
})
