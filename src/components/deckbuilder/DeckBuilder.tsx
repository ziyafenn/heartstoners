"use client";

import { DeckBuilderFilter } from "./DeckBuildFilter";

import { Button } from "../ui/button";
import DeckBuilderForm from "./DeckBuilderForm";
import { CardsPage, MinionTypes, Rarity } from "@/types/hs.type";
import { CardClass } from "blizzard.js/dist/resources/hs";
import { useParams, useSearchParams } from "next/navigation";
import { CurrentDeck } from "./CurrentDeck";
import { CardSearchResult } from "./CardSearchResult";
import { useInView } from "react-intersection-observer";
import { useDeckBuilder } from "@/hooks/useDeckBuilder";
import { cardViewerProps } from "@/hooks/cardViewerProps";
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
  const { ref, inView } = useInView();
  const {
    activeSideboardCard,
    cardsPage,
    selectedCards,
    sideboardCards,
    zilliaxCards,
    actions,
  } = useDeckBuilder({
    initState,
    inView,
  });

  const currentSideboard = sideboardCards.find(
    (sideboard) => sideboard.sideboardCard.id === activeSideboardCard?.id,
  );
  const currentCardsInSideboard =
    currentSideboard && currentSideboard.cardsInSideboard;

  const onAddCard = activeSideboardCard
    ? actions.addSideboardCard
    : actions.addCard;

  const isActiveSideboardCardZilliax = activeSideboardCard?.id === ZILLIAX_ID;

  const cardsDisplayedOnSearchPage = isActiveSideboardCardZilliax
    ? zilliaxCards
    : cardsPage.cards;

  return (
    <div className="flex justify-between">
      <div className="flex-1">
        <DeckBuilderFilter
          action={actions.onSearch}
          rarities={rarities}
          minionTypes={minionTypes}
        />
        <CardSearchResult
          cards={cardsDisplayedOnSearchPage}
          cardViewerProps={(card) =>
            cardViewerProps({
              activeSideboardCard,
              currentSideboard,
              onAddCard,
              selectedCards,
              card,
            })
          }
        >
          <div ref={ref}>loading</div>
        </CardSearchResult>
      </div>
      <CurrentDeck
        activeSideboardCard={activeSideboardCard}
        toggleSideboard={actions.toggleSideboard}
        currentCardsInSideboard={currentCardsInSideboard}
        selectedCards={selectedCards}
      >
        <DeckBuilderForm
          selectedCards={selectedCards}
          deckSearchParams={cardsPage.params}
          sideboardCards={sideboardCards}
        >
          <Button disabled={selectedCards.length < 30}>Create Deck</Button>
        </DeckBuilderForm>
      </CurrentDeck>
    </div>
  );
}
