import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { CardGameMode } from "blizzard.js/dist/resources/hs";
import { getHsMetadata } from "@/service/hs.service";
import { DeckClass } from "@/types/hs.type";

export default async function DeckBuilderMode() {
  const deckClasses = await getHsMetadata<DeckClass>("classes");
  const gameMode = "constructed" as CardGameMode;

  return (
    <div className="flex flex-col max-w-screen-lg items-center justify-center m-auto">
      <Tabs defaultValue="standard">
        <TabsList>
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="wild">Wild</TabsTrigger>
        </TabsList>
      </Tabs>
      <ul className="grid grid-cols-3 gap-8 p-8">
        {deckClasses.map((deckClass) => {
          if (deckClass.slug === "neutral") return null;
          return (
            <li className="select-none" key={deckClass.id}>
              <Link
                href={{
                  pathname: `/deckbuilder/${gameMode}`,
                  query: { deckClass: deckClass.slug, format: "standard" },
                }}
              >
                <div className="relative border-orange-400 border-8 border-double rounded-sm">
                  <div className="absolute bg-black border border-orange-500 bg-opacity-80 w-full h-12 bottom-8 flex items-center gap-4 px-4">
                    <Image
                      src={`/hero_icons/${deckClass.slug}.png`}
                      width={193}
                      height={193}
                      className="size-16 drop-shadow-[1px_0_0_orange]"
                      alt={deckClass.name}
                    />
                    <div className="text-xl">{deckClass.name}</div>
                  </div>
                  <Image
                    src={`/heroes/${deckClass.slug}.jpg`}
                    width={1440}
                    height={1440}
                    className="aspect-[3/4] object-cover"
                    alt={deckClass.name}
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
