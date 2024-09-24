import { AssetIcon } from "@/components/AssetIcon";
import { CARD_CLASSES } from "@/lib/cardClasses";
import Image from "next/image";
import Link from "next/link";
import { DeckImportForm } from "./deck/_components/DeckImportForm";

export default function DeckBuilder() {
  return (
    <div className="m-auto flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-2xl">
          Pick your class or import deck from code
        </h2>
        <DeckImportForm />
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
                <div className="relative overflow-clip rounded-sm border-8 border-[#3a3149] border-double">
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
                  <Image
                    src={`/heroes/${cardClass.slug}.jpg`}
                    width={1440}
                    height={1440}
                    className="aspect-[4/3] w-64 object-cover object-top transition-transform duration-300 hover:scale-110"
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
