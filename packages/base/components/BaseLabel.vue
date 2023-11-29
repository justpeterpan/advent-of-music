<template>
  <div
    class="group-hover:bg-white bg-black border border-white group-hover:text-black text-white px-2 line-clamp-1 group-hover:transition-colors group-hover:duration-500 duration-500 max-w-fit"
  >
    {{ text }}
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
</script>
