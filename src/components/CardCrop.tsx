import { Card } from "@/types/hs.type";
import Image from "next/image";

export function CardCrop({
  children,
  card,
}: {
  children: React.ReactNode;
  card: Card;
}) {
  return (
    <>
      <div className="absolute z-10 flex h-10 w-[268px] select-none items-center justify-between bg-gradient-to-r from-black from-30% via-transparent via-70% font-hs">
        <div className="flex items-center gap-2">
          <div className="font-outline-2 flex size-8 items-center justify-center bg-[url(/assets/mana.png)] bg-contain bg-no-repeat text-center text-[16px]">
            {card.manaCost}
          </div>
          <span className="font-outline-2 w-4/5 leading-none">{card.name}</span>
        </div>
        <div className="flex size-8 w-4 items-center justify-center rounded-l-lg bg-black/80 pl-1 text-center text-[gold]">
          {children}
        </div>
      </div>
      <div className="h-10 w-[243px] overflow-hidden">
        {card.cropImage ? (
          <Image
            className="h-14 object-contain object-right"
            src={card.cropImage}
            width={243}
            height={64}
            alt={card.name}
            draggable={false}
          />
        ) : (
          <Image
            className="scale-[1.6] object-contain object-[38px_0px]"
            src={card.image}
            width={530}
            height={384}
            alt={card.name}
            draggable={false}
          />
        )}
      </div>
    </>
  );
}
