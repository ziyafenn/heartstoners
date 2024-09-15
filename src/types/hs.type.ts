import type { ResourceOptions } from "blizzard.js/dist/resources";
import type { Enums } from "./supabase.type";
import type { CardSearchOptions } from "blizzard.js/dist/resources/hs";

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
  maxSideboardCards?: number;
  bannedFromSideboard?: number;
  isZilliaxFunctionalModule: boolean;
  isZilliaxCosmeticModule: boolean;
  touristClassId?: number;
  runeCost?: {
    blood: number;
    frost: number;
    unholy: number;
  };
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
  slug: Enums<"deck_format">;
  year: number;
  svg: string;
  cardSets: string[];
  name: string;
  standard: boolean;
  icon: string;
};

export type Rarity = {
  slug: "common" | "free" | "rare" | "epic" | "legendary";
  id: number;
  craftingCost: number[];
  dustValue: number[];
  name: "Common" | "Free" | "Rare" | "Epic" | "Legendary";
};

export type CardClass = {
  slug:
    | "deathknight"
    | "demonhunter"
    | "druid"
    | "hunter"
    | "mage"
    | "paladin"
    | "priest"
    | "rogue"
    | "shaman"
    | "warlock"
    | "warrior"
    | "neutral";
  id: number;
  name:
    | "Death Knight"
    | "Demon Hunter"
    | "Druid"
    | "Hunter"
    | "Mage"
    | "Paladin"
    | "Priest"
    | "Rogue"
    | "Shaman"
    | "Warlock"
    | "Warrior"
    | "Neutral";
  cardId?: number;
  heroPowerCardId?: number;
  alternateHeroCardIds?: number[];
};

export type MinionTypes = {
  slug: string;
  id: number;
  name: string;
  gameModes: number[];
};

export type CardsPage = {
  cards: Card[];
  count: number;
  page: number;
  pageCount: number;
};

export type SideboardCards = {
  cardsInSideboard: Card[];
  sideboardCard: Card;
};

export type Deck = {
  deckCode: string;
  version: number;
  format: Enums<"deck_format">;
  hero: Card;
  heroPower: Card;
  cards: Card[];
  class: {
    slug: CardClass["slug"];
    id: number;
    name: CardClass["name"];
  };
  cardCount: number;
  invalidCardIds: string[];
  sideboardCards?: SideboardCards[];
};

export type Keyword = {
  id: number;
  slug: string;
  name: string;
  refText: string;
  text: string;
  gameModes: number[];
};

export type CardType = {
  slug:
    | "hero"
    | "minion"
    | "spell"
    | "weapon"
    | "hero power"
    | "location"
    | "baconquestreward";
  id: number;
  name:
    | "Hero"
    | "Minion"
    | "Spell"
    | "Weapon"
    | "HeroPower"
    | "Location"
    | "Reward";
  gameModes?: number[];
};

export type CardSeachParams = ResourceOptions<CardSearchOptions>;
export type RuneCost = NonNullable<Card["runeCost"]>;
export type Rune = keyof RuneCost;
