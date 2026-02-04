import React, { type FC } from "react";
import type { TooltipProps } from "recharts";
import { Tooltip } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import Heading from "@/components/Heading";
import styles from "./ChartTooltip.module.scss";
import clsx from "clsx";
import { useResolvedLabel } from "@/components/CartesianChart/hooks/useResolvedLabel";
import {
  TooltipLegendItem,
  type TooltipPayloadItem,
} from "@/components/CartesianChart/components/ChartTooltip/TooltipLegendItem";

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
  headingFormatter = (label) => String(label),
  formatter,
}) => {
  return (
    <Tooltip
      cursor={false}
      content={(props) => {
        const { label, payload, active, wrapperClassName } = props;

        const className = clsx(wrapperClassName, styles.tooltip);
        const formattedLabel = useResolvedLabel(headingFormatter, [label]);

        if (!active || !payload || payload.length === 0) {
          return null;
        }

        const items = payload
          .filter((item) => item.fill !== "none")
          .map((item, index) => {
            return (
              <TooltipLegendItem
                key={item.dataKey}
                formatter={formatter}
                item={item}
                index={index}
              />
            );
          });

        return (
          <div className={className}>
            <Heading level={4}>{formattedLabel}</Heading>
            {items}
          </div>
        );
      }}
    />
  );
};

export default ChartTooltip;
