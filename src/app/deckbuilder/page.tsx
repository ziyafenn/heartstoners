import { AssetIcon } from "@/components/AssetIcon";
import { CARD_CLASSES } from "@/lib/cardClasses";
import Image from "next/image";
import Link from "next/link";
import { DeckImportForm } from "./deck/_components/DeckImportForm";

export default function DeckBuilder() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full max-w-7xl flex-col gap-8 p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-2xl">
            Pick your class or import deck from code
          </h2>
          <DeckImportForm />
        </div>
        <ul className="grid grid-cols-auto-fill-clascard justify-center gap-8">
          {CARD_CLASSES.map((cardClass) => {
            if (cardClass.slug === "neutral") return null;
            return (
              <li className="group select-none" key={cardClass.id}>
                <Link
                  href={{
                    pathname: "/deckbuilder/deck",
                    query: { deckClass: cardClass.slug, format: "standard" },
                  }}
                >
                  <div className="relative overflow-clip rounded-sm border-8 border-[#3a3149] border-double ">
                    <div className="absolute bottom-8 z-50 flex h-8 w-full items-center gap-4 border border-y-amber-800 bg-black/80 px-4">
                      <AssetIcon
                        className="size-10 drop-shadow-[1px_0_0_orange]"
                        type="hero"
                        name={cardClass.slug}
                      />

                      <div className="font-hs font-outline-2 text-xl leading-tight drop-shadow-md">
                        {cardClass.name}
                      </div>
                    </div>
                    <div className="absolute size-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-neutral-950/50 via-transparent to-neutral-950" />
                    <Image
                      src={`/heroes/${cardClass.slug}.jpg`}
                      width={1440}
                      height={1440}
                      className="aspect-[4/3] object-cover object-top transition-transform duration-300 group-hover:scale-110"
                      alt={cardClass.name}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
