import { HeroIcon } from "./HeroIcon";
import { AssetIcon } from "./AssetIcon";
import Link from "next/link";
import { DeckPopularity } from "./DeckPopularity";
import { UserDecks } from "@/types/deck.type";

type Props = UserDecks[number];

export function DeckUICard({ data: deck }: { data: Props }) {
  const {
    archetype,
    deck_class,
    deck_format,
    dust_cost_sum,
    id,
    name,
    sub_archetype,
    profiles,
  } = deck;
  return (
    <li className="flex flex-1 flex-col justify-between gap-4 bg-slate-400 p-4">
      <Link href={`/decks/${id}/`}>
        <div>
          <div id="name-meta" className="flex justify-between">
            <div className="leading-none">
              <h3>{name}</h3>
              <span className="text-xs">
                {archetype}
                {sub_archetype && ` - ${sub_archetype}`}
              </span>
            </div>
            <div id="mode-class" className="flex gap-2">
              <div className="size-6 rounded-full bg-red-600" />
              <div className="size-6">
                <HeroIcon slug={deck_class} />
              </div>
            </div>
          </div>
          <div className="flex text-xs">
            <AssetIcon name="dust" type="asset" />
            {dust_cost_sum}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <DeckPopularity deck={deck} />
          <div id="author" className="flex items-center gap-2">
            <span className="text-sm">{profiles!.username}</span>
          </div>
        </div>
      </Link>
    </li>
  );
}
