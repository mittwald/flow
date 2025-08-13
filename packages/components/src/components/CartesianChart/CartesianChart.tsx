import * as Recharts from "recharts";
import type { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";
import React, {
  Children,
  cloneElement,
  useEffect,
  useRef,
  useState,
  type FC,
  type PropsWithChildren,
  type ReactElement,
  type SVGProps,
} from "react";
import { Area, type AreaProps } from "./components/Area";
import clsx from "clsx";
import styles from "./CartesianChart.module.scss";
import Wrap from "../Wrap";
import { CartesianGrid } from "@/components/CartesianChart/components/CartesianGrid";

export interface CartesianChartEmptyViewProps {
  data?: CategoricalChartProps["data"];
}

export interface CartesianChartProps
  extends Pick<CategoricalChartProps, "data">,
    PropsWithChildren {
  className?: string;
  syncId?: string;
  syncMethod?: "index" | "value";
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

  // render order: grid, areas without dots, other children, areas with dots
  // this is needed to ensure that the dots will always overlay the areas
  const areasWithoutDots: ReactElement[] = [];
  const areasWithDots: ReactElement[] = [];
  const otherChildren: ReactElement[] = [];
  const gridChildren: ReactElement[] = [];

  Children.forEach(children, (child, index) => {
    if (!child) return;
    const element = child as ReactElement;

    if (element.type === CartesianGrid) {
      gridChildren.push(element);
    } else if (element.type === Area) {
      areasWithoutDots.push(
        cloneElement(element as ReactElement<AreaProps>, {
          onlyDots: false,
          key: `area-${index}`,
        }),
      );
      areasWithDots.push(
        cloneElement(element as ReactElement<AreaProps>, {
          onlyDots: true,
          key: `area-dots-${index}`,
        }),
      );
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
  }, []);

  return (
    <Wrap if={height}>
      <div
        style={{ height, flex: flexGrow ? 1 : undefined }}
        ref={chartContainerRef}
      >
        <Recharts.ResponsiveContainer>
          <Recharts.AreaChart data={data} className={rootClassName} {...rest}>
            {!showEmptyView && gridChildren}
            {areasWithoutDots}
            {otherChildren}
            {areasWithDots}
            {showEmptyView && viewDimensions && (
              <foreignObject {...viewDimensions}>
                <div className={styles.emptyViewContainer}>
                  <EmptyView data={data} />
                </div>
              </foreignObject>
            )}
          </Recharts.AreaChart>
        </Recharts.ResponsiveContainer>
      </div>
    </Wrap>
  );
};

export default CartesianChart;
