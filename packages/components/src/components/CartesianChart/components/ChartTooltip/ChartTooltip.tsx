import type { FC } from "react";
import * as Recharts from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { TooltipContent } from "./TooltipContent";

export type TooltipLineFormatter = (
  value: ValueType,
  name: NameType,
  index: number,
  unit?: string | number,
) => string;

export type TooltipHeadingFormatter = (
  title: string | number | undefined,
) => string;

export interface WithTooltipFormatters {
  /**
   * A formatter function for the lines in the tooltip. Can be used for purposes
   * like translations.
   */
  formatter?: TooltipLineFormatter;
  /**
   * A formatter function for the heading of the tooltip. Can be used for
   * purposes like translations.
   */
  headingFormatter?: TooltipHeadingFormatter;
}

export interface ChartTooltipProps
  extends Pick<
      Recharts.TooltipProps<ValueType, NameType>,
      "wrapperClassName" | "allowEscapeViewBox"
    >,
    WithTooltipFormatters {}

/** @flr-generate all */
export const ChartTooltip: FC<ChartTooltipProps> = (props) => {
  const { formatter, headingFormatter, ...rest } = props;
  return (
    <Recharts.Tooltip
      {...rest}
      content={(props) => {
        const {
          formatter: ignoredFormatter,
          labelFormatter: ignoredLabelFormatter,
          ...rest
        } = props;

        return (
          <TooltipContent
            formatter={formatter}
            headingFormatter={headingFormatter}
            {...rest}
          />
        );
      }}
      cursor={false}
    />
  );
};

export default ChartTooltip;
