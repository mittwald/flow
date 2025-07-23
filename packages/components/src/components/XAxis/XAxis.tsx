import type { FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";

export type XAxisProps = Pick<
  Recharts.XAxisProps,
  | "className"
  | "dataKey"
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
>;

/** @flr-generate all */
export const XAxis: FC<XAxisProps> = (props) => {
  return (
    <Recharts.XAxis
      {...props}
      fontSize={tokens.axis["font-size"].value}
      tick={{
        fill: tokens.axis["text-color"].value,
      }}
      tickMargin={parseInt(tokens.axis.spacing.value)}
      tickSize={parseInt(tokens.axis["tick-size"].value)}
    />
  );
};

export default XAxis;
