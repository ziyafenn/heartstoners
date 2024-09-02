"use client";
import { copyDeck, likeDeck } from "@/actions/deck.action";
import { CardCrop } from "@/components/CardCrop";
import { Button } from "@/components/ui/button";
import { Card, Deck } from "@/types/hs.type";
import { DeckPopularity } from "@/components/DeckPopularity";
import { UserDecks } from "@/types/deck.type";

export function UserDeck({
  userDeck,
  deckData,
  didUserLike,
}: {
  userDeck: UserDecks[number];
  deckData: Deck;
  didUserLike: boolean;
}) {
  const {
    cards,
    class: deckClass,
    sideboardCards,
    deckCode,
    format,
  } = deckData;
  const { user_id, id } = userDeck;

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
  return (
    <>
      <div>
        <ul>
          {showSelectedCard(deckData.cards)
            .sort((a, b) => a.manaCost - b.manaCost)
            .map((card) => {
              const count =
                cards?.filter((selectedCard) => selectedCard.id === card.id)
                  .length ?? 0;
              return (
                <li key={card.id} className="relative">
                  <CardCrop card={card}>{count}</CardCrop>
                </li>
              );
            })}
        </ul>
        {sideboardCards &&
          sideboardCards.map((sideboard) => (
            <div key={sideboard.sideboardCard.id}>
              <h3>{sideboard.sideboardCard.name}</h3>
              <ul>
                {sideboard.cardsInSideboard
                  .sort((a, b) => a.manaCost - b.manaCost)
                  .map((card) => (
                    <li key={card.id} className="relative">
                      <CardCrop card={card}>1</CardCrop>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </div>
      <div>
        <Button
          disabled={didUserLike}
          onClick={() =>
            likeDeck({
              author_id: user_id,
              deck_id: id,
            })
          }
        >
          Like
        </Button>

        <Button onClick={() => copyDeck(id)}>Copy</Button>
      </div>
      <div>
        <DeckPopularity deck={userDeck} />
      </div>
    </>
  );
}
