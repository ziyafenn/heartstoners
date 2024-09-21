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
          likes: number
          updated_at: string
          views: number
        }
        Insert: {
          author_id?: string
          copies?: number
          deck_id?: number
          game_version: string
          likes?: number
          updated_at?: string
          views?: number
        }
        Update: {
          author_id?: string
          copies?: number
          deck_id?: number
          game_version?: string
          likes?: number
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
          user_id: string
        }
        Insert: {
          author_id: string
          created_at?: string
          deck_id: number
          id?: number
          ip: string
          user_id?: string
        }
        Update: {
          author_id?: string
          created_at?: string
          deck_id?: number
          id?: number
          ip?: string
          user_id?: string
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
          is_expansion: boolean
          url: string
          version_name: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_expansion?: boolean
          url?: string
          version_name: string
        }
        Update: {
          created_at?: string
          id?: number
          is_expansion?: boolean
          url?: string
          version_name?: string
        }
        Relationships: []
      }
      meta_sub_archetypes: {
        Row: {
          as_of: string | null
          card_class: Database["public"]["Enums"]["card_class"]
          core_cards: number[]
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
          as_of?: string | null
          card_class: Database["public"]["Enums"]["card_class"]
          core_cards?: number[]
          created_at?: string
          deck_class_id: number
          id?: number
          name: string
          pct_of_class?: number | null
          pct_of_total?: number | null
          total_games?: number | null
          win_rate?: number | null
        }
        Update: {
          as_of?: string | null
          card_class?: Database["public"]["Enums"]["card_class"]
          core_cards?: number[]
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
          created_at: string
          display_name: string
          hsreplay_id: string
          id: string
          website: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          hsreplay_id?: string
          id: string
          website?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          hsreplay_id?: string
          id?: string
          website?: string
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
          deck_code: string
          deck_format: Database["public"]["Enums"]["deck_format"]
          description: string
          dust_cost_per_card: number[]
          dust_cost_sum: number
          game_mode: Database["public"]["Enums"]["game_mode"]
          game_version: string
          id: number
          name: string
          sideboard_cards: string[]
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
          deck_code?: string
          deck_format?: Database["public"]["Enums"]["deck_format"]
          description?: string
          dust_cost_per_card: number[]
          dust_cost_sum: number
          game_mode?: Database["public"]["Enums"]["game_mode"]
          game_version: string
          id?: number
          name: string
          sideboard_cards?: string[]
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
          deck_code?: string
          deck_format?: Database["public"]["Enums"]["deck_format"]
          description?: string
          dust_cost_per_card?: number[]
          dust_cost_sum?: number
          game_mode?: Database["public"]["Enums"]["game_mode"]
          game_version?: string
          id?: number
          name?: string
          sideboard_cards?: string[]
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
          p_deck_id?: number
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

