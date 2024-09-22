import { getUserDeck } from "@/actions/deck.action";
import { getDeckByCardList } from "@/service/hs.service";
import { DeckCards } from "./_components/DeckCards";
import { DeckDescription } from "./_components/DeckDescription";
import { DeckHeader } from "./_components/DeckHeader";
import { DeckStats } from "./_components/DeckStats";
import type { Metadata, ResolvingMetadata } from "next";
import { findData } from "@/lib/utils";
import { CARD_CLASSES } from "@/lib/cardClasses";

type Props = { params: { deckId: number } };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { deckId } = params;
  const userDeck = await getUserDeck(deckId);
  const { deck } = userDeck;
  const { meta_sub_archetypes, name, deck_class, profiles } = deck!;

  const className = findData(CARD_CLASSES, "slug", deck_class).name;
  const title = `${name} Deck | HeartStoners.gg`;
  const description = `Heartstone Deck for ${meta_sub_archetypes?.name || className} by ${profiles!.display_name}`;

  return {
    title,
    description,
    twitter: {
      title,
      description,
      creator: profiles!.x_username,
    },
  };
}

export default async function Deck({ params }: Props) {
  const { deckId } = params;
  const userDeck = await getUserDeck(deckId);
  const { deck, didUserLike, availableDust } = userDeck;
  const { card_ids, description, sideboard_cards, youtube_id, profiles } =
    deck!;

  const {
    class: deckClass,
    cards,
    sideboardCards,
    deckCode,
  } = await getDeckByCardList({
    cardIds: card_ids,
    sideboardCards: sideboard_cards ?? undefined,
  });

  return (
    <div className="grid grid-cols-[1fr,auto] justify-between gap-8 p-8">
      <main className="flex flex-col gap-8">
        <DeckHeader
          deck={deck!}
          didUserLike={didUserLike}
          deckCode={deckCode}
        />
        <section className="grid h-full grid-cols-[1fr,204px] divide-x-2">
          <DeckDescription description={description} youtube_id={youtube_id} />
          <DeckStats
            deck={deck!}
            availableDust={availableDust}
            cards={cards}
            author={profiles!}
          />
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
