import { Tables } from "./superbase.type";

export type DeckUserInputParams = Pick<
  Tables<"user_decks">,
  "name" | "archetype" | "description"
>;

export type DeckInitParams = Omit<
  Tables<"user_decks">,
  | keyof DeckUserInputParams
  | "id"
  | "created_at"
  | "updated_at"
  | "user_id"
  | "game_version"
>;
