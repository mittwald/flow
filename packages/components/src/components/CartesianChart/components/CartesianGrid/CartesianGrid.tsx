import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { ChartGrid, type ChartGridProps } from "@/components/CartesianChart";
import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";

/** @deprecated Use ChartGridProps */
export type CartesianGridProps = ChartGridProps;

/**
 * @deprecated Use ChartGrid
 * @flr-generate all
 */
export const CartesianGrid = flowComponent(
  "CartesianGrid",
  (props) => {
    const warnDeprecation = useWarnDeprecation();

    warnDeprecation(
      "The 'CartesianGrid' component is deprecated and will be removed in a future release. Use 'ChartGrid' instead.",
    );

    return <ChartGrid {...props} />;
  },
  /* CartesianGrid only stands in for `ChartGrid`, whose props contexts keep reaching it. */
  { type: "layout" },
);
