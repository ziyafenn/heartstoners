"use client";

import { filterDecks } from "@/actions/deckSearch.action";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

type Props = {
  onUpdateFilters: (activeFilters: Record<string, boolean>) => Promise<unknown>;
};

export function Filters({ onUpdateFilters }: Props) {
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>();

  async function onValueChange(key: "craftable_decks", value: boolean) {
    const currentFilters = { ...activeFilters };
    currentFilters[key] = value;
    setActiveFilters(currentFilters);

    onUpdateFilters(activeFilters);
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
