"use server";

import type { CardSeachParams, CardsPage, Deck } from "@/types/hs.type";
import { hs } from "blizzard.js";
import type { CardMetaDataType } from "blizzard.js/dist/resources/hs";

async function createHsClient() {
  return await hs.createInstance({
    key: process.env.BATTLENET_KEY,
    secret: process.env.BATTLENET_SECRET,
    origin: "us", // optional
    locale: "en_US", // optional
    token: "", // optional
  });
}
export async function searchHsCards({
  class: cardClass,
  rarity,
  type,
  manaCost,
  set,
  gameMode = "constructed",
  sort = "manaCost:asc",
  page = 1,
  minionType,
  multiClass,
  textFilter,
  keyword,
}: CardSeachParams) {
  const hsClient = await createHsClient();

  const res = await hsClient.cardSearch({
    gameMode,
    type,
    rarity,
    class: cardClass,
    manaCost,
    locale: "en_US",
    set,
    sort,
    pageSize: 30,
    page,
    minionType,
    collectible: 1,
    multiClass,
    textFilter,
    keyword,
  });

  const {
    data,
  }: {
    data: CardsPage;
  } = res;

  return data;
}

export async function getHsMetadata<T>(type: CardMetaDataType): Promise<T[]> {
  const hsClient = await createHsClient();

  const res = await hsClient.metadata({
    type,
  });
  const { data }: { data: T[] } = res;

  return data;
}

export async function getDeckByCardList({
  cardIds,
  sideboardCards,
}: {
  cardIds: number[];
  sideboardCards?: string[];
}) {
  const hsClient = await createHsClient();

  const res = await hsClient.deck({
    locale: "en_US",
    ids: cardIds,
    sideboardCards,
  });

  const { data }: { data: Deck } = res;

  return data;
}

export async function getDeckByCode(deckCode: string) {
  const hsClient = await createHsClient();

  const res = await hsClient.deck({
    locale: "en_US",
    code: deckCode,
  });

  const { data }: { data: Deck } = res;

  return data;
}
