import { createHsClient, getToken } from "@/service/fetch";
import { getSingleCard } from "@/service/hs.service";
import { getPlayerCollection } from "@/service/hsreplay.service";
import { DeckBuilder } from "./components/DeckBuild";
import { DeckBuilderFilter } from "./components/DeckBuildFilter";

export default async function Home() {
  const hsClient = await createHsClient();

  const cards = await hsClient.cardSearch({
    gameMode: "constructed",
    type: "minion",
    pageSize: 30,
    class: "demonhunter",
  });

  const classes = await hsClient.metadata({
    type: "classes",
  });

  const minionTypes = await hsClient.metadata({
    type: "minionTypes",
  });

  const rarities = await hsClient.metadata({
    type: "rarities",
  });

  const metadata = {
    classes: classes.data,
    minionTypes: minionTypes.data,
    rarities: rarities.data,
  };
  // const player = await getPlayerCollection("sfd");

  // const card = await getSingleCard("559");
  // console.log(card, "card");

  return (
    <main className="flex">
      <DeckBuilder cards={cards.data.cards} metadata={metadata} />
    </main>
  );
}
