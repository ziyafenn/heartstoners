"use client";

import { getCraftableDecks } from "@/service/supabase.service";
import { Button } from "./ui/button";
import { updateUserCollection } from "@/actions/deckBuider.action";

export default function UpdateCollectionButton({
  action,
  label,
}: {
  action: () => void;
  label: string;
}) {
  return (
    <div>
      <Button onClick={() => getCraftableDecks()}>get decks</Button>
      <Button onClick={() => updateUserCollection()}>update collection</Button>
    </div>
  );
}
