import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { DeckGeneratedData } from "@/types/deck.type";
import { createDeck } from "@/actions/deckBuider.action";
import { Button } from "./ui/button";

type Props = {
  children: React.ReactNode;
  deckData: DeckGeneratedData;
};
export default function DeckBuilderForm({ children, deckData }: Props) {
  const createUserDeck = createDeck.bind(null, deckData);
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        <form action={createUserDeck}>
          <Input name="name" key="name" type="text" />
          <Textarea name="description" />
          <Button type="submit">Submit</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
