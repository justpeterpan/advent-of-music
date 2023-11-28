// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: '../../packages/base',
  nitro: {
    experimental: {
      asyncContext: true,
    },
  },
  runtimeConfig: {
    public: {
      admin: process.env.ADMIN_URL || 'http://localhost:3000',
    },
  },
  app: {
    head: {
      title: 'Advent of music',
    },
  },
})
