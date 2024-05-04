"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MinionTypes, Rarity } from "@/types/hs.type";
import { useRef } from "react";

export function DeckBuilderFilter({
  action,
  minionTypes,
  rarities,
}: {
  action: (payload: FormData) => void;
  minionTypes: MinionTypes[];
  rarities: Rarity[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  function onValueChange() {
    const form = formRef.current!;
    form.requestSubmit();
  }

  return (
    <form action={action} ref={formRef}>
      <Select name="minionType" onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Minion Types" />
        </SelectTrigger>
        <SelectContent>
          {minionTypes.map((deckClass) => (
            <SelectItem value={deckClass.slug} key={deckClass.id}>
              {deckClass.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select name="rarity" onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Rarity" />
        </SelectTrigger>
        <SelectContent>
          {rarities.map((rarity) => (
            <SelectItem value={rarity.slug} key={rarity.id}>
              {rarity.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input hidden type="hidden" name="filter" />
    </form>
  );
}
