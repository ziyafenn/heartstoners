"use client";

import { discordLogin } from "@/actions/login.action";
import { Button } from "@/components/ui/button";

export function DiscordSignIn({
  redirectDeckCode,
}: { redirectDeckCode?: string }) {
  return (
    <Button
      onClick={() => discordLogin({ redirectDeckCode })}
      type="button"
      className="w-full"
    >
      Discord
    </Button>
  );
}
