import { Enums, Tables } from "./superbase.type";

export type UserDeck = Tables<"user_decks">;

export type DeckType = Pick<
  UserDeck,
  "deck_format" | "game_mode" | "deck_class"
>;
export type DeckGeneratedData = DeckType &
  Pick<UserDeck, "card_ids" | "dust_cost" | "game_version" | "main_card_ids">;
export type DeckUserInputData = Pick<
  UserDeck,
  "name" | "description" | "archetype"
>;
export type Archetype = Enums<"archetypes">;
