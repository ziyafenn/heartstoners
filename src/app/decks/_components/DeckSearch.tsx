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
import { DBFunction } from "@/types/supabase.func.type";
import { AssetIcon } from "@/components/AssetIcon";
import { DeckPopularity } from "@/components/DeckPopularity";
import { UserDecks } from "@/types/deck.type";

type Props = {
  decks: UserDecks;
  craftableDecks: DBFunction<"get_craftable_decks", "Returns"> | null;
  availableDust: number | null;
};

function DustCost({
  isCraftable,
  dustCostSum,
  availableDust,
}: {
  isCraftable: boolean;
  dustCostSum: number;
  availableDust: number | null;
}) {
  if (isCraftable)
    return <span className="font-bold text-green-500">Craftable</span>;
  if (availableDust) return <span>{dustCostSum - availableDust}</span>;
  return <span>{dustCostSum}</span>;
}

export function DeckSearch({ decks, availableDust, craftableDecks }: Props) {
  const [currentDecks, setCurrentDecks] = useState(() => decks);

  function checkIsCraftable(deck: UserDecks[number]) {
    const craftableDeck = craftableDecks?.find(
      (craftableDeck) => craftableDeck.user_deck_id === deck.id,
    );
    const canBeCrafted =
      !!craftableDeck && craftableDeck.required_dust_cost <= availableDust;
    if (canBeCrafted) return true;
    return false;
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
                <TableCell className="flex gap-4 items-center">
                  <HeroIcon slug={deck.deck_class} className="size-10" />
                  <span className="flex flex-col gap-1">
                    <div className="text-base font-bold">{deck.name}</div>
                    <div className="flex gap-1">
                      <AssetIcon type="asset" name="dust" />
                      <DustCost
                        availableDust={availableDust}
                        dustCostSum={deck.dust_cost_sum}
                        isCraftable={checkIsCraftable(deck)}
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
