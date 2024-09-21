import { Button } from "@/components/ui/button";
import { CARD_CLASSES } from "@/lib/cardClasses";
import { getDeckPopularity } from "@/lib/deckPopularity";
import { findData } from "@/lib/utils";
import {
  getDecks,
  getTopAuthors,
  getTopClasses,
  getTopMetas,
} from "@/service/supabase.service";
import { DeckUICard } from "./_components/DeckUICard";
import { SidebarCardItem } from "./_components/SidebarCardItem";
import { SidebarItemContainer } from "@/components/SidebarItemContainer";
import Image from "next/image";
import Link from "next/link";
import discordLogo from "public/img/discord.svg";

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
        likes: a.deck_interactions?.likes,
      });

      const popularityB = getDeckPopularity({
        copies: b.deck_interactions?.copies,
        views: b.deck_interactions?.views,
        likes: b.deck_interactions?.likes,
      });

      return popularityB - popularityA;
    })
    .slice(0, 6);
  return (
    <div className="grid grid-cols-[1fr_320px] gap-8 rounded-md p-8">
      <main className="flex flex-col gap-8">
        <div className="relative h-48 rounded-md bg-hero bg-left bg-no-repeat shadow-2xl">
          <div className="absolute flex size-full items-center justify-between gap-10 bg-gradient-to-r from-neutral-900/80 via-transparent to-neutral-900 p-10">
            <div className="flex min-w-[520px] flex-col gap-4">
              <h3 className="font-hs text-2xl">
                Craft your winning deck with our Reno-certified deckbuilder for
                Hearthstone! Conquer all challengers with Reno and his minions!
              </h3>
              <div className="flex gap-4">
                <Button variant="secondary" asChild>
                  <Link href="/decks">Discover decks</Link>
                </Button>
              </div>
            </div>
            <div className="hidden max-w-80 select-none xl:block ">
              <Image
                src="/img/logo.png"
                width={1140}
                height={450}
                alt="heartstoners logo"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl outline-2">Most popular decks of the week</h2>
          <ul className="grid grid-cols-auto-fill-deckcard gap-4">
            {mostPopular?.map((deck) => (
              <DeckUICard data={deck} key={deck.id} />
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl outline-2">
            Recent submissions from our users
          </h2>
          <ul className="grid grid-cols-auto-fill-deckcard gap-4">
            {decks?.slice(0, 6).map((deck) => (
              <DeckUICard data={deck} key={deck.id} />
            ))}
          </ul>
        </div>
      </main>
      <aside className="flex flex-col gap-8">
        <div className="relative flex items-center justify-between rounded-sm bg-gradient-to-r from-[#5865F2] to-indigo-600 p-4">
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          <div className="flex items-center gap-2 ">
            <Image src={discordLogo} alt="discord logo" />
            <span className="font-medium text-lg leading-none">
              Join our discord!
            </span>
          </div>
          <Button variant="secondary" asChild>
            <Link href="https://discord.gg/4zqnSMStha" target="_blank">
              Join
            </Link>
          </Button>
        </div>

        <SidebarItemContainer name="Top Creators">
          <ul className="flex flex-col gap-2 divide-y p-4">
            {topAuthors?.map(({ profiles }, index) => (
              <SidebarCardItem
                name={profiles!.display_name}
                key={profiles!.id}
                avatarUrl={profiles?.avatar_url}
              />
            ))}
          </ul>
        </SidebarItemContainer>
        <SidebarItemContainer name="Top Metas">
          <ul className="flex flex-col gap-2 divide-y p-4">
            {topMetas?.map(({ meta_sub_archetypes }, index) => (
              <SidebarCardItem
                name={meta_sub_archetypes!.name}
                slug={meta_sub_archetypes!.card_class}
                key={meta_sub_archetypes!.id}
              />
            ))}
          </ul>
        </SidebarItemContainer>
        <SidebarItemContainer name="Top Classes">
          <ul className="flex flex-col gap-2 divide-y p-4">
            {topClasses?.map((deckClass) => (
              <SidebarCardItem
                name={findData(CARD_CLASSES, "slug", deckClass.deck_class).name}
                key={findData(CARD_CLASSES, "slug", deckClass.deck_class).id}
                slug={deckClass.deck_class}
              />
            ))}
          </ul>
        </SidebarItemContainer>
      </aside>
    </div>
  );
}
