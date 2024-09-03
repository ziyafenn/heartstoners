import React, { forwardRef, useState } from "react";
import { Card } from "@/types/hs.type";
import Image from "next/image";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { MinusIcon, XIcon } from "lucide-react";

type CardCropProps = {
  card: Card;
  cardsInSideboard: number;
  onSideboardClick: () => void;
  count: number;
  onRemove: (card: Card) => void;
};

export const CardCrop = forwardRef<HTMLLIElement, CardCropProps>(
  ({ card, cardsInSideboard, onSideboardClick, count, onRemove }, ref) => {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
      <li
        className={cn(
          "flex justify-end rounded-sm min-h-10 relative select-none",
          card.maxSideboardCards && "min-h-12",
        )}
        onMouseEnter={() => setHovered(card.id)}
        onMouseLeave={() => setHovered(null)}
        ref={ref}
      >
        {card.maxSideboardCards && (
          <div className="absolute bottom-0 z-20 flex w-full justify-center">
            <Button size="sm" className="h-4" onClick={onSideboardClick}>
              OPEN {`${cardsInSideboard}/3`}
            </Button>
          </div>
        )}
        <>
          <div className="absolute z-10 flex h-10 w-full select-none items-center justify-between rounded-lg bg-gradient-to-r from-black from-30% via-transparent via-70% font-hs">
            <div className="flex items-center gap-2 pl-2">
              <div className="font-outline-2 flex size-8 items-center justify-center bg-[url(/assets/mana.png)] bg-contain bg-no-repeat text-center text-[16px]">
                {card.manaCost}
              </div>
              <span className="font-outline-2 w-4/5 leading-none">
                {card.name}
              </span>
            </div>
            <div className="flex size-8 w-4 items-center justify-center rounded-l-lg bg-black/80 pl-1 text-center text-[gold]">
              {hovered === card.id ? (
                <button onClick={() => onRemove(card)}>
                  {count === 2 ? (
                    <MinusIcon className="size-4" />
                  ) : (
                    <XIcon className="size-4" />
                  )}
                </button>
              ) : (
                count
              )}
            </div>
          </div>
          <div className="h-10 overflow-hidden">
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
      </li>
    );
  },
);

CardCrop.displayName = "CardCrop";
