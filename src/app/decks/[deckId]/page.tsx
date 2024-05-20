import { getDeckByCardList } from "@/service/hs.service";
import { getDeckLikeByIp, getSingleDeck } from "@/service/supabase.service";
import { UserDeck } from "./_components/UserDeck";
import { encrypt, getUserIp } from "@/lib/serverUtils";

export default async function Deck({ params }: { params: { deckId: number } }) {
  const { deckId } = params;

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

  return (
    <div className="grid-cols-2">
      <UserDeck
        userDeck={userDeck!}
        deckData={deckData}
        didUserLike={!!didUserLike}
      />
    </div>
  );
}
