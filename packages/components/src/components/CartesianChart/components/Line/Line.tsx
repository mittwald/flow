import { type FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";
import { AreaDot } from "../AreaDot";
import type { CategoricalWithCustomColor } from "@/lib/tokens/CategoricalColors";
import { isCategoricalColor } from "@/lib/tokens/isCategoricalColor";

export interface LineProps extends Pick<
  Recharts.LineProps,
  "className" | "dataKey" | "key" | "xAxisId" | "yAxisId" | "type" | "unit"
> {
  /** The color of the line. @default "sea-green" */
  color?: CategoricalWithCustomColor;
}

/** @flr-generate all */
export const Line: FC<LineProps> = (props) => {
  const { color: colorFromProps = "sea-green", ...rest } = props;

  const color = isCategoricalColor(colorFromProps)
    ? `var(--color--categorical--${colorFromProps})`
    : colorFromProps;

  return (
    <Recharts.Line
      {...rest}
      fill={color}
      activeDot={<AreaDot color={color} />}
      dot={false}
      stroke={color}
      strokeWidth={tokens.line["border-width"].value}
    />
  );
};

export default Line;
