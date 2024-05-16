"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardType, Keyword, MinionTypes, Rarity } from "@/types/hs.type";
import { useRef, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSearchParams } from "next/navigation";
import { HeroIcon } from "../HeroIcon";
import { CardSearchOptions } from "blizzard.js/dist/resources/hs";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

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

  const searchParams = useSearchParams();
  const deckClass = searchParams.get("deckClass") as string;
  const manaCost = [...Array(10).keys(), "10+"];

  const [values, setValues] = useState<
    Partial<Record<keyof CardSearchOptions, string | string[]>>
  >({
    class: ["neutral", deckClass],
    textFilter: "",
    manaCost: [],
  });
  const [textSearchActive, setTextSearchActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState<
    Map<Partial<keyof CardSearchOptions>, string>
  >(new Map());

  function onValueChange(
    value: string[] | string | null,
    type: keyof CardSearchOptions,
    isReset?: boolean,
  ) {
    const updatedFilters = new Map(activeFilters);
    const formattedValue = Array.isArray(value) ? value.join(",") : value;

    if (!(type === "class" || type === "manaCost")) {
      if (isReset) updatedFilters.delete(type);
      else updatedFilters.set(type, formattedValue!);
    }

    setValues((state) => ({ ...state, [type]: formattedValue }));
    setActiveFilters(updatedFilters);

    const form = formRef.current!;
    const formData = new FormData(form);

    isReset ? formData.delete(type) : formData.set(type, formattedValue!);
    formData.set("filter", "true");

    action(formData);
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        ref={formRef}
        className="flex flex-wrap gap-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <ToggleGroup
          defaultValue={values.class as string[]}
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
        <ToggleGroup
          type="multiple"
          onValueChange={(value) => onValueChange(value, "manaCost")}
        >
          {manaCost.map((mana, index) => (
            <ToggleGroupItem
              value={index === 10 ? "10^" : mana.toString()}
              key={mana}
              className="font-outline-2 size-10 bg-[url(/assets/mana.png)] bg-contain bg-no-repeat p-0 text-[16px]"
            >
              {mana}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Select
          name="minionType"
          onValueChange={(value) => onValueChange(value, "minionType")}
          value={values.minionType as string}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Minion Types" />
          </SelectTrigger>
          <SelectContent>
            {minionTypes.map((cardClass) => (
              <SelectItem value={cardClass.slug} key={cardClass.id}>
                {cardClass.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={values.rarity as string}
          name="rarity"
          onValueChange={(value) => {
            onValueChange(value, "rarity");
          }}
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
          value={values.keyword as string}
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
          value={values.type as string}
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
          value={values.textFilter}
          showClearIcon={!!values.textFilter}
          onChange={(e) =>
            setValues((state) => ({
              ...state,
              textFilter: e.target.value,
            }))
          }
          onClear={() => {
            setValues((state) => ({ ...state, textFilter: "" }));
            if (textSearchActive) {
              setTextSearchActive(false);
              onValueChange("", "textFilter", true);
            }
          }}
          placeholder="Text search"
          name="textFilter"
          className="w-48"
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onValueChange(e.currentTarget.value, "textFilter");
              setTextSearchActive(true);
            }
          }}
        />
        <input hidden name="class" type="hidden" value={values.class} />
        <input hidden type="hidden" name="manaCost" value={values.manaCost} />
      </form>

      <ul className="flex gap-4">
        {Array.from(activeFilters.entries()).map(([type, value]) => (
          <li key={type}>
            <Badge
              onClick={() => {
                onValueChange("", type, true);
              }}
            >
              {value.toUpperCase()} <X className="ml-1 size-4" />
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
