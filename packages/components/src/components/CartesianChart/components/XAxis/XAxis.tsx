import type { FC } from "react";
import * as Recharts from "recharts";
import { useDesignTokens } from "../../../../lib/theming";

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
  | "tickFormatter"
>;

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

export default XAxis;
