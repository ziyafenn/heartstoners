"use client";

import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRef, useState } from "react";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { AssetIcon } from "@/components/AssetIcon";

type Props = {
  onUpdateFilters: (activeFilters: FormData) => Promise<unknown>;
};

export function Filters({ onUpdateFilters }: Props) {
  const [isCraftableToggled, setIsCraftableToggled] = useState(false);
  const [deckFormat, setDeckFormat] = useState("standard");
  const formRef = useRef<HTMLFormElement>(null);

  async function onValueChange(key: string, value: unknown) {
    const formData = new FormData(formRef.current!);

    if (key === "craftable_decks") setIsCraftableToggled(value as boolean);
    if (key === "deck_format") setDeckFormat(value as string);

    formData.set(key, String(value));
    onUpdateFilters(formData);
  }

  async function onSubmit(formData: FormData) {
    formData.set("craftable_decks", String(isCraftableToggled));
    onUpdateFilters(formData);
  }
  return (
    <div className="flex flex-col items-start">
      <Toggle
        onPressedChange={(value) => onValueChange("craftable_decks", value)}
      >
        Show Craftable
      </Toggle>
      <form
        ref={formRef}
        action={onSubmit}
        className="flex flex-1 flex-col gap-16"
      >
        {isCraftableToggled && (
          <Input type="number" name="dustCost" defaultValue={0} />
        )}
        <ToggleGroup
          type="single"
          orientation="vertical"
          className="flex-col items-start"
          onValueChange={(value) =>
            value && onValueChange("deck_format", value)
          }
          value={deckFormat}
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
      </form>
    </div>
  );
}
