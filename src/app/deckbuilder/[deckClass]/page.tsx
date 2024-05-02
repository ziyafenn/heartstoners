import { DeckBuilder } from "@/components/DeckBuilder";
import {
  searchHsCards,
  getHsMinionTypes,
  getHsRarities,
} from "@/service/hs.service";
import { CardClass } from "blizzard.js/dist/resources/hs";

export default async function ClassDeckBuilder({
  params,
}: {
  params: { deckClass: CardClass };
}) {
  const cards = searchHsCards({
    deckClass: params.deckClass,
  });

  const rarities = getHsRarities();
  const minionTypes = getHsMinionTypes();

  const hsData = await Promise.all([cards, rarities, minionTypes]);

  return (
    <div>
      <DeckBuilder
        deckClass={params.deckClass}
        cards={hsData[0].cards}
        rarities={hsData[1]}
        minionTypes={hsData[2]}
      />
    </div>
  );
}
