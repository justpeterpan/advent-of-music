import * as v from 'valibot'
import { Temporal } from '@js-temporal/polyfill'
import { serverSupabaseClient } from '#supabase/server'
import { Database } from '../../../../supabase'

const ReponseSchema = v.array(
  v.object({
    spotifyTrackID: v.string(),
    trackName: v.string(),
    artistName: v.array(v.string()),
    coverUrls: v.array(v.string()),
  })
)

export default defineEventHandler(async () => {
  const event = useEvent()

  const supabaseClient = await serverSupabaseClient<Database>(event)
  const { slug } = await readBody(event)
  const { data: calendarId, error: calendarIdError } = await supabaseClient
    .from('calendars')
    .select('calendarID')
    .eq('slug', slug)

  if (calendarIdError?.message || !calendarId?.length)
    return 'something went wrong'

  const { data: calendarTracks, error } = await supabaseClient
    .from('calendar-tracks')
    .select(`tracks(*)`)
    .eq('calendarID', calendarId[0].calendarID)
  if (error?.code || !calendarTracks?.length) return 'something went wrong'

  const dayOfMonth = Temporal.Now.plainDateISO().day
  const placeholdersNeeded =
    calendarTracks.length < dayOfMonth
      ? 24 - calendarTracks.length
      : 24 - dayOfMonth
  const placeholderItem = {
    spotifyTrackID: 'placeholder',
    trackName: '',
    artistName: [''],
    coverUrls: ['placeholder'],
  }
  const placeholderItems = Array(placeholdersNeeded).fill(placeholderItem)

  const slicedResponse = ReponseSchema._parse(
    calendarTracks.slice(0, dayOfMonth).map((track) => track.tracks)
  ).output

  return slicedResponse?.concat(placeholderItems)
})
