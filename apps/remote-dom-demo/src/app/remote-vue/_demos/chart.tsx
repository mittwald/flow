/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Area,
  Bar,
  CartesianChart,
  ChartGrid,
  ChartTooltip,
  Heading,
  IconMonitoring,
  IllustratedMessage,
  XAxis,
  YAxis,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent } from "vue";

const data = [
  { time: "0:00", Shields: 40, Hull: 24 },
  { time: "1:00", Shields: 30, Hull: 13 },
  { time: "2:00", Shields: 20, Hull: 78 },
  { time: "3:00", Shields: 27, Hull: 39 },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const chart = (chartData: Record<string, unknown>[]) => (
  <CartesianChart data={chartData} height="300px">
    {{
      /*
       * `emptyView` is a slot, not a property — rendered output does not
       * survive structured clone.
       */
      emptyView: () => (
        <IllustratedMessage>
          <IconMonitoring />
          <Heading>No data available</Heading>
        </IllustratedMessage>
      ),
      default: () => [
        <ChartGrid />,
        <Area dataKey="Shields" />,
        <Area dataKey="Hull" color="palatinate-blue" />,
        <XAxis dataKey="time" />,
        <YAxis domain={[0, 100]} unit="%" />,
        /*
         * The formatters are remote *properties*, so the host calls them across
         * the boundary and always receives a Promise. They are typed
         * `Promise<T> | T` for that reason, and the host awaits — which is why
         * the async one below works at all.
         */
        <ChartTooltip
          headingFormatter={(value: unknown) => `Sync Format: ${value}`}
          formatter={async (
            value: unknown,
            name: unknown,
            _index: unknown,
            unit?: string,
          ) => {
            await sleep(3000);
            return `Async Format: ${name}: ${value}${unit ? ` ${unit}` : ""}`;
          }}
        />,
      ],
    }}
  </CartesianChart>
);

/**
 * The same chart as a bar chart, once per layout.
 *
 * `layout` decides which axis carries the categories, so the grid lines and the
 * two axes swap with it.
 */
const barChart = (layout: "horizontal" | "vertical") => {
  const vertical = layout === "vertical";

  return (
    <CartesianChart data={data} height="300px" layout={layout}>
      <ChartGrid vertical={vertical} horizontal={!vertical} />
      <Bar dataKey="Shields" />
      <Bar dataKey="Hull" color="palatinate-blue" />
      {vertical ? <XAxis unit="%" /> : <XAxis dataKey="time" />}
      {vertical ? (
        <YAxis dataKey="time" />
      ) : (
        <YAxis domain={[0, 100]} unit="%" />
      )}
      <ChartTooltip />
    </CartesianChart>
  );
};

/** The Vue counterpart of `/remote/chart`. */
export const ChartDemo = defineComponent({
  name: "ChartDemo",
  setup: () => () => [
    chart(data),
    chart(data),
    chart([]),
    barChart("horizontal"),
    barChart("vertical"),
  ],
});
