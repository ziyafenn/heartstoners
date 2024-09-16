import { login } from "@/actions/login.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignIn() {
  return (
    <form className="flex flex-col gap-8" action={login}>
      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Button type="submit" className="w-full">
          Sign In with Email
        </Button>
      </div>
    </form>
  );
}
