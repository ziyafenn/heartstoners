import { cardViewerProps } from "@/lib/cardViewerProps";
import { cn } from "@/lib/utils";
import { Card } from "@/types/hs.type";
import Image from "next/image";

type Props = {
  children: React.ReactNode;
  cards: Card[];
  cardViewerProps: (card: Card) => ReturnType<typeof cardViewerProps>;
};

export function CardSearchResult({ cards, children, cardViewerProps }: Props) {
  return (
    <div className="flex flex-1 flex-col pt-8">
      <div className="grid grid-cols-auto-fill-hscard">
        {cards.map((card) => {
          const { name, id, image } = card;
          const { currentCardCount, isDisabled, onAddCard } =
            cardViewerProps(card);

          return (
            <div key={id}>
              <div>{currentCardCount}</div>
              <button
                onClick={() => onAddCard(card)}
                disabled={isDisabled}
                type="button"
              >
                <Image
                  draggable={false}
                  className={cn("card", currentCardCount && "selected")}
                  alt={name}
                  src={image}
                  height={530}
                  width={384}
                  key={id}
                />
              </button>
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
}
