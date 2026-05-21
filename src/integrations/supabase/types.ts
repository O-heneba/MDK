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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      albums: {
        Row: {
          amazon_music_url: string | null
          apple_music_url: string | null
          audiomack_url: string | null
          boomplay_url: string | null
          cover_url: string | null
          created_at: string
          deezer_url: string | null
          id: string
          itunes_url: string | null
          release_year: number | null
          soundcloud_url: string | null
          spotify_url: string | null
          tidal_url: string | null
          title: string
          youtube_music_url: string | null
          youtube_url: string | null
        }
        Insert: {
          amazon_music_url?: string | null
          apple_music_url?: string | null
          audiomack_url?: string | null
          boomplay_url?: string | null
          cover_url?: string | null
          created_at?: string
          deezer_url?: string | null
          id?: string
          itunes_url?: string | null
          release_year?: number | null
          soundcloud_url?: string | null
          spotify_url?: string | null
          tidal_url?: string | null
          title: string
          youtube_music_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          amazon_music_url?: string | null
          apple_music_url?: string | null
          audiomack_url?: string | null
          boomplay_url?: string | null
          cover_url?: string | null
          created_at?: string
          deezer_url?: string | null
          id?: string
          itunes_url?: string | null
          release_year?: number | null
          soundcloud_url?: string | null
          spotify_url?: string | null
          tidal_url?: string | null
          title?: string
          youtube_music_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          body: string
          created_at: string
          id: string
          pinned: boolean | null
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          pinned?: boolean | null
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          pinned?: boolean | null
          title?: string
        }
        Relationships: []
      }
      bars: {
        Row: {
          approved: boolean | null
          created_at: string
          excerpt: string
          explanation: string
          id: string
          song: string
          tags: string[] | null
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          excerpt: string
          explanation: string
          id?: string
          song: string
          tags?: string[] | null
          user_id: string
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          excerpt?: string
          explanation?: string
          id?: string
          song?: string
          tags?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      channel_config: {
        Row: {
          channel_id: string
          channel_url: string
          created_at: string
          display_count: number
          id: string
          last_fetched_at: string | null
          last_rotated_at: string | null
          rotation_offset: number
          updated_at: string
        }
        Insert: {
          channel_id: string
          channel_url: string
          created_at?: string
          display_count?: number
          id?: string
          last_fetched_at?: string | null
          last_rotated_at?: string | null
          rotation_offset?: number
          updated_at?: string
        }
        Update: {
          channel_id?: string
          channel_url?: string
          created_at?: string
          display_count?: number
          id?: string
          last_fetched_at?: string | null
          last_rotated_at?: string | null
          rotation_offset?: number
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          id: string
          image_url: string | null
          is_upcoming: boolean | null
          location: string | null
          ticket_url: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          is_upcoming?: boolean | null
          location?: string | null
          ticket_url?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          is_upcoming?: boolean | null
          location?: string | null
          ticket_url?: string | null
          title?: string
        }
        Relationships: []
      }
      fan_content: {
        Row: {
          approved: boolean | null
          caption: string
          category: string
          created_at: string
          hashtags: string
          id: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          approved?: boolean | null
          caption: string
          category?: string
          created_at?: string
          hashtags: string
          id?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          approved?: boolean | null
          caption?: string
          category?: string
          created_at?: string
          hashtags?: string
          id?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: []
      }
      fan_rewards: {
        Row: {
          created_at: string
          id: string
          message: string
          reward_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          reward_type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          reward_type?: string
          user_id?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          approved: boolean | null
          caption: string | null
          created_at: string
          id: string
          image_url: string
          uploaded_by: string | null
        }
        Insert: {
          approved?: boolean | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          uploaded_by?: string | null
        }
        Update: {
          approved?: boolean | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      music_videos: {
        Row: {
          active: boolean | null
          auto_fetched: boolean | null
          created_at: string
          display_order: number | null
          id: string
          title: string
          video_id: string
          year: string | null
        }
        Insert: {
          active?: boolean | null
          auto_fetched?: boolean | null
          created_at?: string
          display_order?: number | null
          id?: string
          title: string
          video_id: string
          year?: string | null
        }
        Update: {
          active?: boolean | null
          auto_fetched?: boolean | null
          created_at?: string
          display_order?: number | null
          id?: string
          title?: string
          video_id?: string
          year?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          instagram: string | null
          location: string | null
          tiktok: string | null
          twitter: string | null
          updated_at: string
          user_id: string
          username: string | null
          youtube: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          instagram?: string | null
          location?: string | null
          tiktok?: string | null
          twitter?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
          youtube?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          instagram?: string | null
          location?: string | null
          tiktok?: string | null
          twitter?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      streams: {
        Row: {
          created_at: string
          id: string
          platform: string
          stream_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          stream_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          stream_date?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
