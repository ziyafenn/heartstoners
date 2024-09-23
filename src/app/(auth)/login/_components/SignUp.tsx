"use client";
import { Button } from "@/components/ui/button";
import { checkProfanity } from "@/service/profanity.service";
import { createClient } from "@/service/supabase.auth.client";
import { signUpSchema } from "@/types/schema";
import { type FormEvent, useState } from "react";
import type { z } from "zod";
import { FormItem } from "./FormItem";
import { LoaderPinwheel } from "lucide-react";

type Form = z.infer<typeof signUpSchema>;

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSucces] = useState(false);
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

    setIsLoading(true);

    const dataObj = {
      email: formData.get("email")?.toString().trim(),
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

    const { isProfanity } = await checkProfanity(username);

    if (isProfanity) {
      setFieldErrors((state) => ({
        ...state,
        username: ["It seems your username contains profanity"],
      }));
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: username } },
    });

    if (error) {
      setError(error.message);
      return;
    }

    // await postAuth({ shouldRedirect: !redirectDeckCode });
    setIsLoading(false);
    setIsSucces(true);
    form.reset();
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={signupUser}>
      {error && <span className="pt-2 text-center text-red-500">{error}</span>}
      {isSuccess && (
        <span className="pt-2 text-center text-green-400">
          Link to confirm your email was sent to your email address
        </span>
      )}

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
          description="Min 3 characters"
          minLength={3}
          maxLength={20}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center gap-1">
            <LoaderPinwheel className="size-4 animate-spin text-gray-500" />
            Singing up...
          </span>
        ) : (
          "Create your account"
        )}
      </Button>
    </form>
  );
}
