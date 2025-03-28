import * as Recharts from "recharts";
import type { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";
import {
  Children,
  cloneElement,
  type FC,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import { Area, type AreaProps } from "./components/Area";
import CartesianGrid from "../CartesianGrid";
import clsx from "clsx";
import styles from "./AreaChart.module.scss";
import Wrap from "../Wrap";

export interface AreaChartProps
  extends Pick<
      CategoricalChartProps,
      "data" | "className" | "syncId" | "syncMethod"
    >,
    PropsWithChildren {
  height?: string;
}

/** @flr-generate all */
export const AreaChart: FC<AreaChartProps> = (props) => {
  const { children, data, className, height, ...rest } = props;

  const rootClassName = clsx(styles.areaChart, className);

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

  return (
    <Wrap if={height}>
      <div style={{ height }}>
        <Recharts.ResponsiveContainer>
          <Recharts.AreaChart data={data} className={rootClassName} {...rest}>
            {gridChildren}
            {areasWithoutDots}
            {otherChildren}
            {areasWithDots}
          </Recharts.AreaChart>
        </Recharts.ResponsiveContainer>
      </div>
    </Wrap>
  );
};

export default AreaChart;
