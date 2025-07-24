import type { FC } from "react";
import * as Recharts from "recharts";
import tokens from "../../../../../../design-tokens/dist/variables.json";

export type YAxisProps = Pick<
  Recharts.YAxisProps,
  | "className"
  | "dataKey"
  | "orientation"
  | "allowDecimals"
  | "interval"
  | "minTickGap"
  | "scale"
  | "type"
  | "domain"
  | "hide"
  | "unit"
>;

/** @flr-generate all */
export const YAxis: FC<YAxisProps> = (props) => {
  const { domain = [0, (dataMax) => dataMax / 2], ...rest } = props;

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

export default YAxis;
