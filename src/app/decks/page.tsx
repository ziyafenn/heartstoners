import { searchForCraftableDecks } from "@/actions/deckSearch.action";
import { getRequestedDecks } from "@/service/supabase.service";
import { DeckSearch } from "./_components/DeckSearch";

export default async function Decks() {
  const decks = await getRequestedDecks({ deck_format: "standard" });
  const {
    userCollection: { dust },
    craftableDecks,
  } = await searchForCraftableDecks();

  return (
    <DeckSearch
      decks={decks}
      craftableDecks={craftableDecks}
      availableDust={dust}
    />
  );
}
