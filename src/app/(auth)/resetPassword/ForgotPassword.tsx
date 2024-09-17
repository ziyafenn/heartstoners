"use client";

import { forgotPassword } from "@/actions/login.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";

export function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPassword, { message: "" });

  return (
    <form className="flex flex-col gap-8" action={action}>
      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
      </div>
      <Button type="submit">Reset password</Button>
      {state.message && (
        <span className="pt-2 text-center text-green-500">{state.message}</span>
      )}
    </form>
  );
}
