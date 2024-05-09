import { Card } from "@/types/hs.type";
import Image from "next/image";
import { Button } from "../ui/button";

type Props = {
  children: React.ReactNode;
  selectedCards: Card[];
  currentCardsInSideboard: Card[] | undefined;
  toggleSideboard: (card: Card | null) => void;
  activeSideboardCard: Card | null;
};

export function CurrentDeck({
  children,
  activeSideboardCard,
  currentCardsInSideboard,
  selectedCards,
  toggleSideboard,
}: Props) {
  function showSelectedCard(cardsToShow: Card[]) {
    const seen = new Set();
    const uniqueCards = cardsToShow?.filter((el) => {
      const duplicate = seen.has(el.id);
      seen.add(el.id);
      return !duplicate;
    });
    return uniqueCards;
  }
  const selectedCardsCount = selectedCards.length;

  return (
    <div>
      <aside className="w-80 sticky top-0">
        {/* {!selectedCardsCount && (
          <form onSubmit={getDeckFromCode}>
            <Input name="deckCode" />
            <Button>Paste</Button>
          </form>
        )} */}
        {selectedCardsCount && !activeSideboardCard && (
          <ul className="max-h-[90vh] overflow-auto">
            {showSelectedCard(selectedCards).map((card) => {
              const count = selectedCards.filter(
                (selectedCard) => selectedCard.id === card.id,
              ).length;
              return (
                <li key={card.id}>
                  <div>{count}</div>
                  {card.maxSideboardCards && (
                    <Button onClick={() => toggleSideboard(card)}>Open</Button>
                  )}
                  <Image
                    src={card.cropImage!}
                    width={243}
                    height={64}
                    alt={card.name}
                  />
                </li>
              );
            })}
          </ul>
        )}
        {activeSideboardCard && (
          <div>
            <Button onClick={() => toggleSideboard(null)}>Close</Button>
            {currentCardsInSideboard && (
              <ul>
                {showSelectedCard(currentCardsInSideboard).map((card) => (
                  <Image
                    key={card.id}
                    src={card.cropImage!}
                    width={243}
                    height={64}
                    alt={card.name}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
        {children}
      </aside>
    </div>
  );
}
