<script setup lang="ts">
const route = useRoute()
const placeholderImage = '/cover.jpg'
const { data: calendar } = await useFetch('/calendar', {
  method: 'post',
  body: { slug: route.params.slug },
})

const trackClasses =
  'group-hover:bg-indigo-500 bg-pink-500 text-white px-2 line-clamp-1 group-hover:transition-colors group-hover:duration-500 duration-500 max-w-max'

function concatenateArtistNames(names: Array<string>) {
  return names.join(', ')
}
</script>

<template>
  <div v-if="typeof calendar !== 'string'">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-24">
      <div
        v-for="(track, index) in calendar"
        class="relative group shadow-lg max-w-[640px] rounded ring-1 ring-gray-200"
        :data-index="index"
        :style="`--index: ${index}`"
      >
        <img
          :src="
            track.coverUrls[0] !== 'placeholder'
              ? track.coverUrls[0]
              : placeholderImage
          "
          :alt="track.trackName"
          class="rounded shadow drop-shadow-sm saturate-0 hover:saturate-100 transition-all duration-1000 ease-in-out"
        />
        <div
          v-if="track.artistName"
          class="grid grid-flow-row rotate-6 gap-1 absolute bottom-4 -left-4 font-bold"
        >
          <div
            v-if="concatenateArtistNames(track.artistName)"
            :class="trackClasses"
          >
            {{ concatenateArtistNames(track.artistName) }}
          </div>
          <div v-if="track.trackName" :class="trackClasses">
            {{ track.trackName }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>{{ calendar }}</div>
</template>
