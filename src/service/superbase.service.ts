import { Database } from "@/types/superbase.type";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  "http://localhost:54321",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
);

export async function getDecks() {
  const { data: user_decks, error } = await supabase
    .from("user_decks")
    .select("*");

  return user_decks;
}

export async function getSingleDeck(deckId: string) {
  const { data: deck, error } = await supabase
    .from("user_decks")
    .select("*")
    .eq("id", deckId)
    .single();

  return deck;
}
