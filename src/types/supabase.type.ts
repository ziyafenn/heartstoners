export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      deck_interactions: {
        Row: {
          author_id: string
          copies: number
          deck_id: number
          game_version: string
          updated_at: string
          views: number
        }
        Insert: {
          author_id?: string
          copies?: number
          deck_id?: number
          game_version: string
          updated_at?: string
          views?: number
        }
        Update: {
          author_id?: string
          copies?: number
          deck_id?: number
          game_version?: string
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_deck_interactions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_deck_interactions_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: true
            referencedRelation: "user_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_deck_interactions_game_version_fkey"
            columns: ["game_version"]
            isOneToOne: false
            referencedRelation: "game_versions"
            referencedColumns: ["version_name"]
          },
        ]
      }
      deck_likes: {
        Row: {
          author_id: string
          created_at: string
          deck_id: number
          id: number
          ip: string
          user_id: string | null
        }
        Insert: {
          author_id: string
          created_at?: string
          deck_id: number
          id?: number
          ip: string
          user_id?: string | null
        }
        Update: {
          author_id?: string
          created_at?: string
          deck_id?: number
          id?: number
          ip?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_deck_likes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_deck_likes_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "user_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_deck_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_versions: {
        Row: {
          created_at: string
          id: number
          url: string | null
          version_name: string
        }
        Insert: {
          created_at?: string
          id?: number
          url?: string | null
          version_name: string
        }
        Update: {
          created_at?: string
          id?: number
          url?: string | null
          version_name?: string
        }
        Relationships: []
      }
      meta_sub_archetypes: {
        Row: {
          card_class: Database["public"]["Enums"]["card_class"]
          core_cards: number[] | null
          created_at: string
          deck_class_id: number
          id: number
          name: string
          pct_of_class: number | null
          pct_of_total: number | null
          total_games: number | null
          win_rate: number | null
        }
        Insert: {
          card_class: Database["public"]["Enums"]["card_class"]
          core_cards?: number[] | null
          created_at: string
          deck_class_id: number
          id?: number
          name: string
          pct_of_class?: number | null
          pct_of_total?: number | null
          total_games?: number | null
          win_rate?: number | null
        }
        Update: {
          card_class?: Database["public"]["Enums"]["card_class"]
          core_cards?: number[] | null
          created_at?: string
          deck_class_id?: number
          id?: number
          name?: string
          pct_of_class?: number | null
          pct_of_total?: number | null
          total_games?: number | null
          win_rate?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          hsreplay_id: string | null
          id: string
          updated_at: string | null
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          hsreplay_id?: string | null
          id: string
          updated_at?: string | null
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          hsreplay_id?: string | null
          id?: string
          updated_at?: string | null
          username?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_decks: {
        Row: {
          archetype: Database["public"]["Enums"]["archetypes"]
          card_ids: number[]
          created_at: string
          deck_class: Database["public"]["Enums"]["card_class"]
          deck_format: Database["public"]["Enums"]["deck_format"]
          description: string | null
          dust_cost_per_card: number[]
          dust_cost_sum: number
          game_mode: Database["public"]["Enums"]["game_mode"]
          game_version: string
          id: number
          name: string
          sideboard_cards: string[] | null
          sub_archetype: number | null
          updated_at: string
          user_id: string
          youtube_id: string | null
        }
        Insert: {
          archetype: Database["public"]["Enums"]["archetypes"]
          card_ids: number[]
          created_at?: string
          deck_class: Database["public"]["Enums"]["card_class"]
          deck_format: Database["public"]["Enums"]["deck_format"]
          description?: string | null
          dust_cost_per_card: number[]
          dust_cost_sum?: number
          game_mode?: Database["public"]["Enums"]["game_mode"]
          game_version: string
          id?: number
          name: string
          sideboard_cards?: string[] | null
          sub_archetype?: number | null
          updated_at?: string
          user_id?: string
          youtube_id?: string | null
        }
        Update: {
          archetype?: Database["public"]["Enums"]["archetypes"]
          card_ids?: number[]
          created_at?: string
          deck_class?: Database["public"]["Enums"]["card_class"]
          deck_format?: Database["public"]["Enums"]["deck_format"]
          description?: string | null
          dust_cost_per_card?: number[]
          dust_cost_sum?: number
          game_mode?: Database["public"]["Enums"]["game_mode"]
          game_version?: string
          id?: number
          name?: string
          sideboard_cards?: string[] | null
          sub_archetype?: number | null
          updated_at?: string
          user_id?: string
          youtube_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_user_decks_game_version_fkey"
            columns: ["game_version"]
            isOneToOne: false
            referencedRelation: "game_versions"
            referencedColumns: ["version_name"]
          },
          {
            foreignKeyName: "public_user_decks_sub_archetype_fkey"
            columns: ["sub_archetype"]
            isOneToOne: false
            referencedRelation: "meta_sub_archetypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_user_decks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_craftable_decks: {
        Args: {
          p_card_collection: Json
          p_available_dust: number
        }
        Returns: {
          user_deck_id: number
          missing_cards: number[]
          required_dust_cost: number
        }[]
      }
      increment_copies: {
        Args: {
          id: number
        }
        Returns: undefined
      }
      increment_views: {
        Args: {
          id: number
        }
        Returns: undefined
      }
    }
    Enums: {
      archetypes: "aggro" | "midrange" | "control"
      card_class:
        | "deathknight"
        | "paladin"
        | "rogue"
        | "mage"
        | "demonhunter"
        | "druid"
        | "priest"
        | "shaman"
        | "warlock"
        | "hunter"
        | "warrior"
        | "neutral"
      deck_format: "standard" | "wild" | "twist"
      game_mode: "constructed" | "battlegrounds" | "mercenaries"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

