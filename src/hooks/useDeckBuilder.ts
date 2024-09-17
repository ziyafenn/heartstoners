import {
  type FormEvent,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from "react";
import { loadPageWithFilters } from "@/actions/deckBuider.action";
import type {
  Card,
  CardSeachParams,
  CardsPage,
  Deck,
  Rune,
  SideboardCards,
  RuneCost,
} from "@/types/hs.type";

import { getDeckByCode, getZilliaxSideboardCards } from "@/service/hs.service";
import { ZILLIAX_ID } from "@/lib/constants";
import { updateDeckCodeQuery } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export function useDeckBuilder({
  initState,
  inView,
  deck,
}: {
  deck: Deck | null;
  inView: boolean;
  initState: CardsPage & {
    params: Pick<CardSeachParams, "set" | "class" | "multiClass">;
    loading?: boolean;
  };
}) {
  const [cardsPage, onSearch] = useActionState(loadPageWithFilters, initState);
  const [selectedCards, setSelectedCards] = useState<Card[]>(
    () => deck?.cards ?? [],
  );
  const [sideboardCards, setSideboardCards] = useState<SideboardCards[]>(
    () => deck?.sideboardCards ?? [],
  );
  const [activeSideboardCard, setActiveSideboardCard] = useState<Card | null>(
    null,
  );
  const [zilliaxCards, setZilliaxCards] = useState<Card[]>([]);
  const [deathKnightRuneSlots, setDeathKnightRuneSlots] = useState<RuneCost>({
    blood: 0,
    frost: 0,
    unholy: 0,
  });
  const [touristCard, setTouristCard] = useState<Card | null>(null);

  const searchParams = useSearchParams();

  const loadNextPage = useCallback(async () => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(cardsPage.params)) {
      if (value) formData.append(key, value as string);
    }

    onSearch(formData);
  }, [cardsPage.params, onSearch]);

  function addSideboardCard(sideboardCard: Card) {
    if (!activeSideboardCard) return null;
    const currentSideboardCards = [...sideboardCards];
    const activeSideboard = currentSideboardCards.find(
      (sideboard) => sideboard.sideboardCard.id === activeSideboardCard.id,
    );

    if (activeSideboard) {
      activeSideboard.cardsInSideboard.push(sideboardCard);
    } else {
      const newSideboard: SideboardCards = {
        sideboardCard: activeSideboardCard,
        cardsInSideboard: [sideboardCard],
      };
      currentSideboardCards.push(newSideboard);
    }

    setSideboardCards(currentSideboardCards);
  }

  function createRuneSlots(runeCost: RuneCost) {
    const runeSlots = { ...deathKnightRuneSlots };

    for (const [key, value] of Object.entries(runeCost)) {
      const rune = key as Rune;

      const currentRuneCount = deathKnightRuneSlots[rune];

      if (!value || value <= currentRuneCount) continue;
      const runeDiff = value - currentRuneCount;
      runeSlots[rune] += runeDiff;
    }

    setDeathKnightRuneSlots(runeSlots);
  }

  function removeRuneSlots(runeCost: RuneCost, updatedCardList: Card[]) {
    const { blood, frost, unholy } = runeCost;

    const runeSlots: RuneCost = {
      blood: 0,
      frost: 0,
      unholy: 0,
    };

    function updateRuneCount([rune, value]: [Rune, number]) {
      if (value && value > runeSlots[rune]) runeSlots[rune] = value;
    }

    if (
      (blood && blood === deathKnightRuneSlots.blood) ||
      (frost && frost === deathKnightRuneSlots.frost) ||
      (unholy && unholy === deathKnightRuneSlots.unholy)
    ) {
      updatedCardList.forEach(({ runeCost }) => {
        if (runeCost)
          Object.entries(runeCost).forEach(([key, value]) =>
            updateRuneCount([key as Rune, value]),
          );
      });
      setDeathKnightRuneSlots(runeSlots);
    }
  }

  function addCard(card: Card) {
    const currentSelection = [...selectedCards];
    currentSelection.push(card);

    if (card.runeCost) createRuneSlots(card.runeCost);
    if (card.touristClassId) setTouristCard(card);

    setSelectedCards(currentSelection);
    // updateDeckCodeQuery(
    //   {
    //     card_ids: selectedCards.map((card) => card.id),
    //     deck_class: initState.params.class,
    //     deck_format: initState.params.set,
    //     sideboard_cards: sideboardCards.map(()),
    //   },
    //   searchParams.toString(),
    // );
  }

  function removeCard(card: Card) {
    const { id, runeCost } = card;
    const currentCardCount = selectedCards.filter(
      (card) => card.id === id,
    ).length;
    let updatedSelection: Card[] = [...selectedCards];

    if (currentCardCount === 1) {
      updatedSelection = selectedCards.filter((card) => card.id !== id);
    } else {
      const indexToRemove = updatedSelection.findLastIndex(
        (card) => card.id === id,
      );
      updatedSelection.splice(indexToRemove, 1);
    }

    if (runeCost) removeRuneSlots(runeCost, updatedSelection);
    if (card.touristClassId) setTouristCard(null);

    setSelectedCards(updatedSelection);
  }

  function removeSideboardCard(card: Card) {
    const { id } = card;

    if (!activeSideboardCard) return null;
    let currentSideboardCards = [...sideboardCards];
    const currentSideboard = currentSideboardCards.find(
      (sideboard) => sideboard.sideboardCard.id === activeSideboardCard.id,
    )!;
    const updatedSideboardCards = currentSideboard.cardsInSideboard.filter(
      (card) => card.id !== id,
    );
    if (updatedSideboardCards.length) {
      currentSideboard.cardsInSideboard = updatedSideboardCards;
    } else {
      currentSideboardCards = currentSideboardCards.filter(
        (sideboard) => sideboard.sideboardCard.id !== activeSideboardCard.id,
      );
    }
    setSideboardCards(currentSideboardCards);
  }

  async function getDeckFromCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const deckCode = formData.get("deckCode") as string;
    const deck = await getDeckByCode(deckCode);
    if (deck.sideboardCards) setSideboardCards(deck.sideboardCards);
    setSelectedCards(deck.cards);
  }

  async function toggleSideboard(card: Card | null) {
    if (card?.id === ZILLIAX_ID) {
      const { functions, modules } = await getZilliaxSideboardCards();
      setZilliaxCards([...functions, ...modules]);
    }
    setActiveSideboardCard(card);
  }

  useEffect(() => {
    if (inView) loadNextPage();
  }, [inView, loadNextPage]);

  return {
    cardsPage,
    selectedCards,
    sideboardCards,
    activeSideboardCard,
    zilliaxCards,
    deathKnightRuneSlots,
    touristCard,
    actions: {
      addSideboardCard,
      addCard,
      removeCard,
      removeSideboardCard,
      getDeckFromCode,
      toggleSideboard,
      onSearch,
    },
  };
}
