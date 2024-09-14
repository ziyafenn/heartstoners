import { getDeckByCardList } from "@/service/hs.service";
import Image from "next/image";
import { CardCrop } from "@/components/CardCrop";
import { Card, CardType, Rarity } from "@/types/hs.type";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { getUserDeck } from "@/actions/deck.action";
import { DeckPopularity } from "@/components/DeckPopularity";
import { CARD_TYPES } from "@/lib/cardTypes";
import { CARD_RARITIES } from "@/lib/cardRarities";
import { AssetIcon } from "@/components/AssetIcon";
import { CardTypeIcon } from "@/components/CardTypeIcon";
import { DeckManaChart } from "@/components/DeckManaChart";
import { HeroIcon } from "@/components/HeroIcon";
import { Separator } from "@/components/ui/separator";
import { DustCost } from "@/components/DustCost";
import { searchForCraftableDecks } from "@/actions/deckSearch.action";
import { Badge } from "@/components/ui/badge";

export default async function Deck({ params }: { params: { deckId: number } }) {
  const { deckId } = params;
  const userDeck = await getUserDeck(deckId);
  const { deck, didUserLike, availableDust } = userDeck!;
  const {
    archetype,
    card_ids,
    created_at,
    deck_class,
    deck_format,
    description,
    dust_cost_sum,
    game_version,
    meta_sub_archetypes,
    name,
    profiles,
    sideboard_cards,
    updated_at,
    youtube_id,
  } = deck;

  const {
    class: deckClass,
    cards,
    sideboardCards,
  } = await getDeckByCardList({
    cardIds: card_ids,
    sideboardCards: sideboard_cards ?? undefined,
  });

  const craftableDeck = await searchForCraftableDecks({ deckId });

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
    const cardTypeName = CARD_TYPES.find(
      (cardType) => cardType.id === card.cardTypeId,
    )!.name;
    cardTypes[cardTypeName] = cardTypes[cardTypeName] + 1;
    const cardRarityName = CARD_RARITIES.find(
      (cardRarity) => cardRarity.id === card.rarityId,
    )!.name;
    cardRarities[cardRarityName] = cardRarities[cardRarityName] + 1;
  });

  const cardTypeAllocation = Object.entries(cardTypes);
  const cardRarityAllocation = Object.entries(cardRarities);

  function showSelectedCard(cardsToShow: Card[] | undefined) {
    if (!cardsToShow) return [];
    const seen = new Set();
    const uniqueCards = cardsToShow?.filter((el) => {
      const duplicate = seen.has(el.id);
      seen.add(el.id);
      return !duplicate;
    });
    return uniqueCards.sort((a, b) => a.manaCost - b.manaCost);
  }

  // function showRunes() {
  //   const runes: Rune[] = [];

  //   for (const [key, value] of Object.entries(deathKnightRuneSlots)) {
  //     runes.push(...Array.from({ length: value }, () => key as Rune));
  //   }

  //   return runes;
  // }

  return (
    <div className="grid grid-cols-[1fr,auto] justify-between gap-8">
      <main className="flex flex-col gap-8">
        <section className="flex flex-col gap-4 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeroIcon slug={deck_class} className="size-8" />
              <h1 className="font-hs text-3xl">{name}</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button size="icon" disabled={didUserLike}>
                <Heart />
              </Button>
              <Button>Copy Deck</Button>
            </div>
          </div>
          <div className="flex items-center">
            <ul className="flex items-center gap-2">
              <Badge>{archetype}</Badge>
              {meta_sub_archetypes && <Badge>{meta_sub_archetypes.name}</Badge>}
            </ul>
            {/* <div className="flex gap-1">
              <AssetIcon type="asset" name="dust" />
              <DustCost
                availableDust={availableDust}
                dustCostSum={dust_cost_sum}
                craftableDeck={craftableDeck?.craftableDecks[0]}
              />
            </div>
            <div>
              <DeckPopularity deck={deck} />
            </div> */}
          </div>
        </section>
        <Separator />
        <section className="flex flex-col gap-8">
          {/* <div className="flex justify-between items-center">
            <ul className="flex flex-wrap divide-x-2">
              {cardRarityAllocation.map((cardRarity) => {
                if (cardRarity[1] === 0) return null;
                return (
                  <li
                    key={cardRarity[0]}
                    className="flex gap-1 px-3 first:pl-0 last:pr-0"
                  >
                    <AssetIcon
                      type="rarity"
                      name={cardRarity[0].toLowerCase()}
                    />
                    {cardRarity[0]}:
                    <span className="font-bold">{cardRarity[1]}</span>
                  </li>
                );
              })}
            </ul>
            <ul className="flex flex-wrap divide-x-2">
              {cardTypeAllocation.map((cardType) => {
                if (cardType[1] === 0) return null;
                return (
                  <li
                    key={cardType[0]}
                    className="flex items-center gap-1 px-3 first:pl-0 last:pr-0"
                  >
                    <CardTypeIcon name={cardType[0] as CardType["name"]} />
                    {cardType[0]}:
                    <span className="font-bold">{cardType[1]}</span>
                  </li>
                );
              })}
            </ul>
          </div> */}
          <div className="whitespace-pre-wrap">{description}</div>
          {!!youtube_id && (
            <iframe
              id="ytplayer"
              width="640"
              height="360"
              src={`https://www.youtube.com/embed/${youtube_id}`}
            />
          )}
        </section>
      </main>
      <aside className="grid grid-cols-2 gap-4">
        <div className="flex w-[320px] flex-col rounded-md border-4 border-border shadow-lg">
          <div className="relative text-xl font-bold">
            <div className="absolute size-full bg-black/50" />
            <div className="absolute flex size-full items-center justify-between pl-3 pr-2">
              <span className="font-outline-2 font-hs leading-tight drop-shadow-md">
                {deckClass.name}
              </span>
              {/* {deckClassSlug === "deathknight" && (
                <div className="flex min-w-32 items-center justify-end">
                  {showRunes().map((rune, index) => (
                    <AssetIcon type="rune" name={rune} key={index} />
                  ))}
                </div>
              )} */}
            </div>
            <Image
              src={`/heroes/${deckClass.slug}.jpg`}
              width={1440}
              height={1440}
              className="h-16 object-cover object-[0px,-64px]"
              alt={deckClass.name}
            />
          </div>
          <ul className="flex flex-col gap-1 bg-black/20 p-3">
            {showSelectedCard(cards).map((card, index) => {
              const count =
                cards?.filter((selectedCard) => selectedCard.id === card.id)
                  .length ?? 0;
              return (
                <CardCrop card={card} count={count} key={card.id} isView />
              );
            })}
          </ul>
        </div>
        <div className="flex w-[320px] flex-col gap-4">
          {sideboardCards &&
            sideboardCards.map((sideboard) => (
              <div
                key={sideboard.sideboardCard.id}
                className="flex w-[320px] flex-col rounded-md border-4 border-border shadow-lg"
              >
                <div className="relative text-lg font-bold">
                  <div className="absolute size-full bg-gradient-to-r from-black from-30% via-transparent via-70%" />
                  <div className="absolute flex size-full items-center justify-between pl-3 pr-2">
                    <span className="font-outline-2 font-hs leading-tight drop-shadow-md">
                      {sideboard.sideboardCard.name}
                    </span>
                  </div>
                  <Image
                    src={sideboard.sideboardCard.cropImage!}
                    width={243}
                    height={64}
                    className="h-12 w-full object-cover"
                    alt={deckClass.name}
                  />
                </div>
                <ul className="flex flex-col gap-1 bg-black/20 p-3">
                  {sideboard.cardsInSideboard
                    .sort((a, b) => a.manaCost - b.manaCost)
                    .map((card) => (
                      <CardCrop card={card} key={card.id} count={1} isView />
                    ))}
                </ul>
              </div>
            ))}
          <DeckManaChart selectedCards={cards} />
        </div>
      </aside>
    </div>
  );
}
