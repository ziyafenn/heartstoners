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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const deckClass = searchParams.get("class") as string;

  function onValueChange(value: string, type: "tab" | "select") {
    const form = formRef.current!;
    const formData = new FormData(form);
    formData.append("filter", "true");
    if (type === "tab") formData.append("class", value);

    action(formData);
  }

  return (
    <form ref={formRef}>
      <Tabs
        defaultValue={deckClass}
        className="w-[400px]"
        onValueChange={(value) => onValueChange(value, "tab")}
      >
        <TabsList>
          <TabsTrigger value={deckClass}>{deckClass}</TabsTrigger>
          <TabsTrigger value="neutral">Neutral</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
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
