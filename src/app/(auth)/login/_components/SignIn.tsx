"use client";

import { postAuth } from "@/actions/login.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/service/supabase.auth.client";
import { signInSchema } from "@/types/schema";
import Link from "next/link";
import { type FormEvent, useState } from "react";

export function SignIn() {
  const [error, setError] = useState("");

  async function signinUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = createClient();
    const form = e.currentTarget;
    const formData = new FormData(form);

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
      return console.log(success, parseError);
    }

    const { email, password } = parsedData;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    await postAuth();
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={signinUser}>
      <div className="flex flex-col gap-2">
        {error && (
          <span className="pt-2 text-center text-red-500">{error}</span>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="text-blue-500"
              asChild
            >
              <Link href="/resetPassword">Forgot password?</Link>
            </Button>
          </div>
          <Input name="password" type="password" required />
        </div>
      </div>
      <Button type="submit">Sign In with Email</Button>
    </form>
  );
}
