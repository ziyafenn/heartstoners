"use client";
import { signout } from "@/actions/login.action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/UserAvatar";
import type { Tables } from "@/types/supabase.type";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function ProfileMenu({
  userProfile,
}: { userProfile: Tables<"profiles"> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <UserAvatar imageSrc={userProfile.avatar_url} className="size-6" />
        {userProfile.display_name} <ChevronDown className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => signout()}>Sign out</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/hsConnect">Hs connect</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
