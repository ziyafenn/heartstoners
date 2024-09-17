"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { signout } from "@/actions/login.action";

export function ProfileMenu({ username }: { username: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1">
        {username} <ChevronDown className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => signout()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}