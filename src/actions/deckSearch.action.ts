"use server";

import { getUserCollection } from "@/service/hsreplay.service";
import {
  getCraftableDecks,
  getRequestedDecks,
} from "@/service/supabase.service";

export async function searchForCraftableDecks(props?: {
  maxDust?: number;
  deckId?: number;
}) {
  const userCollection = await getUserCollection();

  if (!userCollection) return null;

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

export async function filterDecks(formData: FormData) {
  let craftableDecks: CraftableDecks = [];
  const filters: Record<string, string> = {};
  const isCraftable = formData.get("craftable_decks");

  if (isCraftable === "true") {
    const maxDust = formData.get("dustCost");
    const decks = await searchForCraftableDecks({ maxDust: Number(maxDust) });
    craftableDecks = decks?.craftableDecks ?? [];
  }

  formData.forEach((value, key) => {
    filters[key] = value as string;
  });

  const decks = await getRequestedDecks(filters, craftableDecks);

  return decks;
}
