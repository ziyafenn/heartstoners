"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardClass,
  CardType,
  Keyword,
  MinionTypes,
  Rarity,
} from "@/types/hs.type";
import { useEffect, useRef, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSearchParams } from "next/navigation";
import { HeroIcon } from "@/components/HeroIcon";
import { CardSearchOptions } from "blizzard.js/dist/resources/hs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CARD_CLASSES } from "@/lib/cardClasses";

type Props = {
  action: (payload: FormData) => void;
  minionTypes: MinionTypes[];
  rarities: Rarity[];
  keywords: Keyword[];
  cardTypes: CardType[];
  touristCard: Card | null;
};

export function DeckBuilderFilter({
  action,
  minionTypes,
  rarities,
  keywords,
  cardTypes,
  touristCard,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const deckClass = searchParams.get("deckClass") as CardClass["slug"];
  const manaCost = [...Array(10).keys(), "10+"];
  const touristClass = CARD_CLASSES.find(
    (cardClass) => cardClass.id === touristCard?.touristClassId,
  );

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

    if (isReset) {
      formData.delete(type);
    } else {
      formData.set(type, formattedValue!);
    }
    formData.set("filter", "true");

    action(formData);
    window.scroll({ top: 0 });
  }

  useEffect(() => {
    const handleScroll = () => {
      const filter = filterRef.current;
      if (!filter) return;
      if (window.scrollY > 128) return filter.classList.add("floating");
      return filter.classList.remove("floating");
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [filterRef]);

  useEffect(() => {
    if (!formRef.current || !touristCard) return;

    const form = formRef.current;
    const formData = new FormData(form);
    const currentClasses = formData.get("class");
    const currentClassArray = currentClasses?.toString().split(",")!;

    currentClassArray.push(`tourist:${touristCard.id}`);
    const formattedValue = currentClassArray.join(",");
    setValues((state) => ({ ...state, class: formattedValue }));
    formData.set("class", formattedValue);
    action(formData);
  }, [touristCard, formRef]);

  return (
    <>
      <div ref={filterRef} className="deckBuilderFilter">
        <form
          ref={formRef}
          className="flex flex-wrap gap-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <ToggleGroup
            type="multiple"
            onValueChange={(value) => onValueChange(value, "class")}
          >
            <ToggleGroupItem value={deckClass} className="size-10 p-0">
              <HeroIcon slug={deckClass} />
            </ToggleGroupItem>
            <ToggleGroupItem value="neutral" className="size-10 p-0">
              <HeroIcon slug="neutral" />
            </ToggleGroupItem>
            {touristCard && (
              <ToggleGroupItem
                value={`tourist:${touristCard.id}`}
                className="size-10 p-0"
              >
                <HeroIcon slug={touristClass!.slug} />
              </ToggleGroupItem>
            )}
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
          <div className="flex flex-1 gap-4">
            <Select
              name="minionType"
              onValueChange={(value) => onValueChange(value, "minionType")}
              value={values.minionType as string}
            >
              <SelectTrigger>
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
              <SelectTrigger>
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
              <SelectTrigger>
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
              <SelectTrigger>
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
          </div>
          <input hidden name="class" type="hidden" value={values.class} />
          <input hidden type="hidden" name="manaCost" value={values.manaCost} />
        </form>
      </div>
      {!!activeFilters.size && (
        <ul className="flex h-8 gap-4 pt-4">
          {Array.from(activeFilters.entries()).map(([type, value]) => (
            <li key={type}>
              <Badge
                onClick={() => onValueChange("", type, true)}
                className="cursor-pointer"
              >
                {value.toUpperCase()} <X className="ml-1 size-4" />
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
