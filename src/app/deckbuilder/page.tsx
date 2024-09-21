import { decodeDeck } from "@/actions/deckBuider.action";
import { AssetIcon } from "@/components/AssetIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CARD_CLASSES } from "@/lib/cardClasses";
import Image from "next/image";
import Link from "next/link";

export default function DeckBuilder() {
  return (
    <div className="m-auto flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-2xl">
          Pick your class or import deck from code
        </h2>
        <form action={decodeDeck} className="flex items-center gap-4">
          <Input
            name="deckCode"
            type="text"
            required
            placeholder="Paste your code"
          />
          <Button type="submit" size="sm">
            Import Deck
          </Button>
        </form>
      </div>
      <ul className="grid grid-cols-4 gap-8">
        {CARD_CLASSES.map((cardClass) => {
          if (cardClass.slug === "neutral") return null;
          return (
            <li className="select-none" key={cardClass.id}>
              <Link
                href={{
                  pathname: "/deckbuilder/deck",
                  query: { deckClass: cardClass.slug, format: "standard" },
                }}
              >
                <div className="relative rounded-sm border-8 border-orange-400 border-double">
                  <div className="absolute bottom-8 flex h-8 w-full items-center gap-4 border border-y-amber-800 bg-black/80 px-4">
                    <AssetIcon
                      className="size-10 drop-shadow-[1px_0_0_orange]"
                      type="hero"
                      name={cardClass.slug}
                    />

                    <div className="font-hs font-outline-2 text-xl leading-tight drop-shadow-md">
                      {cardClass.name}
                    </div>
                  </div>
                  <Image
                    src={`/heroes/${cardClass.slug}.jpg`}
                    width={1440}
                    height={1440}
                    className="aspect-[4/3] w-64 object-cover"
                    alt={cardClass.name}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
