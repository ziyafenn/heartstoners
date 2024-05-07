import { searchForCraftableDecks } from "@/actions/deckSearch.action";
import { getRequestedDecks } from "@/service/supabase.service";

export default async function Decks() {
  const { craftableDecks, userCollection } = await searchForCraftableDecks();
  const decks = await getRequestedDecks({
    craftable_decks: craftableDecks,
  });

  return <div>{decks?.map((deck) => deck.name)}</div>;
}
