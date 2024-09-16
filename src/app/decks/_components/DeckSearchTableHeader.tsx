import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
export function DeckSearchTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Archetype</TableHead>
        <TableHead className="text-right">Date</TableHead>
        <TableHead>Author</TableHead>
        <TableHead className="text-right">Popularity</TableHead>
      </TableRow>
    </TableHeader>
  );
}
