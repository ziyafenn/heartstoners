import { Database } from "./superbase.type";

export type Card = {
  id: number;
  collectible: number;
  slug: string;
  classId: number;
  multiClassIds: number[];
  minionTypeId: number;
  multiTypeIds: number[];
  cardTypeId: number;
  cardSetId: number;
  rarityId: number | null;
  artistName: string;
  health: number;
  attack: number;
  manaCost: number;
  name: string;
  text: string;
  image: string;
  imageGold: string;
  flavorText: string;
  cropImage: string | null;
  parentId?: number;
  childIds?: number[];
  keywordIds: number[];
  isZilliaxFunctionalModule: boolean;
  isZilliaxCosmeticModule: boolean;
};

export type Sets = {
  id: number;
  name: string;
  slug: string;
  hyped: boolean;
  type: string;
  collectibleCount: number;
  collectibleRevealedCount: number;
  nonCollectibleCount: number;
  nonCollectibleRevealedCount: number;
};

export type SetGroups = {
  slug: "standard" | "wild";
  year: number;
  svg: string;
  cardSets: string[];
  name: string;
  standard: boolean;
  icon: string;
};

export type Rarity = {
  slug: string;
  id: number;
  craftingCost: number[];
  dustValue: number[];
  name: string;
};

export type DeckClass = {
  slug: Database["public"]["Enums"]["card_class"];
  id: number;
  name: string;
  cardId: number;
  heroPowerCardId: number;
  alternateHeroCardIds: number[];
};

export type MinionTypes = {
  slug: string;
  id: number;
  name: string;
  gameModes: number[];
};
