import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";

const backendUrl = "https://hsreplay.net/api";

export async function getToken() {
  const clientId = "19f0676648064185bb153378a805a0dc";
  const clientSecret = "q8uTKo4XOOY4F3daN2WrH66shTicAAHj";
  const url = "https://oauth.battle.net/token";

  const auth: { access_token: string } = await wretch(url)
    .addon(QueryStringAddon)
    .auth("Basic " + btoa(clientId + ":" + clientSecret))
    .query({ grant_type: "client_credentials" })
    .post()
    .json();

  return auth;
}

export function hsreplayFetch() {
  return wretch(backendUrl)
    .options({
      Accept: "application/json",
      "Content-Type": "application/json",
    })
    .addon(QueryStringAddon);
}

export async function hsFetch() {
  const { access_token } = await getToken();
  return wretch("https://eu.api.blizzard.com")
    .auth(`Bearer ${access_token}`)
    .options({
      Accept: "application/json",
      "Content-Type": "application/json",
    })
    .addon(QueryStringAddon);
}
