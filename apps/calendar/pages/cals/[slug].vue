<script setup lang="ts">
import { Database } from '../../../../supabase'
const route = useRoute()
const supabaseClient = useSupabaseClient<Database>()
const { data: calendarIDs } = await supabaseClient
  .from('calendars')
  .select('calendarID')
  .eq('slug', route.params.slug)
const calendarID = calendarIDs?.[0].calendarID || 0
const { data: tracks } = await supabaseClient
  .from('tracks')
  .select('*')
  .eq('calendarID', calendarID)
console.log(tracks)
</script>

<template>
  <div>
    <div v-if="calendarIDs?.length">{{ calendarIDs }}</div>
    <div v-if="tracks?.length">
      <ul>
        <li v-for="track of tracks" :key="track.spotifyTrackID">
          {{ track.artistName }} - {{ track.trackName }}
        </li>
      </ul>
    </div>
  </div>
</template>
