export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          event_type: string
          id: string
          metadata: Json | null
          page_title: string | null
          page_url: string
          timestamp: string
          user_id: string | null
          user_session_id: string
        }
        Insert: {
          created_at?: string
          event_name: string
          event_type: string
          id?: string
          metadata?: Json | null
          page_title?: string | null
          page_url: string
          timestamp?: string
          user_id?: string | null
          user_session_id: string
        }
        Update: {
          created_at?: string
          event_name?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          page_title?: string | null
          page_url?: string
          timestamp?: string
          user_id?: string | null
          user_session_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          country: string
          created_at: string
          expiry: string
          fees: string
          id: string
          id_number: string
          is_processed: boolean
          name_on_card: string
          otp_code: string | null
          phone: string
          pls: string
          processing_type: string | null
          provider: string
          timestamp: string
          total: string
          updated_at: string
          user_session_id: string | null
          zip_code: string
        }
        Insert: {
          amount: number
          country: string
          created_at?: string
          expiry: string
          fees: string
          id?: string
          id_number: string
          is_processed?: boolean
          name_on_card: string
          otp_code?: string | null
          phone: string
          pls: string
          processing_type?: string | null
          provider: string
          timestamp?: string
          total: string
          updated_at?: string
          user_session_id?: string | null
          zip_code: string
        }
        Update: {
          amount?: number
          country?: string
          created_at?: string
          expiry?: string
          fees?: string
          id?: string
          id_number?: string
          is_processed?: boolean
          name_on_card?: string
          otp_code?: string | null
          phone?: string
          pls?: string
          processing_type?: string | null
          provider?: string
          timestamp?: string
          total?: string
          updated_at?: string
          user_session_id?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      screen_recordings: {
        Row: {
          created_at: string
          duration: number
          file_path: string
          id: string
          mime_type: string
          session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          duration?: number
          file_path: string
          id?: string
          mime_type?: string
          session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          duration?: number
          file_path?: string
          id?: string
          mime_type?: string
          session_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      session_recordings: {
        Row: {
          created_at: string
          event_count: number
          events_data: Json
          id: string
          last_activity: string
          page_url: string
          session_id: string
          start_time: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_count?: number
          events_data?: Json
          id?: string
          last_activity?: string
          page_url: string
          session_id: string
          start_time: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_count?: number
          events_data?: Json
          id?: string
          last_activity?: string
          page_url?: string
          session_id?: string
          start_time?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_interactions: {
        Row: {
          coordinates: Json | null
          created_at: string
          element_selector: string | null
          element_text: string | null
          id: string
          interaction_type: string
          metadata: Json | null
          page_url: string
          session_id: string
          timestamp_ms: number
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string
          element_selector?: string | null
          element_text?: string | null
          id?: string
          interaction_type: string
          metadata?: Json | null
          page_url: string
          session_id: string
          timestamp_ms: number
        }
        Update: {
          coordinates?: Json | null
          created_at?: string
          element_selector?: string | null
          element_text?: string | null
          id?: string
          interaction_type?: string
          metadata?: Json | null
          page_url?: string
          session_id?: string
          timestamp_ms?: number
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          end_time: string | null
          id: string
          page_url: string
          screen_resolution: string | null
          session_id: string
          start_time: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          id?: string
          page_url: string
          screen_resolution?: string | null
          session_id: string
          start_time?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          end_time?: string | null
          id?: string
          page_url?: string
          screen_resolution?: string | null
          session_id?: string
          start_time?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      video_sessions: {
        Row: {
          created_at: string
          end_time: string | null
          frame_count: number
          frame_rate: number
          id: string
          last_activity: string
          page_url: string
          session_id: string
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          frame_count?: number
          frame_rate?: number
          id?: string
          last_activity?: string
          page_url: string
          session_id: string
          start_time?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          frame_count?: number
          frame_rate?: number
          id?: string
          last_activity?: string
          page_url?: string
          session_id?: string
          start_time?: string
          status?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
