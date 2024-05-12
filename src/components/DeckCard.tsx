import { Flame } from "lucide-react";

export function DeckCard() {
  return (
    <li className="flex flex-col justify-between flex-1 bg-slate-400 p-4">
      <div>
        <div id="name-meta" className="flex justify-between">
          <div className="leading-none">
            <h3>Deck Name</h3>
            <span className="text-xs">Aggro - Deck Hunter</span>
          </div>
          <div id="mode-class" className="flex gap-2">
            <div className="rounded-full bg-red-600 size-6" />
            <div className="rounded-full bg-red-600 size-6" />
          </div>
        </div>
        <span className="text-xs">45432</span>
      </div>
      <div className="flex justify-between text-sm items-center">
        <span>💎💎💎💎</span>
        <div id="author" className="flex items-center gap-2">
          <span className="text-sm">Author Name</span>
        </div>
      </div>
    </li>
  );
}
