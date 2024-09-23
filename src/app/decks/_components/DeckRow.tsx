import { AssetIcon } from "@/components/AssetIcon";
import { DeckPopularity } from "@/components/DeckPopularity";
import { DustCost } from "@/components/DustCost";
import { UserAvatar } from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { findData } from "@/lib/utils";
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
      className="cursor-pointer select-none items-center"
    >
      <TableCell>
        <div className="flex items-center gap-4">
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
        </div>
      </TableCell>
      <TableCell>
        <ul className="flex gap-1">
          <Badge variant="secondary">{deck.archetype}</Badge>
          {deck.meta_sub_archetypes && (
            <Badge variant="secondary">
              {deck.meta_sub_archetypes.name ||
                findData(CARD_CLASSES, "slug", deck.deck_class).name}
            </Badge>
          )}
        </ul>
      </TableCell>
      <TableCell className="text-right">
        {new Date(deck.updated_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <UserAvatar imageSrc={deck.profiles!.avatar_url} />
          <span>{deck.profiles!.display_name}</span>
        </div>
      </TableCell>
      <TableCell>
        <DeckPopularity deck={deck} />
      </TableCell>
    </TableRow>
  );
}
