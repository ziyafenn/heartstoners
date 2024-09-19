"use client";
import { filterDecks } from "@/actions/deckSearch.action";
import { Table, TableBody } from "@/components/ui/table";
import type { CraftableDeck, UserDeck } from "@/types/deck.type";
import type { Tables } from "@/types/supabase.type";
import { useActionState, useRef } from "react";
import { DeckRow } from "./DeckRow";
import { Filters } from "./DeckSearchFilters";
import { DeckSearchTableHeader } from "./DeckSearchTableHeader";

type Props = {
  decks: UserDeck[];
  count: number;
  craftableDecks: CraftableDeck[];
  availableDust: number;
  subArchetypes: Tables<"meta_sub_archetypes">[];
};

export function DeckSearch({
  decks,
  availableDust,
  craftableDecks,
  subArchetypes,
  count,
}: Props) {
  const [state, action] = useActionState(filterDecks, {
    userDecks: decks,
    pagination: [0, 10] as const,
    count,
  });
  const formRef = useRef<HTMLFormElement>(null);

  function getCraftableDeck(id: number) {
    return craftableDecks?.find(
      (craftableDeck) => craftableDeck.user_deck_id === id,
    );
  }

  return (
    <div className="grid grid-cols-[256px,1fr] gap-12">
      <Filters
        onUpdateFilters={action}
        subArchetypes={subArchetypes}
        availableDust={availableDust}
        formRef={formRef}
      />
      <div>
        <Table>
          <DeckSearchTableHeader />
          <TableBody>
            {state.userDecks.map((deck) => (
              <DeckRow
                deck={deck}
                availableDust={availableDust}
                craftableDeck={getCraftableDeck(deck.id)}
                key={deck.id}
              />
            ))}
          </TableBody>
        </Table>
        {/* <DeckSearchPagination
          formRef={formRef}
          onChangePage={action}
          count={state.count}
          pagination={state.pagination}
        /> */}
      </div>
    </div>
  );
}
