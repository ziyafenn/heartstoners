"use server";

import { Card } from "@/types/hs.type";
import { hs } from "blizzard.js";
import { CardClass, CardRarity, CardType } from "blizzard.js/dist/resources/hs";

async function createHsClient() {
  return await hs.createInstance({
    key: "19f0676648064185bb153378a805a0dc",
    secret: "q8uTKo4XOOY4F3daN2WrH66shTicAAHj",
    origin: "us", // optional
    locale: "en_US", // optional
    token: "", // optional
  });
}

export async function searchHsCards({
  deckClass,
  rarity,
  type,
  manaCost,
}: {
  deckClass: CardClass;
  rarity?: CardRarity;
  type?: CardType;
  manaCost?: number;
}) {
  const hsClient = await createHsClient();

  const res = await hsClient.cardSearch({
    gameMode: "constructed",
    type: "minion",
    rarity,
    class: deckClass,
    manaCost,
    locale: "en_US",
    set: "standard",
  });

  const {
    data,
  }: {
    data: { cards: Card[]; cardCount: number; pageCount: number; page: number };
  } = res;

  return data;
}

export async function getHsClasses() {
  const hsClient = await createHsClient();
  const res = await hsClient.metadata({
    type: "classes",
  });

  const { data }: { data: CardClass } = res;

  return data;
}

export async function getHsMinionTypes() {
  const hsClient = await createHsClient();

  const res = await hsClient.metadata({
    type: "minionTypes",
  });
  const { data }: { data: CardType } = res;

  return data;
}

export async function getHsRarities() {
  const hsClient = await createHsClient();

  const res = await hsClient.metadata({
    type: "rarities",
  });
  const { data }: { data: CardRarity } = res;

  return data;
}
export async function getHsSetGroups() {
  const hsClient = await createHsClient();

  const res = await hsClient.metadata({
    type: "setGroups",
  });

  const { data }: { data: string[] } = res;

  return data;
}

export async function getHsSets() {
  const hsClient = await createHsClient();

  hsClient.metadata({
    type: "sets",
  });
}

// export async function getSingleCard(cardId: string) {
//   const api = await hsFetch();

//   const res = api.url(`/cards/${cardId}?locale=en_US`).get().json();
//   return res.data;
// }
