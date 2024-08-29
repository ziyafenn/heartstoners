import { DeckBuilder } from "@/components/deckbuilder/DeckBuilder";
import {
  searchHsCards,
  getHsMetadata,
  getDeckByCode,
} from "@/service/hs.service";
import {
  CardType,
  Deck,
  Keyword,
  MinionTypes,
  Rarity,
  SetGroups,
} from "@/types/hs.type";
import { CardClass } from "blizzard.js/dist/resources/hs";

export default async function ClassDeckBuilder({
  params,
  searchParams,
}: {
  params: { format: SetGroups["slug"] };
  searchParams: { deckClass: CardClass; deckCode?: string };
}) {
  const { format } = params;
  const { deckClass, deckCode } = searchParams;
  let currentDeck: Promise<Deck> | null = null;

  if (deckCode) currentDeck = getDeckByCode(deckCode);

  const cards = searchHsCards({
    class: [deckClass, "neutral"],
    set: format,
    page: 1,
    multiClass: deckClass,
  });
  const rarities = getHsMetadata<Rarity>("rarities");
  const minionTypes = getHsMetadata<MinionTypes>("minionTypes");
  const keywords = getHsMetadata<Keyword>("keywords");
  const cardType = getHsMetadata<CardType>("types");

  const hsData = await Promise.all([
    cards,
    rarities,
    minionTypes,
    keywords,
    cardType,
    currentDeck,
  ]);

  return (
    <DeckBuilder
      initialCards={hsData[0]}
      rarities={hsData[1]}
      minionTypes={hsData[2]}
      keywords={hsData[3]}
      cardTypes={hsData[4]}
      deck={hsData[5]}
    />
  );
}
