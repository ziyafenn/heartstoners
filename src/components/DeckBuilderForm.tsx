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
import { DeckType, DeckGeneratedData, Archetype } from "@/types/deck.type";
import { createDeck } from "@/actions/deckBuider.action";
import { Button } from "./ui/button";
import { ResponsiveBar } from "@nivo/bar";
import { Card } from "@/types/hs.type";
import { getDustCost } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectedCards = Map<number, { count: number } & Card>;

type Props = {
  children: React.ReactNode;
  deckType: DeckType;
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
  deckType,
}: Props) {
  const manaCostCountsSum = Array.from(selectedCards.values()).reduce(
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
  const dustCost = Array.from(selectedCards.values()).reduce(
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

  function getArchetype(): Archetype {
    if (aggroCount > midrangeCount && aggroCount > controlCount) return "aggro";
    if (midrangeCount > aggroCount && midrangeCount > controlCount)
      return "midrange";
    else return "control";
  }

  const deckData: DeckGeneratedData = {
    cardIds: Array.from(selectedCards.values())
      .map((card) => Array(card.count).fill(card.id))
      .flat(),
    dustCost,
    gameVersion: "29.2.2",
    mainCardIds: [],
    ...deckType,
  };

  const createUserDeck = createDeck.bind(null, deckData);
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
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
