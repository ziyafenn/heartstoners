import { hsFetch } from "./fetch";

export async function getSingleCard(cardId: string) {
  const api = await hsFetch();

  const res = api.url(`/cards/${cardId}?locale=en_US`).get().json();
  return res;
}
