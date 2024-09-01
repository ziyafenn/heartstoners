"use client";

import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useRef, useState } from "react";

type Props = {
  onUpdateFilters: (activeFilters: FormData) => Promise<unknown>;
};

export function Filters({ onUpdateFilters }: Props) {
  const [isCraftableToggled, setIsCraftableToggled] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onCraftableToggle(value: boolean) {
    const formData = new FormData(formRef.current!);

    setIsCraftableToggled(value);
    formData.set("craftable_decks", String(value));
    onUpdateFilters(formData);
  }

  async function onSubmit(formData: FormData) {
    formData.set("craftable_decks", String(isCraftableToggled));
    onUpdateFilters(formData);
  }
  return (
    <div className="flex flex-col">
      <Toggle onPressedChange={(value) => onCraftableToggle(value)}>
        Show Craftable
      </Toggle>
      <form
        ref={formRef}
        action={onSubmit}
        className="flex flex-1 flex-col gap-16"
      >
        {isCraftableToggled && <Input type="number" name="dustCost" />}
      </form>
    </div>
  );
}
