"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { decodeDeck } from "@/actions/deckBuider.action";
import { useActionState, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DeckImportForm() {
  const [state, action] = useActionState(decodeDeck, {});
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (state.error) setIsError(true);
  }, [state]);

  return (
    <>
      <AlertDialog open={isError} onOpenChange={setIsError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error importing deck</AlertDialogTitle>
            <AlertDialogDescription>{state.error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <form action={action} className="flex items-center gap-4">
        <Input
          name="deckCode"
          type="text"
          required
          placeholder="Paste your code"
        />
        <Button type="submit" size="sm">
          Import Deck
        </Button>
      </form>
    </>
  );
}
