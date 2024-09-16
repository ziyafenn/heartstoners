"use client";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { type KeyboardEvent, useState } from "react";

type Data = { id: number; label: string };
type Props = {
  data: Data[];
  value: number | null | undefined;
  selectItem: (value: number) => void;
};

export function Combobox({ data, value, selectItem }: Props) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  function onSelect(currentValue: string) {
    const id = data.find((item) => item.label === currentValue)?.id;
    id && selectItem(id);
    setOpen(false);
    setInputValue("");
  }

  function onInputValueChange(value: string) {
    setInputValue(value);
    setOpen(!!value);
  }

  function closePopover(e: KeyboardEvent<HTMLInputElement>) {
    setOpen(false);
    setInputValue("");
    e.currentTarget.blur();
  }

  return (
    <Command>
      <CommandInput
        placeholder="Search sub-archetype..."
        onValueChange={onInputValueChange}
        value={inputValue}
        onKeyDown={(e) => e.key === "Escape" && closePopover(e)}
      />
      <div>
        <CommandList
          hidden={!open}
          className="absolute w-[220px] bg-popover text-popover-foreground"
        >
          <CommandEmpty>No sub-archetype found</CommandEmpty>
          {data.map((subArchetype) => (
            <CommandItem
              key={subArchetype.id}
              value={subArchetype.label}
              onSelect={onSelect}
            >
              {subArchetype.label}
            </CommandItem>
          ))}
        </CommandList>
      </div>
    </Command>
  );
}
