import Image from "next/image";

export function AssetIcon({
  name,
  type,
  className,
}: {
  name: string;
  type: "rarity" | "asset" | "rune" | "format";
  className?: string;
}) {
  if (type === "asset")
    return (
      <div className="size-4">
        <Image
          src={`/assets/${name}.png`}
          alt={name}
          height={72}
          width={72}
          className={className}
        />
      </div>
    );

  if (type === "rarity")
    return (
      <div className="size-4">
        <Image src={`/rarity/${name}.png`} alt={name} height={39} width={27} />
      </div>
    );

  if (type === "rune")
    return (
      <div className="size-10">
        <Image src={`/runes/${name}.png`} alt={name} height={120} width={120} />
      </div>
    );

  if (type === "format")
    return (
      <div className="box-content size-5 rounded-full border border-border">
        <Image src={`/format/${name}.svg`} width={25} height={25} alt={name} />
      </div>
    );
}
