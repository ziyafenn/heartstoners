"use server";

import { searchHsCards } from "@/service/hs.service";
import { createClient } from "@/service/supabase.auth.server";
import { getCurrentGameVersion } from "@/service/supabase.service";
import { DeckInitParams, DeckUserInputParams } from "@/types/deck.type";
import { CardSeachParams, CardsPage } from "@/types/hs.type";
import { redirect } from "next/navigation";
import { decode } from "deckstrings";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { Enums } from "@/types/superbase.type";

export async function loadPageWithFilters(
  currentState: CardsPage & { params: CardSeachParams },
  formData: FormData,
): Promise<CardsPage & { params: CardSeachParams }> {
  const deckSearchParams = {
    ...currentState.params,
    class: formData.get("class"),
    rarity: formData.get("rarity"),
    minionType: formData.get("minionType"),
    textFilter: formData.get("textFilter"),
    keyword: formData.get("keyword"),
    type: formData.get("type"),
    manaCost: formData.get("manaCost") as unknown,
  } as CardSeachParams;
  const isFilter: boolean = formData.has("filter");
  const page = isFilter ? 1 : currentState.page + 1;

  const { cards, ...data } = await searchHsCards({
    ...deckSearchParams,
    page,
  });

  // if it's filter, reset search state
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
  const supabase = createClient();
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
    .select()
    .single();
}

export async function loadDeckFromCode(formData: FormData) {
  const deckCode = formData.get("deckCode")!.toString();

  // const deck = await getDeckByCode(deckCode);
  const deck = decode(deckCode);

  const slug = CARD_CLASSES.find((c) => c.cardId === deck.heroes[0])?.slug;
  const format: Enums<"deck_format"> = deck.format === 1 ? "wild" : "standard";

  redirect(`/deckbuilder/${format}?deckClass=${slug}&deckCode=${deckCode}`);
}
