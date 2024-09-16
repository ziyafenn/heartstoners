"use client";

import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRef, useState } from "react";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { AssetIcon } from "@/components/AssetIcon";
import type { DeckFilters } from "@/types/deck.type";

type Props = {
  onUpdateFilters: (payload: FormData) => void;
};

export function Filters({ onUpdateFilters }: Props) {
  const [values, setValues] = useState<DeckFilters>({
    craftable_decks: "false",
    deck_format: "standard",
  });
  const formRef = useRef<HTMLFormElement>(null);

  async function onValueChange(key: string, value: unknown) {
    setValues((state) => ({ ...state, [key]: value }));

    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);
    formData.set(key, String(value));
    onUpdateFilters(formData);
  }

  return (
    <div className="flex flex-col items-start">
      <Toggle
        onPressedChange={(value) => onValueChange("craftable_decks", value)}
        pressed={values.craftable_decks === "true"}
      >
        Show Craftable
      </Toggle>
      <form
        ref={formRef}
        action={onUpdateFilters}
        className="flex flex-1 flex-col gap-16"
      >
        {values.craftable_decks === "true" && (
          <Input type="number" name="dustCost" defaultValue={0} />
        )}
        <ToggleGroup
          type="single"
          orientation="vertical"
          className="flex-col items-start"
          onValueChange={(value) =>
            value && onValueChange("deck_format", value)
          }
          value={values.deck_format}
        >
          <ToggleGroupItem value="standard">Standard</ToggleGroupItem>
          <ToggleGroupItem value="wild">Wild</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          type="single"
          orientation="vertical"
          className="flex-col items-start"
          onValueChange={(value) => onValueChange("deck_class", value)}
        >
          {CARD_CLASSES.map((cardClass) => {
            if (cardClass.slug === "neutral") return;
            return (
              <ToggleGroupItem
                value={cardClass.slug}
                key={cardClass.id}
                className="flex gap-1"
              >
                <AssetIcon
                  type="hero"
                  name={cardClass.slug}
                  className="size-6"
                />
                {cardClass.name}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
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
      </form>
    </div>
  );
}
