import { DBFunction } from "@/types/supabase.func.type";

export function DustCost({
  dustCostSum,
  availableDust,
  craftableDeck,
}: {
  dustCostSum: number;
  availableDust: number;
  craftableDeck:
    | DBFunction<"get_craftable_decks", "Returns">[number]
    | undefined;
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
    return <span className="text-red-500">{dustCostSum - availableDust}</span>;
  return <span>{dustCostSum}</span>;
}
