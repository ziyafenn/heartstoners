"use client";

import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type HTMLAttributes, useRef, useState } from "react";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { AssetIcon } from "@/components/AssetIcon";
import type { DeckFilters } from "@/types/deck.type";
import { Combobox } from "@/components/ComboBox";
import type { Tables } from "@/types/supabase.type";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type Props = {
  onUpdateFilters: (payload: FormData) => void;
  subArchetypes: Tables<"meta_sub_archetypes">[];
};

function Filter({
  name,
  children,
  className,
}: {
  name: string;
  children: React.ReactNode;
  className?: HTMLAttributes<HTMLDivElement>["className"];
}) {
  return (
    <div className="flex w-full flex-col overflow-clip rounded border border-violet-950 bg-black/20">
      <div className="border-violet-950 border-b bg-violet-950/50 p-3 font-medium">
        {name}
      </div>
      <div className={className}>{children}</div>
    </div>
  );
}

export function Filters({ onUpdateFilters, subArchetypes }: Props) {
  const [values, setValues] = useState<DeckFilters>({
    craftable_decks: "false",
    deck_format: "standard",
    deck_class: "",
    sub_archetype: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  async function onValueChange(
    key: keyof DeckFilters,
    value: unknown,
    isReset?: boolean,
  ) {
    setValues((state) => ({ ...state, [key]: value }));
    if (key === "deck_class" && values.sub_archetype) {
      setValues((state) => ({ ...state, sub_archetype: null }));
    }

    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);

    if (isReset) formData.delete(key);
    else formData.set(key, String(value));

    onUpdateFilters(formData);
  }

  const subs = subArchetypes.map((subArch) => ({
    value: subArch.id,
    label: subArch.name,
    cardClass: subArch.card_class,
  }));

  const filteredSubArches = values.deck_class
    ? subs.filter((subArch) => subArch.cardClass === values.deck_class)
    : subs;

  return (
    <div className="flex flex-col items-start">
      <form
        ref={formRef}
        action={onUpdateFilters}
        className="flex flex-1 flex-col items-start gap-4"
      >
        <Filter name="Deck Class" className="p-4">
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
                          className="size-10"
                        />
                      </ToggleGroupItem>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{cardClass.name}</TooltipContent>
                </Tooltip>
              );
            })}
          </ToggleGroup>
        </Filter>
        <Filter name="My collection">
          <Toggle
            onPressedChange={(value) =>
              onValueChange("craftable_decks", String(value))
            }
            pressed={values.craftable_decks === "true"}
            size="lg"
          >
            Show Craftable
          </Toggle>
          {values.craftable_decks === "true" && (
            <span className="flex items-center justify-between p-4">
              <Label>Max dust cost</Label>
              <Input
                type="number"
                className="w-24"
                name="dustCost"
                defaultValue={0}
              />
            </span>
          )}
        </Filter>
        <Filter name="Sub Archetypes" className="flex flex-col gap-4 p-4">
          <Combobox
            data={filteredSubArches}
            value={values.sub_archetype}
            selectItem={(value) => onValueChange("sub_archetype", value)}
          />
          {values.sub_archetype && (
            <Badge
              className="w-max cursor-pointer"
              onClick={() => onValueChange("sub_archetype", "", true)}
            >
              {
                filteredSubArches.find(
                  (sub) => sub.value === values.sub_archetype,
                )?.label
              }
              <X className="ml-1 size-4" />
            </Badge>
          )}
        </Filter>
        <Filter name="Game format">
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
        </Filter>

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
      </form>
    </div>
  );
}
