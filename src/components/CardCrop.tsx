"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Card } from "@/types/hs.type";
import { MinusIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { forwardRef, useState } from "react";
import { Button } from "./ui/button";

type CardCropProps = {
  card: Card;
  cardsInSideboard?: number;
  onSideboardClick?: () => void;
  count: number;
  onRemove?: (card: Card) => void;
  isView: boolean;
};

export const CardCrop = forwardRef<HTMLLIElement, CardCropProps>(
  (
    { card, cardsInSideboard, onSideboardClick, count, onRemove, isView },
    ref,
  ) => {
    const [hovered, setHovered] = useState<number | null>(null);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    return (
      <Tooltip
        delayDuration={100}
        onOpenChange={(value) => isView && setIsTooltipOpen(value)}
        open={isTooltipOpen}
      >
        <TooltipTrigger asChild>
          <li
            className={cn(
              "relative flex min-h-10 select-none justify-end rounded-sm",
              card.maxSideboardCards && !isView && "min-h-12",
            )}
            onMouseEnter={() => setHovered(card.id)}
            onMouseLeave={() => setHovered(null)}
            ref={ref}
          >
            {!!card.maxSideboardCards && !isView && (
              <div className="absolute bottom-0 z-20 flex w-full justify-center">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-4"
                  onClick={onSideboardClick}
                >
                  OPEN {`${cardsInSideboard}/3`}
                </Button>
              </div>
            )}
            <>
              <div className="absolute z-10 flex h-10 w-full select-none items-center justify-between rounded-lg bg-gradient-to-r from-30% from-black via-70% via-transparent font-hs">
                <div className="flex items-center gap-2 pl-2">
                  <div className="flex size-8 items-center justify-center bg-[url(/assets/mana.png)] bg-contain bg-no-repeat text-center font-outline-2 text-[16px]">
                    {card.manaCost}
                  </div>
                  <span className="font-outline-2 leading-none">
                    {card.name}
                  </span>
                </div>
                <div className="flex size-8 w-4 items-center justify-center rounded-l-lg bg-black/80 pl-1 text-center text-[gold]">
                  {hovered === card.id && !isView && onRemove ? (
                    <button onClick={() => onRemove(card)} type="button">
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
                    className="h-14 w-auto object-contain object-right"
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
        </TooltipTrigger>
        <TooltipContent side="left">
          <Image
            className="w-[320px]"
            draggable={false}
            alt={card.name}
            src={card.image}
            height={530}
            width={384}
          />
        </TooltipContent>
      </Tooltip>
    );
  },
);

CardCrop.displayName = "CardCrop";
