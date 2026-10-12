import type { StackId } from "recharts/types/util/ChartUtils";
import { useCartesianChartContext } from "@/components/CartesianChart/context";

/**
 * Scopes a stack ID to the surrounding chart, so that charts on the same page
 * using the same stack ID do not share the DOM IDs Recharts derives from it.
 */
export const useScopedStackId = (
  stackId: StackId | undefined,
): string | undefined => {
  const { stackIdPrefix } = useCartesianChartContext();
  return stackId === undefined ? undefined : `${stackIdPrefix}${stackId}`;
};
