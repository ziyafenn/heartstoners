import { CardType } from "@/types/hs.type";

export const CARD_TYPES: CardType[] = [
  {
    slug: "hero",
    id: 3,
    name: "Hero",
    gameModes: [1, 5],
  },
  {
    slug: "minion",
    id: 4,
    name: "Minion",
    gameModes: [1, 2, 5, 6, 7],
  },
  {
    slug: "spell",
    id: 5,
    name: "Spell",
    gameModes: [1, 2, 5, 6],
  },
  {
    slug: "weapon",
    id: 7,
    name: "Weapon",
    gameModes: [1, 5, 6],
  },
  {
    slug: "hero power",
    id: 10,
    name: "HeroPower",
  },
  {
    slug: "location",
    id: 39,
    name: "Location",
    gameModes: [1, 5],
  },
  {
    slug: "baconquestreward",
    id: 40,
    name: "Reward",
    gameModes: [2],
  },
];
