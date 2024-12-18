"use server";

import { getUserCollection } from "@/service/hsreplay.service";
import {
  getCraftableDecks,
  getRequestedDecks,
} from "@/service/supabase.service";
import type { DeckFilters, UserDeck } from "@/types/deck.type";

export async function searchForCraftableDecks(props?: {
  maxDust?: number;
  deckId?: number;
}) {
  const userCollection = await getUserCollection();

  if (!userCollection) return;

  const craftableDecks = await getCraftableDecks(
    userCollection.collection,
    props?.maxDust || userCollection.dust,
    props?.deckId,
  );

  return { craftableDecks, userCollection };
}

type CraftableDecks = NonNullable<
  Awaited<ReturnType<typeof searchForCraftableDecks>>
>["craftableDecks"];

type DeckSearchResult = {
  userDecks: UserDeck[];
  // pagination: [number, number];
  // count?: number;
};

export async function filterDecks(
  state: DeckSearchResult,
  formData: FormData,
): Promise<DeckSearchResult> {
  let craftableDecks: CraftableDecks = [];
  let filters: DeckFilters = {};
  const isCraftable = formData.get("craftable_decks");

  if (isCraftable === "true") {
    const maxDust = formData.get("dustCost");
    const decks = await searchForCraftableDecks({ maxDust: Number(maxDust) });
    craftableDecks = decks?.craftableDecks ?? [];
  }

  for (const [key, value] of formData.entries()) {
    filters = {
      ...filters,
      [key]: value,
    };
  }

  const { data: userDecks } = await getRequestedDecks(filters, craftableDecks);

  return {
    userDecks: userDecks ?? [],
  };
}
