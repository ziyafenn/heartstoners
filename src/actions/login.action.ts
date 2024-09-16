"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/service/supabase.auth.server";

type Result = { error?: string };

export async function login(
  state: { error?: string },
  formData: FormData,
): Promise<Result> {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: loginData, error } =
    await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(
  state: Result,
  formData: FormData,
): Promise<Result> {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) {
    const message =
      error.code === "unexpected_failure"
        ? "Username already taken"
        : error.message;
    return {
      error: message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signout() {
  const supabase = createClient();

  await supabase.auth.signOut();
}

type ForgotPassword = Result & { message?: string };

export async function forgotPassword(
  state: ForgotPassword,
  formData: FormData,
): Promise<ForgotPassword> {
  const supabase = createClient();
  const email = formData.get("email") as string;
  await supabase.auth.resetPasswordForEmail(email);

  return {
    message: "Link to reset password was sent to the email",
  };
}
