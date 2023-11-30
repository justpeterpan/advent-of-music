<template>
  <div class="h-screen bg-neutral-950">
    <TheSnowfall />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'bg-neutral-950',
  },
})
</script>
