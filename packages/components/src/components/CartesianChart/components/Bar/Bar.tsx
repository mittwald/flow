import { type ComponentType, type FC } from "react";
import * as Recharts from "recharts";
import type { CategoricalWithCustomColor } from "@/lib/tokens/CategoricalColors";
import { isCategoricalColor } from "@/lib/tokens/isCategoricalColor";
import {
  type ChartDataValue,
  type DataKeyProp,
  type DataKeyWithLabel,
  isDataKeyWithLabel,
} from "@/components/CartesianChart/types";
import { useCartesianChartContext } from "@/components/CartesianChart/context";
import { useDesignTokens } from "@/lib/theming";

type BarBaseProps = Pick<
  Recharts.BarProps,
  | "className"
  | "stackId"
  | "key"
  | "xAxisId"
  | "yAxisId"
  | "unit"
  | "barSize"
  | "maxBarSize"
  | "minPointSize"
> & {
  /** The color of the bar. @default "sea-green" */
  color?: CategoricalWithCustomColor;
};

export interface BarPropsByDataKeyProp<
  TData extends ChartDataValue = ChartDataValue,
> extends BarBaseProps {
  dataKey: DataKeyProp<TData>;
}

export interface BarPropsByDataKey<
  TData extends ChartDataValue = ChartDataValue,
>
  extends BarBaseProps, DataKeyWithLabel<TData> {}

export type BarProps<TData extends ChartDataValue = ChartDataValue> =
  | BarPropsByDataKey<TData>
  | BarPropsByDataKeyProp<TData>;

/** @flr-generate all */
export const Bar: FC<BarProps> = (props) => {
  const { color: colorFromProps = "sea-green", ...rest } = props;

  const tokens = useDesignTokens();
  const { layout } = useCartesianChartContext();

  const color = isCategoricalColor(colorFromProps)
    ? `var(--color--categorical--${colorFromProps})`
    : colorFromProps;

  const cornerRadius = parseInt(tokens.bar["corner-radius"].value);
  const radius: Recharts.BarProps["radius"] =
    props.stackId !== undefined
      ? 0
      : layout === "vertical"
        ? [0, cornerRadius, cornerRadius, 0]
        : [cornerRadius, cornerRadius, 0, 0];

  return (
    <Recharts.Bar
      name={isDataKeyWithLabel(props) ? props.dataKeyLabel : props.dataKey}
      {...rest}
      fill={color}
      radius={radius}
    />
  );
};

export const TypedBar = <TData extends ChartDataValue = ChartDataValue>() =>
  Bar as ComponentType<BarPropsByDataKeyProp<TData>>;

export default Bar;
