import { CardType } from "@/types/hs.type";
import {
  MapIcon,
  Sparkles,
  SquareUserRound,
  SwordsIcon,
  VenetianMask,
} from "lucide-react";

export function CardTypeIcon({ name }: { name: CardType["name"] }) {
  switch (name) {
    case "Weapon":
      return <SwordsIcon className="size-5" />;

    case "Hero":
      return <SquareUserRound className="size-5" />;

    case "Spell":
      return <Sparkles className="size-5" />;

    case "Location":
      return <MapIcon className="size-5" />;

    default:
      return <VenetianMask className="size-5" />;
  }
}
