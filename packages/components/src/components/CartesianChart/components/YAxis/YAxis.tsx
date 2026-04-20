import type { FC } from "react";
import * as Recharts from "recharts";
import type {
  ChartDataValue,
  DataKey,
  DataKeyValue,
} from "@/components/CartesianChart/CartesianChart";
import { useDesignTokens } from "../../../../lib/theming";

export type YAxisProps<
  TData = ChartDataValue,
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
};

/** @flr-generate all */
export const YAxis: FC<YAxisProps> = (props) => {
  const { domain, ...rest } = props;

  const designTokens = useDesignTokens();

  return (
    <Recharts.YAxis
      {...rest}
      allowDataOverflow
      domain={domain}
      fontSize={designTokens.axis["font-size"].value}
      tick={{
        fill: designTokens.text.color.default.value,
      }}
      tickMargin={parseInt(designTokens.axis.spacing.value)}
      tickSize={parseInt(designTokens.axis["tick-size"].value)}
    />
  );
};

export { TypedYAxis } from "./types";

export default YAxis;
