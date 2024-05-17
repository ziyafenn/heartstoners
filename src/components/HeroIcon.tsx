import { CardClass } from "@/types/hs.type";
import Image from "next/image";

export function HeroIcon({ slug }: { slug: CardClass["slug"] }) {
  return (
    <Image
      src={`/hero_icons/${slug}.png`}
      alt={slug}
      width={193}
      height={193}
    />
  );
}
