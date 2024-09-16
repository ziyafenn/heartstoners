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
import { Filters } from "./Filters";
import { useState } from "react";
import { filterDecks } from "@/actions/deckSearch.action";
import type { CraftableDeck, UserDeck } from "@/types/deck.type";
import { DeckRow } from "./DeckRow";
import { DeckSearchTableHeader } from "./DeckSearchTableHeader";

type Props = {
  decks: UserDeck[];
  craftableDecks: CraftableDeck[];
  availableDust: number;
};

export function DeckSearch({ decks, availableDust, craftableDecks }: Props) {
  const [currentDecks, setCurrentDecks] = useState(() => decks);

  function getCraftableDeck(id: number) {
    return craftableDecks?.find(
      (craftableDeck) => craftableDeck.user_deck_id === id,
    );
  }

  async function updateFilters(activeFilters: FormData) {
    const updatedDecks = await filterDecks(activeFilters);
    setCurrentDecks(updatedDecks);
  }

  return (
    <div className="grid grid-cols-[256px_1fr] gap-12">
      <Filters onUpdateFilters={updateFilters} />
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
