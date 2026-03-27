import type { FC } from "react";
import * as Recharts from "recharts";
import { useDesignTokens } from "../../../../lib/theming";

export type CartesianGridProps = Pick<
  Recharts.CartesianGridProps,
  "className" | "vertical" | "horizontal" | "strokeDasharray"
>;

/** @flr-generate all */
export const CartesianGrid: FC<CartesianGridProps> = (props) => {
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

export default CartesianGrid;
