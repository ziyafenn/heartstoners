import { getRequestedDecks } from "@/service/supabase.service";
import { DeckSearch } from "./_components/DeckSearch";

export default async function Decks() {
  const decks = await getRequestedDecks();

  return <DeckSearch decks={decks} />;
}
