import { getHsClasses, getHsSetGroups } from "@/service/hs.service";
import Link from "next/link";

export default async function DeckBuilderType() {
  const hsClasses = await getHsClasses();
  // const setGroups = await getHsSetGroups();

  return (
    <div>
      <div>Standard</div>

      <ul>
        {hsClasses.map((hsClass) => (
          <li key={hsClass.id}>
            <Link href={`/deckbuilder/${hsClass.slug}`}>{hsClass.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
