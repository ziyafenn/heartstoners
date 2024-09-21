import { searchForCraftableDecks } from "@/actions/deckSearch.action";
import {
  getMetaSubArchetypes,
  getRequestedDecks,
  getUser,
  getUserProfile,
} from "@/service/supabase.service";
import type { Tables } from "@/types/supabase.type";
import { DeckSearch } from "./_components/DeckSearch";

export default async function Decks() {
  const getAuthUser = getUser();
  let userProfile: Tables<"profiles"> | null = null;
  const getDecks = getRequestedDecks({ deck_format: "standard" }); // by default
  const getCraftableDecks = searchForCraftableDecks();
  const getSubArchetypes = getMetaSubArchetypes();
  const {
    "0": decks,
    "1": craftableDecks,
    "2": subArchetypes,
    "3": auth,
  } = await Promise.all([
    getDecks,
    getCraftableDecks,
    getSubArchetypes,
    getAuthUser,
  ]);

  const { user } = auth;

  if (user) userProfile = await getUserProfile(user.id);

  return (
    <DeckSearch
      decks={decks.data!}
      craftableDecks={craftableDecks?.craftableDecks ?? []}
      availableDust={craftableDecks?.userCollection.dust ?? 0}
      subArchetypes={subArchetypes ?? []}
      hasHsAccount={!!userProfile?.hsreplay_id}
    />
  );
}
