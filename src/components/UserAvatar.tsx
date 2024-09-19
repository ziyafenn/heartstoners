import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Props = {
  className?: HTMLAttributes<HTMLDivElement>["className"];
  imageSrc: string | undefined;
};

export function UserAvatar({ imageSrc, className }: Props) {
  return (
    <Avatar className={cn("size-8", className)}>
      <AvatarImage src={imageSrc} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
