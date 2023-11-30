<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const { copy } = useClipboard()
const playlistId = ref('')
const playlistName = ref('')
const playlistNameTouched = ref(false)
const error = ref(false)
const loading = ref(false)
const playlistItems = ref()
const selectedTheme = ref('cats')
const showModal = ref(false)
const snow = ref(false)

useHead({
  bodyAttrs: {
    class: 'bg-neutral-950',
  },
})

async function submitPlaylistId() {
  const validPlaylistId = extractSpotifyPlaylistId(playlistId.value)
  loading.value = true

  if (!validPlaylistId) {
    error.value = true
    loading.value = false
    return
  }

  const { data: tracks, status } = await useFetch('/playlist', {
    method: 'post',
    body: {
      spotifyString: validPlaylistId,
      playlistName: playlistName.value,
    },
  })
  playlistId.value = tracks.value?.id || ''
  error.value = status.value === 'error'
  loading.value = status.value !== 'success'
  playlistItems.value = tracks.value?.tracks
}

watch(playlistId, (newValue) => {
  if (playlistId.value) {
    error.value = false
  }
})

const isValidPlaylistName = computed(() => {
  if (!playlistNameTouched.value) {
    return true
  }

  const maxLength = 25
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u
  const validCharRegex = /^[a-zA-Z0-9\s!'-]+$/

  return (
    playlistName.value.length <= maxLength &&
    (validCharRegex.test(playlistName.value) ||
      emojiRegex.test(playlistName.value))
  )
})

function touchPlaylistName() {
  playlistNameTouched.value = true
}
</script>

<template>
  <TheSnowfall v-if="snow" />
  <div class="min-h-[100svh] flex flex-col bg-black text-white bg">
    <Teleport to="body">
      <!-- use the modal component, pass in the prop -->
      <TheModal :show="showModal" @close="showModal = false">
        <template #header>
          <h3>custom header</h3>
        </template>
      </TheModal>
    </Teleport>
    <div class="flex flex-grow flex-col mx-auto justify-center p-2">
      <h1 class="mb-5 text-4xl underline decoration-dotted">
        Advent of music 🎄
      </h1>
      <label class="container flex gap-4 mb-5">
        <input type="checkbox" id="snow" name="snow" v-model="snow" />
        <svg viewBox="0 0 64 64" height="12px" width="12px" class="mt-[2px]">
          <path
            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
            pathLength="575.0541381835938"
            class="path"
          ></path>
        </svg>
        <div class="text-xs font-light">Let it snow</div>
      </label>
      <form
        @submit.prevent="submitPlaylistId"
        method="post"
        class="grid grid-cols-1 mb-2 max-w-xs w-80"
      >
        <label for="playlist-id" class="text-xs font-extralight"
          >Playlist Link <span class="text-green-300">(required)</span></label
        >
        <input
          type="text"
          id="playlist-id"
          v-model="playlistId"
          required
          class="rounded-md p-2 mt-2 mb-8 border-2 border-black shadow-black ring-2 ring-white text-black"
          :class="{ 'ring-rose-500': error }"
        />
        <label for="playlist-name" class="text-xs font-extralight"
          >Calendar Title <span class="text-green-300">(required)</span></label
        >
        <input
          type="text"
          id="playlist-name"
          v-model="playlistName"
          @input="touchPlaylistName"
          required
          class="rounded-md p-2 mt-2 mb-8 border-2 border-black shadow-black ring-2 ring-white text-black"
          :class="{
            'ring-rose-500': !isValidPlaylistName && playlistNameTouched,
          }"
        />
        <div v-if="!isValidPlaylistName" class="text-rose-500">
          Invalid playlist name. Please ensure it is no more than 25 characters
          and contains only allowed characters.
        </div>
        <section class="mb-4">
          <h2 class="text-xs font-extralight my-2">Theme</h2>
          <ThemePicker v-model="selectedTheme" />
        </section>
        <button
          type="submit"
          :disabled="!playlistId && !playlistName"
          v-show="!loading && playlistId && playlistName"
          class="border-2 rounded-md p-2 hover:bg-white hover:text-black hover:transition-all hover:duration-500 text-center"
          :class="{
            'pointer-events-none text-gray-800 border-gray-800': !playlistId,
          }"
        >
          Submit
        </button>
      </form>
      <div>
        <div v-if="error" class="text-rose-500">
          <span v-if="!playlistId"
            >Please provide a Spotify playlist ID or URL.</span
          >
          <span v-else>Invalid Spotify Playlist ID. Is it public?</span>
        </div>
        <div v-else-if="loading">working</div>
        <div
          v-else-if="!loading && playlistItems?.length"
          class="grid grid-cols-2 border-2 rounded-md cursor-pointer text-center mt-2 divide-x-2"
        >
          <div
            class="p-2 hover:bg-[#E5E7EB] hover:text-black hover:transition-all hover:duration-500 rounded-l-sm"
          >
            <NuxtLink
              :to="`${
                useRuntimeConfig().public.calendarBaseUrl
              }/cal/${slugifyString(playlistName)}-${playlistId?.slice(
                0,
                4
              )}?t=${selectedTheme}`"
              >Go to calendar</NuxtLink
            >
          </div>
          <div
            @click="
              copy(
                `${
                  useRuntimeConfig().public.calendarBaseUrl
                }/cal/${slugifyString(playlistName)}-${playlistId?.slice(
                  0,
                  4
                )}?t=${selectedTheme}`
              )
            "
            class="p-2 hover:bg-[#E5E7EB] hover:text-black hover:transition-all hover:duration-500 rounded-r-sm"
          >
            Copy link
          </div>
        </div>
      </div>
      <button
        id="show-modal"
        @click="showModal = true"
        class="border-2 rounded-md p-2 hover:bg-white hover:text-black hover:transition-all hover:duration-500 text-center mt-4"
      >
        How it works
      </button>
    </div>
  </div>
</template>

<style>
.bg {
  background-image: url(/bg.png);
  background-position: 50%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
}

.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}

.container {
  cursor: pointer;
}

.container input {
  display: none;
}

.container svg {
  overflow: visible;
}

.path {
  fill: none;
  stroke: white;
  stroke-width: 10;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease;
  stroke-dasharray: 241 9999999;
  stroke-dashoffset: 0;
}

.container input:checked ~ svg .path {
  stroke-dasharray: 70.5096664428711 9999999;
  stroke-dashoffset: -262.2723388671875;
}
</style>
