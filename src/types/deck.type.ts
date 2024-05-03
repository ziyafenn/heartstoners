import { ObjectToCamel } from "ts-case-convert/lib/caseConvert";
import { Enums, Tables } from "./superbase.type";

export type DeckDto = Tables<"user_decks">;
export type Deck = ObjectToCamel<DeckDto>;
export type DeckType = Pick<Deck, "deckFormat" | "gameMode" | "deckClass">;
export type DeckGeneratedData = DeckType &
  Pick<Deck, "cardIds" | "dustCost" | "gameVersion" | "mainCardIds">;
export type DeckUserInputData = Pick<
  Deck,
  "name" | "description" | "archetype"
>;
export type Archetype = Enums<"archetypes">;
