import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { createDeck } from "@/actions/deckBuider.action";
import { Button } from "./ui/button";
import { ResponsiveBar } from "@nivo/bar";
import { Card, CardSeachParams } from "@/types/hs.type";
import { getDustCost } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMetasByClass } from "@/service/supabase";
import { Enums, Tables } from "@/types/superbase.type";
import { DeckInitParams } from "@/types/deck.type";
import { useSearchParams } from "next/navigation";
import { CardClass } from "blizzard.js/dist/resources/hs";
import { useState } from "react";

type SelectedCards = Map<number, { count: number } & Card>;

type Props = {
  children: React.ReactNode;
  deckSearchParams: CardSeachParams;
  selectedCards: SelectedCards;
};

function BarChart({
  manaCostCounts,
}: {
  manaCostCounts: { name: string; count: number }[];
}) {
  return (
    <div className="flex-1">
      <ResponsiveBar
        axisLeft={null}
        data={manaCostCounts}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#2563eb"]}
        isInteractive={false}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
      />
    </div>
  );
}

export default function DeckBuilderForm({
  children,
  selectedCards,
  deckSearchParams,
}: Props) {
  const searchParams = useSearchParams();
  const deckClass = searchParams.get("class") as string;
  const [subArchetype, setSubArchetype] =
    useState<Tables<"meta_sub_archetypes">>();

  const selectedCardsValues = Array.from(selectedCards.values());
  const manaCostCountsSum = selectedCardsValues.reduce(
    (acc, card) => {
      acc[card.manaCost] = (acc[card.manaCost] || 0) + 1 * card.count;
      return acc;
    },
    { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 } as {
      [key: number]: number;
    },
  );
  const manaCostCounts: { name: string; count: number }[] = [];
  let aggroCount = 0;
  let midrangeCount = 0;
  let controlCount = 0;
  const dustCost = selectedCardsValues.reduce(
    (total, card) => total + getDustCost(card.rarityId) * card.count,
    0,
  );

  for (const [name, count] of Object.entries(manaCostCountsSum)) {
    const key = name === "7" ? "7+" : name;
    manaCostCounts.push({ name: key, count: Number(count) });

    const manaCost = parseInt(name);
    if (manaCost <= 3) {
      aggroCount += Number(count);
    } else if (manaCost <= 5) {
      midrangeCount += Number(count);
    } else {
      controlCount += Number(count);
    }
  }

  function getArchetype(): Enums<"archetypes"> {
    if (aggroCount > midrangeCount && aggroCount > controlCount) return "aggro";
    if (midrangeCount > aggroCount && midrangeCount > controlCount)
      return "midrange";
    else return "control";
  }

  async function getSubArchetype() {
    const metas = await getMetasByClass(deckClass);

    const bestMatch = metas!.reduce(
      (best, meta) => {
        const metaMatches = meta!.core_cards!.filter((coreCard) =>
          selectedCardsValues
            .map((selectedCard) => selectedCard.id)
            .includes(coreCard),
        ).length;
        return metaMatches > best.matchedCardCount
          ? { matchedCardCount: metaMatches, meta }
          : best;
      },
      { matchedCardCount: 0, meta: {} as Tables<"meta_sub_archetypes"> },
    );

    if (bestMatch.matchedCardCount > 2) setSubArchetype(bestMatch.meta);
  }

  const params: DeckInitParams = {
    card_ids: selectedCardsValues
      .map((card) => Array(card.count).fill(card.id))
      .flat(),
    dust_cost: dustCost,
    main_card_ids: [],
    deck_class: deckClass as CardClass,
    deck_format: deckSearchParams.set as "standard",
    game_mode: deckSearchParams.gameMode as "constructed",
    sub_archetype: subArchetype?.id ?? null,
  };

  const createUserDeck = createDeck.bind(null, params);

  return (
    <Sheet>
      <SheetTrigger asChild onClick={getSubArchetype}>
        {children}
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-4">
            <BarChart manaCostCounts={manaCostCounts} />
            <div>Dust Cost {dustCost}</div>
            {/* 
              chart
              archetype?
              subarchetype
              dust cost
              
            */}
          </div>
          <form action={createUserDeck} className="flex flex-col gap-4">
            <Input name="name" key="name" type="text" required />
            <Textarea name="description" maxLength={1000} />
            <Select defaultValue={getArchetype()} name="archetype" required>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Archetype" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aggro">Aggro</SelectItem>
                <SelectItem value="midrange">Midrange</SelectItem>
                <SelectItem value="control">Control</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
