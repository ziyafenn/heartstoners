"use client";

import { discordLogin } from "@/actions/login.action";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import discordLogo from "public/img/discord.svg";

export function DiscordSignIn({
  redirectDeckCode,
}: { redirectDeckCode?: string }) {
  return (
    <Button
      onClick={() => discordLogin({ redirectDeckCode })}
      type="button"
      className="flex w-full items-center gap-2 bg-[#5865F2] text-white"
    >
      <Image src={discordLogo} alt="discord" />
      Sign in with Discord
    </Button>
  );
}
