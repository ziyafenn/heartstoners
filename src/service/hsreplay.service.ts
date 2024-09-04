import { UserCollection } from "@/types/hsreplay.type";
import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";

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
