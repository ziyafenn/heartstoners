import type { UserCollection } from "@/types/hsreplay.type";
import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";
import { createClient } from "./supabase.auth.server";
import { getUserProfile } from "./supabase.service";

function hsreplayFetch() {
  return wretch("https://hsreplay.net", { cache: "no-store" })
    .headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    })
    .addon(QueryStringAddon);
}

export async function getUserCollection() {
  const api = hsreplayFetch();
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const userProfile = await getUserProfile(user.id);

  if (!userProfile?.hsreplay_id) return;

  const res: UserCollection = await api
    .url("/api/v1/collection/")
    .query({
      region: 2,
      account_lo: userProfile?.hsreplay_id,
      type: "CONSTRUCTED",
    })
    .get()
    .json();

  return res;
}

export async function getUserCollectionById(hsReplayId: string) {
  const api = hsreplayFetch();
  const res: { data: UserCollection | null; error?: string } = await api
    .url("/api/v1/collection/")
    .query({
      region: 2,
      account_lo: hsReplayId,
      type: "CONSTRUCTED",
    })
    .get()
    .badRequest(() => ({
      data: null,
      error:
        "It seems there is something wrong with your link. Please try copying and pasting your collection link again",
    }))
    .unauthorized(() => ({
      data: null,
      error:
        "Your HSReplay.net collection wasn't found. Please make sure it is made public.",
    }))
    .json((data: UserCollection) => ({
      data,
    }));

  return res;
}
