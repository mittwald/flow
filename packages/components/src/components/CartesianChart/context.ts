import { createContext, useContext } from "react";
import type { CartesianChartLayout } from "@/components/CartesianChart/types";

interface CartesianChartContext {
  layout: CartesianChartLayout;
  /**
   * Prefix that scopes a stack ID to this chart. Recharts derives DOM IDs from
   * the stack ID, so two charts on one page sharing a stack ID would otherwise
   * share their clip paths.
   */
  stackIdPrefix: string;
}

const cartesianChartContext = createContext<CartesianChartContext>({
  layout: "horizontal",
  stackIdPrefix: "",
});

export const useCartesianChartContext = (): CartesianChartContext =>
  useContext(cartesianChartContext);

export const CartesianChartContextProvider = cartesianChartContext.Provider;
