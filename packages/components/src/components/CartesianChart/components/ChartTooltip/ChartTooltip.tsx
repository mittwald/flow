import React, { type FC, Suspense } from "react";
import { Tooltip, type TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { type TooltipPayloadItem } from "@/components/CartesianChart/components/ChartTooltip/TooltipLegendItem";
import { TooltipContent } from "@/components/CartesianChart/components/ChartTooltip/TooltipContent";
import clsx from "clsx";
import styles from "./ChartTooltip.module.scss";
import LoadingSpinnerView from "@/views/LoadingSpinnerView";

export type TooltipLineFormatter = (
  value: TooltipPayloadItem["value"],
  name: TooltipPayloadItem["dataKey"],
  index: number,
  unit?: TooltipPayloadItem["unit"],
) => Promise<string> | string;

export type TooltipHeadingFormatter = (
  title: string | number | undefined,
) => Promise<string> | string;

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
  extends
    Pick<
      TooltipProps<ValueType, NameType>,
      "wrapperClassName" | "allowEscapeViewBox"
    >,
    WithTooltipFormatters {}

/** @flr-generate all */
export const ChartTooltip: FC<ChartTooltipProps> = ({
  headingFormatter,
  formatter,
}) => {
  return (
    <Tooltip
      cursor={false}
      content={(props) => {
        if (!props.active || !props.payload || props.payload.length === 0) {
          return null;
        }

        const className = clsx(props.wrapperClassName, styles.tooltip);
        return (
          <div className={className}>
            <Suspense fallback={<LoadingSpinnerView />}>
              <TooltipContent
                {...props}
                headingFormatter={headingFormatter}
                formatter={formatter}
              />
            </Suspense>
          </div>
        );
      }}
    />
  );
};

export default ChartTooltip;
