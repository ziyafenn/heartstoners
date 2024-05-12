import { FormEvent, useCallback, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { loadPageWithFilters } from "@/actions/deckBuider.action";
import {
  Card,
  CardSeachParams,
  CardsPage,
  SideboardCards,
} from "@/types/hs.type";

import { getDeckByCode, getZilliaxSideboardCards } from "@/service/hs.service";
import { ZILLIAX_ID } from "@/lib/constants";

export function useDeckBuilder({
  initState,
  inView,
}: {
  inView: boolean;
  initState: CardsPage & {
    params: Pick<CardSeachParams, "gameMode" | "set" | "class" | "multiClass">;
  };
}) {
  const [cardsPage, onSearch] = useFormState(loadPageWithFilters, initState);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [sideboardCards, setSideboardCards] = useState<SideboardCards[]>([]);
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
      getDeckFromCode,
      toggleSideboard,
      onSearch,
    },
  };
}
