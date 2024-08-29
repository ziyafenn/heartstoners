import { CardClass } from "@/types/hs.type";
import Image from "next/image";
import { HTMLAttributes } from "react";

export function HeroIcon({
  slug,
  className,
}: {
  slug: CardClass["slug"];
  className?: HTMLAttributes<HTMLDivElement>["className"];
}) {
  return (
    <div className={className}>
      <Image
        src={`/hero_icons/${slug}.png`}
        alt={slug}
        width={193}
        height={193}
      />
    </div>
  );
}
