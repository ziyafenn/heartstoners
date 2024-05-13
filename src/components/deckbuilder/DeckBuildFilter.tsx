"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardType, Keyword, MinionTypes, Rarity } from "@/types/hs.type";
import { useRef } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSearchParams } from "next/navigation";
import { HeroIcon } from "../HeroIcon";
import { CardSearchOptions } from "blizzard.js/dist/resources/hs";
import { Input } from "../ui/input";

export function DeckBuilderFilter({
  action,
  minionTypes,
  rarities,
  keywords,
  cardTypes,
}: {
  action: (payload: FormData) => void;
  minionTypes: MinionTypes[];
  rarities: Rarity[];
  keywords: Keyword[];
  cardTypes: CardType[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const classRef = useRef<HTMLInputElement>(null);
  const manaCostRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const deckClass = searchParams.get("deckClass") as string;

  function onValueChange(
    value: string[] | string,
    type: keyof CardSearchOptions,
  ) {
    const form = formRef.current!;
    const deckClass = classRef.current!;
    const manaCost = manaCostRef.current!;
    const formattedValue = Array.isArray(value) ? value.join(",") : value;

    if (type === "class") deckClass.value = formattedValue;
    if (type === "manaCost") manaCost.value = formattedValue;

    const formData = new FormData(form);
    formData.set("filter", "true");

    action(formData);
  }

  const manaCost = [...Array(10).keys(), "10+"];

  return (
    <form
      ref={formRef}
      className="flex flex-wrap gap-4"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <ToggleGroup
        defaultValue={["neutral", deckClass]}
        type="multiple"
        onValueChange={(value) => onValueChange(value, "class")}
      >
        <ToggleGroupItem value={deckClass} className="size-10 p-0">
          <HeroIcon slug={deckClass} />
        </ToggleGroupItem>
        <ToggleGroupItem value="neutral" className="size-10 p-0">
          <HeroIcon slug="neutral" />
        </ToggleGroupItem>
      </ToggleGroup>
      <Select
        name="minionType"
        onValueChange={(value) => onValueChange(value, "minionType")}
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
        onValueChange={(value) => onValueChange(value, "rarity")}
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
      <Select
        name="keyword"
        onValueChange={(value) => onValueChange(value, "keyword")}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Keyword" />
        </SelectTrigger>
        <SelectContent>
          {keywords
            .filter((keyword) => keyword.gameModes.includes(5))
            .map((keyword) => (
              <SelectItem value={keyword.slug} key={keyword.id}>
                {keyword.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <Select
        name="type"
        onValueChange={(value) => onValueChange(value, "type")}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          {cardTypes.map((cardType) => (
            <SelectItem value={cardType.slug} key={cardType.id}>
              {cardType.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Text search"
        name="textFilter"
        className="w-48"
        type="text"
        onKeyDown={(e) => {
          const newValue = e.currentTarget.value;
          e.key === "Enter" && onValueChange(newValue, "textFilter");
        }}
      />
      <ToggleGroup
        type="multiple"
        onValueChange={(value) => onValueChange(value, "manaCost")}
      >
        {manaCost.map((mana, index) => (
          <ToggleGroupItem
            value={index === 10 ? "10^" : mana.toString()}
            key={mana}
            className="size-10 p-0 bg-[url(/assets/mana.png)] bg-contain bg-no-repeat font-outline-2 text-[16px]"
          >
            {mana}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <input
        hidden
        name="class"
        ref={classRef}
        type="hidden"
        defaultValue={["neutral", deckClass]}
      />
      <input hidden type="hidden" name="manaCost" ref={manaCostRef} />
    </form>
  );
}
