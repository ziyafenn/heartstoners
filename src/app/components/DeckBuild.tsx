"use client";

import Image from "next/image";
import { useState } from "react";
import { DeckBuilderFilter } from "./DeckBuildFilter";
import { useFormState } from "react-dom";
import { submitFilter } from "@/actions/deckBuider.action";

export function DeckBuilder({
  cards,
  playerData,
  metadata,
}: {
  cards: [];
  playerData: any;
  metadata: {
    classes: [];
    minionTypes: [];
    rarities: [];
  };
}) {
  console.log(cards);

  const [selectedCards, setSelectedCards] = useState([]);
  const [state, formAction] = useFormState(submitFilter, cards);
  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1">
        <DeckBuilderFilter action={formAction} metadata={metadata} />
        <div className="flex-1 grid grid-cols-auto-fill-hscard">
          {state.map((card) => {
            const added = selectedCards.some(
              (selectedCard) => selectedCard.id === card.id
            );
            return (
              <div
                className={added ? "bg-red-600" : "bg-transparent"}
                key={card.id}
              >
                <Image
                  alt={card.name}
                  src={card.image}
                  height={530}
                  width={384}
                  key={card.id}
                  onClick={() => setSelectedCards((state) => [...state, card])}
                />
              </div>
            );
          })}
        </div>
      </div>
      <aside className="w-80">
        <ul>
          {selectedCards.map((cards) => (
            <li key={cards.id}>
              <Image src={cards.cropImage} width={243} height={64} />
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
