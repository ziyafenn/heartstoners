"use server";

import { getUserCollection } from "@/service/hsreplay.service";
import { getCraftableDecks } from "@/service/supabase.service";

export async function searchForCraftableDecks() {
  const userCollection = await getUserCollection();
  const craftableDecks = await getCraftableDecks(userCollection.collection);

  return { craftableDecks, userCollection };
}
