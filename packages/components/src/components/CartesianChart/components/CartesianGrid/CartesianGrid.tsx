import { ChartGrid, type ChartGridProps } from "@/components/CartesianChart";
import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";
import type { FC } from "react";

/** @deprecated Use ChartGridProps */
export type CartesianGridProps = ChartGridProps;

/**
 * @deprecated Use ChartGrid
 * @flr-generate all
 */
export const CartesianGrid: FC<CartesianGridProps> = (props) => {
  const warnDeprecation = useWarnDeprecation();

  warnDeprecation(
    "The 'CartesianGrid' component is deprecated and will be removed in a future release. Use 'ChartGrid' instead.",
  );

  return <ChartGrid {...props} />;
};
