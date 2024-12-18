"use client";

import { AssetIcon } from "@/components/AssetIcon";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { findData } from "@/lib/utils";
import type {
  Card,
  CardClass,
  CardType,
  Keyword,
  MinionTypes,
  Rarity,
} from "@/types/hs.type";
import type { CardSearchOptions } from "blizzard.js/dist/resources/hs";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  action: (payload: FormData) => void;
  minionTypes: MinionTypes[];
  rarities: Rarity[];
  keywords: Keyword[];
  cardTypes: CardType[];
  touristCard: Card | null;
  deckClass: CardClass["slug"];
};

export function DeckBuilderFilter({
  action,
  minionTypes,
  rarities,
  keywords,
  cardTypes,
  touristCard,
  deckClass,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const manaCost = [...Array(10).keys(), "10+"];
  const touristClass =
    touristCard && findData(CARD_CLASSES, "id", touristCard.touristClassId);

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
    value: string[] | string,
    type: keyof CardSearchOptions,
    isReset?: boolean,
  ) {
    const updatedFilters = new Map(activeFilters);
    const formattedValue = Array.isArray(value) ? value.join(",") : value;

    if (!(type === "class" || type === "manaCost")) {
      if (isReset) updatedFilters.delete(type);
      else updatedFilters.set(type, formattedValue);
    }

    setValues((state) => ({ ...state, [type]: value }));
    setActiveFilters(updatedFilters);

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);

    if (isReset) {
      formData.delete(type);
    } else {
      formData.set(type, formattedValue);
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
  }, []);

  useEffect(() => {
    if (!formRef.current) return;

    const form = formRef.current;
    const formData = new FormData(form);
    const deckClasses = values.class as string[];
    let currentClasses: string[] = [];
    const hasTouristFilter = deckClasses.some((currentClass) =>
      currentClass.includes("tourist"),
    );

    if (touristCard && !hasTouristFilter) {
      currentClasses = [...deckClasses, `tourist:${touristCard.id}`];
    } else if (!touristCard && hasTouristFilter) {
      currentClasses = ["neutral", deckClass];
    } else {
      return;
    }

    setValues((state) => ({ ...state, class: currentClasses }));

    formData.set("class", currentClasses.join(","));
    formData.set("filter", "true");
    action(formData);
  }, [touristCard, values.class, action, deckClass]);

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
            value={values.class as string[]}
            onValueChange={(value) =>
              value.length && onValueChange(value, "class")
            }
          >
            <ToggleGroupItem value={deckClass} size="asset" variant="asset">
              <AssetIcon type="hero" name={deckClass} />
            </ToggleGroupItem>
            <ToggleGroupItem value="neutral" size="asset" variant="asset">
              <AssetIcon type="hero" name="neutral" />
            </ToggleGroupItem>
            {touristClass && (
              <ToggleGroupItem
                value={`tourist:${touristCard.id}`}
                size="asset"
                variant="asset"
              >
                <AssetIcon type="hero" name={touristClass.slug} />
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
                size="asset"
                variant="asset"
                className="bg-[url(/assets/mana.png)] bg-contain bg-no-repeat font-outline-2 text-[16px]"
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
            {/* <Select
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
            </Select> */}
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
          <input
            hidden
            name="class"
            type="hidden"
            value={(values.class as string[]).join(",")}
          />
          <input
            hidden
            type="hidden"
            name="manaCost"
            value={(values.manaCost as string[]).join(",")}
          />
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
