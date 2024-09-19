import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  currentCount: number;
  onAddCard: () => void;
  isDisabled: boolean;
  name: string;
  image: string;
};

export function HsCard({
  currentCount,
  isDisabled,
  onAddCard,
  name,
  image,
}: Props) {
  return (
    <div className="card">
      <div className={cn("coin", !currentCount && "hidden")}>
        {currentCount}
      </div>
      <button
        onClick={onAddCard}
        disabled={isDisabled}
        type="button"
        className={cn(isDisabled && "cursor-not-allowed grayscale")}
      >
        <Image
          draggable={false}
          className={cn("image", currentCount && "selected")}
          alt={name}
          src={image}
          height={530}
          width={384}
        />
      </button>
    </div>
  );
}
