import { getDecks } from "@/service/supabase.service";

import { Button } from "@/components/ui/button";

import { DeckCard } from "@/components/DeckCard";
import { SidebarCardItem } from "@/components/SidebarCardItem";

export default async function Home() {
  const decks = await getDecks();

  return (
    <div className="grid grid-cols-[1fr_320px] gap-8 rounded-md">
      <main className="flex gap-8 flex-col">
        <div
          id="hero"
          className="flex gap-4 flex-col justify-start bg-slate-600 rounded-sm p-10 gap-8"
        >
          <h3 className="text-2xl">
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
            Most upvoted deck of the week
          </h2>
          <ul className="grid grid-cols-auto-fit-hscard gap-4">
            <DeckCard />
            <DeckCard />
            <DeckCard />
            <DeckCard />
            <DeckCard />
            <DeckCard />
            <DeckCard />
            <DeckCard />
            <DeckCard />
          </ul>
        </div>
      </main>
      <aside className="flex flex-col gap-8">
        <div className="border border-border p-4">
          Join our discord
          <Button>Join</Button>
        </div>
        <div className="border border-border p-4">
          <ul className="flex flex-col divide-y gap-2">
            <SidebarCardItem />
            <SidebarCardItem />
            <SidebarCardItem />
          </ul>
        </div>
        <div className="border border-border p-4">
          <ul className="flex flex-col divide-y gap-2">
            <SidebarCardItem />
            <SidebarCardItem />
            <SidebarCardItem />
          </ul>
        </div>
        <div className="border border-border p-4">
          <ul className="flex flex-col divide-y gap-2">
            <SidebarCardItem />
            <SidebarCardItem />
            <SidebarCardItem />
          </ul>
        </div>
      </aside>
    </div>
  );
}
