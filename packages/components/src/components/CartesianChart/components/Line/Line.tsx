import { type ComponentType, type FC } from "react";
import * as Recharts from "recharts";
import { AreaDot } from "../AreaDot";
import type { CategoricalWithCustomColor } from "@/lib/tokens/CategoricalColors";
import { isCategoricalColor } from "@/lib/tokens/isCategoricalColor";
import type {
  ChartDataValue,
  DataKey,
} from "@/components/CartesianChart/CartesianChart";
import { useDesignTokens } from "../../../../lib/theming";

export interface LineProps<TData = ChartDataValue> extends Pick<
  Recharts.LineProps,
  "className" | "key" | "xAxisId" | "yAxisId" | "type" | "unit"
> {
  dataKey?: DataKey<TData>;
  /** The color of the line. @default "sea-green" */
  color?: CategoricalWithCustomColor;
}

/** @flr-generate all */
export const Line: FC<LineProps> = (props) => {
  const { color: colorFromProps = "sea-green", ...rest } = props;

  const designTokens = useDesignTokens();

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
      strokeWidth={designTokens.line["border-width"].value}
    />
  );
};

export const TypedLine = <T = ChartDataValue,>() =>
  Line as ComponentType<LineProps<T>>;

export default Line;
