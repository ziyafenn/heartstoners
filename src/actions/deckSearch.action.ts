"use server";

import { getUserCollection } from "@/service/hsreplay.service";
import {
  getCraftableDecks,
  getRequestedDecks,
} from "@/service/supabase.service";
import { DeckFilters } from "@/types/deck.type";

export async function searchForCraftableDecks() {
  const userCollection = await getUserCollection();
  const craftableDecks = await getCraftableDecks(
    userCollection.collection,
    userCollection.dust,
  );
  return { craftableDecks, userCollection };
}

export async function filterDecks(filters: DeckFilters) {
  let craftableDecks: Awaited<
    ReturnType<typeof searchForCraftableDecks>
  >["craftableDecks"] = null;

  if (filters.craftable_decks) {
    const decks = await searchForCraftableDecks();
    craftableDecks = decks.craftableDecks;
  }

  const decks = await getRequestedDecks(filters, craftableDecks);

  return decks;
}
