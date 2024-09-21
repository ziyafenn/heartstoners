"use client";

import { getSubArchetype } from "@/actions/deckBuider.action";
import { AuthForm } from "@/app/(auth)/login/_components/AuthForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeckBuilder } from "@/hooks/useDeckBuilder";
import { cardViewerProps } from "@/lib/cardViewerProps";
import { ZILLIAX_ID } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createClient } from "@/service/supabase.auth.client";
import type {
  CardClass,
  CardType,
  CardsPage,
  Deck,
  Keyword,
  MinionTypes,
  Rarity,
  SetGroups,
} from "@/types/hs.type";
import type { Tables } from "@/types/supabase.type";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { CardSearchResult } from "./CardSearchResult";
import { CurrentDeck } from "./CurrentDeck";
import { DeckBuilderFilter } from "./DeckBuilderFilter";
import DeckBuilderForm from "./DeckBuilderForm";

function Loading() {
  return <div className="z-50 size-full bg-red-500">Loading</div>;
}

export function DeckBuilder({
  initialCards,
  minionTypes,
  rarities,
  keywords,
  cardTypes,
  deck,
  deckClass,
  format = "standard",
}: {
  initialCards: CardsPage;
  minionTypes: MinionTypes[];
  rarities: Rarity[];
  keywords: Keyword[];
  cardTypes: CardType[];
  deck: Deck | null;
  deckClass: CardClass["slug"];
  format: SetGroups["slug"];
}) {
  const supabase = createClient();

  const initState = {
    ...initialCards,
    params: {
      set: format,
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
    touristCard,
    deckData,
    actions,
  } = useDeckBuilder({
    initState,
    inView,
    deck,
  });
  const seachParams = useSearchParams();
  const deckCode = seachParams.get("deckCode");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [subArchetype, setSubArchetype] =
    useState<Tables<"meta_sub_archetypes"> | null>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const currentSideboard = sideboardCards.find(
    (sideboard) => sideboard.sideboardCard.id === activeSideboardCard?.id,
  );
  const currentCardsInSideboard = currentSideboard?.cardsInSideboard;

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

  async function onFormOpen() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }

    const subArchetype = await getSubArchetype(deckClass, selectedCards);
    if (subArchetype) setSubArchetype(subArchetype);
    setIsFormOpen(true);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: Here we update query only on the first render. Deck code qquery is updated from the custom hook.
  useEffect(() => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams({
      deckClass,
      format,
      deckCode: deckCode ?? "",
    });

    url.search = searchParams.toString();

    window.history.replaceState({}, "", url.toString());
    window.scroll({ top: 0 });
  }, [deckClass, format]);

  useEffect(() => {
    if (!cardsPage.loading) {
      setIsLoading(false);
    }
  }, [cardsPage]);

  return (
    <>
      {isFormOpen && (
        <DeckBuilderForm
          isOpen={isFormOpen}
          toggleOpen={setIsFormOpen}
          selectedCards={selectedCards}
          deckSearchParams={cardsPage.params}
          deckData={deckData}
          subArchetype={subArchetype}
        />
      )}
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Your deck is saved</DialogTitle>
          <DialogDescription>
            To finish creating your deck, please sign in or create an account.
            Your progress has been saved and your deck will be restored once you
            sign in.
          </DialogDescription>
          <AuthForm
            onClose={() => setIsAuthDialogOpen(false)}
            redirectDeckCode={deckCode ?? ""}
          />
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-4 p-8">
        <DeckBuilderFilter
          action={updateFilters}
          rarities={rarities}
          minionTypes={minionTypes}
          keywords={keywords}
          cardTypes={cardTypes}
          touristCard={touristCard}
          deckClass={deckClass}
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
                  touristCard,
                })
              }
            >
              <div
                ref={ref}
                className={cn(
                  "flex w-full items-center justify-center",
                  (!canLoadMore || isActiveSideboardCardZilliax) && "hidden",
                )}
              >
                <LoadingSpinner slow />
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
              <Button
                onClick={() => actions.toggleSideboard(null)}
                type="button"
                className="h-12 rounded-none"
              >
                {`Close ${activeSideboardCard.name} sideboard`}
              </Button>
            ) : (
              <Button
                type="button"
                disabled={selectedCards.length < 30}
                className="h-12 rounded-none"
                onClick={onFormOpen}
                variant="primary"
              >
                {`Create Deck (${selectedCards.length}/30)`}
              </Button>
            )}
          </CurrentDeck>
        </main>
      </div>
    </>
  );
}
