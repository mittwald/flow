import type { FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";

export type YAxisProps = Omit<
  Recharts.YAxisProps,
  "fontFamily" | "fontSize" | "tick" | "tickMargin" | "tickSize"
>;

export const YAxis: FC<YAxisProps> = (props) => {
  const { orientation, ...rest } = props;

  return (
    <Recharts.YAxis
      fontFamily="Inter"
      fontSize={tokens.axis["font-size"].value}
      orientation={orientation}
      tick={{
        fill: tokens.axis["text-color"].value,
      }}
      tickMargin={parseInt(tokens.axis.spacing.value)}
      tickSize={parseInt(tokens.axis["tick-size"].value)}
      {...rest}
    />
  );
};

export default YAxis;
