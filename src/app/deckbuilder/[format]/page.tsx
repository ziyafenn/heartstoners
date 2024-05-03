import { DeckBuilder } from "@/components/DeckBuilder";
import {
  searchHsCards,
  getHsMinionTypes,
  getHsRarities,
} from "@/service/hs.service";
import { SetGroups } from "@/types/hs.type";
import { CardClass, CardGameMode } from "blizzard.js/dist/resources/hs";

export default async function ClassDeckBuilder({
  params,
  searchParams,
}: {
  params: { format: SetGroups["slug"] };
  searchParams: { deckClass: CardClass; mode: CardGameMode };
}) {
  const { format } = params;
  const { deckClass } = searchParams;
  const cards = searchHsCards({
    deckClass: deckClass,
    gameMode: "constructed",
    set: format,
    page: 1,
  });

  const rarities = getHsRarities();
  const minionTypes = getHsMinionTypes();

  const hsData = await Promise.all([cards, rarities, minionTypes]);

  return (
    <div>
      <DeckBuilder
        cards={hsData[0]}
        rarities={hsData[1]}
        minionTypes={hsData[2]}
      />
    </div>
  );
}
