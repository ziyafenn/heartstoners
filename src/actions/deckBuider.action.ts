"use server";

import { encodeDeck } from "@/lib/utils";
import { searchHsCards } from "@/service/hs.service";
import { checkProfanity } from "@/service/profanity.service";
import {
  createUserDeck,
  getCurrentGameVersion,
  getMetasByClass,
} from "@/service/supabase.service";
import type { DeckInitParams, DeckUserInputParams } from "@/types/deck.type";
import type {
  Card,
  CardClass,
  CardSeachParams,
  CardsPage,
} from "@/types/hs.type";
import type { Tables } from "@/types/supabase.type";
import { decode } from "deckstrings";
import { RedirectType, redirect } from "next/navigation";

type Params = CardsPage & { params: CardSeachParams; loading?: boolean };

export async function loadPageWithFilters(
  currentState: Params,
  formData: FormData
): Promise<Params> {
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
  const res: Params = isFilter
    ? { ...data, cards, params: deckSearchParams, loading: false }
    : {
        ...data,
        params: deckSearchParams,
        cards: [...currentState.cards, ...cards],
        loading: false,
      };

  return res;
}

type CreateDeck = {
  initParams: DeckInitParams;
  userInput?: DeckUserInputParams;
  error?: string;
};

export async function createDeck(
  state: CreateDeck,
  formData: FormData
): Promise<CreateDeck> {
  let userInput = {} as DeckUserInputParams;
  const gameVersion = await getCurrentGameVersion();
  for (const [key, value] of formData.entries()) {
    userInput = {
      ...userInput,
      [key]: value,
    };
  }
  const { initParams } = state;

  const text = userInput.name;
  const { isProfanity } = await checkProfanity(text);

  if (isProfanity) {
    return {
      initParams,
      userInput,
      error:
        "It seems your text input contains profanity. If it's not, please contact us on Discord.",
    };
  }

  const deckCode = encodeDeck({
    card_ids: initParams?.card_ids,
    deck_class: initParams?.deck_class,
    deck_format: initParams?.deck_format,
    sideboard_cards: initParams?.sideboard_cards,
  });

  const { data, error } = await createUserDeck({
    gameVersion,
    initParams,
    userInput,
    deckCode,
  });

  if (error) {
    const message =
      error.code === "PGRST116"
        ? "It appears that this deck has already been created by you. If you believe this is an error, please contact us on our Discord to report the issue."
        : error.message;
    return {
      initParams,
      userInput,
      error: message,
    };
  }

  redirect(`/decks/${data.id}`, RedirectType.replace); //redirect type does nothing
}

type DecodeDeckState = { error?: string };

export async function decodeDeck(
  state: DecodeDeckState,
  formData: FormData
): Promise<DecodeDeckState> {
  const deckCode = formData.get("deckCode") as string;

  try {
    decode(deckCode);

    const params = new URLSearchParams({ deckCode });
    redirect(`/deckbuilder/deck?${params}`);
  } catch (error) {
    return {
      error:
        "It appears there is an issue with the deck code. If this problem continues, please contact us on Discord.",
    };
  }
}

export async function getSubArchetype(
  deckClass: CardClass["slug"],
  selectedCards: Card[]
) {
  const metas = await getMetasByClass(deckClass);

  const bestMatch = metas!.reduce(
    (best, meta) => {
      const metaMatches = meta.core_cards.filter((coreCard) =>
        selectedCards.map((selectedCard) => selectedCard.id).includes(coreCard)
      ).length;

      return metaMatches > best.matchedCardCount
        ? { matchedCardCount: metaMatches, meta }
        : best;
    },
    { matchedCardCount: 0, meta: {} as Tables<"meta_sub_archetypes"> }
  );

  if (bestMatch.matchedCardCount >= 5) return bestMatch.meta;

  return null;
}
