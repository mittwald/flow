import type { FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";

export type CartesianGridProps = Omit<
  Recharts.CartesianGridProps,
  "content" | "contentStyle" | "stroke" | "strokeWidth"
>;

export const CartesianGrid: FC<CartesianGridProps> = (props) => {
  const { vertical = false, ...rest } = props;

  return (
    <Recharts.CartesianGrid
      {...rest}
      vertical={vertical}
      stroke={tokens["cartesian-grid"].color.value}
      strokeWidth={tokens["cartesian-grid"]["stroke-width"].value}
    />
  );
};

export default CartesianGrid;
