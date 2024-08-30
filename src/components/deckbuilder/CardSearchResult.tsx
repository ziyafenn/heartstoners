import { cardViewerProps } from "@/lib/cardViewerProps";

import type { Card } from "@/types/hs.type";
import { HsCard } from "./HsCard";

type Props = {
  children: React.ReactNode;
  cards: Card[];
  cardViewerProps: (card: Card) => ReturnType<typeof cardViewerProps>;
};

export function CardSearchResult({ cards, children, cardViewerProps }: Props) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="grid grid-cols-auto-fill-hscard">
        {cards.map((card) => {
          const { name, id, image } = card;
          const { currentCardCount, isDisabled, onAddCard } =
            cardViewerProps(card);
          return (
            <HsCard
              key={id}
              currentCount={currentCardCount}
              image={image}
              name={name}
              isDisabled={isDisabled}
              onAddCard={() => onAddCard(card)}
            />
          );
        })}
      </div>
      {children}
    </div>
  );
}
