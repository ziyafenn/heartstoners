"use server";

import {
  Card,
  DeckClass,
  MinionTypes,
  Rarity,
  SetGroups,
} from "@/types/hs.type";
import { hs } from "blizzard.js";
import {
  CardClass,
  CardGameMode,
  CardRarity,
  CardSortOption,
  CardSortOrder,
  CardType,
} from "blizzard.js/dist/resources/hs";

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
  set,
  gameMode,
  sort = "manaCost:asc",
}: {
  gameMode: CardGameMode;
  set: SetGroups["slug"];
  deckClass: CardClass;
  rarity?: CardRarity;
  type?: CardType;
  manaCost?: number;
  sort?: `${CardSortOption}:${CardSortOrder}`;
}) {
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
  });

  const {
    data,
  }: {
    data: { cards: Card[]; cardCount: number; pageCount: number; page: number };
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
