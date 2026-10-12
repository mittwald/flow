import type { FC } from "react";
import * as Recharts from "recharts";
import type {
  ChartDataValue,
  DataKey,
  DataKeyValue,
} from "@/components/CartesianChart/types";
import { useCartesianChartContext } from "@/components/CartesianChart/context";
import { useDesignTokens } from "@/lib/theming";

export type YAxisProps<
  TData extends ChartDataValue = ChartDataValue,
  TDataKey extends DataKey<TData> = DataKey<TData>,
  TDataMatch = DataKeyValue<TData, TDataKey>,
> = Pick<
  Recharts.YAxisProps,
  | "className"
  | "orientation"
  | "allowDecimals"
  | "interval"
  | "minTickGap"
  | "scale"
  | "type"
  | "domain"
  | "hide"
  | "unit"
> & {
  dataKey?: TDataKey;
  tickFormatter?: (value: TDataMatch, index: number) => string;
  /**
   * The width of the axis in pixels. `"auto"` sizes the axis to its widest tick
   * label. Defaults to `"auto"` for a category axis (e.g. with `layout` set to
   * `"vertical"`) and to `60` otherwise. Pin a number to align the plot areas
   * of synchronized charts.
   */
  width?: number | "auto";
};

/**
 * `tickFormatter` is deliberately not part of the remote surface. A function
 * property crosses the boundary as a thread proxy whose call returns a Promise,
 * and recharts concatenates the formatter's result straight into the tick label
 * — so remotely every tick rendered `[object Promise]`. Dropping it from the
 * remote surface leaves the raw value there; the prop keeps working locally.
 *
 * @flr-generate all
 * @flr-ignore-props tickFormatter
 */
export const YAxis: FC<YAxisProps> = (props) => {
  const { domain, type = "auto", width, ...rest } = props;

  const tokens = useDesignTokens();
  const { layout } = useCartesianChartContext();

  const isCategoryAxis =
    type === "category" || (type === "auto" && layout === "vertical");

  return (
    <Recharts.YAxis
      {...rest}
      allowDataOverflow
      domain={domain}
      type={type}
      width={width ?? (isCategoryAxis ? "auto" : undefined)}
      fontSize={tokens.axis["font-size"].value}
      tick={{
        fill: tokens.axis["color"].value,
      }}
      tickMargin={parseInt(tokens.axis.spacing.value)}
      tickSize={parseInt(tokens.axis["tick-size"].value)}
    />
  );
};

export { TypedYAxis } from "./types";

export default YAxis;
