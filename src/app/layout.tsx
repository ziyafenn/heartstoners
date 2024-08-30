import type { Metadata } from "next";
import { Patua_One as FonsHs, Inter as FontSans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createClient } from "@/service/supabase.auth.server";
import { cn } from "@/lib/utils";

const hs = FonsHs({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-hs",
});
const inter = FontSans({
  subsets: ["latin"],
  weight: ["400"],
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

  return (
    <html lang="en">
      <body
        className={cn(inter.variable, hs.variable, "dark h-screen font-sans")}
      >
        <header>
          <nav className="flex items-center justify-between p-4">
            <div>
              <Link href="/">Logo {user?.id || "no user"}</Link>
            </div>
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
        <div className="flex flex-col gap-8 p-8">
          <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
        </div>
        <footer className="border-t p-4">
          <div className="text-xs">
            All assets are trademark of ©2014 Blizzard Entertainment, Inc.
            <br /> All rights reserved. Heroes of Warcraft is a trademark, and
            Hearthstone is a registered trademark of Blizzard Entertainment,
            Inc. in the U.S. and/or other countries.
          </div>
          <div></div>
        </footer>
      </body>
    </html>
  );
}
