"use client";
import { postAuth } from "@/actions/login.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/service/supabase.auth.client";
import { signUpSchema } from "@/types/schema";
import { type FormEvent, useState } from "react";

export function SignUp() {
  const [error, setError] = useState("");

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
      return console.log(success, parseError);
    }

    const { email, password, username } = parsedData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) {
      setError(error.message);
    }
    await postAuth();
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={signupUser}>
      {error && <span className="pt-2 text-center text-red-500">{error}</span>}
      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input name="username" type="username" required key="username" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            key="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input name="password" type="password" required key="password" />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Create your account
      </Button>
    </form>
  );
}
