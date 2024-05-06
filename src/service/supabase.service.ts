"use server";

import { DeckClass } from "@/types/hs.type";
import { UserCollection } from "@/types/hsreplay.type";
import { supabase } from "./fetch";
import { getUserCollection } from "./hsreplay.service";

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

export async function getMetaSubArchetypes() {
  const { data, error } = await supabase
    .from("meta_sub_archetypes")
    .select("*");

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

export async function updateUserCardCollection(collectionData: UserCollection) {
  await supabase.auth.signInWithPassword({
    email: "ziya@ziya.com",
    password: "123456",
  });
  const userId = (await supabase.auth.getUser()).data.user!.id;
  console.log(userId, "user id");

  const { collection, dust, lastModified } = collectionData;
  await supabase
    .from("users")
    .update({
      card_collection: collection,
      available_dust: dust,
      collection_updated_at: lastModified,
    })
    .eq("id", userId);
}

export async function getCraftableDecks() {
  const userCollection = await getUserCollection();
  const { data, error } = await supabase.rpc("get_craftable_decks", {
    p_card_collection: userCollection.collection,
    p_available_dust: 3000,
    p_deck_class: "druid",
  });
  console.log(data);
}
