<template>
  <div
    class="group-hover:bg-indigo-500 bg-pink-500 text-white px-2 line-clamp-1 group-hover:transition-colors group-hover:duration-500 duration-500 max-w-max"
  >
    {{ text }}
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
</script>
