"use client";
import { signout } from "@/actions/auth.action";
import { UserAvatar } from "@/components/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        <DropdownMenuItem asChild>
          <Link href="/auth/hsConnect">Connect to HSReplay</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signout()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
