// import wretch from "wretch";
// import QueryStringAddon from "wretch/addons/queryString";

import { Database } from "@/types/superbase.type";
import { createClient } from "@supabase/supabase-js";

// export async function getToken() {
//   const clientId = "19f0676648064185bb153378a805a0dc";
//   const clientSecret = "q8uTKo4XOOY4F3daN2WrH66shTicAAHj";
//   const url = "https://oauth.battle.net/token";

//   const auth: { access_token: string } = await wretch(url)
//     .addon(QueryStringAddon)
//     .auth("Basic " + btoa(clientId + ":" + clientSecret))
//     .query({ grant_type: "client_credentials" })
//     .post()
//     .json();

//   return auth;
// }

// export async function hsFetch() {
//   const { access_token } = await getToken();
//   return wretch("https://eu.api.blizzard.com")
//     .auth(`Bearer ${access_token}`)
//     .options({
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     })
//     .addon(QueryStringAddon);
// }

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  "http://localhost:54321",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
);
