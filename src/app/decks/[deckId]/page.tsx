import { getDeckByCardList } from "@/service/hs.service";
import { getDeckLikeByIp, getSingleDeck } from "@/service/supabase.service";
import { UserDeck } from "./_components/UserDeck";
import { encrypt, getUserIp } from "@/lib/serverUtils";

export default async function Deck({ params }: { params: { deckId: number } }) {
  const { deckId } = params;

  // if (!hasUserViewedPage) {
  //   await deckInteraction({ deckId, type: "increment_views" });
  //   cookieStore.set("view", "y");
  // }
  // if (!hasUserCopiedDeck) {
  //   cookieStore.set("copy", "y");
  // }

  const userDeck = await getSingleDeck(deckId);
  const deckData = await getDeckByCardList({
    cardIds: userDeck!.card_ids,
    sideboardCards: userDeck?.sideboard_cards ?? undefined,
  });

  const userIp = getUserIp();
  const encryptedUserIp = encrypt(userIp);

  const didUserLike = await getDeckLikeByIp({
    deckId: Number(deckId),
    ip: encryptedUserIp,
  });

  console.log(didUserLike, "didUserLike");

  return (
    <div className="grid grid-cols-2">
      <UserDeck
        deck={userDeck!}
        cards={deckData.cards}
        didUserLike={!!didUserLike}
      />
    </div>
  );
}
