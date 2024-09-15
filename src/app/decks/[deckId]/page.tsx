import { getDeckByCardList } from "@/service/hs.service";
import { getUserDeck } from "@/actions/deck.action";
import { Separator } from "@/components/ui/separator";
import { DeckCards } from "./_components/DeckCards";
import { DeckHeader } from "./_components/DeckHeader";
import { DeckStats } from "./_components/DeckStats";
import { DeckDescription } from "./_components/DeckDescription";

export default async function Deck({ params }: { params: { deckId: number } }) {
  const { deckId } = params;
  const userDeck = await getUserDeck(deckId);
  const { deck, didUserLike, availableDust } = userDeck!;
  const { card_ids, description, sideboard_cards, youtube_id } = deck;

  const {
    class: deckClass,
    cards,
    sideboardCards,
  } = await getDeckByCardList({
    cardIds: card_ids,
    sideboardCards: sideboard_cards ?? undefined,
  });

  return (
    <div className="grid grid-cols-[1fr,auto] justify-between gap-8">
      <main className="flex flex-col gap-8">
        <DeckHeader deck={deck} didUserLike={didUserLike} />
        <Separator />
        <section className="grid h-full grid-cols-[1fr,204px] divide-x-2">
          <DeckDescription description={description} youtube_id={youtube_id} />
          <DeckStats deck={deck} availableDust={availableDust} cards={cards} />
        </section>
      </main>
      <DeckCards
        cards={cards}
        deckClass={deckClass}
        sideboardCards={sideboardCards}
      />
    </div>
  );
}
