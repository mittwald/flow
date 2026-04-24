import type { FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";
import type {
  ChartDataValue,
  DataKey,
  DataKeyValue,
} from "@/components/CartesianChart/types";

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
};

/** @flr-generate all */
export const YAxis: FC<YAxisProps> = (props) => {
  const { domain, ...rest } = props;

  return (
    <Recharts.YAxis
      {...rest}
      allowDataOverflow
      domain={domain}
      fontSize={tokens.axis["font-size"].value}
      tick={{
        fill: tokens.axis["text-color"].value,
      }}
      tickMargin={parseInt(tokens.axis.spacing.value)}
      tickSize={parseInt(tokens.axis["tick-size"].value)}
    />
  );
};

export { TypedYAxis } from "./types";

export default YAxis;
