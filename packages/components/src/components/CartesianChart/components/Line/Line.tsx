import { type FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";
import { AreaDot } from "../AreaDot";
import type { CategoricalColor } from "@/lib/tokens/CategoricalColors";

export interface LineProps
  extends Pick<
    Recharts.LineProps,
    "className" | "dataKey" | "key" | "xAxisId" | "yAxisId" | "type" | "unit"
  > {
  /** The color of the line. @default "sea-green" */
  color?: CategoricalColor;
}

/** @flr-generate all */
export const Line: FC<LineProps> = (props) => {
  const { color = "sea-green", ...rest } = props;

  return (
    <Recharts.Line
      {...rest}
      fill={`var(--color--categorical--${color})`}
      activeDot={<AreaDot color={`var(--color--categorical--${color})`} />}
      dot={false}
      stroke={`var(--color--categorical--${color})`}
      strokeWidth={tokens.line["border-width"].value}
    />
  );
};

export default Line;
