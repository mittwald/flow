import * as Recharts from "recharts";
import React, {
  Children,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type ReactElement,
  type SVGProps,
} from "react";
import clsx from "clsx";
import styles from "./CartesianChart.module.scss";
import Wrap from "../Wrap";
import { CartesianGrid } from "../public";

export interface CartesianChartEmptyViewProps {
  data?: ComponentProps<typeof Recharts.ComposedChart>["data"];
}

export interface CartesianChartProps
  extends
    Pick<
      ComponentProps<typeof Recharts.ComposedChart>,
      "data" | "className" | "syncId" | "syncMethod"
    >,
    PropsWithChildren {
  height?: string;
  /** View that is provided when data is empty/undefined */
  emptyView?: React.ComponentType<CartesianChartEmptyViewProps>;
  /**
   * Allow the height controlling container to set flex-grow: 1. Can only be
   * used in combination with `height`
   */
  flexGrow?: boolean;
}

/** @flr-generate all */
export const CartesianChart: FC<CartesianChartProps> = (props) => {
  const {
    children,
    data,
    className,
    height,
    flexGrow,
    emptyView: EmptyView,
    ...rest
  } = props;
  const rootClassName = clsx(styles.cartesianChart, className);

  const otherChildren: ReactElement[] = [];
  const gridChildren: ReactElement[] = [];

  Children.forEach(children, (child) => {
    if (!child) return;
    const element = child as ReactElement;

    if (element.type === CartesianGrid) {
      gridChildren.push(element);
    } else {
      otherChildren.push(element);
    }
  });

  const showEmptyView = (!data || data.length === 0) && EmptyView;

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [viewDimensions, setViewDimensions] = useState<Partial<
    SVGProps<SVGForeignObjectElement>
  > | null>(null);

  // resizing the foreignObject for the EmptyView on size changes
  useEffect(() => {
    if (showEmptyView) {
      const updateDimensions = () => {
        const svg = chartContainerRef.current?.querySelector(
          "svg",
        ) as SVGSVGElement | null;
        if (!svg) return;

        const clip = svg.querySelector("clipPath rect");
        if (clip) {
          const x = parseFloat(clip.getAttribute("x") ?? "0");
          const y = parseFloat(clip.getAttribute("y") ?? "0");
          const width = parseFloat(clip.getAttribute("width") ?? "0");
          const height = parseFloat(clip.getAttribute("height") ?? "0");
          setViewDimensions({ x, y, width, height });
        }
      };

      updateDimensions();

      const container = chartContainerRef.current;
      const observer = new ResizeObserver(updateDimensions);
      if (container) observer.observe(container);

      return () => {
        observer.disconnect();
      };
    }
  }, [showEmptyView, chartContainerRef.current]);

  return (
    <Wrap if={height}>
      <div
        style={{ height, flex: flexGrow ? 1 : undefined }}
        ref={chartContainerRef}
      >
        <Recharts.ResponsiveContainer
          initialDimension={{
            // fix warning on initial render
            width: 1,
            height: 1,
          }}
        >
          <Recharts.ComposedChart
            data={data}
            className={rootClassName}
            {...rest}
          >
            {!showEmptyView && gridChildren}
            {otherChildren}
            {showEmptyView && viewDimensions && (
              <foreignObject {...viewDimensions}>
                <div className={styles.emptyViewContainer}>
                  <EmptyView data={data} />
                </div>
              </foreignObject>
            )}
          </Recharts.ComposedChart>
        </Recharts.ResponsiveContainer>
      </div>
    </Wrap>
  );
};

export default CartesianChart;
