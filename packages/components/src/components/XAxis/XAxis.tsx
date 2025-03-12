import type { FC } from "react";
import * as Recharts from "recharts";
import tokens from "@mittwald/flow-design-tokens/variables.json";

export type XAxisProps = Omit<
  Recharts.XAxisProps,
  "fontFamily" | "fontSize" | "tick" | "tickMargin" | "tickSize"
>;

export const XAxis: FC<XAxisProps> = (props) => {
  const { orientation, ...rest } = props;

  return (
    <Recharts.XAxis
      fontFamily="Inter"
      fontSize={tokens.axis["font-size"].value}
      orientation={orientation}
      tick={{
        fill: tokens.axis["text-color"].value,
      }}
      tickMargin={parseInt(tokens.axis["axis-to-tick-spacing"].value)}
      tickSize={parseInt(tokens.axis["tick-size"].value)}
      {...rest}
    />
  );
};

export default XAxis;
