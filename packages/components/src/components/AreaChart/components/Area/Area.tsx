import { type FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";
import type { CategoricalColors } from "../../AreaChart";

export interface AreaProps
  extends Omit<
    Recharts.AreaProps,
    | "className"
    | "style"
    | "children"
    | "fill"
    | "stroke"
    | "strokeWidth"
    | "strokeOpacity"
    | "activeDot"
    | "dot"
  > {
  color?: CategoricalColors;
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
  const { color = "sea-green", ...rest } = props;

  return (
    <Recharts.Area
      stackId={1}
      activeDot={<CustomDot color={getCategoricalColor(color)} />}
      fillOpacity={1}
      {...rest}
      fill={getCategoricalColor(color)}
      stroke={tokens.area["border-color"].value}
      strokeWidth={tokens.area["border-width"].value}
    />
  );
};

export default Area;
