"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DeckBuilderFilter } from "./DeckBuildFilter";
import { useFormState } from "react-dom";
import { loadPageWithFilters } from "@/actions/deckBuider.action";
import { Button } from "./ui/button";
import DeckBuilderForm from "./DeckBuilderForm";
import {
  Card,
  CardsPage,
  MinionTypes,
  Rarity,
  SetGroups,
} from "@/types/hs.type";
import { DeckType } from "@/types/deck.type";
import { CardClass } from "blizzard.js/dist/resources/hs";
import { useParams, useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";

type SelectedCards = Map<number, { count: number } & Card>;

export function DeckBuilder({
  cards: initialCards,
  minionTypes,
  rarities,
}: {
  cards: CardsPage;
  minionTypes: MinionTypes[];
  rarities: Rarity[];
}) {
  const [selectedCards, setSelectedCards] = useState<SelectedCards>(
    () => new Map(),
  );
  const [cards, formAction] = useFormState(loadPageWithFilters, initialCards);
  const { ref, inView } = useInView();

  function onAddCard(card: Card) {
    const currentSelection = new Map(selectedCards);
    const addedCard = currentSelection.get(card.id);

    if (!addedCard) currentSelection.set(card.id, { count: 1, ...card });
    else if (addedCard.count === 2) return null;
    else addedCard.count = addedCard.count + 1;

    setSelectedCards(currentSelection);
  }

  const searchParams = useSearchParams();
  const params = useParams<{ format: string }>();
  const { format } = params;
  const deckType: DeckType = useMemo(
    () => ({
      deckClass: searchParams.get("class") as CardClass,
      deckFormat: format as SetGroups["slug"],
      gameMode: searchParams.get("mode") as "constructed",
    }),
    [format, searchParams],
  );

  const loadNextPage = useCallback(async () => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(deckType)) {
      formData.append(key, value!);
    }

    formAction(formData);
  }, [deckType, formAction]);

  useEffect(() => {
    if (inView) loadNextPage();
  }, [inView]);

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1">
        <DeckBuilderFilter
          action={formAction}
          rarities={rarities}
          minionTypes={minionTypes}
        />
        <div className="flex-1 grid grid-cols-auto-fill-hscard">
          {cards.cards.map((card) => {
            const currentCardCount = selectedCards.get(card.id)?.count;
            return (
              <div
                className={currentCardCount ? "bg-red-600" : "bg-transparent"}
                key={card.id}
              >
                <div>{currentCardCount}</div>
                <Image
                  alt={card.name}
                  src={card.image}
                  height={530}
                  width={384}
                  key={card.id}
                  onClick={() => onAddCard(card)}
                />
              </div>
            );
          })}
        </div>
        <div ref={ref}>loading</div>
      </div>
      <div>
        <aside className="w-80 sticky top-0">
          <ul className="max-h-[90vh] overflow-auto">
            {Array.from(selectedCards.values()).map((card) => (
              <li key={card.id}>
                <div>{card.count}</div>
                <Image
                  src={card.cropImage!}
                  width={243}
                  height={64}
                  alt={card.name}
                />
              </li>
            ))}
          </ul>
          <DeckBuilderForm selectedCards={selectedCards} deckType={deckType}>
            <Button>Create Deck</Button>
          </DeckBuilderForm>
        </aside>
      </div>
    </div>
  );
}
