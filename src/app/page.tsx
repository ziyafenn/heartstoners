import { getDecks } from "@/service/supabase.service";
import { Button } from "@/components/ui/button";
import { DeckUICard } from "./_components/DeckUICard";
import { SidebarCardItem } from "./_components/SidebarCardItem";
import { getDeckPopularity } from "@/lib/deckPopularity";

export default async function Home() {
  const decks = await getDecks();
  const mostPopular = decks.toSorted((a, b) => {
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
  });
  return (
    <div className="grid grid-cols-[1fr_320px] gap-8 rounded-md">
      <main className="flex flex-col gap-8">
        <div
          id="hero"
          className="flex flex-col justify-start gap-4 rounded-sm bg-slate-600 p-10"
        >
          <h3 className="font-hs text-2xl">
            Craft your winning deck with our Reno-certified deckbuilder for
            Hearthstone! Conquer all challengers with Reno and his minions!
          </h3>
          <div className="flex gap-4">
            <Button>Sign up</Button>
            <Button>Find decks</Button>
          </div>
        </div>
        <div id="decks">
          <h2 className="text-xl leading-loose">
            Most popular decks of the week
          </h2>
          <ul className="grid grid-cols-auto-fill-hscard gap-4">
            {mostPopular?.map((deck) => (
              <DeckUICard data={deck} key={deck.id} />
            ))}
          </ul>
        </div>
        <div id="decks">
          <h2 className="text-xl leading-loose">
            Recent submissions from our users
          </h2>
          <ul className="grid grid-cols-auto-fill-hscard gap-4">
            {decks?.map((deck) => <DeckUICard data={deck} key={deck.id} />)}
          </ul>
        </div>
      </main>
      <aside className="flex flex-col gap-8">
        <div className="border border-border p-4">
          Join our discord
          <Button>Join</Button>
        </div>
        <div className="border border-border p-4">
          <h3>Top 5 creators</h3>
          <ul className="flex flex-col gap-2 divide-y">
            <SidebarCardItem />
            <SidebarCardItem />
            <SidebarCardItem />
          </ul>
        </div>
        <div className="border border-border p-4">
          <h3>Top 5 metas</h3>

          <ul className="flex flex-col gap-2 divide-y">
            <SidebarCardItem />
            <SidebarCardItem />
            <SidebarCardItem />
          </ul>
        </div>
        <div className="border border-border p-4">
          <h3>Top 5 classes</h3>

          <ul className="flex flex-col gap-2 divide-y">
            <SidebarCardItem />
            <SidebarCardItem />
            <SidebarCardItem />
          </ul>
        </div>
      </aside>
    </div>
  );
}
