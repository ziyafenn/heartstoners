import Image from "next/image";

export function AssetIcon({
  name,
  type,
}: {
  name: string;
  type: "rarity" | "asset" | "rune";
}) {
  if (type === "asset")
    return (
      <div className="size-4">
        <Image src={`/assets/${name}.png`} alt={name} height={72} width={72} />
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
}
