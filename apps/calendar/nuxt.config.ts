// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: '../../packages/base',
  devtools: { enabled: true },
  nitro: {
    experimental: {
      asyncContext: true,
    },
  },
})
