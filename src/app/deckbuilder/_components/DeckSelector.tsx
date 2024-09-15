"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loadDeckFromCode } from "@/actions/deckBuider.action";
import { AssetIcon } from "@/components/AssetIcon";
import { useState } from "react";

export function DeckSelector() {
  const [format, setFormat] = useState("standard");

  return (
    <div className="m-auto flex max-w-screen-lg flex-col gap-8">
      <div className="flex items-center justify-between">
        <Tabs value={format} onValueChange={setFormat} orientation="horizontal">
          <TabsList>
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="wild">Wild</TabsTrigger>
          </TabsList>
        </Tabs>
        <form action={loadDeckFromCode} className="flex gap-4">
          <Input name="deckCode" type="text" required />
          <Button type="submit">Find</Button>
        </form>
      </div>
      <ul className="grid grid-cols-3 gap-8">
        {CARD_CLASSES.map((cardClass) => {
          if (cardClass.slug === "neutral") return null;
          return (
            <li className="select-none" key={cardClass.id}>
              <Link
                href={{
                  pathname: `/deckbuilder/${format}`,
                  query: { deckClass: cardClass.slug },
                }}
              >
                <div className="relative rounded-sm border-8 border-orange-400 border-double">
                  <div className="absolute bottom-8 flex h-12 w-full items-center gap-4 border border-orange-500 bg-black/80 px-4">
                    <div className="size-16 drop-shadow-[1px_0_0_orange]">
                      <AssetIcon type="hero" name={cardClass.slug} />
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
