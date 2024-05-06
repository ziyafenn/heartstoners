import UpdateCollectionButton from "@/components/UpdateButton";
import { updateUserCollection } from "@/actions/deckBuider.action";

import { getPlayerCollection } from "@/service/hsreplay.service";
import {
  getCraftableDecks,
  getDecks,
  getMetaSubArchetypes,
} from "@/service/supabase.service";
import Link from "next/link";
import { supabase } from "@/service/fetch";

export default async function Home() {
  const decks = await getDecks();
  // const playerCollection = await getPlayerCollection("sdf");
  // const subArchetypes = await getMetaSubArchetypes();

  return (
    <main className="flex">
      {/* <UpdateCollectionButton
        label="Update collection"
        action={() => updateUserCollection()}
      /> */}
      <UpdateCollectionButton label="get craftable decks" />

      <ul>
        {/* player dust: {playerCollection.dust} */}
        {decks?.map((deck) => (
          <li key={deck.id}>
            <Link href={`/decks/${deck.id}`}>
              {deck.name}
              {deck.dust_cost}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
