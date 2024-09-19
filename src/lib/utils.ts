import type { UserDeck } from "@/types/deck.type";
import type {
  Card,
  CardSeachParams,
  CardType,
  Deck,
  Rarity,
  SideboardCards,
} from "@/types/hs.type";
import { type ClassValue, clsx } from "clsx";
import {
  type DeckCard,
  type DeckDefinition,
  type SideboardCard,
  encode,
} from "deckstrings";
import { twMerge } from "tailwind-merge";
import { CARD_CLASSES } from "./cardClasses";
import { CARD_RARITIES } from "./cardRarities";
import { CARD_TYPES } from "./cardTypes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDustCost(id: number | null) {
  switch (id) {
    case 1: //common
    case 3:
      return 100;
    case 4:
      return 400;
    case 5:
      return 1600;
    default:
      return 0;
  }
}

export function getYouTubeVideoID(url: string) {
  try {
    const urlObj = new URL(url);
    if (
      urlObj.hostname === "www.youtube.com" ||
      urlObj.hostname === "youtube.com"
    ) {
      return urlObj.searchParams.get("v");
    }
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.substring(1); // Skip the leading "/"
    }
    return null;
  } catch (error) {
    return null;
  }
}

export function toCapital(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function findData<T, K extends keyof T>(
  array: T[],
  key: K,
  value: T[K] | undefined | null,
) {
  const item = array.find((item) => item[key] === value);
  if (!item) {
    throw new Error(`Item with ${String(key)}=${value} not found`);
  }

  return item;
}

export function encodeDeck({
  card_ids,
  sideboard_cards,
  deck_class,
  deck_format,
}: Pick<
  UserDeck,
  "card_ids" | "sideboard_cards" | "deck_class" | "deck_format"
>) {
  function convertCards(ids: number[]): DeckCard[] {
    const counts: Record<number, number> = {};

    for (const id of ids) {
      counts[id] = (counts[id] || 0) + 1;
    }

    return Object.entries(counts).map(([id, count]) => [Number(id), count]);
  }

  function convertSideboardCards(idPairs: string[]): SideboardCard[] {
    const counts: Record<number, number> = {};
    const parents: Record<number, number> = {};

    for (const pair of idPairs) {
      const [childIdStr, parentIdStr] = pair.split(":");
      const childId = Number.parseInt(childIdStr, 10);
      const parentId = Number.parseInt(parentIdStr, 10);

      if (!counts[childId]) {
        counts[childId] = 0;
        parents[childId] = parentId;
      }

      counts[childId]++;
    }

    return Object.entries(counts).map(([childIdStr, count]) => {
      const childId = Number.parseInt(childIdStr, 10);
      return [childId, count, parents[childId]];
    });
  }

  const heroCardId = findData(CARD_CLASSES, "slug", deck_class).cardId;

  const deck: DeckDefinition = {
    cards: convertCards(card_ids), // [dbfId, count] pairs
    sideboardCards: sideboard_cards
      ? convertSideboardCards(sideboard_cards)
      : [], // [dbfId, count, sideboardOwnerDbfId] triplets
    heroes: [heroCardId], // Garrosh Hellscream
    format: deck_format === "standard" ? 2 : 1,
  };

  const deckCode = encode(deck);
  return deckCode;
}

export function updateDeckCodeQuery(
  deck: Pick<Deck, "cards" | "sideboardCards"> &
    Pick<CardSeachParams, "set" | "multiClass">,
) {
  const { card_ids, sideboard_cards } = getDeckData(
    deck.cards,
    deck.sideboardCards,
  );
  const deckCode = encodeDeck({
    card_ids,
    sideboard_cards,
    deck_class: deck.multiClass,
    deck_format: deck.set,
  });
  const url = new URL(window.location.href);
  url.searchParams.set("deckCode", deckCode);
  window.history.replaceState({}, "", url);
}

export function getDeckData(
  selectedCards: Card[],
  sideboardCards: SideboardCards[],
) {
  let dust_cost_sum = 0;
  const dust_cost_per_card: number[] = [];
  const card_ids: number[] = [];
  const cardTypes: Record<CardType["name"], number> = {
    Hero: 0,
    Location: 0,
    Minion: 0,
    Spell: 0,
    Weapon: 0,
    HeroPower: 0,
    Reward: 0,
  };
  const cardRarities: Record<Rarity["name"], number> = {
    Common: 0,
    Free: 0,
    Epic: 0,
    Rare: 0,
    Legendary: 0,
  };

  const sideboard_cards = sideboardCards.flatMap((sideboard) => {
    const primaryId = sideboard.sideboardCard.id;
    return sideboard.cardsInSideboard.map((card) => `${card.id}:${primaryId}`);
  });

  selectedCards.forEach((card) => {
    dust_cost_per_card.push(getDustCost(card.rarityId));
    dust_cost_sum += getDustCost(card.rarityId);
    card_ids.push(card.id);
    const cardTypeName = findData(CARD_TYPES, "id", card.cardTypeId).name;
    cardTypes[cardTypeName] = cardTypes[cardTypeName] + 1;
    const cardRarityName = findData(CARD_RARITIES, "id", card.rarityId).name;
    cardRarities[cardRarityName] = cardRarities[cardRarityName] + 1;
  });

  return {
    dust_cost_sum,
    dust_cost_per_card,
    card_ids,
    cardTypes,
    cardRarities,
    sideboard_cards,
  };
}
