"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/service/supabase.auth.server";
import { revalidatePath } from "next/cache";

type Form = {
  email: string;
  password: string;
  username: string;
};

export async function postAuth(redirectPath?: string) {
  revalidatePath("/", "layout");
  redirect(redirectPath ?? "/");
}

export async function forgotPassword(
  state: null,
  formData: FormData,
): Promise<{ message: string }> {
  const supabase = createClient();
  const email = formData.get("email") as string;
  await supabase.auth.resetPasswordForEmail(email);

  return {
    message: "Link to reset password was sent to the email",
  };
}

export async function signout() {
  const supabase = createClient();

  await supabase.auth.signOut();
}

export async function discordLogin() {
  const site_url = process.env.NEXT_PUBLIC_SITE_URL;

  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${site_url}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
}
