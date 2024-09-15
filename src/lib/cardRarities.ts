import type { Rarity } from "@/types/hs.type";

export const CARD_RARITIES: Rarity[] = [
  {
    slug: "common",
    id: 1,
    craftingCost: [40, 400],
    dustValue: [5, 50],
    name: "Common",
  },
  {
    slug: "free",
    id: 2,
    craftingCost: [],
    dustValue: [],
    name: "Free",
  },
  {
    slug: "rare",
    id: 3,
    craftingCost: [100, 800],
    dustValue: [20, 100],
    name: "Rare",
  },
  {
    slug: "epic",
    id: 4,
    craftingCost: [400, 1600],
    dustValue: [100, 400],
    name: "Epic",
  },
  {
    slug: "legendary",
    id: 5,
    craftingCost: [1600, 3200],
    dustValue: [400, 1600],
    name: "Legendary",
  },
];
