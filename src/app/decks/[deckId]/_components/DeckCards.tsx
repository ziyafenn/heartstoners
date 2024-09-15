import { CardCrop } from "@/components/CardCrop";
import { DeckManaChart } from "@/components/DeckManaChart";
import type { Card, Deck, SideboardCards } from "@/types/hs.type";
import Image from "next/image";

type Props = {
  deckClass: Deck["class"];
  cards: Card[];
  sideboardCards: SideboardCards[] | undefined;
};

function showSelectedCard(cardsToShow: Card[] | undefined) {
  if (!cardsToShow) return [];
  const seen = new Set();
  const uniqueCards = cardsToShow?.filter((el) => {
    const duplicate = seen.has(el.id);
    seen.add(el.id);
    return !duplicate;
  });
  return uniqueCards.sort((a, b) => a.manaCost - b.manaCost);
}

// function showRunes() {
//   const runes: Rune[] = [];

//   for (const [key, value] of Object.entries(deathKnightRuneSlots)) {
//     runes.push(...Array.from({ length: value }, () => key as Rune));
//   }

//   return runes;
// }

export function DeckCards({ deckClass, cards, sideboardCards }: Props) {
  return (
    <aside className="grid grid-cols-2 gap-4">
      <div className="flex h-max w-[320px] flex-col rounded-md border-4 border-border shadow-lg">
        <div className="relative text-xl font-bold">
          <div className="absolute size-full bg-black/50" />
          <div className="absolute flex size-full items-center justify-between pl-3 pr-2">
            <span className="font-outline-2 font-hs leading-tight drop-shadow-md">
              {deckClass.name}
            </span>
            {/* {deckClassSlug === "deathknight" && (
                <div className="flex min-w-32 items-center justify-end">
                  {showRunes().map((rune, index) => (
                    <AssetIcon type="rune" name={rune} key={index} />
                  ))}
                </div>
              )} */}
          </div>
          <Image
            src={`/heroes/${deckClass.slug}.jpg`}
            width={1440}
            height={1440}
            className="h-16 object-cover object-[0px,-64px]"
            alt={deckClass.name}
          />
        </div>
        <ul className="flex flex-col gap-1 bg-black/20 p-3">
          {showSelectedCard(cards).map((card) => {
            const count =
              cards?.filter((selectedCard) => selectedCard.id === card.id)
                .length ?? 0;
            return <CardCrop card={card} count={count} key={card.id} isView />;
          })}
        </ul>
      </div>
      <div className="flex w-[320px] flex-col gap-4">
        {sideboardCards?.map((sideboard) => (
          <div
            key={sideboard.sideboardCard.id}
            className="flex w-[320px] flex-col rounded-md border-4 border-border shadow-lg"
          >
            <div className="relative text-lg font-bold">
              <div className="absolute size-full bg-gradient-to-r from-black from-30% via-transparent via-70%" />
              <div className="absolute flex size-full items-center justify-between pl-3 pr-2">
                <span className="font-outline-2 font-hs leading-tight drop-shadow-md">
                  {sideboard.sideboardCard.name}
                </span>
              </div>
              <Image
                src={
                  sideboard.sideboardCard.cropImage ??
                  sideboard.sideboardCard.image
                }
                width={243}
                height={64}
                className="h-12 w-full object-cover"
                alt={deckClass.name}
              />
            </div>
            <ul className="flex flex-col gap-1 bg-black/20 p-3">
              {sideboard.cardsInSideboard
                .sort((a, b) => a.manaCost - b.manaCost)
                .map((card) => (
                  <CardCrop card={card} key={card.id} count={1} isView />
                ))}
            </ul>
          </div>
        ))}
        <DeckManaChart selectedCards={cards} />
      </div>
    </aside>
  );
}
