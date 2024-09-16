import { AssetIcon } from "@/components/AssetIcon";
import type { Card, CardType, Rarity } from "@/types/hs.type";
import { Calendar, HistoryIcon } from "lucide-react";
import { CARD_TYPES } from "@/lib/cardTypes";
import { CARD_RARITIES } from "@/lib/cardRarities";
import { CardTypeIcon } from "@/components/CardTypeIcon";
import { DustCost } from "@/components/DustCost";
import { searchForCraftableDecks } from "@/actions/deckSearch.action";
import type { UserDeck } from "@/types/deck.type";
import { findData } from "@/lib/utils";

type Props = {
  cards: Card[];
  availableDust: number;
  deck: UserDeck;
};

export async function DeckStats({ cards, deck, availableDust }: Props) {
  const { game_version, card_ids, dust_cost_sum, updated_at, created_at, id } =
    deck;
  const craftableDeck = await searchForCraftableDecks({ deckId: id });

  const cardTypes: Record<CardType["name"], number> = {
    Hero: 0,
    Location: 0,
    Minion: 0,
    Spell: 0,
    Weapon: 0,
    HeroPower: 0,
    Reward: 0,
  };

  const cardRarities: Record<Rarity["name"], number> = {
    Common: 0,
    Free: 0,
    Epic: 0,
    Rare: 0,
    Legendary: 0,
  };

  cards.forEach((card) => {
    card_ids.push(card.id);
    const cardTypeName = findData(CARD_TYPES, "id", card.cardTypeId).name;
    cardTypes[cardTypeName] = cardTypes[cardTypeName] + 1;
    const cardRarityName = findData(CARD_RARITIES, "id", card.rarityId).name;
    cardRarities[cardRarityName] = cardRarities[cardRarityName] + 1;
  });

  const cardTypeAllocation = Object.entries(cardTypes);
  const cardRarityAllocation = Object.entries(cardRarities);
  return (
    <div className="flex flex-col divide-y pl-4">
      <ul className="flex flex-col divide-y">
        <li className="flex justify-between gap-1 pb-2">
          <span className="flex gap-1">
            <AssetIcon type="asset" name="dust" />
            Cost
          </span>
          <DustCost
            availableDust={availableDust}
            dustCostSum={dust_cost_sum}
            craftableDeck={craftableDeck?.craftableDecks[0]}
          />
        </li>
        {cardRarityAllocation.map((cardRarity) => {
          if (cardRarity[1] === 0) return null;
          return (
            <li
              key={cardRarity[0]}
              className="flex items-center justify-between py-2"
            >
              <span className="flex items-baseline gap-1">
                <AssetIcon type="rarity" name={cardRarity[0].toLowerCase()} />
                {cardRarity[0]}
              </span>
              <span className="font-bold">{cardRarity[1]}</span>
            </li>
          );
        })}
        {cardTypeAllocation.map((cardType) => {
          if (cardType[1] === 0) return null;
          return (
            <li
              key={cardType[0]}
              className="flex items-center justify-between py-2"
            >
              <span className="flex items-center gap-1">
                <CardTypeIcon name={cardType[0] as CardType["name"]} />
                {cardType[0]}
              </span>
              <span className="font-bold">{cardType[1]}</span>
            </li>
          );
        })}
        <li className="flex items-center justify-between py-2">
          <span className="flex items-center gap-1">
            <Calendar className="size-5" />
            Created
          </span>
          <span className="font-bold">
            {new Date(created_at).toLocaleDateString()}
          </span>
        </li>
        {updated_at > created_at && (
          <li className="flex items-center justify-between py-2">
            <span className="flex items-center gap-1">
              <Calendar className="size-5" />
              Updated
            </span>
            <span className="font-bold">
              {new Date(updated_at).toLocaleDateString()}
            </span>
          </li>
        )}
        <li className="flex items-center justify-between py-2">
          <span className="flex items-center gap-1">
            <HistoryIcon className="size-5" />
            Version
          </span>
          <span className="font-bold">{game_version}</span>
        </li>
      </ul>
    </div>
  );
}
