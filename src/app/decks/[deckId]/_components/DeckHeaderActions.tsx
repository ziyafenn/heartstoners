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

function checkACookieExists(cookies: string) {
  return cookies.split(";").some((item) => item.trim().startsWith("copy="));
}

export function DeckHeaderActions({
  didUserLike,
  deckCode,
  deckId,
  authorId,
}: DeckHeaderProps) {
  const [isLiked, setIsLiked] = useState(didUserLike);

  async function onCopy() {
    await navigator.clipboard.writeText(deckCode);
    const cookies = document.cookie;
    const hasUserCopiedDeck = checkACookieExists(cookies);

    if (!hasUserCopiedDeck) {
      document.cookie = `copy=true;path=/decks/${deckId}`;
      await copyDeck(deckId);
    }
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
