<template>
  <div
    class="m-10"
    :class="route.query.t === 'dark' ? 'bg-neutral-950' : 'bg-white'"
  >
    <h1
      class="max-w-max m-10 my-24 text-5xl font-black underline underline-offset-8 decoration-wavy decoration-pink-500 decoration hover:underline-offset-4 hover:transition-all hover:duration-500 duration-500 ease-in-out hover:ease-in-out hover:decoration-indigo-500"
      :class="route.query.t === 'dark' ? 'text-white' : 'text-black'"
    >
      Advent Of Music
    </h1>
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
