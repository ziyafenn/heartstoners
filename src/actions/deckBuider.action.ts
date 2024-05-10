"use server";

import { supabase } from "@/service/fetch";
import { searchHsCards } from "@/service/hs.service";
import { getCurrentGameVersion } from "@/service/supabase.service";
import { DeckInitParams, DeckUserInputParams } from "@/types/deck.type";
import { CardSeachParams, CardsPage } from "@/types/hs.type";

export async function loadPageWithFilters(
  currentState: CardsPage & { params: CardSeachParams },
  formData: FormData,
): Promise<CardsPage & { params: CardSeachParams }> {
  const deckSearchParams = {
    ...currentState.params,
    class: formData.get("class") ?? currentState.params.class,
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
  const gameVersion = await getCurrentGameVersion();

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
      game_version: gameVersion,
    })
    .select();

  if (error) console.log(error, "errror");
  else console.log(data, "done");
}
