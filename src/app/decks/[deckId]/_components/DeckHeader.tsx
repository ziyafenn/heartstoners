import { AssetIcon } from "@/components/AssetIcon";
import { DeckPopularity } from "@/components/DeckPopularity";
import { toCapital } from "@/lib/utils";
import { UserDeck } from "@/types/deck.type";
import { DeckHeaderActions } from "./DeckHeaderActions";
import { Badge } from "@/components/ui/badge";

type Props = { deck: UserDeck; didUserLike: boolean; deckCode: string };

export function DeckHeader({ deck, didUserLike, deckCode }: Props) {
  const { archetype, deck_class, name, meta_sub_archetypes, deck_format } =
    deck;

  return (
    <section className="flex flex-col gap-4 border-b pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AssetIcon type="hero" name={deck_class} className="size-7" />
          <h1 className="font-hs text-3xl">{name}</h1>
        </div>
        <DeckHeaderActions
          didUserLike={didUserLike}
          deckCode={deckCode}
          deckId={deck.id}
          authorId={deck.profiles!.id}
        />
      </div>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <AssetIcon type="format" name={deck_format} />
          <Badge>{toCapital(archetype)}</Badge>
          {meta_sub_archetypes && <Badge>{meta_sub_archetypes.name}</Badge>}
          <Badge className="bg-black/80">
            <DeckPopularity deck={deck} />
          </Badge>
        </div>
      </div>
    </section>
  );
}
