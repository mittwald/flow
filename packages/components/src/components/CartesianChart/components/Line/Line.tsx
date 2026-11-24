import { type ComponentType, type FC } from "react";
import * as Recharts from "recharts";
import { AreaDot } from "../AreaDot";
import type { CategoricalWithCustomColor } from "@/lib/tokens/CategoricalColors";
import { useCategoricalColorValue } from "@/lib/tokens/useCategoricalColorValue";
import type {
  ChartDataValue,
  DataKey,
} from "@/components/CartesianChart/types";
import { useChartAnimation } from "@/components/CartesianChart/hooks/useChartAnimation";
import { useDesignTokens } from "@/lib/theming";

export interface LineProps<
  TData extends ChartDataValue = ChartDataValue,
> extends Pick<
  Recharts.LineProps,
  "className" | "key" | "xAxisId" | "yAxisId" | "type" | "unit"
> {
  dataKey?: DataKey<TData>;
  /**
   * The color of the line. @default "indigo"
   *
   * @deprecatedValues sea-green, palatinate-blue, tangerine, magenta, tropical-indigo,
   *   malachite, azure, yellow, alloy-orange, lime
   */
  color?: CategoricalWithCustomColor;
}

/** @flr-generate all */
export const Line: FC<LineProps> = (props) => {
  const { color: colorFromProps = "indigo", ...rest } = props;

  const tokens = useDesignTokens();
  const animation = useChartAnimation();

  const categoricalColorValue = useCategoricalColorValue();
  const color = categoricalColorValue(colorFromProps);

  return (
    <Recharts.Line
      {...rest}
      fill={color}
      activeDot={<AreaDot color={color} />}
      dot={false}
      stroke={color}
      strokeWidth={tokens.line["border-width"].value}
      {...animation}
    />
  );
};

export const TypedLine = <T extends ChartDataValue = ChartDataValue>() =>
  Line as ComponentType<LineProps<T>>;

export default Line;
