"use client";

import { postAuth } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import { createClient } from "@/service/supabase.auth.client";
import { signInSchema } from "@/types/schema";
import { type FormEvent, useState } from "react";
import type { z } from "zod";
import { FormItem } from "./FormItem";
import { LoaderPinwheel } from "lucide-react";

type Form = z.infer<typeof signInSchema>;

export function SignIn({
  redirectDeckCode,
  onClose,
}: { redirectDeckCode?: string; onClose?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof Form, string[]>>
  >({
    email: [],
    password: [],
  });

  async function signinUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = createClient();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setIsLoading(true);

    const dataObj = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const {
      success,
      data: parsedData,
      error: parseError,
    } = signInSchema.safeParse(dataObj);

    if (!success) {
      const er = parseError.flatten().fieldErrors;

      setFieldErrors(er);
      return;
    }

    const { email, password } = parsedData;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }
    await postAuth({ shouldRedirect: !redirectDeckCode });
    setIsLoading(false);
    if (onClose) onClose();
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={signinUser}>
      <div className="flex flex-col gap-2">
        {error && (
          <span className="pt-2 text-center text-red-500">{error}</span>
        )}
        <FormItem field="email" label="Email" error={fieldErrors.email?.[0]} />
        <FormItem
          forgotPassTarget={redirectDeckCode ? "_blank" : "_self"}
          field="password"
          label="Password"
          error={fieldErrors.password?.[0]}
        />
      </div>
      <Button type="submit">
        {isLoading ? (
          <span className="flex items-center gap-1">
            <LoaderPinwheel className="size-4 animate-spin text-gray-500" />
            Singing up...
          </span>
        ) : (
          "Sign in with Email"
        )}
      </Button>
    </form>
  );
}
