// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: '../../packages/base',
  runtimeConfig: {
    public: {
      calendarBaseUrl: process.env.CALENDAR_BASE_URL,
    },
  },
})
