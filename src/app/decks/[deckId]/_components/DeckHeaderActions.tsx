"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function DeckHeaderActions({ didUserLike }: { didUserLike: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <Button size="icon" disabled={didUserLike}>
        <Heart />
      </Button>
      <Button>Copy Deck</Button>
    </div>
  );
}
