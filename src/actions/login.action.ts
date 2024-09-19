"use server";

import { createClient } from "@/service/supabase.auth.server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type Form = {
  email: string;
  password: string;
  username: string;
};

export async function postAuth({ shouldRedirect = true }) {
  revalidatePath("/", "layout");
  if (shouldRedirect) redirect("/");
}

export async function signout() {
  const supabase = createClient();

  await supabase.auth.signOut();
}

export async function discordLogin({
  redirectDeckCode,
}: { redirectDeckCode?: string }) {
  const site_url = process.env.NEXT_PUBLIC_SITE_URL;

  const supabase = createClient();
  const next = redirectDeckCode
    ? `?next=/deckbuilder/deck?deckCode=${redirectDeckCode}`
    : "";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${site_url}/auth/callback${next}`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
}
