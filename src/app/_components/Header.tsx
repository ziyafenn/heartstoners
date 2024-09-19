import { Button } from "@/components/ui/button";
import { getUser, getUserProfile } from "@/service/supabase.service";
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
            width={1290}
            height={402}
            alt="heartstoners logo"
            className="h-16 w-auto"
          />
        </Link>
        <ul className="flex items-center gap-8">
          <li>
            <Link href="/decks">Decks</Link>
          </li>
          <li>
            {userProfile ? (
              <ProfileMenu username={userProfile.display_name} />
            ) : (
              <Link href="/login">Sign in</Link>
            )}
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
