<template>
  <div
    class="m-10"
    :class="route.query.t === 'dark' ? 'bg-neutral-950' : 'bg-white'"
  >
    <NuxtPage class="m-10" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
useHead({
  bodyAttrs: {
    class: route.query.t === 'dark' ? 'bg-neutral-950' : 'bg-white',
  },
})
</script>
