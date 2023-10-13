<script setup lang="ts">
import { useStorage } from '@vueuse/core'
const { data: calendar } = await useFetch('/calendar', {
  method: 'post',
  body: { slug: useRoute().params.slug },
})
const openedTrack: Ref<number | null> = ref(null)
const defaultState: Set<number> = new Set()
const state = useStorage('opened', defaultState)

async function openDoor(trackIndex: number, trackId: string) {
  if (trackId !== 'placeholder') {
    state.value = state.value.add(trackIndex)
    openedTrack.value = trackIndex
  }
}

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
        class="relative group shadow-lg max-w-[320px] rounded ring-1 ring-gray-200"
        :key="track.spotifyTrackID + index"
      >
        <ClientOnly>
          <div class="relative overflow-hidden">
            <div
              class="door flex align-middle rounded ring-1 ring-gray-200 bg-white"
              :class="[
                track.spotifyTrackID === 'placeholder'
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer',
                {
                  'door-open':
                    state.has(index) && track.spotifyTrackID !== 'placeholder',
                },
              ]"
              @click="openDoor(index, track.spotifyTrackID)"
            >
              <span class="text-9xl font-black self-center pl-2">{{
                index + 1
              }}</span>
            </div>
            <NuxtImg
              :src="
                track.coverUrls[0] !== 'placeholder'
                  ? track.coverUrls[0]
                  : '/cover.jpg'
              "
              :alt="track.trackName"
              format="webp"
              quality="60"
              class="rounded shadow object-cover drop-shadow-sm saturate-0 hover:saturate-100 transition-all duration-1000 ease-in-out"
            />
          </div>
        </ClientOnly>

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

<style>
.door {
  position: absolute;
  top: 100%;
  left: 100%;
  width: 100%;
  height: 100%;
  transform: translate(-100%, -100%);
  transition: width 1.5s, height 1.5s, transform 0.5s;
  z-index: 1;
}

.door-open {
  width: 0%;
  height: 100%;
  transition: opacity 1s, width 1s, height 1s, transform 1s;
  transform: translate(0%, -100%) scale(1);
}
</style>
