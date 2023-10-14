export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      "calendar-tracks": {
        Row: {
          calendarID: number
          spotifyTrackID: string
        }
        Insert: {
          calendarID: number
          spotifyTrackID: string
        }
        Update: {
          calendarID?: number
          spotifyTrackID?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar-tracks_calendarID_fkey"
            columns: ["calendarID"]
            referencedRelation: "calendars"
            referencedColumns: ["calendarID"]
          }
        ]
      }
      calendars: {
        Row: {
          calendarID: number
          name: string | null
          slug: string | null
        }
        Insert: {
          calendarID?: number
          name?: string | null
          slug?: string | null
        }
        Update: {
          calendarID?: number
          name?: string | null
          slug?: string | null
        }
        Relationships: []
      }
      tracks: {
        Row: {
          artistName: string[] | null
          coverUrls: string[] | null
          previewUrl: string | null
          spotifyTrackID: string
          trackName: string | null
        }
        Insert: {
          artistName?: string[] | null
          coverUrls?: string[] | null
          previewUrl?: string | null
          spotifyTrackID: string
          trackName?: string | null
        }
        Update: {
          artistName?: string[] | null
          coverUrls?: string[] | null
          previewUrl?: string | null
          spotifyTrackID?: string
          trackName?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracks_spotifyTrackID_fkey"
            columns: ["spotifyTrackID"]
            referencedRelation: "calendar-tracks"
            referencedColumns: ["spotifyTrackID"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
