import { loadPageWithFilters } from "@/actions/deckBuider.action";
import type {
  Card,
  CardSeachParams,
  CardsPage,
  Deck,
  Rune,
  RuneCost,
  SideboardCards,
} from "@/types/hs.type";
import {
  type FormEvent,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from "react";

import { ZILLIAX_ID } from "@/lib/constants";
import { getDeckData, updateDeckCodeQuery } from "@/lib/utils";
import { getDeckByCode, getZilliaxSideboardCards } from "@/service/hs.service";

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

  const loadNextPage = useCallback(async () => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(cardsPage.params)) {
      if (value) formData.append(key, value as string);
    }

    onSearch(formData);
  }, [cardsPage.params, onSearch]);

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
    const currentSelectedCards = [...selectedCards];
    currentSelectedCards.push(card);

    if (card.runeCost) createRuneSlots(card.runeCost);
    if (card.touristClassId) setTouristCard(card);

    setSelectedCards(currentSelectedCards);

    updateDeckCodeQuery({
      cards: currentSelectedCards,
      sideboardCards: sideboardCards,
      multiClass: initState.params.multiClass,
      set: initState.params.set,
    });
  }

  function removeCard(card: Card) {
    const { id, runeCost, bannedFromSideboard } = card;
    const isSideboardCard = sideboardCards.some(
      (sideboard) => sideboard.sideboardCard.id === id,
    );
    const currentCardCount = selectedCards.filter(
      (card) => card.id === id,
    ).length;
    let currentSelectedCards: Card[] = [...selectedCards];

    if (currentCardCount === 1) {
      currentSelectedCards = selectedCards.filter((card) => card.id !== id);
    } else {
      const indexToRemove = currentSelectedCards.findLastIndex(
        (card) => card.id === id,
      );
      currentSelectedCards.splice(indexToRemove, 1);
    }

    if (runeCost) removeRuneSlots(runeCost, currentSelectedCards);
    if (card.touristClassId) setTouristCard(null);
    if (bannedFromSideboard && isSideboardCard)
      setSideboardCards((state) =>
        state.filter((sideboard) => sideboard.sideboardCard.id !== id),
      );

    setSelectedCards(currentSelectedCards);

    updateDeckCodeQuery({
      cards: currentSelectedCards,
      sideboardCards: sideboardCards,
      multiClass: initState.params.multiClass,
      set: initState.params.set,
    });
  }

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

    updateDeckCodeQuery({
      cards: selectedCards,
      sideboardCards: currentSideboardCards,
      multiClass: initState.params.multiClass,
      set: initState.params.set,
    });
  }

  function removeSideboardCard(card: Card) {
    const { id } = card;

    if (!activeSideboardCard) return;
    let currentSideboardCards = [...sideboardCards];
    const currentSideboard = currentSideboardCards.find(
      (sideboard) => sideboard.sideboardCard.id === activeSideboardCard.id,
    );
    if (!currentSideboard) return;
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

    updateDeckCodeQuery({
      cards: selectedCards,
      sideboardCards: currentSideboardCards,
      multiClass: initState.params.multiClass,
      set: initState.params.set,
    });
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

  const deckData = getDeckData(selectedCards, sideboardCards);

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
    deckData,
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
