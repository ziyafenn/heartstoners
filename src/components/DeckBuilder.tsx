"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";
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
  SideboardCards,
} from "@/types/hs.type";
import { CardClass } from "blizzard.js/dist/resources/hs";
import { useParams, useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { Input } from "./ui/input";
import { getDeckByCode, getZilliaxSideboardCards } from "@/service/hs.service";
import { ZILLIAX_ID } from "@/lib/constants";

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

  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [sideboardCards, setSideboardCards] = useState<SideboardCards[]>([]);
  const [sideboardParentCard, setSideboardParentCard] = useState<Card | null>(
    null,
  );
  const [cards, formAction] = useFormState(loadPageWithFilters, initState);
  const [zilliaxCards, setZilliaxCards] = useState<Card[]>([]);
  const { ref, inView } = useInView();
  const selectedCardsCount = selectedCards.length;

  function addSideboardCard(sideboardCard: Card) {
    if (!sideboardParentCard) return null;
    const currentSideboardCards = [...sideboardCards];
    const activeSideboard = currentSideboardCards.find(
      (sideboard) => sideboard.sideboardCard.id === sideboardParentCard.id,
    );

    if (activeSideboard) {
      activeSideboard.cardsInSideboard.push(sideboardCard);
    } else {
      const newSideboard: SideboardCards = {
        sideboardCard: sideboardParentCard,
        cardsInSideboard: [sideboardCard],
      };
      currentSideboardCards.push(newSideboard);
    }

    setSideboardCards(currentSideboardCards);
  }

  function addCard(card: Card) {
    const currentSelection = [...selectedCards];
    currentSelection.push(card);

    setSelectedCards(currentSelection);
  }

  const loadNextPage = useCallback(async () => {
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
    if (deck.sideboardCards) setSideboardCards(deck.sideboardCards);
    setSelectedCards(deck.cards);
  }

  function showSelectedCard(cardsToShow: Card[]) {
    const seen = new Set();
    const uniqueCards = cardsToShow?.filter((el) => {
      const duplicate = seen.has(el.id);
      seen.add(el.id);
      return !duplicate;
    });
    return uniqueCards;
  }

  async function onOpenSideboard(card: Card) {
    if (card.id === ZILLIAX_ID && !zilliaxCards.length) {
      const { cosmeticCards, functionalCards } =
        await getZilliaxSideboardCards();

      setZilliaxCards([...cosmeticCards, ...functionalCards]);
    }
    setSideboardParentCard(card);
  }

  const currentSideboard = sideboardCards.find(
    (sideboard) => sideboard.sideboardCard.id === sideboardParentCard?.id,
  );
  const currentCardsInSideboard =
    currentSideboard && currentSideboard.cardsInSideboard;

  useEffect(() => {
    if (inView) loadNextPage();
  }, [inView]);

  return (
    <div className="flex flex-1">
      {sideboardParentCard?.id === ZILLIAX_ID ? (
        <div className="flex-1 grid grid-cols-auto-fill-hscard">
          {zilliaxCards.map((card) => (
            <div key={card.id}>{card.name}</div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          <DeckBuilderFilter
            action={formAction}
            rarities={rarities}
            minionTypes={minionTypes}
          />
          <div className="flex-1 grid grid-cols-auto-fill-hscard">
            {cards.cards.map((card) => {
              const { bannedFromSideboard, id, name, image, rarityId } = card;
              const sideboardCardCount =
                currentSideboard?.cardsInSideboard.filter(
                  (sideboardCard) => sideboardCard.id === id,
                ).length ?? 0;
              const cardCount = selectedCards.filter(
                (card) => card.id === id,
              ).length;
              const currentCardCount = sideboardParentCard
                ? sideboardCardCount
                : cardCount;
              const onAddCard = sideboardParentCard
                ? addSideboardCard
                : addCard;
              const legendaryLimit = rarityId === 5 && currentCardCount === 1;
              const nonLegendaryLimit =
                rarityId !== 5 && currentCardCount === 2;
              const sidebarCardsCount =
                currentSideboard?.cardsInSideboard.length ?? 0;
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
      )}
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
              {showSelectedCard(selectedCards).map((card) => {
                const count = selectedCards.filter(
                  (selectedCard) => selectedCard.id === card.id,
                ).length;
                return (
                  <li key={card.id}>
                    <div>{count}</div>
                    {card.maxSideboardCards && (
                      <Button onClick={() => onOpenSideboard(card)}>
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
              <Button onClick={() => setSideboardParentCard(null)}>
                Close
              </Button>
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
          <DeckBuilderForm
            selectedCards={selectedCards}
            deckSearchParams={cards.params}
            sideboardCards={sideboardCards}
          >
            <Button disabled={selectedCardsCount < 30}>Create Deck</Button>
          </DeckBuilderForm>
        </aside>
      </div>
    </div>
  );
}
