import * as v from 'valibot'
import { slugifyString } from '../../utils/utils'
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
          album: v.object({
            images: v.array(
              v.object({
                url: v.string(),
                height: v.number(),
                width: v.number(),
              })
            ),
          }),
          preview_url: v.nullable(v.string()),
        }),
      })
    ),
  }),
})

async function extractSpotifyPlaylistId(input: string): Promise<string | null> {
  const idPattern = /^[0-9A-Za-z]{22}$/
  if (idPattern.test(input)) return input

  const fullUrlPattern =
    /https:\/\/open\.spotify\.com\/playlist\/([0-9A-Za-z]{22})/
  const match = fullUrlPattern.exec(input)
  if (match?.[1]) {
    return match[1]
  }

  const shortUrlPattern = /https:\/\/spotify\.link\/([0-9A-Za-z]){11}/
  if (shortUrlPattern.exec(input)) {
    const playlistUrl: string = await $fetch(input)
    const match = fullUrlPattern.exec(playlistUrl)
    if (match?.[1]) return match[1]
  }

  return null
}

export default defineEventHandler(async (event) => {
  const supabaseClient = await serverSupabaseClient<Database>(event)
  const body: { spotifyString: string; playlistName: string } = await readBody(
    event
  )
  const client_id = runtimeConfig.spotify.clientId
  const client_secret = runtimeConfig.spotify.clientSecret
  const token_url = runtimeConfig.spotify.tokenUrl
  const payload = Buffer.from(client_id + ':' + client_secret).toString(
    'base64'
  )
  let playlistId = await extractSpotifyPlaylistId(body.spotifyString)

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
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${authResponse.access_token}`,
      },
      method: 'GET',
      query: {
        market: 'DE',
        fields:
          'tracks.items(track(id, artists, name, album.images, preview_url))',
      },
    }
  )

  const response = {
    tracks: ReponseSchema._parse(playlistResponse).output?.tracks.items,
    id: playlistId,
    calendarName: body.playlistName,
    slug: `${slugifyString(body.playlistName)}-${playlistId?.slice(0, 4)}`,
  }
  const calendarsResponse = await supabaseClient
    .from('calendars')
    .upsert({ name: response.calendarName, slug: response.slug })
    .select()

  if (calendarsResponse.status === 201 && response.tracks?.length) {
    const transformedCalendarTrackData = response.tracks
      ?.slice(0, 24)
      .map((track) => ({
        spotifyTrackID: track.track.id,
        calendarID: calendarsResponse.data?.[0].calendarID || 0,
      }))
    const transformedTrackData = response.tracks?.slice(0, 24).map((track) => ({
      spotifyTrackID: track.track.id,
      trackName: track.track.name,
      artistName: track.track.artists.map((artist) => artist.name),
      coverUrls: track.track.album.images.map((image) => image.url),
      previewUrl: track.track.preview_url,
    }))
    if (transformedCalendarTrackData && transformedTrackData) {
      await supabaseClient
        .from('calendar-tracks')
        .upsert(transformedCalendarTrackData)
      await supabaseClient.from('tracks').upsert(transformedTrackData)
    }
  }

  return response
})
