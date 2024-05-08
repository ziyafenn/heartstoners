"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { DeckBuilderFilter } from "./DeckBuildFilter";
import { useFormState } from "react-dom";
import { loadPageWithFilters } from "@/actions/deckBuider.action";
import { Button } from "./ui/button";
import DeckBuilderForm from "./DeckBuilderForm";
import { Card, CardsPage, MinionTypes, Rarity } from "@/types/hs.type";
import { CardClass } from "blizzard.js/dist/resources/hs";
import { useParams, useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { Input } from "./ui/input";
import { getDeckByCode } from "@/service/hs.service";

type SelectedCards = Card[];
type SideboardCards = Array<Card & { parentId: number }>;

export function DeckBuilder({
  initialCards,
  minionTypes,
  rarities,
}: {
  initialCards: CardsPage;
  minionTypes: MinionTypes[];
  rarities: Rarity[];
}) {
  const searchParams = useSearchParams();
  const params = useParams<{ format: "standard" | "wild" }>();
  const { format } = params;

  const initState = {
    ...initialCards,
    params: {
      gameMode: searchParams.get("mode") as "constructed",
      set: format,
      class: searchParams.get("class") as CardClass,
    },
  };

  const [selectedCards, setSelectedCards] = useState<SelectedCards>([]);
  const [cardsInSideboard, setCardsInSideboard] = useState<SideboardCards>([]);
  const [sideboardParentCard, setSideboardParentCard] = useState<number | null>(
    null,
  );
  const [cards, formAction] = useFormState(loadPageWithFilters, initState);
  const { ref, inView } = useInView();
  const selectedCardsCount = selectedCards.length;

  function addSideboardCard(card: Card) {
    if (!sideboardParentCard) return null;

    const currentSideboardCards = [...cardsInSideboard];
    currentSideboardCards.push({ ...card, parentId: sideboardParentCard });

    setCardsInSideboard(currentSideboardCards);
  }

  function addCard(card: Card) {
    const currentSelection = [...selectedCards];
    currentSelection.push(card);

    setSelectedCards(currentSelection);
  }

  const loadNextPage = useCallback(async () => {
    console.log("next page params", cards.params);

    const formData = new FormData();
    for (const [key, value] of Object.entries(cards.params)) {
      formData.append(key, value as string);
    }

    formAction(formData);
  }, [cards.params, formAction]);

  async function getDeckFromCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const deckCode = formData.get("deckCode") as string;
    const deck = await getDeckByCode(deckCode);

    setSelectedCards(deck.cards);
  }

  function showSelectedCard() {
    const seen = new Set();
    const uniqueCards = selectedCards.filter((el) => {
      const duplicate = seen.has(el.id);
      seen.add(el.id);
      return !duplicate;
    });
    return uniqueCards;
  }
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
            const { bannedFromSideboard, id, name, image, rarityId } = card;
            const sideboardCardCount = cardsInSideboard.filter(
              (card) => card.id === id,
            ).length;
            const cardCount = selectedCards.filter(
              (card) => card.id === id,
            ).length;
            const currentCardCount = sideboardParentCard
              ? sideboardCardCount
              : cardCount;
            const onAddCard = sideboardParentCard ? addSideboardCard : addCard;
            const legendaryLimit = rarityId === 5 && currentCardCount === 1;
            const nonLegendaryLimit = rarityId !== 5 && currentCardCount === 2;
            const sidebarCardsCount = cardsInSideboard.filter(
              (card) => card.parentId === sideboardParentCard,
            ).length;
            const isTotalCardCountReached = sideboardParentCard
              ? sidebarCardsCount === 3
              : selectedCardsCount === 30;
            const isUnavailableForSideboard =
              !!sideboardParentCard && !!bannedFromSideboard;

            return (
              <div
                className={currentCardCount ? "bg-red-600" : "bg-transparent"}
                key={id}
              >
                <div>{currentCardCount}</div>
                <button
                  onClick={() => onAddCard(card)}
                  disabled={
                    isTotalCardCountReached ||
                    legendaryLimit ||
                    nonLegendaryLimit ||
                    isUnavailableForSideboard
                  }
                  type="button"
                >
                  <Image
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
        <div ref={ref}>loading</div>
      </div>
      <div>
        <aside className="w-80 sticky top-0">
          {!selectedCardsCount && (
            <form onSubmit={getDeckFromCode}>
              <Input name="deckCode" />
              <Button>Paste</Button>
            </form>
          )}
          {selectedCardsCount && !sideboardParentCard && (
            <ul className="max-h-[90vh] overflow-auto">
              {showSelectedCard().map((card) => {
                const count = selectedCards.filter(
                  (selectedCard) => selectedCard.id === card.id,
                ).length;
                return (
                  <li key={card.id}>
                    <div>{count}</div>
                    {card.maxSideboardCards && (
                      <Button onClick={() => setSideboardParentCard(card.id)}>
                        Open
                      </Button>
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
          {sideboardParentCard && (
            <div>
              sideboard parent active!
              <Button onClick={() => setSideboardParentCard(null)}>
                Close
              </Button>
            </div>
          )}
          <DeckBuilderForm
            selectedCards={selectedCards}
            deckSearchParams={cards.params}
          >
            <Button disabled={selectedCardsCount < 30}>Create Deck</Button>
          </DeckBuilderForm>
        </aside>
      </div>
    </div>
  );
}
