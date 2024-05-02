import { ObjectToCamel } from "ts-case-convert/lib/caseConvert";
import { Database } from "./superbase.type";

export type DeckDto = Database["public"]["Tables"]["user_decks"]["Row"];
export type Deck = ObjectToCamel<DeckDto>;
export type DeckGeneratedData = Pick<
  Deck,
  | "archetype"
  | "cardIds"
  | "deckFormat"
  | "dustCost"
  | "gameMode"
  | "deckClass"
  | "gameVersion"
  | "mainCardIds"
>;
export type DeckUserInputData = Pick<Deck, "name" | "description">;
