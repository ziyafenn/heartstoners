import { getDeckByCardList } from "@/service/hs.service";
import { getSingleDeck } from "@/service/supabase";
import Image from "next/image";

export default async function Deck({ params }: { params: { deckId: string } }) {
  const { deckId } = params;
  const userDeck = await getSingleDeck(deckId);
  const deckData = await getDeckByCardList(userDeck!.card_ids);

  return (
    <div>
      <ul>
        {/* {Object.entries(deck!).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))} */}
        {deckData.cards.map((card) => (
          <li key={card.id}>
            <Image src={card.image} alt={card.name} height={530} width={384} />
          </li>
        ))}
      </ul>
    </div>
  );
}
