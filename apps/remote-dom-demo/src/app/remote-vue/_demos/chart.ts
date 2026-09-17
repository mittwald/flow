import {
  Area,
  CartesianChart,
  ChartGrid,
  ChartTooltip,
  Heading,
  IconMonitoring,
  IllustratedMessage,
  XAxis,
  YAxis,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, h } from "vue";

const data = [
  { time: "0:00", Shields: 40, Hull: 24 },
  { time: "1:00", Shields: 30, Hull: 13 },
  { time: "2:00", Shields: 20, Hull: 78 },
  { time: "3:00", Shields: 27, Hull: 39 },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const chart = (chartData: Record<string, unknown>[]) =>
  h(
    CartesianChart,
    { data: chartData, height: "300px" },
    {
      /*
       * `emptyView` is a slot, not a property — rendered output does not
       * survive structured clone.
       */
      emptyView: () =>
        h(IllustratedMessage, null, () => [
          h(IconMonitoring),
          h(Heading, null, () => "No data available"),
        ]),
      default: () => [
        h(ChartGrid),
        h(Area, { dataKey: "Shields" }),
        h(Area, { dataKey: "Hull", color: "palatinate-blue" }),
        h(XAxis, { dataKey: "time" }),
        h(YAxis, { domain: [0, 100], unit: "%" }),
        /*
         * The formatters are remote *properties*, so the host calls them across
         * the boundary and always receives a Promise. They are typed
         * `Promise<T> | T` for that reason, and the host awaits — which is why
         * the async one below works at all.
         */
        h(ChartTooltip, {
          headingFormatter: (value: unknown) => `Sync Format: ${value}`,
          formatter: async (
            value: unknown,
            name: unknown,
            _index: unknown,
            unit?: string,
          ) => {
            await sleep(3000);
            return `Async Format: ${name}: ${value}${unit ? ` ${unit}` : ""}`;
          },
        }),
      ],
    },
  );

/** The Vue counterpart of `/remote/chart`. */
export const ChartDemo = defineComponent({
  name: "ChartDemo",
  setup: () => () => [chart(data), chart(data), chart([])],
});
