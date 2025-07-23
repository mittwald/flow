import { type FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";
import { AreaDot } from "../AreaDot";
import type { CategoricalColors } from "@/lib/tokens/CategoricalColors";
import { getCategoricalColorValue } from "@/lib/tokens/getCategoricalColorValue";

export interface LineProps
  extends Pick<
    Recharts.LineProps,
    "className" | "dataKey" | "key" | "xAxisId" | "yAxisId" | "type" | "unit"
  > {
  /** The color of the line. @default "sea-green" */
  color?: CategoricalColors;
}

/** @flr-generate all */
export const Line: FC<LineProps> = (props) => {
  const { color = "sea-green", ...rest } = props;

  return (
    <Recharts.Line
      {...rest}
      fill={getCategoricalColorValue(color)}
      activeDot={<AreaDot color={getCategoricalColorValue(color)} />}
      dot={false}
      stroke={getCategoricalColorValue(color)}
      strokeWidth={tokens.line["border-width"].value}
    />
  );
};

export default Line;
