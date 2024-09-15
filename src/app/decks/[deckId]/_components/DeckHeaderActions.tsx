"use client";

import { copyDeck, likeDeck } from "@/actions/deck.action";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";

type DeckHeaderProps = {
  didUserLike: boolean;
  deckCode: string;
  deckId: number;
  authorId: string;
};

export function DeckHeaderActions({
  didUserLike,
  deckCode,
  deckId,
  authorId,
}: DeckHeaderProps) {
  const [isLiked, setIsLiked] = useState(didUserLike);

  async function onCopy() {
    await navigator.clipboard.writeText(deckCode);
    await copyDeck(deckId);
  }

  async function onLike() {
    setIsLiked(true);
    await likeDeck({ author_id: authorId, deck_id: deckId });
  }

  return (
    <div className="flex items-center gap-4">
      <Button type="button" onClick={onLike} size="icon" disabled={isLiked}>
        <Heart />
      </Button>
      <Button type="button" onClick={onCopy}>
        Copy Deck
      </Button>
    </div>
  );
}
