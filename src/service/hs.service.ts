"use server";

import { promises as fs } from "node:fs";
import type { Card, CardSeachParams, CardsPage, Deck } from "@/types/hs.type";
import { hs } from "blizzard.js";
import type { CardMetaDataType } from "blizzard.js/dist/resources/hs";
import { env } from "node:process";

async function createHsClient() {
  return await hs.createInstance({
    key: env.BATTLENET_KEY,
    secret: env.BATTLENET_SECRET,
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

export async function getZilliaxSideboardCards() {
  // const hsClient = await createHsClient();

  // const params: Partial<CardSeachParams> = {
  //   collectible: 0,
  //   page: 1,
  //   pageSize: 20,
  //   gameMode: "constructed",
  //   set: "standard",
  //   locale: "en_US",
  // };

  // const cosmeticCardSearch = hsClient.cardSearch({
  //   ...params,
  //   textFilter: "zilliax",
  // });

  // const functionalCardSearch = hsClient.cardSearch({
  //   ...params,
  //   textFilter: "module",
  // });

  // const res = await Promise.all([cosmeticCardSearch, functionalCardSearch]);
  // const [{ data: cosmeticCardRes }, { data: functionalCardRes }]: {
  //   data: CardsPage;
  // }[] = res;

  // const cosmeticCards = cosmeticCardRes.cards.filter(
  //   (card) => card.isZilliaxCosmeticModule,
  // );
  // const functionalCards = functionalCardRes.cards.filter(
  //   (card) => card.isZilliaxFunctionalModule,
  // );

  // return { cosmeticCards, functionalCards };

  const file = await fs.readFile(
    `${process.cwd()}/public/zilliax.json`,
    "utf8",
  );

  const data: { functions: Card[]; modules: Card[] } = JSON.parse(file);
  return data;
}
