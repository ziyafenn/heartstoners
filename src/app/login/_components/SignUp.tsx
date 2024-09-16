import { signup } from "@/actions/login.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUp() {
  return (
    <form className="flex flex-col gap-8" action={signup}>
      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="username" required />
        </div>
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
          Create your account
        </Button>
      </div>
    </form>
  );
}
