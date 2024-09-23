import { searchForCraftableDecks } from "@/actions/deckSearch.action";
import {
  getMetaSubArchetypes,
  getRequestedDecks,
  getUser,
  getUserProfile,
} from "@/service/supabase.service";
import type { Tables } from "@/types/supabase.type";
import { DeckSearch } from "./_components/DeckSearch";
import type { Metadata } from "next";
import { getCollectibleCardImageIds } from "@/service/heartstonejson.service";

export const metadata: Metadata = {
  title: "Find Heartstone decks for every Perils in Paradise Meta!",
};

export default async function Decks() {
  const getAuthUser = getUser();
  let userProfile: Tables<"profiles"> | null = null;
  const getDecks = getRequestedDecks({ deck_format: "standard" }); // by default
  const getCraftableDecks = searchForCraftableDecks();
  const getSubArchetypes = getMetaSubArchetypes();
  const getCardImageIds = getCollectibleCardImageIds();
  const {
    "0": decks,
    "1": craftableDecks,
    "2": subArchetypes,
    "3": cardImageIds,
    "4": auth,
  } = await Promise.all([
    getDecks,
    getCraftableDecks,
    getSubArchetypes,
    getCardImageIds,
    getAuthUser,
  ]);

  const { user } = auth;

  if (user) userProfile = await getUserProfile(user.id);

  function getCardImage(cardId: number) {
    const card = cardImageIds.find((card) => card.dbfId === cardId);
    if (!card) throw new Error("no card");

    return [
      card?.name,
      `https://art.hearthstonejson.com/v1/256x/${card?.id}.jpg`,
    ];
  }

  const cardImageUrls = decks.data!.map((deck) =>
    deck.card_ids.map((cardId) => getCardImage(cardId)),
  );

  return (
    <DeckSearch
      decks={decks.data!}
      craftableDecks={craftableDecks?.craftableDecks ?? []}
      availableDust={craftableDecks?.userCollection.dust ?? 0}
      subArchetypes={subArchetypes ?? []}
      hasHsAccount={!!userProfile?.hsreplay_id}
      cardImageUrls={cardImageUrls}
    />
  );
}
