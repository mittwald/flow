"use client";

import {
  Area,
  CartesianChart,
  CartesianGrid,
  ChartTooltip,
  Heading,
  IconMonitoring,
  IllustratedMessage,
  XAxis,
  YAxis,
} from "@mittwald/flow-remote-react-components";
import type { FC } from "react";

const data = [
  {
    Zeit: "0 Uhr",
    Datenbanken: 40,
    Projekte: 24,
  },
  {
    Zeit: "1 Uhr",
    Datenbanken: 30,
    Projekte: 13,
  },
  {
    Zeit: "2 Uhr",
    Datenbanken: 20,
    Projekte: 78,
  },
  {
    Zeit: "3 Uhr",
    Datenbanken: 27,
    Projekte: 39,
  },
];

export default function Page() {
  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const emptyView = (
    <IllustratedMessage>
      <IconMonitoring />
      <Heading>Keine Daten verfügbar</Heading>
    </IllustratedMessage>
  );

  const ExampleChart: FC<{ data: readonly unknown[] }> = ({ data }) => {
    return (
      <CartesianChart emptyView={emptyView} data={data} height="300px">
        <CartesianGrid />
        <Area dataKey="Datenbanken" />
        <Area dataKey="Projekte" color="palatinate-blue" />
        <XAxis dataKey="Zeit" />
        <YAxis domain={[0, 100]} unit="%" />
        <ChartTooltip
          headingFormatter={(v) => {
            return `Sync Format: ${v}`;
          }}
          formatter={async (value, name, index, unit) => {
            await sleep(3000);
            return `Async Format: ${name}: ${value}${unit ? ` ${unit}` : ""}`;
          }}
        />
      </CartesianChart>
    );
  };

  return (
    <>
      <ExampleChart data={data} />
      <ExampleChart data={[]} />
    </>
  );
}
