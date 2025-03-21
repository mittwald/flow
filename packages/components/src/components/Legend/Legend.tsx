import type { FC } from "react";
import * as Recharts from "recharts";
import LegendContent from "./components/LegendContent/LegendContent";

export type LegendFormatter = (text: string) => string;

export interface WithLegendFormatters {
  /**
   * A formatter function for the texts of the Legend. Can be used for purposes
   * like translations.
   */
  formatter?: LegendFormatter;
}

export type LegendProps = Pick<
  Recharts.LegendProps,
  "className" | "verticalAlign"
> &
  WithLegendFormatters;

/** @flr-generate all */
export const Legend: FC<LegendProps> = (props) => {
  const { formatter, ...rest } = props;

  return (
    <Recharts.Legend
      {...rest}
      content={<LegendContent formatter={formatter} />}
    />
  );
};

export default Legend;
