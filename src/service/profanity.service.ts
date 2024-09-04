import wretch from "wretch";

function profanityFetch() {
  return wretch("https://vector.profanity.dev", { cache: "no-store" }).headers({
    Accept: "application/json",
    "Content-Type": "application/json",
  });
}

export async function checkProfanity(message: string) {
  const api = profanityFetch();

  const res: { isProfanity: boolean; score: number } = await api
    .post({ message })
    .json();

  return res;
}
