import type { FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";

export type YAxisProps = Pick<
  Recharts.YAxisProps,
  | "className"
  | "dataKey"
  | "orientation"
  | "allowDecimals"
  | "allowDataOverflow"
  | "interval"
  | "minTickGap"
  | "scale"
>;

export const YAxis: FC<YAxisProps> = (props) => {
  return (
    <Recharts.YAxis
      {...props}
      fontFamily="Inter"
      fontSize={tokens.axis["font-size"].value}
      tick={{
        fill: tokens.axis["text-color"].value,
      }}
      tickMargin={parseInt(tokens.axis.spacing.value)}
      tickSize={parseInt(tokens.axis["tick-size"].value)}
    />
  );
};

export default YAxis;
