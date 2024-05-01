"use server";

import { createHsClient } from "@/service/fetch";

export async function submitFilter(currentState: [], formData: FormData) {
  const hsClient = await createHsClient();
  const deckClass = formData.get("class");

  const cards = await hsClient.cardSearch({
    gameMode: "constructed",
    type: "minion",
    pageSize: 30,
    class: deckClass,
  });

  return cards.data.cards;
}
