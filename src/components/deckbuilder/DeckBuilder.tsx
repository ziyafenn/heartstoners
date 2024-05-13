"use client";

import { DeckBuilderFilter } from "./DeckBuildFilter";

import { Button } from "../ui/button";
import DeckBuilderForm from "./DeckBuilderForm";
import {
  CardType,
  CardsPage,
  Keyword,
  MinionTypes,
  Rarity,
} from "@/types/hs.type";
import { CardClass, CardGameMode } from "blizzard.js/dist/resources/hs";
import { useParams, useSearchParams } from "next/navigation";
import { CurrentDeck } from "./CurrentDeck";
import { CardSearchResult } from "./CardSearchResult";
import { useInView } from "react-intersection-observer";
import { useDeckBuilder } from "@/hooks/useDeckBuilder";
import { cardViewerProps } from "@/lib/cardViewerProps";
import { ZILLIAX_ID } from "@/lib/constants";

export function DeckBuilder({
  initialCards,
  minionTypes,
  rarities,
  keywords,
  cardTypes,
}: {
  initialCards: CardsPage;
  minionTypes: MinionTypes[];
  rarities: Rarity[];
  keywords: Keyword[];
  cardTypes: CardType[];
}) {
  const searchParams = useSearchParams();
  const params = useParams<{ gameMode: CardGameMode }>();
  const { gameMode } = params;
  const deckClass = searchParams.get("deckClass") as CardClass;
  const initState = {
    ...initialCards,
    params: {
      gameMode,
      set: searchParams.get("format") ?? "standard",
      class: [deckClass, "neutral"] as CardClass[],
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

  const onRemovedCard = activeSideboardCard
    ? actions.removeSideboardCard
    : actions.removeCard;

  const isActiveSideboardCardZilliax = activeSideboardCard?.id === ZILLIAX_ID;

  const cardsDisplayedOnSearchPage = isActiveSideboardCardZilliax
    ? zilliaxCards
    : cardsPage.cards;

  return (
    <div>
      <DeckBuilderFilter
        action={actions.onSearch}
        rarities={rarities}
        minionTypes={minionTypes}
        keywords={keywords}
        cardTypes={cardTypes}
      />
      <main className="grid grid-cols-[1fr,280px] gap-8">
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
        <CurrentDeck
          sideboardCards={sideboardCards}
          toggleSideboard={actions.toggleSideboard}
          selectedCards={
            activeSideboardCard ? currentCardsInSideboard : selectedCards
          }
          removeCard={onRemovedCard}
        >
          {activeSideboardCard ? (
            <Button onClick={() => actions.toggleSideboard(null)} type="button">
              Close
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
