"use client";

import { DeckBuilderFilter } from "./DeckBuilderFilter";

import { Button } from "@/components/ui/button";
import DeckBuilderForm from "./DeckBuilderForm";
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
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { CurrentDeck } from "./CurrentDeck";
import { CardSearchResult } from "./CardSearchResult";
import { useInView } from "react-intersection-observer";
import { useDeckBuilder } from "@/hooks/useDeckBuilder";
import { cardViewerProps } from "@/lib/cardViewerProps";
import { ZILLIAX_ID } from "@/lib/constants";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getSubArchetype } from "@/actions/deckBuider.action";
import type { Tables } from "@/types/supabase.type";
import { createClient } from "@/service/supabase.auth.client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AuthCard from "@/app/(auth)/login/_components/AuthCard";

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
}: {
  initialCards: CardsPage;
  minionTypes: MinionTypes[];
  rarities: Rarity[];
  keywords: Keyword[];
  cardTypes: CardType[];
  deck: Deck | null;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const supabase = createClient();

  const format =
    searchParams.get("format") ?? ("standard" as SetGroups["slug"]);
  const deckClass = searchParams.get("deckClass") as CardClass["slug"];
  const deckCode = searchParams.get("deckCode");

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
    actions,
  } = useDeckBuilder({
    initState,
    inView,
    deck,
  });

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
      console.log("no user");

      setIsAuthDialogOpen(true);
      return;
    }

    const subArchetype = await getSubArchetype(deckClass, selectedCards);
    if (subArchetype) setSubArchetype(subArchetype);
    setIsFormOpen(true);
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
    <>
      {isFormOpen && (
        <DeckBuilderForm
          isOpen={isFormOpen}
          toggleOpen={setIsFormOpen}
          selectedCards={selectedCards}
          deckSearchParams={cardsPage.params}
          sideboardCards={sideboardCards}
          subArchetype={subArchetype}
        />
      )}
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <AuthCard
            action={() => setIsAuthDialogOpen(false)}
            redirect={`/deckbuilder/deck?deckClass=${deckClass}&format=${format}&deckCode=${deckCode}`}
            //todo: pass generated deck code.
          />
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-4">
        <DeckBuilderFilter
          action={updateFilters}
          rarities={rarities}
          minionTypes={minionTypes}
          keywords={keywords}
          cardTypes={cardTypes}
          touristCard={touristCard}
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
                  "size-24 self-center",
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
              <Button
                onClick={() => actions.toggleSideboard(null)}
                type="button"
              >
                {`Close ${activeSideboardCard.name} sideboard`}
              </Button>
            ) : (
              <Button
                type="button"
                disabled={selectedCards.length < 1}
                className="rounded-none bg-orange-200"
                onClick={onFormOpen}
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