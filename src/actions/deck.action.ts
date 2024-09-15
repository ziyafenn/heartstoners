"use server";
import { encrypt, getUserIp } from "@/lib/serverUtils";
import { getUserCollection } from "@/service/hsreplay.service";
import {
  deckInteraction,
  deckLiked,
  getDeckLikeByIp,
  getSingleDeck,
} from "@/service/supabase.service";
import type { Tables } from "@/types/supabase.type";
import { cookies } from "next/headers";

export async function likeDeck({
  author_id,
  deck_id,
}: Pick<Tables<"deck_likes">, "author_id" | "deck_id">) {
  const ip = getUserIp();
  const encryptedIp = encrypt(ip);

  await deckLiked({
    author_id,
    deck_id,
    ip: encryptedIp,
  });
}

export async function copyDeck(deckId: number) {
  const cookieStore = cookies();
  const hasUserCopiedDeck = cookieStore.has("copy");

  if (!hasUserCopiedDeck) {
    cookieStore.set({
      name: "copy",
      value: "true",
      path: `/decks/${deckId}`,
    });

    await deckInteraction({
      deckId,
      type: "increment_copies",
    });
  }
}

export async function getUserDeck(deckId: number) {
  try {
    const userIp = getUserIp();
    const encryptedUserIp = encrypt(userIp);
    const getDeck = getSingleDeck(deckId);
    const getDeckLikes = getDeckLikeByIp({
      deckId: Number(deckId),
      ip: encryptedUserIp,
    });
    const getAvailableDust = await getUserCollection();

    const {
      "0": userDeck,
      "1": didUserLike,
      "2": userCollection,
    } = await Promise.all([getDeck, getDeckLikes, getAvailableDust]);

    const { data, error } = userDeck;

    if (error) throw error;

    return {
      deck: data,
      didUserLike: !!didUserLike,
      availableDust: userCollection?.dust ?? 0,
    };
  } catch (error) {
    throw new Error(error as string);
  }
}
