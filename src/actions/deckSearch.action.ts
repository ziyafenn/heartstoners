"use server";

import { getUserCollection } from "@/service/hsreplay.service";
import {
  getCraftableDecks,
  getRequestedDecks,
} from "@/service/supabase.service";

export async function searchForCraftableDecks(maxDust?: number) {
  const userCollection = await getUserCollection();
  const craftableDecks = await getCraftableDecks(
    userCollection.collection,
    maxDust || userCollection.dust,
  );

  return { craftableDecks, userCollection };
}

export async function filterDecks(formData: FormData) {
  let craftableDecks: Awaited<
    ReturnType<typeof searchForCraftableDecks>
  >["craftableDecks"] = null;
  const filters: Record<string, string> = {};
  const isCraftable = formData.get("craftable_decks");

  if (isCraftable === "true") {
    const maxDust = formData.get("dustCost");
    const decks = await searchForCraftableDecks(Number(maxDust));
    craftableDecks = decks.craftableDecks;
  }

  formData.forEach((value, key) => {
    filters[key] = value as string;
  });

  const decks = await getRequestedDecks(filters, craftableDecks);

  return decks;
}
