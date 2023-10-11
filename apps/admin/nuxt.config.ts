// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: '../../packages/base',
  devtools: { enabled: true },
  runtimeConfig: {
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      tokenUrl: process.env.SPOTIFY_TOKEN_URL,
    },
  },
})
