import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { HeroIcon } from "@/components/HeroIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { loadDeckFromCode } from "@/actions/deckBuider.action";

export default async function DeckBuilderMode() {
  return (
    <div className="m-auto flex max-w-screen-lg flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <form action={loadDeckFromCode} className="flex gap-4">
          <Input name="deckCode" type="text" required />
          <Button type="submit">Find</Button>
        </form>
        <Tabs defaultValue="standard">
          <TabsList>
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="wild">Wild</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ul className="grid grid-cols-3 gap-8 p-8">
        {CARD_CLASSES.map((cardClass) => {
          if (cardClass.slug === "neutral") return null;
          return (
            <li className="select-none" key={cardClass.id}>
              <Link
                href={{
                  pathname: `/deckbuilder/standard`, //TODO: update the format
                  query: { deckClass: cardClass.slug },
                }}
              >
                <div className="relative rounded-sm border-8 border-double border-orange-400">
                  <div className="absolute bottom-8 flex h-12 w-full items-center gap-4 border border-orange-500 bg-black/80 px-4">
                    <div className="size-16 drop-shadow-[1px_0_0_orange]">
                      <HeroIcon slug={cardClass.slug} />
                    </div>
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
