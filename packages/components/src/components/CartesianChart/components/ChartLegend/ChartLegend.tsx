import type { FC } from "react";
import * as Recharts from "recharts";
import LegendContent from "./LegendContent";

export type ChartLegendFormatter = (text: string) => string;

export interface WithChartLegendFormatters {
  /**
   * A formatter function for the texts of the Legend. Can be used for purposes
   * like translations.
   */
  formatter?: ChartLegendFormatter;
}

export type ChartLegendProps = Pick<
  Recharts.LegendProps,
  "className" | "verticalAlign"
> &
  WithChartLegendFormatters;

/** @flr-generate all */
export const ChartLegend: FC<ChartLegendProps> = (props) => {
  const { formatter, ...rest } = props;

  return (
    <Recharts.Legend
      {...rest}
      content={<LegendContent formatter={formatter} />}
    />
  );
};

export default ChartLegend;
