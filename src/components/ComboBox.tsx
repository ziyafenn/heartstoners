"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { type KeyboardEvent, useState } from "react";

type Data = { id: number; label: string; cardClass: string; className: string };
type Props = {
  data: Data[];
  value: string | undefined | null;
  selectItem: (value: number) => void;
};

type GroupedSubArchetypes = {
  [key: string]: Data[];
};

export function Combobox({ data, value, selectItem }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const groupedSubArchetypes = data.reduce(
    (acc, { cardClass, className, id, label }) => {
      if (!acc[cardClass]) {
        acc[cardClass] = [];
      }
      acc[cardClass].push({
        label,
        id,
        className,
        cardClass,
      });
      return acc;
    },
    {} as GroupedSubArchetypes,
  );

  function onSelect(currentValue: string) {
    const id = data.find((item) => item.label === currentValue)?.id;
    id && selectItem(id);
    setIsOpen(false);
    setInputValue("");
  }

  function closePopover(e: KeyboardEvent<HTMLInputElement>) {
    setIsOpen(false);
    setInputValue("");
    e.currentTarget.blur();
  }

  return (
    <Command>
      <CommandInput
        placeholder="Search sub-archetype..."
        onValueChange={setInputValue}
        value={inputValue?.toString()}
        onKeyDown={(e) => e.key === "Escape" && closePopover(e)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />
      <div>
        <CommandList
          hidden={!isOpen}
          className="absolute w-[220px] bg-popover text-popover-foreground"
        >
          <CommandEmpty>No sub-archetype found</CommandEmpty>
          {Object.keys(groupedSubArchetypes).map((cardClass) => {
            const subArchetypeGroup = groupedSubArchetypes[cardClass];
            console.log(cardClass);

            return (
              <CommandGroup
                key={cardClass}
                heading={subArchetypeGroup[0].className} // Assuming all items in the group have the same className
              >
                {subArchetypeGroup.map((subArchetype) => (
                  <CommandItem
                    key={subArchetype.id}
                    value={subArchetype.id}
                    onSelect={onSelect}
                  >
                    {subArchetype.label}
                  </CommandItem>
                ))}
                <CommandSeparator />
              </CommandGroup>
            );
          })}
        </CommandList>
      </div>
    </Command>
  );
}
