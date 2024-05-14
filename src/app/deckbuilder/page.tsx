import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { CardGameMode } from "blizzard.js/dist/resources/hs";
import { CARD_CLASSES } from "@/lib/cardClasses";

export default async function DeckBuilderMode() {
  const gameMode = "constructed" as CardGameMode;

  return (
    <div className="m-auto flex max-w-screen-lg flex-col items-center justify-center">
      <Tabs defaultValue="standard">
        <TabsList>
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="wild">Wild</TabsTrigger>
        </TabsList>
      </Tabs>
      <ul className="grid grid-cols-3 gap-8 p-8">
        {CARD_CLASSES.map((cardClass) => {
          if (cardClass.slug === "neutral") return null;
          return (
            <li className="select-none" key={cardClass.id}>
              <Link
                href={{
                  pathname: `/deckbuilder/${gameMode}`,
                  query: { deckClass: cardClass.slug, format: "standard" },
                }}
              >
                <div className="relative rounded-sm border-8 border-double border-orange-400">
                  <div className="absolute bottom-8 flex h-12 w-full items-center gap-4 border border-orange-500 bg-black/80 px-4">
                    <Image
                      src={`/hero_icons/${cardClass.slug}.png`}
                      width={193}
                      height={193}
                      className="size-16 drop-shadow-[1px_0_0_orange]"
                      alt={cardClass.name}
                    />
                    <div className="text-xl">{cardClass.name}</div>
                  </div>
                  <Image
                    src={`/heroes/${cardClass.slug}.jpg`}
                    width={1440}
                    height={1440}
                    className="aspect-[3/4] object-cover"
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
