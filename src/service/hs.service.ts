"use server";

import {
  Card,
  CardSeachParams,
  CardsPage,
  Deck,
  DeckClass,
  MinionTypes,
  Rarity,
  SetGroups,
} from "@/types/hs.type";
import { hs } from "blizzard.js";
import { promises as fs } from "fs";

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
  class: deckClass,
  rarity,
  type,
  manaCost,
  set,
  gameMode,
  sort = "manaCost:asc",
  page = 1,
  minionType,
}: CardSeachParams) {
  const hsClient = await createHsClient();

  const res = await hsClient.cardSearch({
    gameMode,
    type,
    rarity,
    class: deckClass,
    manaCost,
    locale: "en_US",
    set,
    sort,
    pageSize: 15,
    page,
    minionType,
    collectible: 1,
  });

  const {
    data,
  }: {
    data: CardsPage;
  } = res;

  return data;
}

export async function getHsDeckClasses() {
  const hsClient = await createHsClient();
  const res = await hsClient.metadata({
    type: "classes",
  });

  const { data }: { data: DeckClass[] } = res;

  return data;
}

export async function getHsMinionTypes() {
  const hsClient = await createHsClient();

  const res = await hsClient.metadata({
    type: "minionTypes",
  });
  const { data }: { data: MinionTypes[] } = res;

  return data;
}

export async function getHsRarities() {
  const hsClient = await createHsClient();

  const res = await hsClient.metadata({
    type: "rarities",
  });
  const { data }: { data: Rarity[] } = res;

  return data;
}
export async function getHsSetGroups() {
  const hsClient = await createHsClient();

  const res = await hsClient.metadata({
    type: "setGroups",
  });

  const { data }: { data: SetGroups[] } = res;

  return data;
}

export async function getHsSets() {
  const hsClient = await createHsClient();

  const res = await hsClient.metadata({
    type: "sets",
  });
  const { data }: { data: string[] } = res;

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

export async function getDeckByCode(code: string) {
  const hsClient = await createHsClient();

  const res = await hsClient.deck({
    locale: "en_US",
    code,
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
    process.cwd() + "/public/zilliax.json",
    "utf8",
  );

  const data: { functions: Card[]; modules: Card[] } = JSON.parse(file);
  return data;
}
