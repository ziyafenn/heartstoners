import { UserCollection } from "@/types/hsreplay.type";
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

  const userProfile = await getUserProfile(user.id);

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
