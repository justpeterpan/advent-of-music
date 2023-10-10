<script setup lang="ts">
const playlistId = ref('')
const error = ref(false)
const loading = ref(false)
const playlistItems = ref()

async function submitPlaylistId() {
  const { data: tracks, status } = await useFetch('/playlist', {
    method: 'post',
    body: {
      spotifyPlaylistId: playlistId.value,
    },
  })
  error.value = status.value === 'error'
  loading.value = status.value !== 'success'
  playlistItems.value = tracks.value
}
</script>

<template>
  <div class="min-h-[100svh] flex flex-col bg-black text-white">
    <div class="flex flex-grow flex-col mx-auto justify-center p-2">
      <form
        @submit.prevent="submitPlaylistId"
        method="post"
        class="grid grid-cols-1 mb-1"
      >
        <label for="playlist-id" class="text-xs font-extralight"
          >Playlist Id</label
        >
        <input
          type="text"
          id="playlist-id"
          v-model="playlistId"
          required
          class="rounded-md p-2 my-2 border-2 border-black shadow-black ring-2 ring-white text-black"
          :class="{ 'ring-red-500': error }"
        />
        <button
          type="submit"
          :disabled="!playlistId"
          class="text-left border-2 rounded-md p-2 hover:bg-white hover:text-black hover:transition-colors hover:duration-500"
          :class="{
            'pointer-events-none text-gray-800 border-gray-800': !playlistId,
          }"
        >
          Submit
        </button>
      </form>
      <div>
        <div v-if="error" class="text-red-500">something went wrong</div>
        <div v-else-if="loading">working</div>
        <div v-else-if="!loading && playlistItems?.length">
          finished
          <ul>
            <li v-for="item of playlistItems" :key="item.track.id">
              {{ item.track.id }} ---- {{ item.track.artists }} ----
              {{ item.track.name }}
            </li>
          </ul>
          <NuxtLink :to="`http://localhost:3000/cals/${playlistId}`"
            >Calendar</NuxtLink
          >
        </div>
      </div>
    </div>
  </div>
</template>
