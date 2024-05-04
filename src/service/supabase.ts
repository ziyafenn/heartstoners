import { DeckClass } from "@/types/hs.type";
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
  const { data, error } = await supabase
    .from("user_decks")
    .select("*")
    .eq("id", deckId)
    .single();

  return data;
}

export async function getMetasByClass(className: DeckClass["name"]) {
  const { data, error } = await supabase
    .from("meta_sub_archetypes")
    .select("*")
    .eq("player_class_name", className);

  return data;
}

export async function getCurrentGameVersion() {
  const { data, error } = await supabase
    .from("game_versions")
    .select("version_name")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  return data!.version_name;
}
