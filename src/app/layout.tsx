import type { Metadata } from "next";
import { Patua_One as FonsHs, Inter as FontSans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createClient } from "@/service/supabase.auth.server";
import { cn } from "@/lib/utils";
import Image from "next/image";

const hs = FonsHs({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-hs",
});
const inter = FontSans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // const userProfile = await getUserProfile(user.id)

  return (
    <html lang="en">
      <body
        className={cn(
          inter.variable,
          hs.variable,
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          "dark min-h-svh font-sans bg-gradient-to-r from-[hsl(246,55%,10%)] via-[hsl(243,40%,19%)] to-[hsl(240,27%, 19%)]",
        )}
      >
        <header>
          <nav className="flex select-none items-center justify-between px-8 py-4">
            <Link href="/">
              <Image
                src="/img/logo.png"
                width={676}
                height={362}
                alt="heartstoners logo"
                className="h-20 w-auto"
              />
              no user
            </Link>

            <ul className="flex items-center gap-8">
              <li>
                <Link href="/decks">Decks</Link>
              </li>
              <li>Profile</li>
              <li>
                <Button asChild>
                  <Link href="/deckbuilder">Create a deck</Link>
                </Button>
              </li>
            </ul>
          </nav>
        </header>
        <div className="flex flex-col p-8">
          <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
        </div>
        <footer className="border-t p-4">
          <div className="text-xs">
            All assets are trademark of ©2014 Blizzard Entertainment, Inc.
            <br /> All rights reserved. Heroes of Warcraft is a trademark, and
            Hearthstone is a registered trademark of Blizzard Entertainment,
            Inc. in the U.S. and/or other countries.
          </div>
        </footer>
      </body>
    </html>
  );
}
