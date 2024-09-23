import { createDeck } from "@/actions/deckBuider.action";
import { AssetIcon } from "@/components/AssetIcon";
import { CardTypeIcon } from "@/components/CardTypeIcon";
import { DeckManaChart } from "@/components/DeckManaChart";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { findData, type getDeckData } from "@/lib/utils";
import type { DeckInitParams } from "@/types/deck.type";
import type {
  Card,
  CardClass,
  CardSeachParams,
  CardType,
} from "@/types/hs.type";
import type { Tables } from "@/types/supabase.type";
import type { CardRarity } from "blizzard.js/dist/resources/hs";
import { InfoIcon } from "lucide-react";
import {
  type ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFormStatus } from "react-dom";

type Props = {
  deckSearchParams: CardSeachParams;
  selectedCards: Card[];
  deckData: ReturnType<typeof getDeckData>;
  isOpen: boolean;
  toggleOpen: (open: boolean) => void;
  subArchetype: Tables<"meta_sub_archetypes"> | null;
};

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
  deckData,
  isOpen,
  toggleOpen,
  subArchetype,
}: Props) {
  const formRef = useRef<(() => void) | HTMLFormElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const deckClass = deckSearchParams.multiClass;
  const [isFormMounted, setIsFormMounted] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const {
    cardRarities,
    cardTypes,
    card_ids,
    dust_cost_per_card,
    dust_cost_sum,
    sideboard_cards,
  } = deckData;
  // const aggroCount = 0;
  // const midrangeCount = 0;
  // const controlCount = 0;

  // for (const [name, count] of Object.entries(manaCostCountsSum)) {
  //   const manaCost = parseInt(name);
  //   if (manaCost <= 3) {
  //     aggroCount += Number(count);
  //   } else if (manaCost <= 5) {
  //     midrangeCount += Number(count);
  //   } else {
  //     controlCount += Number(count);
  //   }
  // }

  // function getArchetype(): Enums<"archetypes"> {
  //   if (aggroCount > midrangeCount && aggroCount > controlCount) return "aggro";
  //   if (midrangeCount > aggroCount && midrangeCount > controlCount)
  //     return "midrange";
  //   else return "control";
  // }

  const initParams: DeckInitParams = {
    card_ids: card_ids,
    dust_cost_per_card: dust_cost_per_card,
    deck_class: deckClass as CardClass["slug"],
    deck_format: deckSearchParams.set as "standard",
    sub_archetype: subArchetype?.id ?? null,
    sideboard_cards,
    dust_cost_sum,
  };

  const cardTypeAllocation = Object.entries(cardTypes);
  const cardRarityAllocation = Object.entries(cardRarities);

  const [state, formAction] = useActionState(createDeck, { initParams });

  function onNameInputChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;

    if (!input.checkValidity()) {
      input.setCustomValidity("");
    }
  }

  const { userInput } = state;

  useEffect(() => {
    if (!isFormMounted) return;
    const form = formRef.current as HTMLFormElement;

    function validateForm(event: SubmitEvent) {
      const nameInput = nameInputRef.current;

      if (!form || !nameInput) return;
      const cardClassName = findData(CARD_CLASSES, "slug", deckClass).name;

      // Rule 1: Ensure card class name is a whole word
      const regexPattern1 = `\\b${cardClassName}\\b`;
      const regex1 = new RegExp(regexPattern1, "i"); // Case-insensitive regex

      // Rule 2: Ensure card class name is part of a phrase with at least one other word
      const regexPattern2 = `\\b\\w+\\b\\s+\\b${cardClassName}\\b|\\b${cardClassName}\\b\\s+\\b\\w+\\b`;
      const regex2 = new RegExp(regexPattern2, "i"); // Case-insensitive regex

      if (!regex1.test(nameInput.value)) {
        event.preventDefault();
        nameInput.setCustomValidity(
          `Deck class should be part of the deck name (${cardClassName})`,
        );
        return nameInput.reportValidity();
      }
      if (!regex2.test(nameInput.value)) {
        event.preventDefault();
        nameInput.setCustomValidity(
          `Deck name should include at least one word before or after the deck class (${cardClassName})`,
        );
        return nameInput.reportValidity();
      }
    }

    form.addEventListener("submit", validateForm);

    return () => {
      form.removeEventListener("submit", validateForm);
    };
  }, [isFormMounted, deckClass]);

  useEffect(() => {
    if (state.error) setIsAlertOpen(true);
  }, [state]);

  return (
    <>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>There was an issue</AlertDialogTitle>
            <AlertDialogDescription>{state.error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Sheet open={isOpen} defaultOpen onOpenChange={toggleOpen}>
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
              <DeckManaChart selectedCards={selectedCards} />
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
                        name={cardRarity[0].toLowerCase() as CardRarity}
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
              ref={(node) => {
                formRef.current = node;
                setIsFormMounted(!!node);
              }}
            >
              <div className="flex flex-1 flex-col gap-4">
                <div>
                  <Label htmlFor="name">Deck name</Label>
                  <Input
                    ref={nameInputRef}
                    name="name"
                    onChange={onNameInputChange}
                    key="name"
                    type="text"
                    required
                    autoComplete="off"
                    autoFocus
                    spellCheck="true"
                    maxLength={40}
                    placeholder="Include the class name to capture your Hearthstone deck's essence"
                    defaultValue={userInput?.name}
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
                    defaultValue={userInput?.description}
                  />
                </div>
                <div>
                  <Label htmlFor="youtube_id">Youtube link</Label>
                  <Input
                    name="youtube_id"
                    key="youtube_id"
                    type="url"
                    autoComplete="off"
                    pattern="^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$"
                    placeholder="Make sure to add youtube video link if you got one!"
                    defaultValue={state.userInput?.youtube_id ?? ""}
                  />
                </div>
              </div>
              <div className="flex items-start gap-8">
                <div>
                  <Label>Archetype</Label>
                  <Select
                    defaultValue="aggro"
                    name="archetype"
                    required
                    value={userInput?.archetype}
                  >
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
                        Sub-archetype is determined based on current meta and
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
    </>
  );
}
