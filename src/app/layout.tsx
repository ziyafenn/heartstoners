import type { Metadata } from "next";
import { Patua_One as FonsHs, Rubik as FontSans } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Image from "next/image";
import Link from "next/link";
import discordLogo from "public/img/discord.svg";
import xLogo from "public/img/x.svg";
import { Header } from "./_components/Header";

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

const title = "Heartstone Decks for Current Meta - Crafted by Community!";
const description =
  "Find Heartstone decks for every Perils in Paradise meta. Discover top creative decks you can create from your collection. Made by community of deck-crafters.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "heartstone",
    "decks",
    "meta",
    "perils in paradise",
    "battlegrounds",
    "cards",
    "top",
    "best",
  ],
  twitter: {
    site: "@heartstoners_gg",
    card: "summary",
    title,
    description,
    images: "https://heartstoners.gg/img/x-post.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.variable,
          hs.variable,
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          "dark min-h-svh flex flex-col font-sans bg-[#150416] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(28,17,92,0.7),rgba(255,255,255,0))]",
        )}
      >
        <Header />
        <div className="flex flex-1 flex-col">
          <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
        </div>
        <footer className="flex items-center justify-between border-t p-4">
          <div className="text-xs">
            © {new Date().getFullYear()} HeartStoners.gg
            <br />
            Heartstone™ assets are trademark of ©2014 Blizzard Entertainment,
            Inc.
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild className="size-10 p-0">
              <Link href="https://discord.gg/4zqnSMStha" target="_blank">
                <Image src={discordLogo} alt="discord" className="size-5" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="size-10 p-0">
              <Link href="https://x.com/heartstoners_gg" target="_blank">
                <Image src={xLogo} alt="discord" className="size-5" />
              </Link>
            </Button>
          </div>
        </footer>
        <SpeedInsights />
      </body>
    </html>
  );
}
