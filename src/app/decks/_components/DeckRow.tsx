import { AssetIcon } from "@/components/AssetIcon";
import { DeckPopularity } from "@/components/DeckPopularity";
import { DustCost } from "@/components/DustCost";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import type { CraftableDeck, UserDeck } from "@/types/deck.type";
import { useRouter } from "next/navigation";

type Props = {
  deck: UserDeck;
  craftableDeck: CraftableDeck | undefined;
  availableDust: number;
};

export function DeckRow({ deck, availableDust, craftableDeck }: Props) {
  const router = useRouter();
  return (
    <TableRow
      key={deck.id}
      onClick={() => router.push(`/decks/${deck.id}`)}
      className="cursor-pointer select-none"
    >
      <TableCell className="flex items-center gap-4">
        <AssetIcon type="hero" name={deck.deck_class} className="size-10" />
        <span className="flex flex-col gap-1">
          <div className="font-bold text-base">{deck.name}</div>
          <div className="flex gap-1">
            <AssetIcon type="asset" name="dust" />
            <DustCost
              availableDust={availableDust}
              dustCostSum={deck.dust_cost_sum}
              craftableDeck={craftableDeck}
            />
          </div>
        </span>
      </TableCell>
      <TableCell>
        <ul className="flex gap-1">
          <Badge>{deck.archetype}</Badge>
          {deck.meta_sub_archetypes && (
            <Badge>{deck.meta_sub_archetypes.name}</Badge>
          )}
        </ul>
      </TableCell>
      <TableCell className="text-right">
        {new Date(deck.updated_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <span>{deck.profiles!.avatar_url}</span>
        <span>{deck.profiles!.username}</span>
      </TableCell>
      <TableCell>
        <DeckPopularity deck={deck} />
      </TableCell>
    </TableRow>
  );
}
