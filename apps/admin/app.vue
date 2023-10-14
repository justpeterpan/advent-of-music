<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
const { copy } = useClipboard()
const playlistId = ref('')
const error = ref(false)
const loading = ref(false)
const playlistItems = ref()

function extractSpotifyPlaylistId(input: string): string | null {
  const idPattern = /^[0-9A-Za-z]{22}$/
  if (idPattern.test(input)) return input

  const shortUrlPattern = /https:\/\/spotify\.link\/([0-9A-Za-z]){11}/
  if (shortUrlPattern.exec(input)) return input

  const fullUrlPattern =
    /https:\/\/open\.spotify\.com\/playlist\/([0-9A-Za-z]{22})/
  const match = fullUrlPattern.exec(input)
  if (match?.[1]) {
    return match[1]
  }

  return null
}

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
    },
  })
  playlistId.value = tracks.value?.id || ''
  error.value = status.value === 'error'
  loading.value = status.value !== 'success'
  playlistItems.value = tracks.value?.tracks
}

watch(playlistId, (newValue) => {
  if (playlistId.value === '') {
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
        <button
          type="submit"
          :disabled="!playlistId"
          v-show="playlistId && !loading"
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
          <span v-else>Something went wrong.</span>
        </div>
        <div v-else-if="loading">working</div>
        <div v-else-if="!loading && playlistItems?.length">
          <div class="w-80 p-2 mb-1 border border-neutral-900 truncate">
            <NuxtLink
              :to="`https://advent-of-music-calendar.vercel.app/cals/${playlistId}`"
              >{{
                `https://advent-of-music-calendar.vercel.app/cals/${playlistId}`
              }}</NuxtLink
            >
          </div>
          <div
            @click="
              copy(
                `https://advent-of-music-calendar.vercel.app/cals/${playlistId}`
              )
            "
            class="w-80 p-2 border border-neutral-900 truncate"
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
