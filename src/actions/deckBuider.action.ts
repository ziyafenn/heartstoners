"use server";

import { searchHsCards } from "@/service/hs.service";
import { supabase } from "@/service/superbase.service";
import {
  DeckBuildType,
  DeckGeneratedData,
  DeckUserInputData,
} from "@/types/deck.type";
import { CardsPage } from "@/types/hs.type";
import { objectToSnake } from "ts-case-convert/lib/caseConvert";

export async function loadPageWithFilters(
  currentState: CardsPage,
  formData: FormData,
): Promise<CardsPage> {
  let deckBuildType = {} as DeckBuildType;

  for (const [key, value] of formData.entries()) {
    deckBuildType = {
      ...deckBuildType,
      [key]: value,
    };
  }

  const data = await searchHsCards({
    ...deckBuildType,
    set: deckBuildType.deckFormat,
    page: currentState.page + 1,
  });

  return { ...data, cards: [...currentState.cards, ...data.cards] };
}

export async function createDeck(
  deckData: DeckGeneratedData,
  formData: FormData,
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
      user_id: "86e43de9-ecd7-4bb0-9a42-d2a557da1d31",
    })
    .select();

  if (error) console.log(error, "errror");
  else console.log(data, "done");
}
