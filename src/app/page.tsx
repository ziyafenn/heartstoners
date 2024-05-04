import {
  getPlayerCollection,
  getSubArchetypePopularity,
  getSubArchetypes,
} from "@/service/hsreplay.service";
import { getDecks } from "@/service/supabase";
import Link from "next/link";

export default async function Home() {
  const decks = await getDecks();
  const playerCollection = await getPlayerCollection("sdf");
  const subArchetypePopularity = await getSubArchetypePopularity();
  const subArchetypes = await getSubArchetypes();
  return (
    <main className="flex">
      <ul>
        player dust: {playerCollection.dust}
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
