"use client";

import Image from "next/image";
import { useState } from "react";
import { DeckBuilderFilter } from "./DeckBuildFilter";
import { useFormState } from "react-dom";
import { submitFilter } from "@/actions/deckBuider.action";
import { Button } from "./ui/button";
import DeckBuilderForm from "./DeckBuilderForm";
import { Card, MinionTypes, Rarity } from "@/types/hs.type";
import { getDustCost } from "@/lib/utils";
import { DeckGeneratedData } from "@/types/deck.type";
import { CardClass } from "blizzard.js/dist/resources/hs";

type SelectedCards = Map<number, { count: number } & Card>;

export function DeckBuilder({
  cards,
  minionTypes,
  rarities,
  deckClass,
}: {
  deckClass: CardClass;
  cards: Card[];
  minionTypes: MinionTypes[];
  rarities: Rarity[];
}) {
  const [selectedCards, setSelectedCards] = useState<SelectedCards>(
    () => new Map(),
  );
  const [state, formAction] = useFormState(submitFilter, cards);

  function onAddCard(card: Card) {
    const mapCopy = new Map(selectedCards);
    const addedCard = mapCopy.get(card.id);

    if (addedCard?.count === 2) return null;

    if (!addedCard) mapCopy.set(card.id, { count: 1, ...card });
    else addedCard.count = (addedCard.count || 0) + 1;

    setSelectedCards(mapCopy);
  }

  const deckData: DeckGeneratedData = {
    cardIds: Array.from(selectedCards.values())
      .map((card) => Array(card.count).fill(card.id))
      .flat(),
    dustCost: Array.from(selectedCards.values()).reduce(
      (total, card) => total + getDustCost(card.rarityId) * card.count,
      0,
    ),
    archetype: "aggro",
    deckClass: deckClass,
    deckFormat: "standard",
    gameMode: "constructed",
    gameVersion: "29.2.2",
    mainCardIds: [],
  };

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1">
        <DeckBuilderFilter
          action={formAction}
          rarities={rarities}
          minionTypes={minionTypes}
        />
        <div className="flex-1 grid grid-cols-auto-fill-hscard">
          {state.map((card) => {
            if (card.parentId) return null;
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
      </div>
      <aside className="w-80">
        <ul>
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
        <DeckBuilderForm deckData={deckData}>
          <Button>Create Deck</Button>
        </DeckBuilderForm>
      </aside>
    </div>
  );
}
