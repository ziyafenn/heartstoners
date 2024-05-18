import { DeckBuilder } from "@/components/deckbuilder/DeckBuilder";
import { searchHsCards, getHsMetadata } from "@/service/hs.service";
import {
  CardType,
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
  searchParams: { deckClass: CardClass };
}) {
  const { format } = params;
  const { deckClass } = searchParams;

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
  ]);

  return (
    <DeckBuilder
      initialCards={hsData[0]}
      rarities={hsData[1]}
      minionTypes={hsData[2]}
      keywords={hsData[3]}
      cardTypes={hsData[4]}
    />
  );
}
