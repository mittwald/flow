import { type ComponentType, type FC } from "react";
import * as Recharts from "recharts";
import { AreaDot } from "../AreaDot";
import type { CategoricalWithCustomColor } from "@/lib/tokens/CategoricalColors";
import { isCategoricalColor } from "@/lib/tokens/isCategoricalColor";
import {
  type ChartDataValue,
  type DataKeyProp,
  type DataKeyWithLabel,
  isDataKeyWithLabel,
} from "@/components/CartesianChart/types";
import { useScopedStackId } from "@/components/CartesianChart/hooks/useScopedStackId";
import { useChartAnimation } from "@/components/CartesianChart/hooks/useChartAnimation";
import { useDesignTokens } from "@/lib/theming";

type AreaBaseProps = Pick<
  Recharts.AreaProps,
  | "className"
  | "stackId"
  | "fillOpacity"
  | "key"
  | "xAxisId"
  | "yAxisId"
  | "type"
  | "unit"
> & {
  /** The color of the area. @default "sea-green" */
  color?: CategoricalWithCustomColor;
};

export interface AreaPropsByDataKeyProp<
  TData extends ChartDataValue = ChartDataValue,
> extends AreaBaseProps {
  dataKey: DataKeyProp<TData>;
}

export interface AreaPropsByDataKey<
  TData extends ChartDataValue = ChartDataValue,
>
  extends AreaBaseProps, DataKeyWithLabel<TData> {}

export type AreaProps<TData extends ChartDataValue = ChartDataValue> =
  AreaPropsByDataKey<TData> | AreaPropsByDataKeyProp<TData>;

/** @flr-generate all */
export const Area: FC<AreaProps> = (props) => {
  const {
    color: colorFromProps = "sea-green",
    stackId: stackIdFromProps = 1,
    fillOpacity = 1,
    ...rest
  } = props;

  const tokens = useDesignTokens();
  const stackId = useScopedStackId(stackIdFromProps);
  const animation = useChartAnimation();

  const color = isCategoricalColor(colorFromProps)
    ? `var(--color--categorical--${colorFromProps})`
    : colorFromProps;

  return (
    <Recharts.Area
      name={isDataKeyWithLabel(props) ? props.dataKeyLabel : props.dataKey}
      stackId={stackId}
      fillOpacity={fillOpacity}
      {...rest}
      activeDot={<AreaDot color={color} />}
      fill={color}
      stroke={tokens.area["border-color"].value}
      strokeWidth={tokens.area["border-width"].value}
      {...animation}
    />
  );
};

export const TypedArea = <TData extends ChartDataValue = ChartDataValue>() =>
  Area as ComponentType<AreaPropsByDataKeyProp<TData>>;

export default Area;
