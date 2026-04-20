import type { ComponentType, FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";

export type ChartGridProps = Pick<
  Recharts.CartesianGridProps,
  "className" | "vertical" | "horizontal" | "strokeDasharray"
>;

/** @flr-generate all */
export const ChartGrid: FC<ChartGridProps> = (props) => {
  const { vertical = false, ...rest } = props;

  return (
    <Recharts.CartesianGrid
      vertical={vertical}
      {...rest}
      stroke={tokens["cartesian-grid"].color.value}
      strokeWidth={tokens["cartesian-grid"]["stroke-width"].value}
    />
  );
};

export const TypedChartGrid = () => ChartGrid as ComponentType<ChartGridProps>;

export default ChartGrid;
