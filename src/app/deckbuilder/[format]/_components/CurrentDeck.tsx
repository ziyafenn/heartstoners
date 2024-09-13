import {
  Card,
  CardClass,
  Rune,
  RuneCost,
  SideboardCards,
} from "@/types/hs.type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { CardCrop } from "@/components/CardCrop";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { AssetIcon } from "@/components/AssetIcon";
import Image from "next/image";

type Props = {
  children: React.ReactNode;
  selectedCards: Card[] | undefined;
  toggleSideboard: (card: Card | null) => void;
  removeCard: (card: Card) => void;
  sideboardCards: SideboardCards[];
  deckClass: CardClass["slug"];
  deathKnightRuneSlots: RuneCost;
};

export function CurrentDeck({
  children,
  selectedCards,
  toggleSideboard,
  removeCard,
  sideboardCards,
  deckClass,
  deathKnightRuneSlots,
}: Props) {
  const [availHeight, setAvailHeight] = useState<number | string>("100vh");
  const [cardListMaxHeight, setCardListMaxHeight] = useState(0);
  const endOfListRef = useRef<HTMLLIElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const cardClass = CARD_CLASSES.find(
    (cardClass) => cardClass.slug === deckClass,
  )!;

  function showSelectedCard(cardsToShow: Card[] | undefined) {
    if (!cardsToShow) return [];
    const seen = new Set();
    const uniqueCards = cardsToShow?.filter((el) => {
      const duplicate = seen.has(el.id);
      seen.add(el.id);
      return !duplicate;
    });
    return uniqueCards;
  }
  // const selectedCardsCount = selectedCards?.length ?? 0;

  function showRunes() {
    const runes: Rune[] = [];

    for (const [key, value] of Object.entries(deathKnightRuneSlots)) {
      runes.push(...Array.from({ length: value }, () => key as Rune));
    }

    return runes;
  }

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    const lastItem = endOfListRef.current;

    if (scrollArea && lastItem) {
      scrollArea.scrollTo({ top: lastItem.offsetTop, behavior: "smooth" });
    }
  }, [selectedCards]);

  useEffect(() => {
    const innerHeight = window.innerHeight;
    const main = document.getElementsByTagName("main")[0];

    const rect = main.getBoundingClientRect();
    const position = {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
    };
    const height = innerHeight - position.y;

    if (scrollAreaRef.current) {
      const BOTTOM_PADDING = 80;
      const scrollArea = scrollAreaRef.current.getBoundingClientRect();
      const maxHeight = innerHeight - scrollArea.top - BOTTOM_PADDING;

      setCardListMaxHeight(maxHeight);
    }

    setAvailHeight(height);
  }, [scrollAreaRef]);

  return (
    <aside className="mt-6">
      <div
        className="sticky top-40 flex flex-col overflow-hidden rounded-md border-4 border-border shadow-lg"
        style={{ maxHeight: availHeight }}
      >
        {/* {!selectedCardsCount && (
          <form onSubmit={getDeckFromCode}>
            <Input name="deckCode" />
            <Button>Paste</Button>
          </form>
        )} */}
        <div className="relative text-xl font-bold">
          <div className="absolute size-full bg-black/50" />
          <div className="absolute flex size-full items-center justify-between pl-3 pr-2">
            <span className="font-outline-2 font-hs leading-tight drop-shadow-md">
              {cardClass.name}
            </span>
            {deckClass === "deathknight" && (
              <div className="flex min-w-32 items-center justify-end">
                {showRunes().map((rune, index) => (
                  <AssetIcon type="rune" name={rune} key={index} />
                ))}
              </div>
            )}
          </div>
          <Image
            src={`/heroes/${cardClass.slug}.jpg`}
            width={1440}
            height={1440}
            className="h-16 object-cover object-[0px,-64px]"
            alt={cardClass.name}
          />
        </div>
        <ScrollArea ref={scrollAreaRef} className="bg-black/20 py-3 ">
          <ul
            className="flex flex-col gap-1 px-3"
            style={{
              height: cardListMaxHeight,
            }}
          >
            {showSelectedCard(selectedCards).map((card, index) => {
              const count =
                selectedCards?.filter(
                  (selectedCard) => selectedCard.id === card.id,
                ).length ?? 0;
              const isLastItem =
                index === showSelectedCard(selectedCards).length - 1;
              const cardsInSideboard =
                sideboardCards.find(
                  (sideboard) => sideboard.sideboardCard.id === card.id,
                )?.cardsInSideboard.length ?? 0;
              return (
                <CardCrop
                  ref={isLastItem ? endOfListRef : null}
                  card={card}
                  count={count}
                  onRemove={removeCard}
                  onSideboardClick={() => toggleSideboard(card)}
                  cardsInSideboard={cardsInSideboard}
                  key={card.id}
                />
              );
            })}
          </ul>
        </ScrollArea>
        {children}
      </div>
    </aside>
  );
}
