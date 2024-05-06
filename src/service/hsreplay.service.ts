import { SubArchetype, UserCollection } from "@/types/hsreplay.type";
import { region } from "blizzard.js/dist/resources/wow";
import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";

export function hsreplayFetch() {
  return wretch("https://hsreplay.net")
    .headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    })
    .addon(QueryStringAddon);
}

export async function getPlayerCollection(userId: string) {
  const api = hsreplayFetch();

  const res: UserCollection = await api
    .url(`/api/v1/collection`)
    .query({ region: 2, account_lo: 1063814088, type: "CONSTRUCTED" })
    .get()
    .json();

  return res;
}

export async function getSubArchetypeByWinRate() {
  const api = hsreplayFetch();

  const res: SubArchetype[] = await api
    .url(`/analytics/query/list_decks_by_win_rate_v2/`)
    .query({
      GameType: "RANKED_STANDARD",
      LeagueRankRange: "BRONZE_THROUGH_GOLD",
      Region: "ALL",
      TimeRange: "CURRENT_PATCH",
    })
    .get()
    .json();

  return res;
}

export async function getUserCollection() {
  const api = hsreplayFetch();

  const res: UserCollection = await api
    .url("/api/v1/collection/")
    .query({
      region: 2,
      account_lo: 1063814088,
      type: "CONSTRUCTED",
    })
    .get()
    .json();

  return res;
}
