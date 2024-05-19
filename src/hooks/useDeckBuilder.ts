import { FormEvent, useCallback, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { loadPageWithFilters } from "@/actions/deckBuider.action";
import {
  Card,
  CardSeachParams,
  CardsPage,
  Deck,
  SideboardCards,
} from "@/types/hs.type";

import { getDeckByCode, getZilliaxSideboardCards } from "@/service/hs.service";
import { ZILLIAX_ID } from "@/lib/constants";

export function useDeckBuilder({
  initState,
  inView,
  deck,
}: {
  deck: Deck | null;
  inView: boolean;
  initState: CardsPage & {
    params: Pick<CardSeachParams, "set" | "class" | "multiClass">;
  };
}) {
  const [cardsPage, onSearch] = useFormState(loadPageWithFilters, initState);
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

  useEffect(() => {
    if (inView) loadNextPage();
  }, [inView]);

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

  function addCard(card: Card) {
    const currentSelection = [...selectedCards];
    currentSelection.push(card);

    setSelectedCards(currentSelection);
  }

  function removeCard(cardId: number) {
    const currentCardCount = selectedCards.filter(
      (card) => card.id === cardId,
    ).length;
    let updatedSelection: Card[] = [...selectedCards];

    if (currentCardCount === 1) {
      updatedSelection = selectedCards.filter((card) => card.id !== cardId);
    } else {
      const indexToRemove = updatedSelection.findLastIndex(
        (card) => card.id === cardId,
      );
      updatedSelection.splice(indexToRemove, 1);
    }

    setSelectedCards(updatedSelection);
  }

  function removeSideboardCard(cardId: number) {
    if (!activeSideboardCard) return null;
    let currentSideboardCards = [...sideboardCards];
    const currentSideboard = currentSideboardCards.find(
      (sideboard) => sideboard.sideboardCard.id === activeSideboardCard.id,
    )!;
    const updatedSideboardCards = currentSideboard.cardsInSideboard.filter(
      (card) => card.id !== cardId,
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

  const loadNextPage = useCallback(async () => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(cardsPage.params)) {
      formData.append(key, value as string);
    }

    onSearch(formData);
  }, [cardsPage.params, onSearch]);

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

  return {
    cardsPage,
    selectedCards,
    sideboardCards,
    activeSideboardCard,
    zilliaxCards,
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
