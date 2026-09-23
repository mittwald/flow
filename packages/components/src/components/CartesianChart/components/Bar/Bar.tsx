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
import { useScopedStackId } from "@/components/CartesianChart/hooks/useScopedStackId";
import { useDesignTokens } from "@/lib/theming";
import { useChartAnimation } from "@/components/CartesianChart/hooks/useChartAnimation";

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
  BarPropsByDataKey<TData> | BarPropsByDataKeyProp<TData>;

/** @flr-generate all */
export const Bar: FC<BarProps> = (props) => {
  const { color: colorFromProps = "sea-green", ...rest } = props;

  const tokens = useDesignTokens();
  const animation = useChartAnimation();
  const { layout } = useCartesianChartContext();
  const stackId = useScopedStackId(props.stackId);

  const color = isCategoricalColor(colorFromProps)
    ? `var(--color--categorical--${colorFromProps})`
    : colorFromProps;

  const cornerRadius = parseInt(tokens.bar["corner-radius"].value);
  const radius: Recharts.BarProps["radius"] =
    layout === "vertical"
      ? [0, cornerRadius, cornerRadius, 0]
      : [cornerRadius, cornerRadius, 0, 0];

  const bar = (
    <Recharts.Bar
      name={isDataKeyWithLabel(props) ? props.dataKeyLabel : props.dataKey}
      {...rest}
      stackId={stackId}
      fill={color}
      radius={stackId === undefined ? radius : 0}
      {...animation}
    />
  );

  if (stackId === undefined) {
    return bar;
  }

  // Every Bar of a stack renders its own BarStack, because a Bar cannot know
  // its siblings — they all describe the same clip path, so the duplicates are
  // redundant rather than conflicting.
  return (
    <Recharts.BarStack stackId={stackId} radius={radius}>
      {bar}
    </Recharts.BarStack>
  );
};

export const TypedBar = <TData extends ChartDataValue = ChartDataValue>() =>
  Bar as ComponentType<BarPropsByDataKeyProp<TData>>;

export default Bar;
