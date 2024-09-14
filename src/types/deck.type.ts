import { getDecks } from "@/service/supabase.service";
import { Tables } from "./supabase.type";

export type DeckUserInputParams = Pick<
  Tables<"user_decks">,
  "name" | "archetype" | "description" | "youtube_id"
>;

export type DeckInitParams = Omit<
  Tables<"user_decks">,
  | keyof DeckUserInputParams
  | "id"
  | "created_at"
  | "updated_at"
  | "user_id"
  | "game_version"
  | "game_mode"
>;

export type DeckFilters = Partial<
  Tables<"user_decks"> & {
    craftable_decks?: "true" | "false";
  }
>;

export type UserDecks = Awaited<ReturnType<typeof getDecks>>;
