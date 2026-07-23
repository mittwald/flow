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
    time: "0:00",
    Shields: 40,
    Hull: 24,
  },
  {
    time: "1:00",
    Shields: 30,
    Hull: 13,
  },
  {
    time: "2:00",
    Shields: 20,
    Hull: 78,
  },
  {
    time: "3:00",
    Shields: 27,
    Hull: 39,
  },
];

export default function Page() {
  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const emptyView = (
    <IllustratedMessage>
      <IconMonitoring />
      <Heading>No data available</Heading>
    </IllustratedMessage>
  );

  const ExampleChart: FC<{ data: Record<string, unknown>[] }> = ({ data }) => {
    return (
      <CartesianChart emptyView={emptyView} data={data} height="300px">
        <CartesianGrid />
        <Area dataKey="Shields" />
        <Area dataKey="Hull" color="palatinate-blue" />
        <XAxis dataKey="time" />
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
