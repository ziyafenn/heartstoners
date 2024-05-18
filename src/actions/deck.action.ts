"use server";
import { encrypt, getUserIp } from "@/lib/serverUtils";
import { deckInteraction, deckLiked } from "@/service/supabase.service";
import { Tables } from "@/types/superbase.type";
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
