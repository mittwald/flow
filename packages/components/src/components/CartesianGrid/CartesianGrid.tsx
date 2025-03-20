import type { FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";

export type CartesianGridProps = Pick<
  Recharts.CartesianGridProps,
  "className" | "vertical" | "horizontal" | "strokeDasharray"
>;

/** @flr-generate all */
export const CartesianGrid: FC<CartesianGridProps> = (props) => {
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

export default CartesianGrid;
