"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/service/supabase.auth.server";

export async function login(formData: FormData) {
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
    redirect("/error");
  }

  console.log(loginData, "login data");

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: signup, error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error, "error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}