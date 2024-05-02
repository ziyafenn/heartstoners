"use server";

import { searchHsCards } from "@/service/hs.service";
import { supabase } from "@/service/superbase.service";
import { DeckGeneratedData, DeckUserInputData } from "@/types/deck.type";
import { Card } from "@/types/hs.type";
import { objectToSnake } from "ts-case-convert/lib/caseConvert";

export async function submitFilter(currentState: Card[], formData: FormData) {
  const deckClass = formData.get("deckClass");

  const cards = await searchHsCards({
    deckClass,
  });

  return cards.cards;
}

export async function createDeck(
  deckData: DeckGeneratedData,
  formData: FormData
) {
  let userInput = {} as DeckUserInputData;

  for (const [key, value] of formData.entries()) {
    userInput = {
      ...userInput,
      [key]: value,
    };
  }

  const { data, error } = await supabase
    .from("user_decks")
    .insert({
      ...objectToSnake(deckData),
      ...userInput,
      deck_code: "sdf",
      user_id: "abf01736-0654-4481-9832-2bc98c138465",
    })
    .select();

  if (error) console.log(error, "errror");
  else console.log(data, "done");
}
