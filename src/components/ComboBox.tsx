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
import {
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type Data = { id: string; label: string; cardClass: string; className: string };
type Props = {
  data: Data[];
  selectItem: (value: string) => void;
};

type GroupedSubArchetypes = {
  [key: string]: Data[];
};

export function Combobox({ data, selectItem }: Props) {
  const inputRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

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

  const subArchetypesArray = Object.entries(groupedSubArchetypes);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", (e) =>
      handleClickOutside(e as unknown as MouseEvent),
    );

    return () => {
      document.removeEventListener("mousedown", (e) =>
        handleClickOutside(e as unknown as MouseEvent),
      );
    };
  }, []);

  return (
    <Command ref={inputRef}>
      <CommandInput
        placeholder="Search sub-archetype"
        onValueChange={setInputValue}
        value={inputValue}
        onKeyDown={(e) => e.key === "Escape" && closePopover(e)}
        onFocus={() => setIsOpen(true)}
      />
      <div>
        <CommandList
          hidden={!isOpen}
          className={"absolute w-[220px] bg-popover text-popover-foreground"}
        >
          <CommandEmpty>No sub-archetype found</CommandEmpty>
          {subArchetypesArray.map(([cardClass, data]) => {
            return (
              <CommandGroup key={cardClass} heading={data[0].className}>
                {data.map((subArchetype) => (
                  <CommandItem
                    key={subArchetype.id}
                    value={subArchetype.label}
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
