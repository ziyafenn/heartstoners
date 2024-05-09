import { Card, SideboardCards } from "@/types/hs.type";

type Props = {
  card: Card;
  currentSideboard: SideboardCards | undefined;
  selectedCards: Card[];
  activeSideboardCard: Card | null;
  onAddCard: (card: Card) => void;
};

export function cardViewerProps({
  card,
  currentSideboard,
  selectedCards,
  activeSideboardCard,
  onAddCard,
}: Props) {
  const { bannedFromSideboard, id, rarityId } = card;
  const selectedCardsCount = selectedCards.length;
  const sideboardCardCount =
    currentSideboard?.cardsInSideboard.filter(
      (sideboardCard) => sideboardCard.id === id,
    ).length ?? 0;
  const cardCount = selectedCards.filter((card) => card.id === id).length;
  const currentCardCount = activeSideboardCard ? sideboardCardCount : cardCount;
  const legendaryLimit = rarityId === 5 && currentCardCount === 1;
  const nonLegendaryLimit = rarityId !== 5 && currentCardCount === 2;
  const sidebarCardsCount = currentSideboard?.cardsInSideboard.length ?? 0;
  const isTotalCardCountReached = activeSideboardCard
    ? sidebarCardsCount === 3
    : selectedCardsCount === 30;
  const isUnavailableForSideboard =
    !!activeSideboardCard && !!bannedFromSideboard;

  return {
    currentCardCount,
    onAddCard,
    legendaryLimit,
    nonLegendaryLimit,
    isTotalCardCountReached,
    isUnavailableForSideboard,
  };
}
