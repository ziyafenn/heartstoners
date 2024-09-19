"use client";

import type { Card } from "@/types/hs.type";
import { ResponsiveBar } from "@nivo/bar";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

const fullConfig = resolveConfig(tailwindConfig);
const {
  theme: { colors },
} = fullConfig;

export function DeckManaChart({ selectedCards }: { selectedCards: Card[] }) {
  const manaCostCounts: { name: string; count: number }[] = [];
  const manaCostCountsSum = selectedCards.reduce(
    (acc, card) => {
      const manaCost = card.manaCost >= 7 ? 7 : card.manaCost;
      acc[manaCost] = (acc[manaCost] || 0) + 1;
      return acc;
    },
    { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 } as {
      [key: number]: number;
    },
  );

  for (const [name, count] of Object.entries(manaCostCountsSum)) {
    const key = name === "7" ? "7+" : name;
    manaCostCounts.push({ name: key, count: Number(count) });
  }

  return (
    <div className="h-40">
      <ResponsiveBar
        axisLeft={null}
        data={manaCostCounts}
        keys={["count"]}
        borderRadius={3}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 0 }}
        padding={0.4}
        colors={[colors.indigo[500]]}
        isInteractive={false}
        theme={{
          grid: { line: { stroke: colors.border } },
          axis: { legend: { text: { fill: "#FFFFFF" } } },
          labels: { text: { fill: "white" } },
          text: { fill: "white" },
        }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
      />
    </div>
  );
}
