"use client";
import { signup } from "@/actions/login.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";

export function SignUp() {
  const [state, action] = useFormState(signup, {});
  return (
    <form className="flex flex-col gap-8" action={action}>
      {state.error && (
        <span className="pt-2 text-center text-red-500">{state.error}</span>
      )}
      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input name="username" type="username" required />
        </div>
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
          <Label htmlFor="password">Password</Label>
          <Input name="password" type="password" required />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Create your account
      </Button>
    </form>
  );
}
