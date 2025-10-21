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
      available_slots: {
        Row: {
          id: string
          date: string
          time: string
          status: 'available' | 'booked'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          time: string
          status?: 'available' | 'booked'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          time?: string
          status?: 'available' | 'booked'
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          slot_id: string
          patient_name: string
          phone: string
          child_age: string
          notes: string
          status: 'confirmed' | 'cancelled' | 'completed'
          booked_at: string
          created_at: string
        }
        Insert: {
          id?: string
          slot_id: string
          patient_name: string
          phone: string
          child_age: string
          notes?: string
          status?: 'confirmed' | 'cancelled' | 'completed'
          booked_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          slot_id?: string
          patient_name?: string
          phone?: string
          child_age?: string
          notes?: string
          status?: 'confirmed' | 'cancelled' | 'completed'
          booked_at?: string
          created_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string
          cover_image: string
          author: string
          published: boolean
          likes_count: number
          liked_by: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt: string
          cover_image?: string
          author?: string
          published?: boolean
          likes_count?: number
          liked_by?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string
          cover_image?: string
          author?: string
          published?: boolean
          likes_count?: number
          liked_by?: Json
          created_at?: string
          updated_at?: string
        }
      }
      clinic_settings: {
        Row: {
          id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          updated_at?: string
        }
      }
    }
  }
}
