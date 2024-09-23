import wretch from "wretch";

function heartstonejsonFetch() {
  return wretch("https://api.hearthstonejson.com", {
    next: { revalidate: 604800 },
  }).headers({
    Accept: "application/json",
    "Content-Type": "application/json",
  });
}

export async function getCollectibleCardImageIds() {
  const api = heartstonejsonFetch();

  const res: { name: string; dbfId: number; id: string }[] = await api
    .url("/v1/latest/enUS/cards.collectible.json")
    .get()
    .json();

  return res;
}
