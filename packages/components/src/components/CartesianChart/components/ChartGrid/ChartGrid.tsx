import type { ComponentType, FC } from "react";
import * as Recharts from "recharts";
import { useDesignTokens } from "@/lib/theming";

export type ChartGridProps = Pick<
  Recharts.CartesianGridProps,
  "className" | "vertical" | "horizontal" | "strokeDasharray"
>;

/** @flr-generate all */
export const ChartGrid: FC<ChartGridProps> = (props) => {
  const { vertical = false, ...rest } = props;

  const designTokens = useDesignTokens();

  return (
    <Recharts.CartesianGrid
      vertical={vertical}
      {...rest}
      stroke={designTokens["cartesian-grid"].color.value}
      strokeWidth={designTokens["cartesian-grid"]["stroke-width"].value}
    />
  );
};

export const TypedChartGrid = () => ChartGrid as ComponentType<ChartGridProps>;

export default ChartGrid;
