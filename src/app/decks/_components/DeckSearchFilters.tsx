"use client";
import { AssetIcon } from "@/components/AssetIcon";
import { Combobox } from "@/components/ComboBox";
import { SidebarItemContainer } from "@/components/SidebarItemContainer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { findData } from "@/lib/utils";
import type { DeckFilters } from "@/types/deck.type";
import type { Tables } from "@/types/supabase.type";
import { CircleHelp, X } from "lucide-react";
import Link from "next/link";
import { type KeyboardEvent, type RefObject, useState } from "react";

type Props = {
  onUpdateFilters: (payload: FormData) => void;
  subArchetypes: Tables<"meta_sub_archetypes">[];
  availableDust: number;
  formRef: RefObject<HTMLFormElement>;
  hasHsAccount: boolean;
};

export function Filters({
  onUpdateFilters,
  subArchetypes,
  availableDust,
  formRef,
  hasHsAccount,
}: Props) {
  const [values, setValues] = useState<DeckFilters>({
    craftable_decks: "false",
    deck_format: "standard",
    deck_class: "",
    sub_archetype: "",
  });
  const [dustCostValue, setDustCostValue] = useState(String(availableDust));
  const subs = subArchetypes.map((subArch) => ({
    id: String(subArch.id),
    label: subArch.name,
    cardClass: subArch.card_class,
    className: findData(CARD_CLASSES, "slug", subArch.card_class).name,
  }));

  const filteredSubArches = values.deck_class
    ? subs.filter((subArch) => subArch.cardClass === values.deck_class)
    : subs;

  async function onValueChange(
    key: keyof DeckFilters,
    value: unknown,
    isReset?: boolean,
  ) {
    const subArchCardClass = filteredSubArches.find(
      (subArch) => subArch.id === values.sub_archetype,
    )?.cardClass;

    setValues((state) => ({ ...state, [key]: value }));
    if (key === "deck_class" && subArchCardClass !== value) {
      setValues((state) => ({ ...state, sub_archetype: undefined }));
    }

    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);

    if (isReset) formData.delete(key);
    else formData.set(key, String(value));

    onUpdateFilters(formData);
  }

  function onDustCostChange(e: KeyboardEvent<HTMLInputElement>) {
    const { value } = e.currentTarget;
    if (value === dustCostValue) e.preventDefault();
    else setDustCostValue(value);
  }

  return (
    <div className="flex flex-col items-start">
      <form
        ref={formRef}
        action={onUpdateFilters}
        className="flex flex-1 flex-col items-start gap-4"
      >
        <SidebarItemContainer name="Deck Class" className="p-4">
          <ToggleGroup
            type="single"
            orientation="horizontal"
            className="flex flex-wrap items-center justify-center gap-2"
            onValueChange={(value) => onValueChange("deck_class", value)}
            value={values.deck_class}
          >
            {CARD_CLASSES.map((cardClass) => {
              if (cardClass.slug === "neutral") return;
              return (
                <Tooltip key={cardClass.id}>
                  <TooltipTrigger asChild>
                    <span>
                      <ToggleGroupItem
                        value={cardClass.slug}
                        variant="asset"
                        key={cardClass.slug}
                        className="flex gap-1"
                        size="asset"
                      >
                        <AssetIcon
                          type="hero"
                          name={cardClass.slug}
                          className="size-10 rounded-full border border-amber-900"
                        />
                      </ToggleGroupItem>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{cardClass.name}</TooltipContent>
                </Tooltip>
              );
            })}
          </ToggleGroup>
        </SidebarItemContainer>
        <SidebarItemContainer name="My collection">
          <div className="flex items-center justify-between pr-4">
            <Toggle
              className="pr-0"
              onPressedChange={(value) =>
                onValueChange("craftable_decks", String(value))
              }
              pressed={values.craftable_decks === "true"}
              size="lg"
              disabled={!hasHsAccount}
            >
              Show Craftable
            </Toggle>
            {!hasHsAccount && (
              <Tooltip>
                <TooltipTrigger>
                  <CircleHelp className="size-4" />
                </TooltipTrigger>
                <TooltipContent>
                  Make sure you are signed in and have your{" "}
                  <Link
                    href="/auth/hsConnect/"
                    className="text-blue-500 underline"
                  >
                    HSReplay account connected
                  </Link>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {values.craftable_decks === "true" && (
            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <Label>Max dust cost</Label>
                <Input
                  type="number"
                  defaultValue={availableDust}
                  className="w-24"
                  name="dustCost"
                  onKeyDown={(e) => e.key === "Enter" && onDustCostChange(e)}
                />
              </div>
              <span className="flex items-baseline text-sm">
                Available dust:
                <AssetIcon type="asset" name="dust" className="mr-1 ml-2" />
                <span className="font-bold">{availableDust}</span>
              </span>
            </div>
          )}
        </SidebarItemContainer>
        <SidebarItemContainer name="Archetypes" className="flex flex-col">
          <div className="flex flex-col gap-4 p-4">
            <Combobox
              data={filteredSubArches}
              selectItem={(value) => onValueChange("sub_archetype", value)}
            />
            {values.sub_archetype && (
              <Badge
                className="w-max cursor-pointer"
                onClick={() => onValueChange("sub_archetype", "", true)}
              >
                {
                  filteredSubArches.find(
                    (sub) => sub.id === values.sub_archetype,
                  )?.label
                }
                <X className="ml-1 size-4" />
              </Badge>
            )}
          </div>
          <Separator />
          <ToggleGroup
            type="single"
            orientation="vertical"
            className="flex-col items-start"
            onValueChange={(value) => onValueChange("archetype", value)}
            value={values.archetype}
          >
            <ToggleGroupItem value="aggro" size="lg">
              Aggro
            </ToggleGroupItem>
            <ToggleGroupItem value="midrange" size="lg">
              Midrange
            </ToggleGroupItem>
            <ToggleGroupItem value="control" size="lg">
              Control
            </ToggleGroupItem>
          </ToggleGroup>
        </SidebarItemContainer>
        <SidebarItemContainer name="Game format">
          <ToggleGroup
            type="single"
            orientation="vertical"
            className="flex-col items-start"
            onValueChange={(value) =>
              value && onValueChange("deck_format", value)
            }
            value={values.deck_format}
          >
            <ToggleGroupItem value="standard" size="lg">
              Standard
            </ToggleGroupItem>
            <ToggleGroupItem value="wild" size="lg">
              Wild
            </ToggleGroupItem>
          </ToggleGroup>
        </SidebarItemContainer>

        <input
          type="hidden"
          value={values.deck_format}
          hidden
          name="deck_format"
        />
        <input
          type="hidden"
          value={values.craftable_decks}
          hidden
          name="craftable_decks"
        />
        <input
          type="hidden"
          value={values.deck_class}
          hidden
          name="deck_class"
        />
        <input
          type="hidden"
          value={values.sub_archetype ?? ""}
          hidden
          name="sub_archetype"
        />
        <input type="submit" hidden />
      </form>
    </div>
  );
}
