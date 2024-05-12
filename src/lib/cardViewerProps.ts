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
  const {
    bannedFromSideboard,
    id,
    rarityId,
    isZilliaxCosmeticModule,
    isZilliaxFunctionalModule,
  } = card;
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
  const isCosmeticModulePresent =
    isZilliaxCosmeticModule &&
    currentSideboard?.cardsInSideboard.some(
      (card) => card.isZilliaxCosmeticModule,
    );
  const isFunctionalModuleCountReached =
    isZilliaxFunctionalModule &&
    currentSideboard?.cardsInSideboard.filter(
      (card) => card.isZilliaxFunctionalModule,
    ).length === 2;

  const isDisabled =
    isTotalCardCountReached ||
    legendaryLimit ||
    nonLegendaryLimit ||
    isUnavailableForSideboard ||
    isCosmeticModulePresent ||
    isFunctionalModuleCountReached;

  return {
    currentCardCount,
    isDisabled,
    onAddCard,
  };
}
