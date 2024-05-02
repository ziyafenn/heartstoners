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
      user_decks: {
        Row: {
          archetype: Database["public"]["Enums"]["archetypes"]
          card_ids: number[]
          created_at: string
          deck_class: Database["public"]["Enums"]["card_class"]
          deck_code: string
          deck_format: Database["public"]["Enums"]["deck_format"]
          description: string | null
          dust_cost: number
          game_mode: Database["public"]["Enums"]["game_mode"]
          game_version: string
          id: string
          main_card_ids: number[]
          name: string
          sub_archetypes: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          archetype: Database["public"]["Enums"]["archetypes"]
          card_ids: number[]
          created_at?: string
          deck_class: Database["public"]["Enums"]["card_class"]
          deck_code: string
          deck_format: Database["public"]["Enums"]["deck_format"]
          description?: string | null
          dust_cost: number
          game_mode: Database["public"]["Enums"]["game_mode"]
          game_version: string
          id?: string
          main_card_ids: number[]
          name: string
          sub_archetypes?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          archetype?: Database["public"]["Enums"]["archetypes"]
          card_ids?: number[]
          created_at?: string
          deck_class?: Database["public"]["Enums"]["card_class"]
          deck_code?: string
          deck_format?: Database["public"]["Enums"]["deck_format"]
          description?: string | null
          dust_cost?: number
          game_mode?: Database["public"]["Enums"]["game_mode"]
          game_version?: string
          id?: string
          main_card_ids?: number[]
          name?: string
          sub_archetypes?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_decks_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
