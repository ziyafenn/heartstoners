"use server";

import { searchHsCards } from "@/service/hs.service";
import { supabase } from "@/service/supabase";
import { DeckInitParams, DeckUserInputParams } from "@/types/deck.type";
import { CardSeachParams, CardsPage } from "@/types/hs.type";

export async function loadPageWithFilters(
  currentState: CardsPage & { params: CardSeachParams },
  formData: FormData,
): Promise<CardsPage & { params: CardSeachParams }> {
  const deckSearchParams = {
    ...currentState.params,
    rarity: formData.get("rarity"),
    minionType: formData.get("minionType"),
  } as CardSeachParams;
  const isFilter: boolean = formData.has("filter");

  const page = isFilter ? 1 : currentState.page + 1;

  const { cards, ...data } = await searchHsCards({
    ...deckSearchParams,
    page,
  });

  const res: CardsPage & { params: CardSeachParams } = isFilter
    ? { ...data, cards, params: deckSearchParams }
    : {
        ...data,
        params: deckSearchParams,
        cards: [...currentState.cards, ...cards],
      };

  return res;
}

export async function createDeck(
  deckParams: DeckInitParams,
  formData: FormData,
) {
  let userInput = {} as DeckUserInputParams;

  for (const [key, value] of formData.entries()) {
    userInput = {
      ...userInput,
      [key]: value,
    };
  }

  const { data, error } = await supabase
    .from("user_decks")
    .insert({
      ...deckParams,
      ...userInput,
      user_id: "86e43de9-ecd7-4bb0-9a42-d2a557da1d31",
    })
    .select();

  if (error) console.log(error, "errror");
  else console.log(data, "done");
}
