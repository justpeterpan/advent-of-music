import * as v from 'valibot'
import { serverSupabaseClient } from '#supabase/server'
import { Database } from '../../../../supabase'

const runtimeConfig = useRuntimeConfig()
const ReponseSchema = v.object({
  tracks: v.object({
    items: v.array(
      v.object({
        track: v.object({
          id: v.string(),
          artists: v.array(v.object({ name: v.string(), id: v.string() })),
          name: v.string(),
        }),
      })
    ),
  }),
})

export default defineEventHandler(async (event) => {
  const supabaseClient = await serverSupabaseClient<Database>(event)
  const body: { spotifyPlaylistId: string } = await readBody(event)
  const client_id = runtimeConfig.spotify.clientId
  const client_secret = runtimeConfig.spotify.clientSecret
  const token_url = runtimeConfig.spotify.tokenUrl
  const payload = Buffer.from(client_id + ':' + client_secret).toString(
    'base64'
  )
  const authResponse: {
    access_token: string
    token_type: string
    expires_in: number
  } = await $fetch(token_url, {
    headers: {
      Authorization: `Basic ${payload}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  })

  const playlistResponse = await $fetch(
    `https://api.spotify.com/v1/playlists/${body.spotifyPlaylistId}`,
    {
      headers: {
        Authorization: `Bearer ${authResponse.access_token}`,
      },
      method: 'GET',
      query: {
        market: 'DE',
        fields: 'tracks.items(track(id, artists, name))',
      },
    }
  )

  const tracks = ReponseSchema._parse(playlistResponse).output?.tracks.items

  const calendarsResponse = await supabaseClient
    .from('calendars')
    .upsert({ name: body.spotifyPlaylistId, slug: body.spotifyPlaylistId })
    .select()

  if (calendarsResponse.status === 201) {
    const transformedData = tracks?.map((track) => ({
      spotifyTrackID: track.track.id,
      calendarID: calendarsResponse.data?.[0].calendarID || 0,
      trackName: track.track.name,
      artistName: track.track.artists.map((artist) => artist.name),
    }))
    if (transformedData)
      await supabaseClient.from('tracks').insert(transformedData)
  }

  console.log('calendarsResponse', calendarsResponse)

  return tracks
})
