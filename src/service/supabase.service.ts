"use server";

import { CardClass } from "@/types/hs.type";
import { UserCollection } from "@/types/hsreplay.type";
import { Tables } from "@/types/superbase.type";
import { createClient } from "./supabase.auth.server";
import { decrypt, getUserIp } from "@/lib/serverUtils";

export async function getDecks() {
  const supabase = createClient();

  const { data: user_decks, error } = await supabase.from("user_decks").select(
    `*, 
    profiles:user_id (
      *
    )`,
  );

  return user_decks;
}

export async function getSingleDeck(deckId: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_decks")
    .select("*")
    .eq("id", deckId)
    .single();

  if (error) return null;

  return data;
}

export async function getMetasByClass(className: CardClass["slug"]) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("meta_sub_archetypes")
    .select("*")
    .eq("card_class", className);

  return data;
}

export async function getMetaSubArchetypes() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("meta_sub_archetypes")
    .select("*");

  return data;
}

export async function getCurrentGameVersion() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("game_versions")
    .select("version_name")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  return data!.version_name;
}

export async function getCraftableDecks(
  userCollection: UserCollection["collection"],
) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_craftable_decks", {
    p_available_dust: 100,
    p_card_collection: userCollection,
  });
  return data;
}

export async function getRequestedDecks({
  archetype,
  // card_ids,
  deck_class,
  deck_format,
  // dust_cost,
  game_mode,
  sub_archetype,
  user_id,
  name,
  craftable_decks,
}: Tables<"user_decks"> & {
  craftable_decks?:
    | {
        user_deck_id: number;
        missing_cards: number[];
        required_dust_cost: number;
      }[]
    | null;
}) {
  const supabase = createClient();

  const query = supabase.from("user_decks").select("*");

  // if (craftable_decks) {
  //   const deckIds = craftable_decks.map((deck) => deck.user_deck_id);
  //   query = query.in("id", deckIds);
  // }
  // if (archetype) {
  //   query = query.eq("archetype", archetype);
  // }
  // // if (card_ids)   { query = query.eq('card_ids', card_ids) }
  // if (deck_class) {
  //   query = query.eq("deck_class", deck_class);
  // }
  // if (deck_format) {
  //   query = query.eq("deck_format", deck_format);
  // }
  // // if (dust_cost) {
  // //   query = query.("dust_cost", dust_cost);
  // // }
  // if (game_mode) {
  //   query = query.eq("game_mode", game_mode);
  // }
  // if (sub_archetype) {
  //   query = query.eq("sub_archetype", sub_archetype);
  // }
  // if (user_id) {
  //   query = query.eq("user_id", user_id);
  // }
  // if (name) {
  //   query = query.textSearch("name", name);
  // }

  const { data, error } = await query;

  return data;
}

export async function deckLiked({
  author_id,
  deck_id,
  ip,
}: Pick<Tables<"deck_likes">, "author_id" | "deck_id" | "ip">) {
  const supabase = createClient();

  const { data } = await supabase
    .from("deck_likes")
    .insert({ deck_id, author_id, ip });
  return data;
}

export async function getDeckLikeByIp({
  deckId,
  ip,
}: {
  deckId: number;
  ip: string;
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from("deck_likes")
    .select("ip")
    .eq("deck_id", deckId)
    .eq("ip", ip)
    .single();

  return data;
}

export async function deckInteraction({
  deckId,
  type,
}: {
  deckId: number;
  type: "increment_views" | "increment_copies"; // | "increment_likes";
}) {
  const supabase = createClient();
  await supabase.rpc(type, {
    id: deckId,
  });
}
