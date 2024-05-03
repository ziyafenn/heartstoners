import { getHsDeckClasses } from "@/service/hs.service";
import Link from "next/link";

export default async function DeckBuilderMode() {
  const deckClasses = await getHsDeckClasses();

  return (
    <div className="flex flex-col">
      <ul className="flex gap-6">
        <li key="standard">Standard</li>
        <li key="wild">Wild (coming soon)</li>
      </ul>
      <ul className="grid grid-cols-3">
        {deckClasses.map((deckClass) => {
          if (deckClass.slug === "neutral") return null;
          return (
            <li key={deckClass.id}>
              <Link
                href={{
                  pathname: `/deckbuilder/standard`,
                  query: { class: deckClass.slug, mode: "constructed" },
                }}
              >
                {deckClass.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
