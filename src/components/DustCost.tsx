import type { CraftableDeck } from "@/types/deck.type";

export function DustCost({
  dustCostSum,
  availableDust,
  craftableDeck,
}: {
  dustCostSum: number;
  availableDust: number;
  craftableDeck: CraftableDeck | undefined;
}) {
  function checkIsCraftable() {
    const canBeCrafted =
      !!craftableDeck && craftableDeck.required_dust_cost <= availableDust;

    return canBeCrafted;
  }
  const isCraftable = checkIsCraftable();
  if (isCraftable) {
    return <span className="font-bold text-green-500">Craftable</span>;
  }
  if (availableDust)
    return (
      <span className="font-bold text-red-500">
        {dustCostSum - availableDust}
      </span>
    );
  return <span>{dustCostSum}</span>;
}
