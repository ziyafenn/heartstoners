import { DeckBuilder } from "./_components/DeckBuilder";
import {
  searchHsCards,
  getHsMetadata,
  getDeckByCode,
} from "@/service/hs.service";
import type {
  CardType,
  Deck,
  Keyword,
  MinionTypes,
  Rarity,
  SetGroups,
} from "@/types/hs.type";
import type { CardClass } from "blizzard.js/dist/resources/hs";

export default async function ClassDeckBuilder({
  // params,
  searchParams,
}: {
  // params: { format: SetGroups["slug"] };
  searchParams: {
    deckClass: CardClass;
    format: SetGroups["slug"];
    deckCode?: string;
  };
}) {
  const { deckClass, format, deckCode } = searchParams;
  let currentDeck: Deck | null = null;
  let currentDeckClass = deckClass;
  let currentDeckFormat = format;

  if (deckCode) {
    currentDeck = await getDeckByCode(deckCode);
    const { class: deckClass, format } = currentDeck;
    currentDeckClass = deckClass.slug;
    currentDeckFormat = format;
  }

  const rarities = getHsMetadata<Rarity>("rarities");
  const minionTypes = getHsMetadata<MinionTypes>("minionTypes");
  const keywords = getHsMetadata<Keyword>("keywords");
  const cardType = getHsMetadata<CardType>("types");
  const cards = searchHsCards({
    class: [currentDeckClass, "neutral"],
    set: currentDeckFormat,
    page: 1,
    multiClass: currentDeckClass,
  });

  const hsData = await Promise.all([
    cards,
    rarities,
    minionTypes,
    keywords,
    cardType,
  ]);

  return (
    <DeckBuilder
      initialCards={hsData[0]}
      rarities={hsData[1]}
      minionTypes={hsData[2]}
      keywords={hsData[3]}
      cardTypes={hsData[4]}
      deck={currentDeck}
      deckClass={currentDeckClass}
      format={currentDeckFormat}
    />
  );
}
