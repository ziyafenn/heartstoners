"use server";

import { searchHsCards } from "@/service/hs.service";
import {
  createUserDeck,
  getCurrentGameVersion,
  getMetasByClass,
} from "@/service/supabase.service";
import { DeckInitParams, DeckUserInputParams } from "@/types/deck.type";
import { Card, CardClass, CardSeachParams, CardsPage } from "@/types/hs.type";
import { redirect } from "next/navigation";
import { decode } from "deckstrings";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { Enums, Tables } from "@/types/supabase.type";
// import { checkProfanity } from "@/service/profanity.service";
import { getYouTubeVideoID } from "@/lib/utils";

type Params = CardsPage & { params: CardSeachParams; loading?: boolean };

export async function loadPageWithFilters(
  currentState: Params,
  formData: FormData,
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

type CreateDeck = { data: DeckInitParams | null; error?: string };

export async function createDeck(
  state: CreateDeck,
  formData: FormData,
): Promise<CreateDeck> {
  let userInput = {} as DeckUserInputParams;
  const gameVersion = await getCurrentGameVersion();
  for (const [key, value] of formData.entries()) {
    if (key === "youtube_link") {
      userInput = {
        ...userInput,
        youtube_id: getYouTubeVideoID(value.toString()),
      };
    } else {
      userInput = {
        ...userInput,
        [key]: value,
      };
    }
  }
  const { data: initParams } = state;

  // const text = `${userInput.name}. ${userInput.description}`;
  // const { isProfanity } = await checkProfanity(text);

  // if (isProfanity)
  //   return {
  //     data: null,
  //     error:
  //       "It seems your text input contains profanity. If it's not, please contact us on Discord.",
  //   };

  const { data, error } = await createUserDeck({
    gameVersion,
    initParams: initParams!,
    userInput,
  });

  if (error) return { data: null, error: error.message };

  redirect(`/decks/${data.id}`);
}

export async function loadDeckFromCode(formData: FormData) {
  const deckCode = formData.get("deckCode")!.toString();

  // const deck = await getDeckByCode(deckCode);
  const deck = decode(deckCode);

  const slug = CARD_CLASSES.find((c) => c.cardId === deck.heroes[0])?.slug;
  const format: Enums<"deck_format"> = deck.format === 1 ? "wild" : "standard";

  redirect(`/deckbuilder/${format}?deckClass=${slug}&deckCode=${deckCode}`);
}

export async function getSubArchetype(
  deckClass: CardClass["slug"],
  selectedCards: Card[],
) {
  const metas = await getMetasByClass(deckClass);

  const bestMatch = metas!.reduce(
    (best, meta) => {
      const metaMatches = meta!.core_cards!.filter((coreCard) =>
        selectedCards.map((selectedCard) => selectedCard.id).includes(coreCard),
      ).length;
      return metaMatches > best.matchedCardCount
        ? { matchedCardCount: metaMatches, meta }
        : best;
    },
    { matchedCardCount: 0, meta: {} as Tables<"meta_sub_archetypes"> },
  );

  if (bestMatch.matchedCardCount > 2) return bestMatch.meta;

  return null;
}
