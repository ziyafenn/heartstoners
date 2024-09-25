import { AssetIcon } from "@/components/AssetIcon";
import { CardCrop } from "@/components/CardCrop";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { findData, showSelectedCard, toCapital } from "@/lib/utils";
import type {
  Card,
  CardClass,
  Rune,
  RuneCost,
  SideboardCards,
} from "@/types/hs.type";
import type { Enums } from "@/types/supabase.type";
import { ArrowLeftRight } from "lucide-react";
import Image from "next/image";
import { type RefObject, useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  selectedCards: Card[] | undefined;
  toggleSideboard: (card: Card | null) => void;
  removeCard: (card: Card) => void;
  sideboardCards: SideboardCards[];
  deckClass: CardClass["slug"];
  deathKnightRuneSlots: RuneCost;
  updateFilters: (formData: FormData) => void;
  filteFormRef: RefObject<HTMLFormElement>;
};

export function CurrentDeck({
  children,
  selectedCards,
  toggleSideboard,
  removeCard,
  sideboardCards,
  deckClass: deckClassSlug,
  deathKnightRuneSlots,
  filteFormRef,
  updateFilters,
}: Props) {
  const [availHeight, setAvailHeight] = useState<number | string>("100vh");
  const [cardListMaxHeight, setCardListMaxHeight] = useState(0);
  const [format, setFormat] = useState<Enums<"deck_format">>("standard");
  const endOfListRef = useRef<HTMLLIElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const deckClass = findData(CARD_CLASSES, "slug", deckClassSlug);

  function showRunes() {
    const runes: Rune[] = [];

    for (const [key, value] of Object.entries(deathKnightRuneSlots)) {
      runes.push(...Array.from({ length: value }, () => key as Rune));
    }

    return runes;
  }

  function switchFormat(format: Enums<"deck_format">) {
    const filterForm = filteFormRef.current;
    if (!filterForm) return;

    const formData = new FormData(filterForm);

    setFormat(format);
    formData.set("set", format);
    updateFilters(formData);

    const url = new URL(window.location.href);
    url.searchParams.set("format", format);
    window.history.replaceState({}, "", url);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
  }, []);

  return (
    <aside className="mt-6">
      <div
        className="sticky top-40 flex flex-col overflow-hidden rounded-md border-4 border-border shadow-lg"
        style={{ maxHeight: availHeight }}
      >
        <div className="relative">
          <div className="absolute size-full bg-black/50" />
          <div className="absolute flex size-full items-center justify-between pr-2 pl-3">
            <div className="flex flex-col">
              <span className="font-bold font-hs font-outline-2 text-xl leading-tight drop-shadow-md">
                {deckClass.name}
              </span>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    className="flex h-auto items-baseline p-0 font-outline-2 text-xs text-yellow-400"
                  >
                    Standard
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Switch to Wild Format</TooltipContent>
              </Tooltip>
            </div>
            {deckClassSlug === "deathknight" && (
              <div className="flex min-w-32 items-center justify-end">
                {showRunes().map((rune, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <AssetIcon type="rune" name={rune} key={index} />
                ))}
              </div>
            )}
          </div>
          <Image
            src={`/heroes/${deckClass.slug}.jpg`}
            width={1440}
            height={1440}
            className="h-16 object-cover object-[0px,-64px]"
            alt={deckClass.name}
          />
        </div>

        <ScrollArea ref={scrollAreaRef} className="bg-black/20 py-3 ">
          <ul
            className="flex flex-col gap-1 px-3"
            style={{
              height: cardListMaxHeight,
            }}
          >
            {selectedCards?.length ? (
              showSelectedCard(selectedCards).map((card, index) => {
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
                    isView={false}
                  />
                );
              })
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="flex gap-2"
                  onClick={() =>
                    switchFormat(format === "standard" ? "wild" : "standard")
                  }
                >
                  <ArrowLeftRight className="size-4" />
                  Switch to {format === "standard" ? "Wild" : "Standard"} Format
                </Button>
              </div>
            )}
          </ul>
        </ScrollArea>

        {children}
      </div>
    </aside>
  );
}
