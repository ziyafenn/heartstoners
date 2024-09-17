"use client";

import { login } from "@/actions/login.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useFormState } from "react-dom";

export function SignIn() {
  const [state, action] = useFormState(login, { error: "" });
  return (
    <form className="flex flex-col gap-8" action={action}>
      <div className="flex flex-col gap-2">
        {state.error && (
          <span className="pt-2 text-center text-red-500">{state.error}</span>
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
