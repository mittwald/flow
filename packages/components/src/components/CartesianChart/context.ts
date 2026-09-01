import { createContext, useContext } from "react";
import type { CartesianChartLayout } from "@/components/CartesianChart/types";

interface CartesianChartContext {
  layout: CartesianChartLayout;
}

const cartesianChartContext = createContext<CartesianChartContext>({
  layout: "horizontal",
});

export const useCartesianChartContext = (): CartesianChartContext =>
  useContext(cartesianChartContext);

export const CartesianChartContextProvider = cartesianChartContext.Provider;
