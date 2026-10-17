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
          image_alt: string
          image_url: string
          is_featured: boolean | null
          location: string
          price: number
          price_period: Database['public']['Enums']['price_period'] | null
          title: string
          type: Database['public']['Enums']['property_type']
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
          image_alt: string
          image_url: string
          is_featured?: boolean | null
          location: string
          price: number
          price_period?: Database['public']['Enums']['price_period'] | null
          title: string
          type: Database['public']['Enums']['property_type']
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
          image_alt?: string
          image_url?: string
          is_featured?: boolean | null
          location?: string
          price?: number
          price_period?: Database['public']['Enums']['price_period'] | null
          title?: string
          type?: Database['public']['Enums']['property_type']
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
