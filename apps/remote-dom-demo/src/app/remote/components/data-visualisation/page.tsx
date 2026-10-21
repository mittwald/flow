"use client";
import { ComponentGroupPage } from "@/app/remote/components/_lib/ComponentGroupPage";
import {
  Area,
  BigNumber,
  CartesianChart,
  ChartGrid,
  ChartTooltip,
  DonutChart,
  Heading,
  Section,
  Text,
  XAxis,
  YAxis,
} from "@mittwald/flow-remote-react-components";

const shieldData = [
  { time: "0:00", Shields: 40, Hull: 24 },
  { time: "1:00", Shields: 30, Hull: 13 },
  { time: "2:00", Shields: 20, Hull: 78 },
  { time: "3:00", Shields: 27, Hull: 39 },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Page() {
  return (
    <ComponentGroupPage title="Data Visualisation">
      <Section>
        <Heading level={3}>BigNumber</Heading>
        <BigNumber>
          <Text>98%</Text>
          <Text>Shield strength</Text>
        </BigNumber>
      </Section>

      <Section>
        <Heading level={3}>CartesianChart</Heading>
        {/* The tooltip formatters run in the extension, so the host gets a
            Promise back from both — the async one takes three seconds. */}
        <CartesianChart data={shieldData} height="300px">
          <ChartGrid />
          <Area dataKey="Shields" />
          <Area dataKey="Hull" color="palatinate-blue" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} unit="%" />
          <ChartTooltip
            headingFormatter={(value) => `Sync format: ${value}`}
            formatter={async (value, name, index, unit) => {
              await sleep(3000);
              return `Async format: ${name}: ${value}${unit ? ` ${unit}` : ""}`;
            }}
          />
        </CartesianChart>
      </Section>

      <Section>
        <Heading level={3}>DonutChart</Heading>
        <DonutChart
          aria-label="Fleet"
          segments={[
            { title: "Star Destroyers", value: 12 },
            { title: "TIE fighters", value: 64 },
            { title: "Shuttles", value: 24 },
          ]}
        />
      </Section>
    </ComponentGroupPage>
  );
}
