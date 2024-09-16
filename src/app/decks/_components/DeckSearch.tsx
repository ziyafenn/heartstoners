"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table, TableBody } from "@/components/ui/table";
import { Filters } from "./DeckSearchFilters";
import { filterDecks } from "@/actions/deckSearch.action";
import type { CraftableDeck, UserDeck } from "@/types/deck.type";
import { DeckRow } from "./DeckRow";
import { DeckSearchTableHeader } from "./DeckSearchTableHeader";
import { useFormState } from "react-dom";
import type { Tables } from "@/types/supabase.type";

type Props = {
  decks: UserDeck[];
  craftableDecks: CraftableDeck[];
  availableDust: number;
  subArchetypes: Tables<"meta_sub_archetypes">[];
};

export function DeckSearch({
  decks,
  availableDust,
  craftableDecks,
  subArchetypes,
}: Props) {
  const [currentDecks, action] = useFormState(filterDecks, decks);

  function getCraftableDeck(id: number) {
    return craftableDecks?.find(
      (craftableDeck) => craftableDeck.user_deck_id === id,
    );
  }

  return (
    <div className="grid grid-cols-[256px,1fr] gap-12">
      <Filters onUpdateFilters={action} subArchetypes={subArchetypes} />
      <div>
        <Table>
          <DeckSearchTableHeader />
          <TableBody>
            {currentDecks.map((deck) => (
              <DeckRow
                deck={deck}
                availableDust={availableDust}
                craftableDeck={getCraftableDeck(deck.id)}
                key={deck.id}
              />
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
