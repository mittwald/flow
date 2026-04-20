import type { FC } from "react";
import * as Recharts from "recharts";
import type {
  ChartDataValue,
  DataKey,
  DataKeyValue,
} from "@/components/CartesianChart/CartesianChart";
import { useDesignTokens } from "../../../../lib/theming";

export type XAxisProps<
  TData = ChartDataValue,
  TDataKey extends DataKey<TData> = DataKey<TData>,
  TDataMatch = DataKeyValue<TData, TDataKey>,
> = Pick<
  Recharts.XAxisProps,
  | "className"
  | "orientation"
  | "allowDecimals"
  | "allowDataOverflow"
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
export const XAxis: FC<XAxisProps> = (props) => {
  const designTokens = useDesignTokens();

  return (
    <Recharts.XAxis
      {...props}
      fontSize={designTokens.axis["font-size"].value}
      tick={{
        fill: designTokens.text.color.default.value,
      }}
      tickMargin={parseInt(designTokens.axis.spacing.value)}
      tickSize={parseInt(designTokens.axis["tick-size"].value)}
    />
  );
};

export { TypedXAxis } from "./types";

export default XAxis;
