import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { ComponentType } from "react";
import * as Recharts from "recharts";
import { useDesignTokens } from "@/lib/theming";

export type ChartGridProps = FlowComponentProps &
  Pick<
    Recharts.CartesianGridProps,
    "className" | "vertical" | "horizontal" | "strokeDasharray"
  > & { children?: never };

/** @flr-generate all */
export const ChartGrid = flowComponent("ChartGrid", (props) => {
  const { ref: ignoredRef, vertical = false, ...rest } = props;

  const designTokens = useDesignTokens();

  return (
    <Recharts.CartesianGrid
      vertical={vertical}
      {...rest}
      stroke={designTokens["cartesian-grid"].color.value}
      strokeWidth={designTokens["cartesian-grid"]["stroke-width"].value}
    />
  );
});

export const TypedChartGrid = () => ChartGrid as ComponentType<ChartGridProps>;

export default ChartGrid;
