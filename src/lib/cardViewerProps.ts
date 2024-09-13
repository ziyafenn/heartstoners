import { Card, Rune, RuneCost, SideboardCards } from "@/types/hs.type";

type Props = {
  card: Card;
  currentSideboard: SideboardCards | undefined;
  selectedCards: Card[];
  activeSideboardCard: Card | null;
  onAddCard: (card: Card) => void;
  deathKnightRuneSlots: RuneCost;
  touristCard: Card | null;
};

export function cardViewerProps({
  card,
  currentSideboard,
  selectedCards,
  activeSideboardCard,
  onAddCard,
  deathKnightRuneSlots,
  touristCard,
}: Props) {
  function canDeathKnightCardBeAdded() {
    const { runeCost } = card;
    let result = true;

    if (!runeCost) return result;

    const runeSlotCount = Object.values(deathKnightRuneSlots).reduce(
      (a, b) => a + b,
    );

    for (const [key, value] of Object.entries(runeCost)) {
      const rune = key as Rune;
      if (value <= deathKnightRuneSlots[rune]) continue;
      const runeDiff = value - deathKnightRuneSlots[rune];
      if (runeSlotCount + runeDiff > 3) {
        result = false;
        break;
      }
    }

    return result;
  }

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

  const isAboveRuneSlotLimit = !canDeathKnightCardBeAdded();
  const isTouristCard = touristCard && card.touristClassId;

  const isDisabled =
    isTotalCardCountReached ||
    legendaryLimit ||
    nonLegendaryLimit ||
    isUnavailableForSideboard ||
    isCosmeticModulePresent ||
    isFunctionalModuleCountReached ||
    isAboveRuneSlotLimit ||
    isTouristCard;

  return {
    currentCardCount,
    isDisabled,
    onAddCard,
  };
}
