import { ComposedChart, ResponsiveContainer } from "recharts";
import {
  type ComponentProps,
  type ComponentType,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useId,
  useMemo,
} from "react";
import clsx from "clsx";
import styles from "./CartesianChart.module.scss";
import { useChartClipRect } from "@/components/CartesianChart/hooks/useChartClipRect";
import DivView from "@/views/DivView";
import Wrap from "@/components/Wrap";
import type {
  CartesianChartLayout,
  ChartDataValue,
  DataKeyProp,
} from "@/components/CartesianChart/types";
import { CartesianChartContextProvider } from "@/components/CartesianChart/context";
import { TypedArea } from "@/components/CartesianChart/components/Area";
import { TypedBar } from "@/components/CartesianChart/components/Bar";
import { TypedXAxis } from "@/components/CartesianChart/components/XAxis";
import { TypedYAxis } from "@/components/CartesianChart/components/YAxis";
import { TypedChartGrid } from "@/components/CartesianChart/components/ChartGrid";
import { TypedChartLegend } from "@/components/CartesianChart/components/ChartLegend";
import { TypedChartTooltip } from "@/components/CartesianChart/components/ChartTooltip";
import { TypedLine } from "@/components/CartesianChart/components/Line";
import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";

/** @deprecated Use a ReactNode instead */
export interface CartesianChartEmptyViewProps {
  data?: ComponentProps<typeof ComposedChart>["data"];
}

export interface CartesianChartProps<TData = ChartDataValue>
  extends
    Pick<
      ComponentProps<typeof ComposedChart>,
      "className" | "syncId" | "syncMethod"
    >,
    PropsWithChildren {
  /** The data points rendered by the chart. */
  data?: TData[];

  /** The height of the chart. */
  height?: string;

  /**
   * The orientation of the axes and graphical items. `"horizontal"` puts the
   * category axis on the x-axis — bars grow upwards. `"vertical"` puts it on
   * the y-axis — bars grow to the side. `XAxis` and `YAxis` follow the layout
   * on their own; only the `dataKey` moves to whichever axis is the categorical
   * one.
   *
   * @default "horizontal"
   */
  layout?: CartesianChartLayout;

  /** View that is provided when data is empty/undefined */
  emptyView?: ReactNode;

  /**
   * Allow the height controlling container to set flex-grow: 1. Can only be
   * used in combination with `height`
   */
  flexGrow?: boolean;
}

const reactComponentTypes = [
  Symbol.for("react.memo"),
  Symbol.for("react.forward_ref"),
];

const isEmptyViewComponent = (
  value: unknown,
): value is ComponentType<CartesianChartEmptyViewProps> =>
  typeof value === "function" ||
  (typeof value === "object" &&
    value !== null &&
    "$$typeof" in value &&
    reactComponentTypes.includes(value.$$typeof as symbol));

/** @flr-generate all */
export const CartesianChart: FC<CartesianChartProps> = (props) => {
  const {
    children,
    data,
    className,
    height,
    flexGrow,
    emptyView,
    layout = "horizontal",
    ...rest
  } = props;
  const warnDeprecation = useWarnDeprecation();

  const { viewDimensions, ref: containerRef } = useChartClipRect();

  const showEmptyView = !!((!data || data.length === 0) && emptyView);
  const rootClassName = clsx(
    styles.cartesianChart,
    showEmptyView && styles.emptyView,
    className,
  );
  const EmptyViewComponent = isEmptyViewComponent(emptyView)
    ? emptyView
    : undefined;

  if (EmptyViewComponent) {
    warnDeprecation(
      "Passing a component to the 'emptyView' prop is deprecated and will be removed in a future release. Use 'emptyView={<Element />}' instead.",
    );
  }

  const chartId = useId().replaceAll(/[^\w-]/g, "");
  const contextValue = useMemo(
    () => ({ layout, stackIdPrefix: `${chartId}-` }),
    [layout, chartId],
  );

  return (
    <CartesianChartContextProvider value={contextValue}>
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
            <ComposedChart
              data={data}
              className={rootClassName}
              layout={layout}
              {...rest}
            >
              {children}
              {showEmptyView && viewDimensions && (
                <foreignObject {...viewDimensions}>
                  <DivView className={styles.emptyViewContainer}>
                    {EmptyViewComponent ? (
                      <EmptyViewComponent data={data} />
                    ) : (
                      emptyView
                    )}
                  </DivView>
                </foreignObject>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Wrap>
    </CartesianChartContextProvider>
  );
};

export const typedCartesianChart = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData extends ChartDataValue<any> = ChartDataValue<any>,
  XAxisDataKey extends DataKeyProp<TData> = DataKeyProp<TData>,
>() => ({
  Chart: CartesianChart as ComponentType<CartesianChartProps<TData>>,
  Area: TypedArea<TData>(),
  Bar: TypedBar<TData>(),
  XAxis: TypedXAxis<TData, XAxisDataKey>(),
  YAxis: TypedYAxis<TData>(),
  Grid: TypedChartGrid(),
  Legend: TypedChartLegend(),
  Tooltip: TypedChartTooltip<TData, XAxisDataKey>(),
  Line: TypedLine<TData>(),
});

export default CartesianChart;
