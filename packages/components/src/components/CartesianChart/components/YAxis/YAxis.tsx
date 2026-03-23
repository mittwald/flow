import type { FC } from "react";
import * as Recharts from "recharts";
import { useDesignTokens } from "../../../../lib/theming";

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
  | "tickFormatter"
>;

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

export default YAxis;
