import { searchForCraftableDecks } from "@/actions/deckSearch.action";
import { getRequestedDecks } from "@/service/supabase.service";
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
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HeroIcon } from "@/components/HeroIcon";
export default async function Decks() {
  const { craftableDecks, userCollection } = await searchForCraftableDecks();
  const decks = await getRequestedDecks();

  console.log(decks, "decks");

  return (
    <div className="grid grid-cols-[320px_1fr]">
      <div>filters</div>
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
            {decks?.map((deck) => (
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
                <TableCell>{deck.user_id}</TableCell>
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
          <TableFooter>
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
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
