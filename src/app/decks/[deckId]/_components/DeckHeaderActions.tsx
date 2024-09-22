"use client";

import { copyDeck, likeDeck } from "@/actions/deck.action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, ThumbsUp } from "lucide-react";
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
  const [hasPressedCopy, setHasPressedCopy] = useState(false);
  const [hasPressedLike, setHasPressedLike] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(deckCode);
    const cookies = document.cookie;
    const hasUserCopiedDeck = checkACookieExists(cookies);

    setHasPressedCopy(true);
    setTimeout(() => setHasPressedCopy(false), 2000); // Revert back

    if (!hasUserCopiedDeck) {
      document.cookie = `copy=true;path=/decks/${deckId}`;
      await copyDeck(deckId);
    }
  }

  async function onLike() {
    setHasPressedLike(true);
    setTimeout(() => setHasPressedLike(false), 2000); // Revert back

    setIsLiked(true);
    await likeDeck({ author_id: authorId, deck_id: deckId });
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        onClick={onLike}
        disabled={isLiked}
        className={cn(
          "transition duration-75",
          hasPressedLike && "bg-green-100",
        )}
      >
        <Heart className={cn(hasPressedLike && "animate-bounce")} />
      </Button>
      <Button
        type="button"
        onClick={onCopy}
        className={cn(
          "transition duration-75",
          hasPressedCopy && "bg-green-100",
        )}
      >
        {hasPressedCopy ? (
          <span className="flex gap-2">
            <ThumbsUp className="size-4" />
            Copied
          </span>
        ) : (
          "Copy Deck"
        )}
      </Button>
    </div>
  );
}
