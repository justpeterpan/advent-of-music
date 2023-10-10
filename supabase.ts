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
          calendarID: number
          spotifyTrackID: string
          trackName: string | null
        }
        Insert: {
          artistName?: string[] | null
          calendarID: number
          spotifyTrackID: string
          trackName?: string | null
        }
        Update: {
          artistName?: string[] | null
          calendarID?: number
          spotifyTrackID?: string
          trackName?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracks_calendarID_fkey"
            columns: ["calendarID"]
            referencedRelation: "calendars"
            referencedColumns: ["calendarID"]
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
