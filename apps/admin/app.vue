<script setup lang="ts">
const playlistId = ref('')
const loading = ref(false)
const playlistItems = ref()

async function submitPlaylistId() {
  const {
    data: tracks,
    status,
    error,
  } = await useFetch('/auth', {
    method: 'post',
    body: {
      spotifyPlaylistId: playlistId.value,
    },
  })
  loading.value = status.value === 'success' ? false : true
  playlistItems.value = tracks.value
}
</script>

<template>
  <div>
    <form @submit.prevent="submitPlaylistId" method="post">
      <label for="playlist-id">Playlist Id</label>
      <input type="text" id="playlist-id" v-model="playlistId" />
      <button type="submit">Submit</button>
    </form>
    <div v-if="loading">working</div>
    <div v-else-if="!loading && playlistItems?.length">
      finished
      <ul>
        <li v-for="item of playlistItems" :key="item.track.id">
          {{ item.track.id }} ---- {{ item.track.artists }} ----
          {{ item.track.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
