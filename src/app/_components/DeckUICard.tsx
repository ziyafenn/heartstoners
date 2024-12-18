import { AssetIcon } from "@/components/AssetIcon";
import { DeckPopularity } from "@/components/DeckPopularity";
import { UserAvatar } from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { findData } from "@/lib/utils";
import type { UserDeck } from "@/types/deck.type";
import Image from "next/image";
import Link from "next/link";

type Props = UserDeck;

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
    <li className="relative select-none overflow-hidden rounded-xl border border-border hover:translate-y-[-4px] hover:border-[#4C0019] hover:shadow-xl">
      <Link href={`/decks/${id}`}>
        <div className="absolute z-10 size-full bg-[#2c1b3f] mix-blend-multiply" />
        <div className="absolute z-20 flex size-full items-center justify-between p-4 bg-blend-overlay">
          <div className="flex gap-4 ">
            <div className="flex flex-col gap-2">
              <AssetIcon
                type="hero"
                name={deck_class}
                className="box-content size-5 rounded-full border border-amber-900"
              />
              <AssetIcon type="format" name={deck_format} />
            </div>
            <div className="flex flex-col justify-between">
              <h3 className="font-hs text-xl outline-2">{name}</h3>
              <ul className="flex items-center gap-2">
                <Badge variant="secondary">{archetype}</Badge>
                {meta_sub_archetypes && (
                  <Badge variant="secondary">
                    {meta_sub_archetypes.name ||
                      findData(CARD_CLASSES, "slug", deck_class).name}
                  </Badge>
                )}
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div id="author" className="flex items-center gap-2">
              <span className="text-sm">by {profiles!.display_name}</span>
              <UserAvatar imageSrc={profiles!.avatar_url} />
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
