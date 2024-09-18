"use client";
import { postAuth } from "@/actions/login.action";
import { Button } from "@/components/ui/button";
import { createClient } from "@/service/supabase.auth.client";
import { signUpSchema } from "@/types/schema";
import { type FormEvent, useState } from "react";
import type { z } from "zod";
import { FormItem } from "./FormItem";

type Form = z.infer<typeof signUpSchema>;

export function SignUp({
  redirectDeckCode,
  onClose,
}: { redirectDeckCode?: string; onClose?: () => void }) {
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof Form, string[]>>
  >({
    email: [],
    password: [],
    username: [],
  });

  async function signupUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = createClient();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const dataObj = {
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    const {
      success,
      data: parsedData,
      error: parseError,
    } = signUpSchema.safeParse(dataObj);

    if (!success) {
      const er = parseError.flatten().fieldErrors;

      setFieldErrors(er);
      return;
    }

    const { email, password, username } = parsedData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: username } },
    });

    if (error) {
      setError(error.message);
      return;
    }
    await postAuth({ shouldRedirect: !redirectDeckCode });
    if (onClose) onClose();
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={signupUser}>
      {error && <span className="pt-2 text-center text-red-500">{error}</span>}
      <div className="flex flex-col gap-2">
        <FormItem field="email" label="Email" error={fieldErrors.email?.[0]} />
        <FormItem
          field="password"
          label="Password"
          error={fieldErrors.password?.[0]}
          description="Min 6 characters"
        />
        <FormItem
          field="username"
          label="Username"
          error={fieldErrors.username?.[0]}
          description="Min 3 characters, no profanity"
        />
      </div>
      <Button type="submit" className="w-full">
        Create your account
      </Button>
    </form>
  );
}
