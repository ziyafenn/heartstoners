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

  function onValueChange(value: string) {
    formRef.current?.requestSubmit();
  }

  return (
    <form action={action} ref={formRef}>
      <Select name="class" onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Classes" />
        </SelectTrigger>
        <SelectContent>
          {minionTypes.map((deckClass) => (
            <SelectItem value={deckClass.slug} key={deckClass.id}>
              {deckClass.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </form>
  );
}
