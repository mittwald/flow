import { type FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";
import type { CategoricalColors } from "../../AreaChart";

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
  color?: CategoricalColors;
  /** @internal */
  onlyDots?: boolean;
}

const CustomDot: FC<Recharts.DotProps & { color: string }> = ({
  cx,
  cy,
  color,
}) => {
  if (cx === undefined || cy === undefined) return null;

  return (
    <svg
      x={cx - 7}
      y={cy - 7}
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="7" cy="7" r="7" fill="white" />
      <circle cx="7" cy="7" r="4" stroke={color} strokeWidth="2" fill="white" />
    </svg>
  );
};

const getCategoricalColor = (color: CategoricalColors) => {
  return tokens.color.categorical[color].value;
};

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
        onlyDots ? <CustomDot color={getCategoricalColor(color)} /> : false
      }
      fill={onlyDots ? "none" : getCategoricalColor(color)}
      stroke={onlyDots ? "none" : tokens.area["border-color"].value}
      strokeWidth={onlyDots ? undefined : tokens.area["border-width"].value}
    />
  );
};

export default Area;
