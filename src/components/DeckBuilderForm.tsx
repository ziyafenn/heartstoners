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
import { ResponsiveBar } from "@nivo/bar";

type Props = {
  children: React.ReactNode;
  deckData: DeckGeneratedData;
};

function BarChart(props) {
  return (
    <div {...props}>
      <ResponsiveBar
        data={[
          { name: "Jan", count: 111 },
          { name: "Feb", count: 157 },
          { name: "Mar", count: 129 },
          { name: "Apr", count: 150 },
          { name: "May", count: 119 },
          { name: "Jun", count: 72 },
        ]}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#2563eb"]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A bar chart showing data"
      />
    </div>
  );
}

export default function DeckBuilderForm({ children, deckData }: Props) {
  const createUserDeck = createDeck.bind(null, deckData);
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-4">
            <BarChart className="flex-1" />
          </div>
          <form action={createUserDeck} className="flex flex-col gap-4">
            <Input name="name" key="name" type="text" />
            <Textarea name="description" />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
