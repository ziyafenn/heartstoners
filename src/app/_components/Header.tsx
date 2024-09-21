import { Button } from "@/components/ui/button";
import { getUser, getUserProfile } from "@/service/supabase.service";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProfileMenu } from "./ProfileMenu";

export async function Header() {
  const auth = await getUser();
  const userProfile = auth.user && (await getUserProfile(auth.user.id));

  return (
    <header>
      <nav className="flex select-none items-center justify-between px-8 py-4">
        <Link href="/">
          <Image
            src="/img/logo.png"
            width={1140}
            height={450}
            alt="heartstoners logo"
            className="h-20 w-auto"
          />
        </Link>
        <ul className="flex items-center gap-8 font-medium">
          <li className="hover:text-indigo-400">
            {userProfile ? (
              <ProfileMenu userProfile={userProfile} />
            ) : (
              <Link href="/login" className="flex gap-1">
                <User className="size-5" />
                Sign in
              </Link>
            )}
          </li>
          <li className="hover:text-indigo-400">
            <Link href="/decks">Discover Decks</Link>
          </li>
          <li>
            <Button asChild variant="primary">
              <Link href="/deckbuilder">Create a deck</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
