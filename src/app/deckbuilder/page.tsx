import { getHsDeckClasses } from "@/service/hs.service";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function DeckBuilderMode() {
  const deckClasses = await getHsDeckClasses();
  const format = "standard";

  return (
    <div className="flex flex-col">
      <Tabs>
        <TabsList>
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="wild">Wild</TabsTrigger>
        </TabsList>
      </Tabs>
      <ul className="grid grid-cols-3">
        {deckClasses.map((deckClass) => {
          if (deckClass.slug === "neutral") return null;
          return (
            <li key={deckClass.id}>
              <Link
                href={{
                  pathname: `/deckbuilder/${format}`,
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
