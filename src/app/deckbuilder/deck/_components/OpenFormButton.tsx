import { Button } from "@/components/ui/button";
import type { Card } from "@/types/hs.type";

export function OpenFormButton({
  selectedCards,
  onClick,
}: { selectedCards: Card[]; onClick: () => void }) {
  return (
    <div className="flex items-center gap-4 p-2 ">
      <Button
        type="button"
        disabled={selectedCards.length < 30}
        className="w-full"
        onClick={onClick}
        variant="accent"
      >
        {`Create Deck (${selectedCards.length}/30)`}
      </Button>
    </div>
  );
}
