"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Data = { value: number; label: string };
type Props = {
  data: Data[];
  value: number | null | undefined;
  selectItem: (value: number) => void;
};

export function Combobox({ data, value, selectItem }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          {value
            ? data.find((subArchetype) => subArchetype.value === value)?.label
            : "Select Sub-Archetype..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Sub-Archetype..." />
          <CommandList>
            <CommandEmpty>No subArchetype found.</CommandEmpty>
            <CommandGroup>
              {data.map((subArchetype) => (
                <CommandItem
                  key={subArchetype.value}
                  value={subArchetype.label}
                  onSelect={(currentValue) => {
                    const id = data.find(
                      (item) => item.label === currentValue,
                    )?.value;
                    id && selectItem(id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === subArchetype.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {subArchetype.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
