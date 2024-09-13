import { getDeckByCardList } from "@/service/hs.service";
import { getDeckLikeByIp, getSingleDeck } from "@/service/supabase.service";
import { encrypt, getUserIp } from "@/lib/serverUtils";
import Image from "next/image";
import { CardCrop } from "@/components/CardCrop";
import { Card } from "@/types/hs.type";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default async function Deck({ params }: { params: { deckId: number } }) {
  const { deckId } = params;

  const {
    archetype,
    card_ids,
    sideboard_cards,
    created_at,
    deck_class,
    deck_format,
    description,
    dust_cost_sum,
    game_mode,
    game_version,
    name,
    meta_sub_archetypes,
    updated_at,
    youtube_link,
    user_id,
  } = await getSingleDeck(deckId);
  const {
    class: deckClass,
    cards,
    sideboardCards,
  } = await getDeckByCardList({
    cardIds: card_ids,
    sideboardCards: sideboard_cards ?? undefined,
  });

  const userIp = getUserIp();
  const encryptedUserIp = encrypt(userIp);
  const didUserLike = await getDeckLikeByIp({
    deckId: Number(deckId),
    ip: encryptedUserIp,
  });

  function showSelectedCard(cardsToShow: Card[] | undefined) {
    if (!cardsToShow) return [];
    const seen = new Set();
    const uniqueCards = cardsToShow?.filter((el) => {
      const duplicate = seen.has(el.id);
      seen.add(el.id);
      return !duplicate;
    });
    return uniqueCards;
  }

  // function showRunes() {
  //   const runes: Rune[] = [];

  //   for (const [key, value] of Object.entries(deathKnightRuneSlots)) {
  //     runes.push(...Array.from({ length: value }, () => key as Rune));
  //   }

  //   return runes;
  // }

  return (
    <div className="grid grid-cols-[1fr,auto] gap-8">
      <main>
        <div className="flex items-center justify-between">
          <h1 className="font-hs text-3xl">{name}</h1>
          <div className="flex items-center gap-4">
            <Button size="icon" disabled={!!didUserLike}>
              <Heart />
            </Button>
            <Button>Copy Deck</Button>
          </div>
        </div>
        <div>{description}</div>
      </main>
      <aside className="deckColumn">
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
        </div>
      </aside>
    </div>
  );
}
