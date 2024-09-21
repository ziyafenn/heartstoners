"use server";

import { getUserCollectionById } from "@/service/hsreplay.service";
import { createClient } from "@/service/supabase.auth.server";
import { getUser, updateUser } from "@/service/supabase.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

type HsReplayFormState = {
  hsReplayUrl?: string;
  error?: string;
  success?: string;
};

export async function addHsReplayId(
  state: HsReplayFormState,
  formData: FormData,
): Promise<HsReplayFormState> {
  const hsReplayUrl = formData.get("hsReplayUrl")!.toString();

  function getHsReplayIdFromUrl(hsReplayUrl: string) {
    const urlObject = new URL(hsReplayUrl);
    const pathParts = urlObject.pathname
      .split("/")
      .filter((part) => part !== "");

    console.log(pathParts[pathParts.length - 1], "id");

    return pathParts[pathParts.length - 1];
  }

  const hsReplayId = getHsReplayIdFromUrl(hsReplayUrl);

  const auth = await getUser();
  const userId = auth.user!.id;
  const userCollection = await getUserCollectionById(hsReplayId);

  if (userCollection.error)
    return {
      hsReplayUrl,
      error: userCollection.error,
    };

  const { error } = await updateUser(userId, { hsReplayId });

  if (error) {
    return {
      error: "Something went wrong",
      hsReplayUrl,
    };
  }

  return {
    success: "Your HSReplay.net account was successfully added!",
  };
}
