"use client";

import { DeckBuilderFilter } from "./DeckBuildFilter";

import { Button } from "@/components/ui/button";
import DeckBuilderForm from "./DeckBuilderForm";
import {
  CardClass,
  CardType,
  CardsPage,
  Deck,
  Keyword,
  MinionTypes,
  Rarity,
  SetGroups,
} from "@/types/hs.type";
import { useParams, useSearchParams } from "next/navigation";
import { CurrentDeck } from "./CurrentDeck";
import { CardSearchResult } from "./CardSearchResult";
import { useInView } from "react-intersection-observer";
import { useDeckBuilder } from "@/hooks/useDeckBuilder";
import { cardViewerProps } from "@/lib/cardViewerProps";
import { ZILLIAX_ID } from "@/lib/constants";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function Loading() {
  return <div className="size-full bg-red-500 z-50">Loading</div>;
}

export function DeckBuilder({
  initialCards,
  minionTypes,
  rarities,
  keywords,
  cardTypes,
  deck,
}: {
  initialCards: CardsPage;
  minionTypes: MinionTypes[];
  rarities: Rarity[];
  keywords: Keyword[];
  cardTypes: CardType[];
  deck: Deck | null;
}) {
  const searchParams = useSearchParams();
  const params = useParams<{ format: SetGroups["slug"] }>();
  const { format } = params;
  const deckClass = searchParams.get("deckClass") as CardClass["slug"];
  const initState = {
    ...initialCards,
    params: {
      set: format as "standard",
      class: [deckClass, "neutral"] as CardClass["slug"][],
      multiClass: deckClass,
    },
  };
  const { ref, inView } = useInView();
  const {
    activeSideboardCard,
    cardsPage,
    selectedCards,
    sideboardCards,
    zilliaxCards,
    deathKnightRuneSlots,
    actions,
  } = useDeckBuilder({
    initState,
    inView,
    deck,
  });

  const [isLoading, setIsLoading] = useState(false);

  const currentSideboard = sideboardCards.find(
    (sideboard) => sideboard.sideboardCard.id === activeSideboardCard?.id,
  );
  const currentCardsInSideboard =
    currentSideboard && currentSideboard.cardsInSideboard;

  const onAddCard = activeSideboardCard
    ? actions.addSideboardCard
    : actions.addCard;

  const onRemovedCard = activeSideboardCard
    ? actions.removeSideboardCard
    : actions.removeCard;

  const isActiveSideboardCardZilliax = activeSideboardCard?.id === ZILLIAX_ID;

  const cardsDisplayedOnSearchPage = isActiveSideboardCardZilliax
    ? zilliaxCards
    : cardsPage.cards;

  const canLoadMore = cardsPage.pageCount > cardsPage.page;

  function updateFilters(formData: FormData) {
    setIsLoading(true);
    actions.onSearch(formData);
    window.scroll({ top: 0 });
  }

  useEffect(() => {
    window.scroll({ top: 0 });
  }, []);

  useEffect(() => {
    if (!cardsPage.loading) {
      setIsLoading(false);
    }
  }, [cardsPage]);

  return (
    <div className="flex flex-col gap-4">
      <DeckBuilderFilter
        action={updateFilters}
        rarities={rarities}
        minionTypes={minionTypes}
        keywords={keywords}
        cardTypes={cardTypes}
      />
      <main className="grid select-none grid-cols-[1fr,320px] gap-8">
        {isLoading ? (
          <Loading />
        ) : (
          <CardSearchResult
            cards={cardsDisplayedOnSearchPage}
            cardViewerProps={(card) =>
              cardViewerProps({
                activeSideboardCard,
                currentSideboard,
                onAddCard,
                selectedCards,
                card,
                deathKnightRuneSlots,
              })
            }
          >
            <div
              ref={ref}
              className={cn(
                "self-center size-24",
                (!canLoadMore || isActiveSideboardCardZilliax) && "hidden",
              )}
            >
              <Image
                src="/img/hs-logo.png"
                width={256}
                height={256}
                alt="heartstone-logo"
                className="animate-spin-slow object-contain delay-1000"
              />
            </div>
          </CardSearchResult>
        )}
        <CurrentDeck
          deckClass={deckClass}
          sideboardCards={sideboardCards}
          toggleSideboard={actions.toggleSideboard}
          selectedCards={
            activeSideboardCard ? currentCardsInSideboard : selectedCards
          }
          removeCard={onRemovedCard}
          deathKnightRuneSlots={deathKnightRuneSlots}
        >
          {activeSideboardCard ? (
            <Button onClick={() => actions.toggleSideboard(null)} type="button">
              {`Close ${activeSideboardCard.name} sideboard`}
            </Button>
          ) : (
            <DeckBuilderForm
              selectedCards={selectedCards}
              deckSearchParams={cardsPage.params}
              sideboardCards={sideboardCards}
            />
          )}
        </CurrentDeck>
      </main>
    </div>
  );
}
