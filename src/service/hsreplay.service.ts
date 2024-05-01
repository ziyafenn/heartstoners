import { hsreplayFetch } from "./fetch";

export async function getPlayerCollection(userId: string) {
  const api = hsreplayFetch();

  const res = await api
    .url(`/v1/collection`)
    .query({ region: 2, account_lo: 1063814088, type: "CONSTRUCTED" })
    .get()
    .json();
  console.log(res, "res");

  return res;
}
