import { HeroIcon } from "@/components/HeroIcon";
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
    <li className="rounded bg-blue-900/80 px-1 py-0.5 text-xs">{label}</li>
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
    <li className="relative select-none overflow-hidden rounded-xl border border-border hover:translate-y-[-4px] hover:border-orange-900 hover:shadow-xl">
      <Link href={`/decks/${id}`}>
        <div className="absolute z-10 size-full bg-indigo-950	mix-blend-multiply " />
        <div className="absolute z-20 flex size-full items-center justify-between p-4 bg-blend-overlay">
          <div className="flex gap-4 ">
            <div className="flex flex-col gap-2">
              <HeroIcon
                slug={deck_class}
                className="box-content size-5 rounded-full border border-border"
              />
              <Image
                src={`/format/${deck_format}.svg`}
                width={25}
                height={25}
                className="box-content size-5 rounded-full border border-border"
                alt={deck_format}
              />
            </div>
            <div className="flex flex-col justify-between">
              <h3 className="font-hs text-xl outline-2">{name}</h3>
              <ul className="flex items-center gap-2">
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
              <span className="size-6 rounded-full bg-yellow-50" />
            </div>
            <DeckPopularity deck={deck} />
          </div>
        </div>
      </Link>
      <Image
        src={`/heroes/${deck_class}.jpg`}
        width={1440}
        height={1440}
        className="h-24 object-cover object-[0px,-160px] grayscale"
        alt={deck_class}
      />
    </li>
  );
}
