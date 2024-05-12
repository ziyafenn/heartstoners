import Image from "next/image";

export function HeroIcon({ slug }: { slug: string }) {
  return (
    <Image
      src={`/hero_icons/${slug}.png`}
      alt={slug}
      width={193}
      height={193}
    />
  );
}
