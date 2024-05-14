import { Card, SideboardCards } from "@/types/hs.type";
import Image from "next/image";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MinusIcon, XIcon } from "lucide-react";

type Props = {
  children: React.ReactNode;
  selectedCards: Card[] | undefined;
  toggleSideboard: (card: Card | null) => void;
  removeCard: (cardId: number) => void;
  sideboardCards: SideboardCards[];
};

export function CurrentDeck({
  children,
  selectedCards,
  toggleSideboard,
  removeCard,
  sideboardCards,
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const endOfListRef = useRef<HTMLLIElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
  const selectedCardsCount = selectedCards?.length ?? 0;

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    const lastItem = endOfListRef.current;

    if (scrollArea && lastItem) {
      scrollArea.scrollTo({ top: lastItem.offsetTop, behavior: "smooth" });
    }
  }, [selectedCards]);

  return (
    <aside>
      <div className="sticky top-0 flex flex-col gap-4 pt-8">
        {/* {!selectedCardsCount && (
          <form onSubmit={getDeckFromCode}>
            <Input name="deckCode" />
            <Button>Paste</Button>
          </form>
        )} */}

        <ScrollArea ref={scrollAreaRef}>
          <ul className="flex max-h-[86vh] flex-col gap-1 pr-3">
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
                  <div className="absolute z-10 flex h-10 w-full items-center justify-between bg-gradient-to-r from-black from-30% via-transparent via-70%">
                    <div className="flex items-center gap-2">
                      <div className="font-outline-2 flex size-8 items-center justify-center bg-[url(/assets/mana.png)] bg-contain bg-no-repeat text-center text-[16px]">
                        {card.manaCost}
                      </div>
                      <span className="font-outline-2 w-4/5 leading-none">
                        {card.name}
                      </span>
                    </div>
                    <div className="flex size-8 w-4 items-center justify-center rounded-l-lg bg-black/80 pl-1 text-center text-[gold]">
                      {hovered === card.id ? (
                        <button onClick={() => removeCard(card.id)}>
                          {count === 2 ? (
                            <MinusIcon className="size-4" />
                          ) : (
                            <XIcon className="size-4" />
                          )}
                        </button>
                      ) : (
                        count
                      )}
                    </div>
                  </div>
                  <div className="h-10 overflow-hidden">
                    {card.cropImage ? (
                      <Image
                        className="h-14 object-contain object-right"
                        src={card.cropImage}
                        width={243}
                        height={64}
                        alt={card.name}
                      />
                    ) : (
                      <Image
                        className="scale-[1.6] object-contain object-[38px_0px]"
                        src={card.image}
                        width={530}
                        height={384}
                        alt={card.name}
                      />
                    )}
                  </div>
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
