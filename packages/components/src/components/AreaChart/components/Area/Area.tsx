import { type FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";
import type { CategoricalColors } from "../../AreaChart";
import { AreaDot } from "../AreaDot";

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
  color?: CategoricalColors;
  /** @internal */
  onlyDots?: boolean;
}

const getCategoricalColor = (color: CategoricalColors) => {
  return tokens.color.categorical[color].value;
};

/** @flr-generate all */
export const Area: FC<AreaProps> = (props) => {
  const {
    color = "sea-green",
    stackId = "1",
    fillOpacity = 1,
    onlyDots = true,
    ...rest
  } = props;

  return (
    <Recharts.Area
      stackId={stackId}
      fillOpacity={fillOpacity}
      {...rest}
      activeDot={
        onlyDots ? <AreaDot color={getCategoricalColor(color)} /> : false
      }
      fill={onlyDots ? "none" : getCategoricalColor(color)}
      stroke={onlyDots ? "none" : tokens.area["border-color"].value}
      strokeWidth={onlyDots ? undefined : tokens.area["border-width"].value}
    />
  );
};

export default Area;
