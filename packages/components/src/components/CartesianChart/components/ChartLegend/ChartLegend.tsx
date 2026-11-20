import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { ComponentType } from "react";
import * as Recharts from "recharts";
import LegendContent from "./LegendContent";

export type ChartLegendFormatter = (text: string, index: number) => string;

export interface WithChartLegendFormatters {
  /**
   * A formatter function for the texts of the Legend. Can be used for purposes
   * like translations.
   */
  formatter?: ChartLegendFormatter;
}

export type ChartLegendProps = FlowComponentProps &
  Pick<Recharts.LegendProps, "className" | "verticalAlign"> &
  WithChartLegendFormatters & { children?: never };

/** @flr-generate all */
export const ChartLegend = flowComponent(
  "ChartLegend",
  (props) => {
    const { ref: ignoredRef, formatter, ...rest } = props;

    return (
      <Recharts.Legend
        {...rest}
        content={<LegendContent formatter={formatter} />}
      />
    );
  },
  /* ChartLegend renders a `Legend`: outer props contexts (e.g. the content color of `AccentBox`) keep reaching its texts. */
  { type: "layout" },
);

export const TypedChartLegend = () =>
  ChartLegend as ComponentType<ChartLegendProps>;

export default ChartLegend;
