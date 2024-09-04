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
    meta_sub_archetypes,
  } = deck;
  return (
    <li className="relative rounded-xl overflow-hidden select-none border border-border hover:shadow-xl hover:translate-y-[-4px] hover:border-orange-900">
      <Link href={"/"}>
        <div className="absolute size-full bg-indigo-950 mix-blend-multiply	z-10 " />
        <div className="absolute z-20 items-center justify-between p-4 flex size-full bg-blend-overlay">
          <div className="flex gap-4 ">
            <div className="flex flex-col gap-2">
              <HeroIcon
                slug={deck_class}
                className="size-5 border border-border box-content rounded-full"
              />
              <Image
                src={`/format/${deck_format}.svg`}
                width={25}
                height={25}
                className="size-5 rounded-full border border-border box-content"
                alt={deck_format}
              />
            </div>
            <div className="flex flex-col justify-between">
              <h3 className="text-xl font-hs outline-2">{name}</h3>
              <ul className="flex gap-2 items-center">
                <Tag label={archetype} type="archetype" />
                {meta_sub_archetypes && (
                  <Tag label={meta_sub_archetypes.name} type="sub_archetype" />
                )}
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
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
        className="h-24 object-[0px,-160px] object-cover grayscale"
        alt={deck_class}
      />
    </li>
  );
}
