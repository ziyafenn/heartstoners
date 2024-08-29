"use server";

import { getUserCollection } from "@/service/hsreplay.service";
import {
  getCraftableDecks,
  getRequestedDecks,
} from "@/service/supabase.service";

export async function searchForCraftableDecks() {
  const userCollection = await getUserCollection();
  const craftableDecks = await getCraftableDecks(userCollection.collection);

  return { craftableDecks, userCollection };
}

export async function filterDecks(filters: Record<string, boolean>) {
  const decks = await getRequestedDecks(filters);

  return decks;
}
