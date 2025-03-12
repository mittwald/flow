import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import * as Recharts from "recharts";
import type { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";
import tokens from "@mittwald/flow-design-tokens/variables.json";
import type { FC } from "react";

export const categoricalColors = Object.keys(
  tokens.color.categorical,
) as (keyof typeof tokens.color.categorical)[];
export type CategoricalColors = (typeof categoricalColors)[number];

export interface AreaChartProps
  extends Omit<CategoricalChartProps, "style">,
    FlowComponentProps {}

/** @flr-generate all */
export const AreaChart: FC<AreaChartProps> = (props) => {
  const { children, ...rest } = props;

  return (
    <Recharts.ResponsiveContainer width="100%" height="100%">
      <Recharts.AreaChart {...rest}>{children}</Recharts.AreaChart>
    </Recharts.ResponsiveContainer>
  );
};

export default AreaChart;
