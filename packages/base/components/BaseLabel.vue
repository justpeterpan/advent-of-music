<template>
  <div :class="theme === 'dark' ? darkTheme : defaultTheme">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string; theme: string }>();

const defaultTheme =
  "group-hover:bg-indigo-500 bg-pink-500 text-white px-2 line-clamp-1 group-hover:transition-colors group-hover:duration-500 duration-500 max-w-max";

const darkTheme =
  "group-hover:bg-white bg-black border border-white group-hover:text-black text-white px-2 line-clamp-1 group-hover:transition-colors group-hover:duration-500 duration-500 max-w-max";
</script>
