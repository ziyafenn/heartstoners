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
import { Filters } from "./Filters";
import { useState } from "react";
import { filterDecks } from "@/actions/deckSearch.action";
import type { DBFunction } from "@/types/supabase.func.type";
import { AssetIcon } from "@/components/AssetIcon";
import { DeckPopularity } from "@/components/DeckPopularity";
import type { UserDeck } from "@/types/deck.type";
import { DustCost } from "@/components/DustCost";

type Props = {
  decks: UserDeck[];
  craftableDecks: DBFunction<"get_craftable_decks", "Returns">;
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
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Archetype</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="text-right">Popularity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentDecks.map((deck) => (
              <TableRow key={deck.id}>
                <TableCell className="flex items-center gap-4">
                  <AssetIcon
                    type="hero"
                    name={deck.deck_class}
                    className="size-10"
                  />
                  <span className="flex flex-col gap-1">
                    <div className="text-base font-bold">{deck.name}</div>
                    <div className="flex gap-1">
                      <AssetIcon type="asset" name="dust" />
                      <DustCost
                        availableDust={availableDust}
                        dustCostSum={deck.dust_cost_sum}
                        craftableDeck={getCraftableDeck(deck.id)}
                      />
                    </div>
                  </span>
                </TableCell>
                <TableCell>
                  <div>{deck.meta_sub_archetypes?.name}</div>
                  <div>{deck.archetype}</div>
                </TableCell>
                <TableCell className="text-right">
                  {new Date(deck.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span>{deck.profiles!.avatar_url}</span>
                  <span>{deck.profiles!.username}</span>
                </TableCell>
                <TableCell>
                  <span>
                    <DeckPopularity deck={deck} />
                  </span>
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
