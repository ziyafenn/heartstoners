import { cardViewerProps } from "@/lib/cardViewerProps";
import { Card } from "@/types/hs.type";
import Image from "next/image";

type Props = {
  children: React.ReactNode;
  cards: Card[];
  cardViewerProps: (card: Card) => ReturnType<typeof cardViewerProps>;
};

export function CardSearchResult({ cards, children, cardViewerProps }: Props) {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 grid grid-cols-auto-fill-hscard">
        {cards.map((card) => {
          const { name, id, image } = card;
          const { currentCardCount, isDisabled, onAddCard } =
            cardViewerProps(card);

          return (
            <div
              className={currentCardCount ? "bg-red-600" : "bg-transparent"}
              key={id}
            >
              <div>{currentCardCount}</div>
              <button
                onClick={() => onAddCard(card)}
                disabled={isDisabled}
                type="button"
              >
                <Image
                  className="drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]"
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
