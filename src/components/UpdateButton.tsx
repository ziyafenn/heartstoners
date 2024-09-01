"use client";

import { Button } from "./ui/button";
import { searchForCraftableDecks } from "@/actions/deckSearch.action";

export default function UpdateCollectionButton({
  action,
  label,
}: {
  action: () => void;
  label: string;
}) {
  return (
    <div>
      <Button onClick={() => searchForCraftableDecks()}>get decks</Button>
    </div>
  );
}
