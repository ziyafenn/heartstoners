import { cn } from "@/lib/utils";
import type { Card, CardClass, Rarity, SetGroups } from "@/types/hs.type";
import Image from "next/image";
import type { HTMLAttributes } from "react";

type NameTypeMap = {
  rarity: Rarity["slug"];
  asset: "dust" | "mana";
  rune: keyof NonNullable<Card["runeCost"]>;
  format: SetGroups["slug"];
  hero: CardClass["slug"];
};

type Props<T extends keyof NameTypeMap> = {
  name: NameTypeMap[T];
  type: T;
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

export function AssetIcon<T extends keyof NameTypeMap>({
  name,
  type,
  className,
}: Props<T>) {
  if (type === "asset")
    return (
      <div className={cn("size-4", className)}>
        <Image src={`/assets/${name}.png`} alt={name} height={72} width={72} />
      </div>
    );

  if (type === "rarity")
    return (
      <div className={cn("size-4", className)}>
        <Image src={`/rarity/${name}.png`} alt={name} height={39} width={27} />
      </div>
    );

  if (type === "rune")
    return (
      <div className={cn("size-10", className)}>
        <Image src={`/runes/${name}.png`} alt={name} height={120} width={120} />
      </div>
    );

  if (type === "format")
    return (
      <div
        className={cn(
          "box-content size-5 rounded-full border border-border",
          className,
        )}
      >
        <Image src={`/format/${name}.svg`} width={25} height={25} alt={name} />
      </div>
    );

  if (type === "hero")
    return (
      <div className={className}>
        <Image
          src={`/hero_icons/${name}.png`}
          alt={name}
          width={193}
          height={193}
        />
      </div>
    );
}

// export function AssetIcon<T extends keyof NameTypeMap>(props: Props<T>) {
//   return (
//     <Tooltip>
//       <TooltipTrigger>
//         <AssetIconTrigger {...props} />
//       </TooltipTrigger>
//       <TooltipContent>{props.name}</TooltipContent>
//     </Tooltip>
//   );
// }
