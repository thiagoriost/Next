export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          area_sq_m: number
          badge: string | null
          badge_type: Database['public']['Enums']['property_badge_type'] | null
          baths: number
          beds: number
          category: Database['public']['Enums']['property_category']
          created_at: string | null
          id: string
          image_alt: string | null
          image_url: string | null
          images: string[]
          is_featured: boolean | null
          location: string
          price: number
          price_period: Database['public']['Enums']['price_period'] | null
          title: string
          type: Database['public']['Enums']['property_type']
          slug: string
          description: string | null
          description_es: string | null
          lat: number | null
          lng: number | null
          parking_spots: number | null
          agent_name: string | null
          agent_image_url: string | null
          amenities: string[] | null
          amenities_es: string[] | null
        }
        Insert: {
          area_sq_m: number
          badge?: string | null
          badge_type?: Database['public']['Enums']['property_badge_type'] | null
          baths: number
          beds: number
          category: Database['public']['Enums']['property_category']
          created_at?: string | null
          id: string
          image_alt?: string | null
          image_url?: string | null
          images?: string[]
          is_featured?: boolean | null
          location: string
          price: number
          price_period?: Database['public']['Enums']['price_period'] | null
          title: string
          type: Database['public']['Enums']['property_type']
          slug: string
          description?: string | null
          description_es?: string | null
          lat?: number | null
          lng?: number | null
          parking_spots?: number | null
          agent_name?: string | null
          agent_image_url?: string | null
          amenities?: string[] | null
          amenities_es?: string[] | null
        }
        Update: {
          area_sq_m?: number
          badge?: string | null
          badge_type?: Database['public']['Enums']['property_badge_type'] | null
          baths?: number
          beds?: number
          category?: Database['public']['Enums']['property_category']
          created_at?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          images?: string[]
          is_featured?: boolean | null
          location?: string
          price?: number
          price_period?: Database['public']['Enums']['price_period'] | null
          title?: string
          type?: Database['public']['Enums']['property_type']
          slug?: string
          description?: string | null
          description_es?: string | null
          lat?: number | null
          lng?: number | null
          parking_spots?: number | null
          agent_name?: string | null
          agent_image_url?: string | null
          amenities?: string[] | null
          amenities_es?: string[] | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          user_id: string
          email: string
          full_name: string
          role: Database['public']['Enums']['app_role']
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          email?: string
          full_name?: string
          role?: Database['public']['Enums']['app_role']
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          email?: string
          full_name?: string
          role?: Database['public']['Enums']['app_role']
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: 'admin' | 'editor' | 'viewer'
      price_period: 'mo' | 'year'
      property_badge_type: 'exclusive' | 'new' | 'sale' | 'rent'
      property_category: 'House' | 'Apartment' | 'Villa' | 'Penthouse'
      property_type: 'sale' | 'rent'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
