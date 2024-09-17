import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  type DeckCard,
  type DeckDefinition,
  encode,
  type SideboardCard,
} from "deckstrings";
import { CARD_CLASSES } from "./cardClasses";
import type { UserDeck } from "@/types/deck.type";
import { Deck } from "@/types/hs.type";

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

export function updateQueryString(
  searchParams: string,
  name: string,
  value: string,
) {
  const params = new URLSearchParams(searchParams);
  params.set(name, value);

  return params.toString();
}

export function updateDeckCodeQuery(
  deck: Parameters<typeof encodeDeck>[0],
  searchParams: string,
) {
  const deckCode = encodeDeck(deck);
  const query = updateQueryString(searchParams, "deckCode", deckCode);
  return query;
}
