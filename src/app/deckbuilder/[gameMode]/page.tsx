import { DeckBuilder } from "@/components/deckbuilder/DeckBuilder";
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
  params: { gameMode: CardGameMode };
  searchParams: { deckClass: CardClass; format: SetGroups["slug"] };
}) {
  const { gameMode } = params;
  const { deckClass, format } = searchParams;

  const cards = searchHsCards({
    class: [deckClass, "neutral"],
    gameMode,
    set: format,
    page: 1,
    multiClass: deckClass,
  });

  const rarities = getHsRarities();
  const minionTypes = getHsMinionTypes();

  const hsData = await Promise.all([cards, rarities, minionTypes]);

  return (
    <div>
      <DeckBuilder
        initialCards={hsData[0]}
        rarities={hsData[1]}
        minionTypes={hsData[2]}
      />
    </div>
  );
}
