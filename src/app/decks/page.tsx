import { searchForCraftableDecks } from "@/actions/deckSearch.action";
import { getRequestedDecks } from "@/service/supabase.service";
import { DeckSearch } from "./_components/DeckSearch";

export default async function Decks() {
  const getDecks = getRequestedDecks({ deck_format: "standard" }); // by default
  const getCraftableDecks = searchForCraftableDecks();
  const { "0": decks, "1": craftableDecks } = await Promise.all([
    getDecks,
    getCraftableDecks,
  ]);

  return (
    <DeckSearch
      decks={decks}
      craftableDecks={craftableDecks?.craftableDecks ?? []}
      availableDust={craftableDecks?.userCollection.dust ?? 0}
    />
  );
}
