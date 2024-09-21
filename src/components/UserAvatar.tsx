import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { HTMLAttributes } from "react";

type Props = {
  className?: HTMLAttributes<HTMLDivElement>["className"];
  imageSrc: string | undefined | null;
};

export function UserAvatar({ imageSrc, className }: Props) {
  return (
    <Avatar className={cn("size-6", className)}>
      <AvatarImage src={imageSrc ?? ""} />
      <AvatarFallback>
        <Image
          src={"/img/fallback.webp"}
          alt="fallback avatar"
          width={1024}
          height={1024}
          className={cn("size-6", className)}
        />
      </AvatarFallback>
    </Avatar>
  );
}
