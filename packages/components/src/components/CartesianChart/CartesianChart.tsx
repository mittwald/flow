import { ComposedChart, ResponsiveContainer } from "recharts";
import React, {
  type ComponentProps,
  type ComponentType,
  type FC,
  isValidElement,
  type PropsWithChildren,
  type ReactNode,
  useMemo,
} from "react";
import clsx from "clsx";
import styles from "./CartesianChart.module.scss";
import { useChartClipRect } from "@/components/CartesianChart/hooks/useChartClipRect";
import DivView from "@/views/DivView";
import Wrap from "@/components/Wrap";

import { TypedArea } from "@/components/CartesianChart/components/Area";
import { TypedChartGrid } from "@/components/CartesianChart/components/ChartGrid";
import { TypedYAxis } from "@/components/CartesianChart/components/YAxis";
import { TypedChartLegend } from "@/components/CartesianChart/components/ChartLegend";
import { TypedChartTooltip } from "@/components/CartesianChart/components/ChartTooltip";
import { TypedXAxis } from "@/components/CartesianChart/components/XAxis";
import { TypedLine } from "@/components/CartesianChart/components/Line";

/** @deprecated Use a ReactNode instead */
export interface CartesianChartEmptyViewProps {
  data?: ComponentProps<typeof ComposedChart>["data"];
}

export type ChartDataValue = Record<string, unknown>;
export type DataKey<TData> = keyof TData | (() => keyof TData) | number;
export type DataKeyValue<
  TData,
  TDataKey extends DataKey<TData>,
> = TDataKey extends keyof TData
  ? TData[TDataKey]
  : TDataKey extends () => infer K
    ? K extends keyof TData
      ? TData[K]
      : TData[keyof TData]
    : TData[keyof TData];

export interface CartesianChartProps<TData = ChartDataValue>
  extends
    Pick<
      ComponentProps<typeof ComposedChart>,
      "className" | "syncId" | "syncMethod"
    >,
    PropsWithChildren {
  data?: TData[];

  height?: string;

  /** View that is provided when data is empty/undefined */
  emptyView?: ReactNode;

  /**
   * Allow the height controlling container to set flex-grow: 1. Can only be
   * used in combination with `height`
   */
  flexGrow?: boolean;
}

/** @flr-generate all */
export const CartesianChart: FC<CartesianChartProps> = (props) => {
  const { children, data, className, height, flexGrow, emptyView, ...rest } =
    props;

  const { viewDimensions, ref: containerRef } = useChartClipRect();

  const showEmptyView = !!((!data || data.length === 0) && emptyView);
  const rootClassName = clsx(
    styles.cartesianChart,
    className,
    showEmptyView && styles.emptyView,
  );

  const emptyElement = useMemo(() => {
    if (isValidElement(emptyView)) {
      return emptyView;
    }

    if (!emptyView) {
      return;
    }

    console.warn(
      "CartesianChart: emptyView as a non-element is deprecated and will be removed in a future release. Please provide an element as emptyView.",
    );
    return null;
  }, [emptyView]);

  return (
    <Wrap if={height}>
      <div style={{ height, flex: flexGrow ? 1 : undefined }}>
        <ResponsiveContainer
          initialDimension={{
            // fix warning on initial render
            width: 1,
            height: 1,
          }}
          width={height ? undefined : "100%"}
          aspect={height ? undefined : 3}
          ref={containerRef}
        >
          <ComposedChart data={data} className={rootClassName} {...rest}>
            {children}
            {showEmptyView && viewDimensions && (
              <foreignObject {...viewDimensions}>
                <DivView className={styles.emptyViewContainer}>
                  {emptyElement}
                </DivView>
              </foreignObject>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Wrap>
  );
};

export const typedCartesianChart = <TData = ChartDataValue,>() => ({
  Chart: CartesianChart as ComponentType<CartesianChartProps<TData>>,
  Area: TypedArea<TData>(),
  XAxis: TypedXAxis<TData>(),
  YAxis: TypedYAxis<TData>(),
  Grid: TypedChartGrid(),
  Legend: TypedChartLegend(),
  Tooltip: TypedChartTooltip<TData>(),
  Line: TypedLine<TData>(),
});

export default CartesianChart;
