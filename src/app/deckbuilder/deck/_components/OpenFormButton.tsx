import { Button } from "@/components/ui/button";
import type { Card } from "@/types/hs.type";
import { DotSquareIcon, EllipsisVertical } from "lucide-react";

export function OpenFormButton({
  selectedCards,
  onClick,
}: { selectedCards: Card[]; onClick: () => void }) {
  return (
    <div className="flex h-12 items-center gap-4 bg-black px-2 ">
      <Button
        type="button"
        disabled={selectedCards.length < 30}
        className="w-full"
        onClick={onClick}
        variant="accent"
      >
        {`Create Deck (${selectedCards.length}/30)`}
      </Button>
      <Button size="icon" variant="secondary">
        <EllipsisVertical className="size-4 text-black" />
      </Button>
    </div>
  );
}
