"use client";

import { Toggle } from "@/components/ui/toggle";
import { DeckFilters } from "@/types/deck.type";
import { useState } from "react";

type Props = {
  onUpdateFilters: (activeFilters: DeckFilters) => Promise<unknown>;
};

export function Filters({ onUpdateFilters }: Props) {
  const [activeFilters, setActiveFilters] = useState<DeckFilters>();

  async function onValueChange(key: "craftable_decks", value: boolean) {
    let currentFilters: DeckFilters;

    if (activeFilters) {
      currentFilters = { ...activeFilters, [key]: value };
    } else {
      currentFilters = { [key]: value };
    }
    setActiveFilters(currentFilters);
    onUpdateFilters(currentFilters);
  }
  return (
    <div className="flex">
      <Toggle
        onPressedChange={(value) => onValueChange("craftable_decks", value)}
      >
        Show Craftable
      </Toggle>
    </div>
  );
}
