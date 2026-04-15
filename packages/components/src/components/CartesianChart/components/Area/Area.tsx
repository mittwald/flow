import { type ComponentType, type FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";
import { AreaDot } from "../AreaDot";
import type { CategoricalWithCustomColor } from "@/lib/tokens/CategoricalColors";
import { isCategoricalColor } from "@/lib/tokens/isCategoricalColor";
import type {
  ChartDataValue,
  DataKey,
} from "@/components/CartesianChart/CartesianChart";

export interface AreaProps<TData = ChartDataValue> extends Pick<
  Recharts.AreaProps,
  | "className"
  | "stackId"
  | "fillOpacity"
  | "key"
  | "xAxisId"
  | "yAxisId"
  | "type"
  | "unit"
> {
  dataKey: DataKey<TData>;
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

export const TypedArea = <T = ChartDataValue,>() =>
  Area as ComponentType<AreaProps<T>>;

export default Area;
