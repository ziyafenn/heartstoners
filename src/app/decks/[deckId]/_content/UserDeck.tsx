"use client";
import { copyDeck, likeDeck } from "@/actions/deck.action";
import { Button } from "@/components/ui/button";
import { Card, Deck } from "@/types/hs.type";
import { Tables } from "@/types/superbase.type";
import Image from "next/image";

export function UserDeck({
  deck,
  cards,
  didUserLike,
}: {
  deck: Tables<"user_decks">;
  cards: Card[];
  didUserLike: boolean;
}) {
  return (
    <>
      <ul className="grid grid-cols-auto-fit-hscard">
        {/* {Object.entries(deck!).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))} */}
        {cards.map((card) => (
          <li key={card.id}>
            <Image src={card.image} alt={card.name} height={530} width={384} />
          </li>
        ))}
      </ul>
      <div>
        <Button
          disabled={didUserLike}
          onClick={() =>
            likeDeck({
              author_id: deck.user_id,
              deck_id: deck.id,
            })
          }
        >
          Like
        </Button>

        <Button onClick={() => copyDeck(deck.id)}>Copy</Button>
      </div>
    </>
  );
}
