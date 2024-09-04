import { HeroIcon } from "@/components/HeroIcon";
import { AssetIcon } from "@/components/AssetIcon";
import Link from "next/link";
import { DeckPopularity } from "@/components/DeckPopularity";
import { UserDecks } from "@/types/deck.type";
import Image from "next/image";

type Props = UserDecks[number];

function Tag({
  label,
  type,
}: {
  label: string;
  type: "archetype" | "sub_archetype";
}) {
  return (
    <li className="text-xs bg-blue-900/80 py-0.5 px-1 rounded">{label}</li>
  );
}

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
    <li className="relative rounded-xl overflow-hidden select-none border border-border hover:shadow-xl hover:translate-y-[-4px] hover:border-orange-900">
      <Link href={`/decks/${id}/`}>
        <div className="absolute size-full bg-gradient-to-r from-black/80 via-black/20 to-black/80" />
        <div className="absolute items-center justify-between p-4 flex size-full">
          <div className="flex gap-2 items-center">
            <HeroIcon slug={deck_class} className="size-12" />
            <div>
              <div className="flex gap-1 items-center">
                <h3 className="text-xl font-hs outline-2">{name}</h3>
                <Image
                  src={`/format/${deck_format}.svg`}
                  width={25}
                  height={25}
                  className="size-5"
                  alt={deck_format}
                />
              </div>

              <ul className="flex gap-2">
                <Tag label={archetype} type="archetype" />
                {sub_archetype && (
                  <Tag label={sub_archetype.toString()} type="sub_archetype" />
                )}
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 text-sm">
            <div id="author" className="flex items-center gap-2">
              <span className="text-sm">by {profiles!.username}</span>
              <span className="size-6 bg-yellow-50 rounded-full" />
            </div>
            <DeckPopularity deck={deck} />
          </div>
        </div>
      </Link>
      <Image
        src={`/heroes/${deck_class}.jpg`}
        width={1440}
        height={1440}
        className="h-24 object-[0px,-160px] object-cover "
        alt={deck_class}
      />
    </li>
  );
}
