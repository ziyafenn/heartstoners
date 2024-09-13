import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createDeck } from "@/actions/deckBuider.action";
import { Button } from "@/components/ui/button";
import { ResponsiveBar } from "@nivo/bar";
import {
  Card,
  CardClass,
  CardSeachParams,
  CardType,
  Rarity,
  SideboardCards,
} from "@/types/hs.type";
import { getDustCost } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMetasByClass } from "@/service/supabase.service";
import { Enums, Tables } from "@/types/supabase.type";
import { DeckInitParams } from "@/types/deck.type";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CARD_TYPES } from "@/lib/cardTypes";
import { CARD_RARITIES } from "@/lib/cardRarities";
import { AssetIcon } from "@/components/AssetIcon";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  InfoIcon,
  MapIcon,
  Sparkles,
  SquareUserRound,
  SwordsIcon,
  VenetianMask,
} from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config";
import { CARD_CLASSES } from "@/lib/cardClasses";

const fullConfig = resolveConfig(tailwindConfig);
const {
  theme: { colors },
} = fullConfig;

type Props = {
  deckSearchParams: CardSeachParams;
  selectedCards: Card[];
  sideboardCards: SideboardCards[];
  isOpen: boolean;
  toggleOpen: (open: boolean) => void;
};

function BarChart({
  manaCostCounts,
}: {
  manaCostCounts: { name: string; count: number }[];
}) {
  return (
    <div className="h-40">
      <ResponsiveBar
        axisLeft={null}
        data={manaCostCounts}
        keys={["count"]}
        borderRadius={3}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 0 }}
        padding={0.4}
        colors={[colors.blue[300]]}
        isInteractive={false}
        theme={{
          grid: { line: { stroke: colors.border } },
          axis: { legend: { text: { fill: "#FFFFFF" } } },
          labels: { text: { fill: "red" } },
          text: { fill: "white" },
        }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
      />
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      Submit
    </Button>
  );
}

export default function DeckBuilderForm({
  selectedCards,
  deckSearchParams,
  sideboardCards,
  isOpen,
  toggleOpen,
}: Props) {
  const searchParams = useSearchParams();
  const deckClass = searchParams.get("deckClass") as CardClass["slug"];
  const [subArchetype, setSubArchetype] =
    useState<Tables<"meta_sub_archetypes">>();

  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const manaCostCountsSum = selectedCards.reduce(
    (acc, card) => {
      acc[card.manaCost] = (acc[card.manaCost] || 0) + 1;
      return acc;
    },
    { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 } as {
      [key: number]: number;
    },
  );
  let aggroCount = 0;
  let midrangeCount = 0;
  let controlCount = 0;
  let dust_cost_sum = 0;
  const dust_cost_per_card: number[] = [];
  const card_ids: number[] = [];
  const manaCostCounts: { name: string; count: number }[] = [];
  const cardTypes: Record<CardType["name"], number> = {
    Hero: 0,
    Location: 0,
    Minion: 0,
    Spell: 0,
    Weapon: 0,
    HeroPower: 0,
    Reward: 0,
  };
  const cardRarities: Record<Rarity["name"], number> = {
    Common: 0,
    Free: 0,
    Epic: 0,
    Rare: 0,
    Legendary: 0,
  };

  selectedCards.forEach((card) => {
    dust_cost_per_card.push(getDustCost(card.rarityId));
    dust_cost_sum += getDustCost(card.rarityId);
    card_ids.push(card.id);
    const cardTypeName = CARD_TYPES.find(
      (cardType) => cardType.id === card.cardTypeId,
    )!.name;
    cardTypes[cardTypeName] = cardTypes[cardTypeName] + 1;
    const cardRarityName = CARD_RARITIES.find(
      (cardRarity) => cardRarity.id === card.rarityId,
    )!.name;
    cardRarities[cardRarityName] = cardRarities[cardRarityName] + 1;
  });

  const sideboard_cards = sideboardCards.flatMap((sideboard) => {
    const primaryId = sideboard.sideboardCard.id;
    return sideboard.cardsInSideboard.map((card) => `${card.id}:${primaryId}`);
  });

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
  const getSubArchetype = useCallback(async () => {
    const metas = await getMetasByClass(deckClass);

    const bestMatch = metas!.reduce(
      (best, meta) => {
        const metaMatches = meta!.core_cards!.filter((coreCard) =>
          selectedCards
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
  }, [deckClass, selectedCards]);

  const initParams: DeckInitParams = {
    card_ids: card_ids,
    dust_cost_per_card: dust_cost_per_card,
    deck_class: deckClass as CardClass["slug"],
    deck_format: deckSearchParams.set as "standard",
    sub_archetype: subArchetype?.id ?? null,
    sideboard_cards: sideboard_cards.length ? sideboard_cards : null,
    dust_cost_sum,
  };

  const cardTypeAllocation = Object.entries(cardTypes);
  const cardRarityAllocation = Object.entries(cardRarities);

  function CardTypeIcon({ name }: { name: CardType["name"] }) {
    switch (name) {
      case "Weapon":
        return <SwordsIcon className="size-5" />;

      case "Hero":
        return <SquareUserRound className="size-5" />;

      case "Spell":
        return <Sparkles className="size-5" />;

      case "Location":
        return <MapIcon className="size-5" />;

      default:
        return <VenetianMask className="size-5" />;
    }
  }

  const [state, formAction] = useFormState(createDeck, {
    data: initParams,
  });

  useEffect(() => {
    if (state.error) window.alert(state.error);
  }, [state.error]);

  useEffect(() => {
    if (isOpen) getSubArchetype();
  }, [isOpen, getSubArchetype]);

  return (
    <Sheet open={isOpen} onOpenChange={toggleOpen}>
      <SheetContent
        onInteractOutside={(event) => event.preventDefault()}
        side="left"
        className="flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>Create your deck</SheetTitle>
          <SheetDescription>
            Summarize your deck&apos;s strategy and key features
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-8">
          <div className="flex flex-col gap-4 text-sm">
            <BarChart manaCostCounts={manaCostCounts} />
            <div className="flex items-center gap-2">
              <span>Dust Cost:</span>
              <span className="flex gap-1">
                <AssetIcon type="asset" name="dust" />
                <span className="font-bold">{dust_cost_sum}</span>
              </span>
            </div>
            <ul className="flex flex-wrap divide-x-2">
              {cardRarityAllocation.map((cardRarity) => {
                if (cardRarity[1] === 0) return null;
                return (
                  <li
                    key={cardRarity[0]}
                    className="flex gap-1 px-3 first:pl-0"
                  >
                    <AssetIcon
                      type="rarity"
                      name={cardRarity[0].toLowerCase()}
                    />
                    {cardRarity[0]}:
                    <span className="font-bold">{cardRarity[1]}</span>
                  </li>
                );
              })}
            </ul>
            <ul className="flex flex-wrap divide-x-2">
              {cardTypeAllocation.map((cardType) => {
                if (cardType[1] === 0) return null;
                return (
                  <li
                    key={cardType[0]}
                    className="flex items-center gap-1 px-3 first:pl-0"
                  >
                    <CardTypeIcon name={cardType[0] as CardType["name"]} />
                    {cardType[0]}:
                    <span className="font-bold">{cardType[1]}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <form
            action={formAction}
            className="flex flex-1 flex-col gap-8"
            ref={formRef}
          >
            <div className="flex flex-1 flex-col gap-4">
              <div>
                <Label htmlFor="name">Deck name</Label>
                <Input
                  ref={nameInputRef}
                  name="name"
                  key="name"
                  type="text"
                  required
                  autoComplete="off"
                  autoFocus
                  spellCheck="true"
                  placeholder="Include the class name to capture your Hearthstone deck's essence"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  name="description"
                  maxLength={3000}
                  className="flex-1 resize-none"
                  spellCheck="true"
                  autoCapitalize="sentences"
                  draggable={false}
                  placeholder="Describe Your Deck's Strategy and Key Cards"
                />
              </div>
              <div>
                <Label htmlFor="youtube_link">Youtube link</Label>
                <Input
                  name="youtube_link"
                  key="youtube_link"
                  type="url"
                  autoComplete="off"
                  pattern="^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$"
                  placeholder="Make sure to add youtube video link if you got one!"
                />
              </div>
            </div>
            <div className="flex items-start gap-8">
              <div>
                <Label>Archetype</Label>
                <Select defaultValue={getArchetype()} name="archetype" required>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Archetype" />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectItem value="aggro">Aggro</SelectItem>
                    <SelectItem value="midrange">Midrange</SelectItem>
                    <SelectItem value="control">Control</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sub-archetype</Label>
                <div className="flex h-10 items-center gap-2">
                  <span className="text-lg">
                    {subArchetype?.name ?? "None"}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Sub-archetype is determined based on current metas and
                      cards in your deck
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            <SubmitButton />
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
