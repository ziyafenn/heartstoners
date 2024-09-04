"use server";

import { CardClass } from "@/types/hs.type";
import { UserCollection } from "@/types/hsreplay.type";
import { Tables } from "@/types/supabase.type";
import { createClient } from "./supabase.auth.server";
import { DBFunction } from "@/types/supabase.func.type";
import { DeckFilters } from "@/types/deck.type";
import { QueryResult, QueryData, QueryError } from "@supabase/supabase-js";

const deckQuery = `*, 
    profiles (*),
    deck_likes (*),
    deck_interactions (views, copies),
    meta_sub_archetypes (name)
    `;

export async function getDecks() {
  const supabase = createClient();
  const userDecksQuery = supabase
    .from("user_decks")
    .select(deckQuery)
    .order("created_at", { ascending: false })
    .limit(20);

  type UserDecks = QueryData<typeof userDecksQuery>;

  const { data: user_decks, error } = await userDecksQuery;

  return user_decks as UserDecks;
}

export async function getSingleDeck(deckId: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_decks")
    .select(deckQuery)
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
  availableDust: number,
) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_craftable_decks", {
    p_available_dust: availableDust,
    p_card_collection: userCollection,
  });
  return data;
}

export async function getRequestedDecks(
  filters?: DeckFilters,
  craftableDecks?: DBFunction<"get_craftable_decks", "Returns"> | null,
) {
  const supabase = createClient();
  let query = supabase.from("user_decks").select(
    `*, profiles (*), meta_sub_archetypes:sub_archetype (*), deck_likes (*),
    deck_interactions (views, copies)`,
  );

  if (filters?.craftable_decks === "true") {
    const deckIds = craftableDecks!.map((deck) => deck.user_deck_id);
    query = query.in("id", deckIds);
  }
  // if (filters?.archetype) {
  //   query = query.eq("archetype", filters.archetype);
  // }
  // if (card_ids)   { query = query.eq('card_ids', card_ids) }
  if (filters?.deck_class) {
    query = query.eq("deck_class", filters.deck_class);
  }
  if (filters?.deck_format) {
    query = query.eq("deck_format", filters.deck_format);
  }
  // if (dust_cost) {
  //   query = query.("dust_cost", dust_cost);
  // }
  // if (filters?.game_mode) {
  //   query = query.eq("game_mode", game_mode);
  // }
  // if (filters?.sub_archetype) {
  //   query = query.eq("sub_archetype", filters.sub_archetype);
  // }
  // if (filters?.user_id) {
  //   query = query.eq("user_id", filters.user_id);
  // }
  // if (filters?.name) {
  //   query = query.textSearch("name", filters.name);
  // }
  const { data } = await query;
  // type Data = Tables<"user_decks"> & {
  //   profiles: Tables<"profiles">;
  //   deck_interactions: Tables<"deck_interactions">;
  //   meta_sub_archetypes: Tables<"meta_sub_archetypes">;
  // };
  type UserDecks = QueryData<typeof query>;

  return data as UserDecks;
}

export async function getTopClasses() {
  const supabase = createClient();

  const { data } = await supabase
    .from("user_decks")
    .select("deck_class, deck_class.count()");

  return data;
}
export async function getTopMetas() {
  const supabase = createClient();

  const { data } = await supabase
    .from("user_decks")
    .select("meta_sub_archetypes (*), sub_archetype, sub_archetype.count()");

  return data;
}

export async function getTopAuthors() {
  const supabase = createClient();

  const { data } = await supabase
    .from("user_decks")
    .select("profiles (*), user_id, user_id.count()");

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
