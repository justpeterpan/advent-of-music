<script setup lang="ts">
import PlayIcon from '~/assets/icons/play.svg'
import PauseIcon from '~/assets/icons/pause.svg'
import OpenIcon from '~/assets/icons/open.svg'
import { useStorage } from '@vueuse/core'

const route = useRoute()

let theme = ''

if (typeof route.query.t === 'string') {
  theme = route.query.t
} else if (
  Array.isArray(route.query.t) &&
  route.query.t.length > 0 &&
  typeof route.query.t[0] === 'string'
) {
  theme = route.query.t[0]
} else {
  theme = 'default'
}

const { data: calendar } = await useFetch('/calendar', {
  method: 'post',
  body: { slug: route.params.slug },
})
const state = useStorage(`${route.params.slug}`, new Set())
const isPlaying = ref({ state: false, id: '' })

function openDoor(trackIndex: number, trackId: string) {
  if (trackId !== 'placeholder') {
    state.value = state.value.add(trackIndex)
  }
}

function getAudioElementById(id: string): HTMLAudioElement | null {
  return document.getElementById(id) as HTMLAudioElement | null
}

function togglePlayback(audioElement: HTMLAudioElement) {
  if (audioElement.paused) {
    audioElement.play()
    isPlaying.value.state = true
  } else {
    audioElement.pause()
    isPlaying.value.state = false
  }
}

function playAudio(trackId: string) {
  const audioElement = getAudioElementById(trackId)

  if (!audioElement) return

  if (trackId === isPlaying.value.id) {
    togglePlayback(audioElement)
    return
  }

  // pause currently playing track
  if (isPlaying.value.id) {
    const currentlyPlaying = getAudioElementById(isPlaying.value.id)
    if (currentlyPlaying) currentlyPlaying.pause()
  }

  // play the new track
  audioElement.play()
  isPlaying.value = { state: true, id: trackId }
}

function concatenateArtistNames(names: Array<string>) {
  return names.join(', ')
}

function isPlaceHolder(door: { spotifyTrackID: string }) {
  return door.spotifyTrackID === 'placeholder'
}

function isOpened(index: number) {
  return state.value.has(index)
}

function currentlyPlaying(door: { spotifyTrackID: string }) {
  return isPlaying.value.state && isPlaying.value.id === door.spotifyTrackID
}
</script>

<template>
  <div v-if="typeof calendar !== 'string'">
    <h1
      class="max-w-max mt-24 text-5xl font-black underline underline-offset-8 decoration-wavy decoration-pink-500 decoration hover:underline-offset-4 hover:transition-all hover:duration-500 duration-500 ease-in-out hover:ease-in-out hover:decoration-indigo-500"
      :class="route.query.t === 'dark' ? 'text-white' : 'text-black'"
    >
      Advent Of Music
    </h1>
    <h2
      class="max-w-max text-3xl font-extrabold underline underline-offset-8 decoration-wavy mt-10 mb-24 decoration-pink-500"
    >
      {{ calendar?.calendarName }}
    </h2>
    <main
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-24"
    >
      <div
        v-for="(door, index) in calendar?.tracks"
        class="relative group w-56 h-56 rounded ring-1 ring-gray-200 shadow"
        :key="door.spotifyTrackID + index"
      >
        <ClientOnly>
          <section class="relative overflow-hidden rounded w-56 h-56">
            <!-- Overlay and door number -->
            <div
              class="z-10 absolute top-full left-full h-full -translate-x-full -translate-y-full transition-multiple duration-1000 flex rounded"
              :class="[
                isPlaceHolder(door) ? 'cursor-not-allowed' : 'cursor-pointer',
                isOpened(index) && !isPlaceHolder(door)
                  ? 'w-0 ring-0'
                  : 'w-full ring-1 ring-gray-200',
                theme === 'dark' ? 'bg-black' : 'bg-white',
              ]"
              @click="openDoor(index, door.spotifyTrackID)"
            >
              <span
                class="text-9xl pl-2 font-black"
                :class="theme === 'dark' ? 'text-white' : 'text-black'"
                >{{ index + 1 }}</span
              >
            </div>
            <!-- Cover -->
            <img
              v-if="isOpened(index)"
              :src="!isPlaceHolder(door) ? door.coverUrls[0] : '/cover.jpg'"
              :alt="`${door.trackName} cover art`"
              class="rounded object-cover w-56 h-56 saturate-0 group-hover:saturate-100 transition-all duration-1000 ease-in-out"
            />
            <!-- Play/Pause button & spotify link-->
            <div
              class="opacity-100 md:group-hover:opacity-100 transform-multiple duration-500 ease-in-out cursor-pointer fill-white"
              :class="[
                currentlyPlaying(door)
                  ? 'opacity-100'
                  : 'opacity-100 md:opacity-0',
              ]"
            >
              <img
                v-if="door.previewUrl"
                @click="playAudio(door.spotifyTrackID)"
                :src="currentlyPlaying(door) ? PauseIcon : PlayIcon"
                alt="play pause icon"
                class="bg-neutral-500 bg-opacity-80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 w-14 h-14 border-2"
              />
              <section>
                <NuxtLink
                  v-if="isOpened(index) && !isPlaceHolder(door)"
                  :to="`https://open.spotify.com/track/${door.spotifyTrackID}`"
                  class="absolute w-10 h-10 top-0 right-0 bg-gradient-to-tr from-transparent to-indigo-500 from-50% to-50% p-10"
                >
                  <img
                    :src="OpenIcon"
                    alt="open icon"
                    class="absolute w-8 h-8 top-0 right-0 m-2"
                  />
                </NuxtLink>
              </section>
            </div>
          </section>
          <!-- Artist & track name -->
          <section
            v-if="door.artistName && door.trackName"
            class="grid grid-flow-row rotate-6 gap-1 absolute bottom-4 -left-4 font-bold"
          >
            <BaseLabel
              :text="concatenateArtistNames(door.artistName)"
              :theme="theme"
            />
            <BaseLabel :text="door.trackName" :theme="theme" />
          </section>
          <!-- Song preview -->
          <audio
            v-if="door.previewUrl"
            hidden
            :src="door.previewUrl"
            :id="door.spotifyTrackID"
          />
        </ClientOnly>
      </div>
    </main>
  </div>
  <div v-else>{{ calendar }}</div>
</template>
