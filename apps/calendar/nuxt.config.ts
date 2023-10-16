// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: '../../packages/base',
  nitro: {
    experimental: {
      asyncContext: true,
    },
  },
})
