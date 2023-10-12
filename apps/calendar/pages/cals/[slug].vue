<script setup lang="ts">
const route = useRoute()
const { data: calendar } = await useFetch('/calendar', {
  method: 'post',
  body: { slug: route.params.slug },
})

function concatenateArtistNames(names: Array<string>) {
  return names.join(', ')
}
</script>

<template>
  <div v-if="typeof calendar !== 'string'">
    <TransitionGroup
      name="list"
      tag="div"
      appear
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-24"
    >
      <div
        v-for="(track, index) in calendar"
        class="relative group shadow-lg max-w-[640px] rounded ring-1 ring-gray-200"
        :data-index="index"
        :style="`--index: ${index}`"
      >
        <img
          :src="track.coverUrls[0]"
          :alt="track.trackName"
          class="rounded shadow drop-shadow-sm saturate-0 hover:saturate-100 transition-all duration-1000 ease-in-out"
        />
        <div
          class="z-20 absolute bottom-4 -left-4 font-bold group-hover:bg-indigo-500 bg-pink-500 rotate-6 text-white px-2 line-clamp-1 group-hover:transition-colors group-hover:duration-500 duration-500"
        >
          {{ concatenateArtistNames(track.artistName) }}
        </div>
        <div
          class="text-sm absolute -bottom-2 -left-4 group-hover:bg-indigo-500 bg-pink-500 rotate-6 text-white px-2 line-clamp-1"
        >
          {{ track.trackName }}
        </div>
      </div>
    </TransitionGroup>
  </div>
  <div v-else>{{ calendar }}</div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-active {
  position: absolute;
}

.list-enter-active[data-index] {
  transition-delay: calc(0.05s * var(--index));
}
</style>
