// Database types will be generated from Supabase schema
// For now, we'll add basic types manually

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
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string
          whatsapp_number: string | null
          avatar_url: string | null
          default_currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          phone: string
          whatsapp_number?: string | null
          avatar_url?: string | null
          default_currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string
          whatsapp_number?: string | null
          avatar_url?: string | null
          default_currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      // More tables will be added as we build them
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
  }
}
