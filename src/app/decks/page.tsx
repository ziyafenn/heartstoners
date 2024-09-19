import { searchForCraftableDecks } from "@/actions/deckSearch.action";
import {
  getMetaSubArchetypes,
  getRequestedDecks,
} from "@/service/supabase.service";
import { DeckSearch } from "./_components/DeckSearch";

export default async function Decks() {
  const getDecks = getRequestedDecks({ deck_format: "standard" }); // by default
  const getCraftableDecks = searchForCraftableDecks();
  const getSubArchetypes = getMetaSubArchetypes();
  const {
    "0": decks,
    "1": craftableDecks,
    "2": subArchetypes,
  } = await Promise.all([getDecks, getCraftableDecks, getSubArchetypes]);

  return (
    <DeckSearch
      decks={decks.data}
      count={decks.count}
      craftableDecks={craftableDecks?.craftableDecks ?? []}
      availableDust={craftableDecks?.userCollection.dust ?? 0}
      subArchetypes={subArchetypes}
    />
  );
}
