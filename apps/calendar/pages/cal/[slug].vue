<template>
  <div v-if="typeof calendar !== 'string'">
    <h1
      class="lg:absolute lg:-left-3 lg:[writing-mode:vertical-rl] text-[#F2EDE4] pt-10 lg:pt-20 font-[600] px-10 lg:px-0 [font-family:'Zodiak-Variable',serif] lg:text-8xl text-6xl"
    >
      {{
        calendar?.calendarName ? calendar?.calendarName : 'Advent of music 🎄'
      }}
    </h1>
    <main
      class="grid grid-cols-2 md:grid-cols-4 w-full lg:w-[800px] mx-auto px-10 pt-10 lg:pt-20"
    >
      <div
        v-for="(door, index) in calendar?.tracks"
        :key="door.spotifyTrackID + index"
        class="group"
      >
        <ClientOnly>
          <div
            tabindex="0"
            class="relative w-full h-full aspect-square [perspective:850px] z-[666] hover:z-[999]"
            @click="openDoor(index, door.spotifyTrackID)"
            @keydown.space.prevent="openDoor(index, door.spotifyTrackID)"
          >
            <!-- front door -->
            <div
              class="w-full h-full rounded-2xl will-change-transform relative bg-cover [transform-style:preserve-3d] origin-[0] [perspective:850px] transition-all duration-1000 ease-out cursor-pointer"
              :class="isOpened(index) ? 'door__open' : ''"
              :style="{
                backgroundImage: `url(/assets/doors/${theme}/${index + 1}.png)`,
              }"
            />
            <!-- door content -->
            <div class="absolute top-0 left-0 -z-[1] rounded-3xl w-full h-full">
              <!-- cover image -->
              <img
                v-if="isOpened(index)"
                :src="!isPlaceHolder(door) ? door.coverUrls[0] : '/cover.jpg'"
                :alt="`${door.trackName} cover art`"
                class="rounded-3xl"
              />
              <!-- play/pause button & spotify link-->
              <div
                class="opacity-100 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transform-multiple duration-500 ease-in-out cursor-pointer fill-white"
                :class="[
                  currentlyPlaying(door)
                    ? 'opacity-100'
                    : 'opacity-100 md:opacity-0',
                ]"
              >
                <!-- play button -->
                <img
                  v-if="door.previewUrl"
                  tabindex="0"
                  @click="playAudio(door.spotifyTrackID)"
                  @keydown.space.prevent="playAudio(door.spotifyTrackID)"
                  :src="currentlyPlaying(door) ? PauseIcon : PlayIcon"
                  alt="play pause icon"
                  class="bg-neutral-500 bg-opacity-80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 w-14 h-14 border-2"
                  role="button"
                />
                <!-- link to spotify -->
                <section>
                  <NuxtLink
                    v-if="isOpened(index) && !isPlaceHolder(door)"
                    :to="`https://open.spotify.com/track/${door.spotifyTrackID}`"
                    class="absolute w-10 h-10 top-0 right-0 bg-gradient-to-tr from-transparent to-indigo-500 from-50% to-50% p-10 rounded-tr-2xl"
                  >
                    <img
                      :src="OpenIcon"
                      alt="open icon"
                      class="absolute w-8 h-8 top-0 right-0 m-2"
                    />
                  </NuxtLink>
                </section>
                <!-- song name & artist -->
                <section
                  v-if="isOpened(index) && door.artistName && door.trackName"
                  class="absolute bottom-0 rounded-bl-2xl cursor-default"
                >
                  <BaseLabel
                    tabindex="0"
                    :text="concatenateArtistNames(door.artistName)"
                  />
                  <BaseLabel
                    tabindex="0"
                    :text="door.trackName"
                    class="rounded-bl-2xl"
                  />
                </section>
              </div>
            </div>
          </div>
          <!-- Song preview -->
          <audio
            v-if="isOpened(index) && door.previewUrl"
            hidden
            :src="door.previewUrl"
            :id="door.spotifyTrackID"
          />
        </ClientOnly>
      </div>
    </main>
  </div>
  <div v-else>
    {{ throwError() }}
  </div>
</template>

<script setup lang="ts">
import PlayIcon from '~/assets/icons/play.svg'
import PauseIcon from '~/assets/icons/pause.svg'
import OpenIcon from '~/assets/icons/open.svg'
import { useStorage } from '@vueuse/core'
import '~/assets/fonts/zodiak.css'

const route = useRoute()

function throwError() {
  throw new Error('Calendar not found.')
}

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
  theme = 'flat'
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

<style>
.door__open {
  transform: rotateY(-84deg);
  perspective-origin: 0;
  backface-visibility: hidden;
  transition: all 0.5s ease-in;
}
</style>
