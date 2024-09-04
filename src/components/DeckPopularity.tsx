import { getDeckPopularity } from "@/lib/deckPopularity";
import { UserDecks } from "@/types/deck.type";

export function DeckPopularity({ deck }: { deck: UserDecks[number] }) {
  const score = getDeckPopularity({
    copies: deck.deck_interactions?.copies,
    views: deck.deck_interactions?.views,
    likes: deck.deck_likes.length,
  });
  const rating = Array.from({ length: score }, (_, index) => index + 1);

  return (
    <ul className="flex items-center gap-1 justify-end">
      {rating.map((rate) => (
        <span className="text-xs">⭐</span>
      ))}
    </ul>
  );
}
