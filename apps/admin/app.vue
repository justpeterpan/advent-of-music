<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const { copy } = useClipboard()
const playlistId = ref('')
const playlistName = ref('')
const error = ref(false)
const loading = ref(false)
const playlistItems = ref()
const selectedTheme = ref('dark')

async function submitPlaylistId() {
  const validPlaylistId = extractSpotifyPlaylistId(playlistId.value)

  if (!validPlaylistId) {
    error.value = true
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
</script>

<template>
  <div class="min-h-[100svh] flex flex-col bg-black text-white bg">
    <div class="flex flex-grow flex-col mx-auto justify-center p-2">
      <form
        @submit.prevent="submitPlaylistId"
        method="post"
        class="grid grid-cols-1 mb-1 max-w-xs w-80"
      >
        <label for="playlist-id" class="text-xs font-extralight"
          >Playlist</label
        >
        <input
          type="text"
          id="playlist-id"
          v-model="playlistId"
          required
          class="rounded-md p-2 my-2 border-2 border-black shadow-black ring-2 ring-white text-black"
          :class="{ 'ring-rose-500': error }"
        />
        <label for="playlist-name" class="text-xs font-extralight">Name</label>
        <input
          type="text"
          id="playlist-name"
          v-model="playlistName"
          required
          class="rounded-md p-2 my-2 border-2 border-black shadow-black ring-2 ring-white text-black"
          :class="{ 'ring-rose-500': error }"
        />
        <section class="mb-4">
          <h2 class="text-xs font-extralight my-2">Theme</h2>
          <ThemePicker v-model="selectedTheme" />
        </section>
        <button
          type="submit"
          :disabled="!playlistId && !playlistName"
          v-show="!loading && playlistId && playlistName"
          class="text-left border-2 rounded-md p-2 hover:bg-white hover:text-black hover:transition-all hover:duration-500"
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
        <div v-else-if="!loading && playlistItems?.length">
          <div class="w-80 p-2 mb-1 border border-neutral-900 truncate">
            <NuxtLink
              :to="`https://advent-of-music-calendar.vercel.app/cals/${slugifyString(
                playlistName
              )}-${playlistId?.slice(0, 4)}?t=${selectedTheme}`"
              >{{
                `https://advent-of-music-calendar.vercel.app/cals/${slugifyString(
                  playlistName
                )}-${playlistId?.slice(0, 4)}?t=${selectedTheme}`
              }}</NuxtLink
            >
          </div>
          <div
            @click="
              copy(
                `https://advent-of-music-calendar.vercel.app/cals/$${slugifyString(
                  playlistName
                )}-${playlistId?.slice(0, 4)}?t=${selectedTheme}`
              )
            "
            class="w-80 p-2 border border-neutral-900 truncate cursor-pointer"
          >
            Click to copy url
          </div>
        </div>
      </div>
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
</style>
