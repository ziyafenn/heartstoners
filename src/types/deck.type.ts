import type { getSingleDeck } from "@/service/supabase.service";
import type { DBFunction } from "./supabase.func.type";
import type { Tables } from "./supabase.type";

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
  | "deck_code"
>;

export type DeckFilters = Partial<
  Record<keyof Tables<"user_decks">, string>
> & {
  craftable_decks?: "true" | "false";
};
export type UserDeck = NonNullable<Awaited<ReturnType<typeof getSingleDeck>>>;

export type CraftableDeck = DBFunction<
  "get_craftable_decks",
  "Returns"
>[number];
