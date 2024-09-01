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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HeroIcon } from "@/components/HeroIcon";
import { Filters } from "./Filters";
import { useState } from "react";
import { filterDecks } from "@/actions/deckSearch.action";

type Props = {
  decks: Awaited<ReturnType<typeof filterDecks>>;
};

export function DeckSearch({ decks }: Props) {
  const [currentDecks, setCurrentDecks] = useState(() => decks);

  async function updateFilters(activeFilters: FormData) {
    const updatedDecks = await filterDecks(activeFilters);
    setCurrentDecks(updatedDecks);
  }
  return (
    <div className="grid grid-cols-[200px_1fr] gap-12">
      <Filters onUpdateFilters={updateFilters} />
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentDecks.map((deck) => (
              <TableRow key={deck.id}>
                <TableCell className="flex items-center gap-2 font-medium">
                  <HeroIcon slug={deck.deck_class} className="size-6" />
                  {deck.name}
                </TableCell>
                <TableCell>{deck.deck_class}</TableCell>
                <TableCell>
                  {deck.archetype} {deck.sub_archetype}
                </TableCell>
                <TableCell>{deck.deck_format}</TableCell>
                <TableCell>{deck.profiles.avatar_url}</TableCell>
                <TableCell>{deck.dust_cost_sum}</TableCell>
                <TableCell className="text-right">
                  {new Date(deck.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {deck.game_version}
                </TableCell>
              </TableRow>
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
