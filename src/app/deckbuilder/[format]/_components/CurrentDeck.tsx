import {
  Card,
  CardClass,
  Rune,
  RuneCost,
  SideboardCards,
} from "@/types/hs.type";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MinusIcon, XIcon } from "lucide-react";
import { CardCrop } from "@/components/CardCrop";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { AssetIcon } from "@/components/AssetIcon";

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
  const [hovered, setHovered] = useState<number | null>(null);
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
      const BOTTOM_PADDING = 64;
      const scrollArea = scrollAreaRef.current.getBoundingClientRect();
      const maxHeight = innerHeight - scrollArea.top - BOTTOM_PADDING;

      setCardListMaxHeight(maxHeight);
    }

    setAvailHeight(height);
  }, [scrollAreaRef]);

  return (
    <aside>
      <div
        className="sticky top-20 flex flex-col gap-4"
        style={{ maxHeight: availHeight }}
      >
        {/* {!selectedCardsCount && (
          <form onSubmit={getDeckFromCode}>
            <Input name="deckCode" />
            <Button>Paste</Button>
          </form>
        )} */}
        <div>{cardClass.name}</div>
        {deckClass === "deathknight" && (
          <div className="flex h-16 items-center justify-center bg-red-50">
            {showRunes().map((rune, index) => (
              <AssetIcon type="rune" name={rune} key={index} />
            ))}
          </div>
        )}
        <ScrollArea ref={scrollAreaRef}>
          <ul
            className="flex flex-col gap-1 pr-3"
            style={{
              maxHeight: cardListMaxHeight,
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
                <li
                  key={card.id}
                  className={cn(
                    "flex justify-end rounded-sm min-h-10 relative select-none",
                    card.maxSideboardCards && "min-h-12",
                  )}
                  onMouseEnter={() => setHovered(card.id)}
                  onMouseLeave={() => setHovered(null)}
                  ref={isLastItem ? endOfListRef : null}
                >
                  {card.maxSideboardCards && (
                    <div className="absolute bottom-0 z-20 flex w-full justify-center">
                      <Button
                        size="sm"
                        className="h-4"
                        onClick={() => toggleSideboard(card)}
                      >
                        OPEN {`${cardsInSideboard}/3`}
                      </Button>
                    </div>
                  )}
                  <CardCrop card={card}>
                    {hovered === card.id ? (
                      <button onClick={() => removeCard(card)}>
                        {count === 2 ? (
                          <MinusIcon className="size-4" />
                        ) : (
                          <XIcon className="size-4" />
                        )}
                      </button>
                    ) : (
                      count
                    )}
                  </CardCrop>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
        {children}
      </div>
    </aside>
  );
}
