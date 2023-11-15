import slugify from '@sindresorhus/slugify'

export function extractSpotifyPlaylistId(
  input: string | undefined
): string | null {
  const idPattern = /^[0-9A-Za-z]{22}$/
  if (!input) return null
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

export function slugifyString(input: string): string {
  return slugify(input)
}
