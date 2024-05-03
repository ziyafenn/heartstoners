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
  params: { deckClass: CardClass };
  searchParams: { format: SetGroups["slug"]; mode: CardGameMode };
}) {
  const { deckClass } = params;
  const { format, mode } = searchParams;
  const cards = searchHsCards({
    deckClass: params.deckClass,
    gameMode: mode,
    set: format,
  });

  const rarities = getHsRarities();
  const minionTypes = getHsMinionTypes();

  const hsData = await Promise.all([cards, rarities, minionTypes]);

  return (
    <div>
      <DeckBuilder
        deckClass={deckClass}
        cards={hsData[0].cards}
        rarities={hsData[1]}
        minionTypes={hsData[2]}
      />
    </div>
  );
}
