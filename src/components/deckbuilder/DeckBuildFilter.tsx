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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const deckClass = searchParams.get("deckClass") as string;

  function onValueChange(value: string[] | string, type: "toggle" | "select") {
    const form = formRef.current!;
    const formData = new FormData(form);
    formData.append("filter", "true");
    if (type === "toggle") formData.append("class", value);

    action(formData);
  }

  return (
    <form ref={formRef}>
      <ToggleGroup
        defaultValue={["neutral", deckClass]}
        className="w-[400px]"
        type="multiple"
        onValueChange={(value) => onValueChange(value, "toggle")}
      >
        <ToggleGroupItem value={deckClass}>{deckClass}</ToggleGroupItem>
        <ToggleGroupItem value="neutral">Neutral</ToggleGroupItem>
      </ToggleGroup>
      <Select
        name="minionType"
        onValueChange={(value) => onValueChange(value, "select")}
      >
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
      <Select
        name="rarity"
        onValueChange={(value) => onValueChange(value, "select")}
      >
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
    </form>
  );
}
