import { ObjectToCamel } from "ts-case-convert/lib/caseConvert";
import { Tables } from "./superbase.type";

export type DeckDto = Tables<"user_decks">;
export type Deck = ObjectToCamel<DeckDto>;
export type DeckBuildType = Pick<Deck, "deckFormat" | "gameMode" | "deckClass">;
export type DeckGeneratedData = DeckBuildType &
  Pick<
    Deck,
    "archetype" | "cardIds" | "dustCost" | "gameVersion" | "mainCardIds"
  >;
export type DeckUserInputData = Pick<Deck, "name" | "description">;
