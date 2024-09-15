import { getDeckPopularity } from "@/lib/deckPopularity";
import type { UserDeck } from "@/types/deck.type";

export function DeckPopularity({ deck }: { deck: UserDeck }) {
  const score = getDeckPopularity({
    copies: deck.deck_interactions?.copies,
    views: deck.deck_interactions?.views,
    likes: deck.deck_interactions?.likes,
  });
  const ratings = Array.from({ length: score }, (_, index) => index + 1);

  return (
    <ul className="flex items-center justify-end gap-1">
      {ratings.map((rating) => (
        <span className="text-xs" key={rating}>
          ⭐
        </span>
      ))}
    </ul>
  );
}
