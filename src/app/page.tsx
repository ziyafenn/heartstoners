import {
  getDecks,
  getTopAuthors,
  getTopClasses,
  getTopMetas,
} from "@/service/supabase.service";
import { Button } from "@/components/ui/button";
import { DeckUICard } from "./_components/DeckUICard";
import { SidebarCardItem } from "./_components/SidebarCardItem";
import { getDeckPopularity } from "@/lib/deckPopularity";
import { CARD_CLASSES } from "@/lib/cardClasses";

export default async function Home() {
  const fetchDecks = getDecks();
  const fetchTopClasses = getTopClasses();
  const fetchTopAuthors = getTopAuthors();
  const fetchTopMetas = getTopMetas();

  const {
    "0": decks,
    "1": topClasses,
    "2": topAuthors,
    "3": topMetas,
  } = await Promise.all([
    fetchDecks,
    fetchTopClasses,
    fetchTopAuthors,
    fetchTopMetas,
  ]);

  const mostPopular = decks
    .toSorted((a, b) => {
      const popularityA = getDeckPopularity({
        copies: a.deck_interactions?.copies,
        views: a.deck_interactions?.views,
        likes: a.deck_likes.length,
      });

      const popularityB = getDeckPopularity({
        copies: b.deck_interactions?.copies,
        views: b.deck_interactions?.views,
        likes: b.deck_likes.length,
      });

      return popularityB - popularityA;
    })
    .slice(0, 6);
  return (
    <div className="grid grid-cols-[1fr_320px] gap-8 rounded-md">
      <main className="flex flex-col gap-8">
        <div
          id="hero"
          className="relative flex flex-col justify-start gap-4 rounded-sm bg-hero bg-left bg-no-repeat p-10"
        >
          <h3 className="font-hs text-2xl">
            Craft your winning deck with our Reno-certified deckbuilder for
            Hearthstone! Conquer all challengers with Reno and his minions!
          </h3>
          <div className="flex gap-4">
            <Button>Sign up</Button>
            <Button>Discover decks</Button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-hs text-2xl outline-2">
            Most popular decks of the week
          </h2>
          <ul className="grid grid-cols-auto-fill-deckcard gap-4">
            {mostPopular?.map((deck) => (
              <DeckUICard data={deck} key={deck.id} />
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-hs text-2xl outline-2">
            Recent submissions from our users
          </h2>
          <ul className="grid grid-cols-auto-fill-deckcard gap-4">
            {decks!.slice(0, 6).map((deck) => (
              <DeckUICard data={deck} key={deck.id} />
            ))}
          </ul>
        </div>
      </main>
      <aside className="flex flex-col gap-8">
        <div className="border border-border p-4">
          Join our discord
          <Button>Join</Button>
        </div>
        <div className="border border-border p-4">
          <h3>Top creators</h3>
          <ul className="flex flex-col gap-2 divide-y">
            {topAuthors?.map((author, index) => (
              <SidebarCardItem name={author.profiles!.username} key={index} />
            ))}
          </ul>
        </div>
        <div className="border border-border p-4">
          <h3>Top metas</h3>
          <ul className="flex flex-col gap-2 divide-y">
            {topMetas?.map((meta, index) => (
              <SidebarCardItem
                name={meta.meta_sub_archetypes?.name}
                key={index}
              />
            ))}
          </ul>
        </div>
        <div className="border border-border p-4">
          <h3>Top classes</h3>
          <ul className="flex flex-col gap-2 divide-y">
            {topClasses?.map((deckClass, index) => (
              <SidebarCardItem
                name={
                  CARD_CLASSES.find(
                    (cardClass) => cardClass.slug === deckClass.deck_class,
                  )?.name
                }
                key={index}
              />
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
