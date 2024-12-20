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
  await deckInteraction({
    deckId,
    type: "increment_copies",
  });
}

export async function getUserDeck(deckId: number) {
  const userIp = getUserIp();
  const encryptedUserIp = encrypt(userIp);
  const getDeck = getSingleDeck(deckId);
  const getDeckLikes = getDeckLikeByIp({
    deckId: Number(deckId),
    ip: encryptedUserIp,
  });
  const getAvailableDust = getUserCollection();

  const {
    "0": deck,
    "1": didUserLike,
    "2": userCollection,
  } = await Promise.all([getDeck, getDeckLikes, getAvailableDust]);

  return {
    deck,
    didUserLike: !!didUserLike,
    availableDust: userCollection?.dust ?? 0,
  };
}
