<script setup lang="ts">
const route = useRoute()
const { data: calendar } = await useFetch('/calendar', {
  method: 'post',
  body: { slug: route.params.slug },
})
</script>

<template>
  <div v-if="typeof calendar !== 'string'">
    <ul class="grid grid-cols-4 gap-4">
      <li v-for="track of calendar">
        <div class="relative">
          <img
            :src="track.coverUrls[0]"
            :alt="track.trackName"
            class="rounded h-64 w-64 shadow"
          />
          <div
            class="absolute -bottom-2 -left-4 bg-pink-500 rotate-6 text-white px-2 line-clamp-1"
          >
            {{ track.trackName }}
          </div>
        </div>
        <div class="text-black">
          <span v-for="name of track.artistName">{{ name }} &nbsp; </span>
        </div>
      </li>
    </ul>
  </div>
  <div v-else>{{ calendar }}</div>
</template>
