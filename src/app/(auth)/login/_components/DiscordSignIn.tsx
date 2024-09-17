"use client";

import { discordLogin } from "@/actions/login.action";
import { Button } from "@/components/ui/button";

export function DiscordSignIn() {
  return (
    <Button onClick={() => discordLogin()} type="button" className="w-full">
      Discord
    </Button>
  );
}
