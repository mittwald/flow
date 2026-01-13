import { type FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";
import { AreaDot } from "../AreaDot";
import type { CategoricalWithCustomColor } from "@/lib/tokens/CategoricalColors";
import { isCategoricalColor } from "@/lib/tokens/isCategoricalColor";

export interface AreaProps
  extends Pick<
    Recharts.AreaProps,
    | "className"
    | "dataKey"
    | "stackId"
    | "fillOpacity"
    | "key"
    | "xAxisId"
    | "yAxisId"
    | "type"
    | "unit"
  > {
  /** The color of the area. @default "sea-green" */
  color?: CategoricalWithCustomColor;
}

/** @flr-generate all */
export const Area: FC<AreaProps> = (props) => {
  const {
    color: colorFromProps = "sea-green",
    stackId = 1,
    fillOpacity = 1,
    ...rest
  } = props;

  const color = isCategoricalColor(colorFromProps)
    ? `var(--color--categorical--${colorFromProps})`
    : colorFromProps;

  return (
    <Recharts.Area
      stackId={stackId}
      fillOpacity={fillOpacity}
      {...rest}
      activeDot={<AreaDot color={color} />}
      fill={color}
      stroke={tokens.area["border-color"].value}
      strokeWidth={tokens.area["border-width"].value}
    />
  );
};

export default Area;
