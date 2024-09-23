import { AssetIcon } from "@/components/AssetIcon";
import { DeckPopularity } from "@/components/DeckPopularity";
import { DustCost } from "@/components/DustCost";
import { UserAvatar } from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import type { CraftableDeck, UserDeck } from "@/types/deck.type";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  deck: UserDeck;
  craftableDeck: CraftableDeck | undefined;
  availableDust: number;
  cardImageUrls: string[][];
};

export function DeckRow({
  deck,
  availableDust,
  craftableDeck,
  cardImageUrls,
}: Props) {
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
        <ul className="flex w-max gap-1">
          <Badge>{deck.archetype}</Badge>
          {deck.meta_sub_archetypes && (
            <Badge>{deck.meta_sub_archetypes.name}</Badge>
          )}
        </ul>
      </TableCell>
      <TableCell>
        <ul className="flex flex-wrap gap-1">
          {cardImageUrls.map(([name, image]) => (
            <li key={name}>
              <div className="size-10 overflow-clip rounded-full">
                <Image alt={name} src={image} width={256} height={256} />
              </div>
            </li>
          ))}
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
