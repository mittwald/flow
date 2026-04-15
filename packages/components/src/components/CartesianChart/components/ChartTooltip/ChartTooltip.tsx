import React, { type ComponentType, type FC, Suspense } from "react";
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
import type { ChartDataValue } from "@/components/CartesianChart/CartesianChart";

export type TooltipLineFormatter<TData> = (
  value: TData[keyof TData],
  name: keyof TData,
  index: number,
  unit?: TooltipPayloadItem["unit"],
) => Promise<string> | string;

export type TooltipHeadingFormatter<TData> = (
  title: TData[keyof TData],
) => Promise<string> | string;

export type TooltipLProgressBarFormatter<TData> = (
  value: TData[keyof TData],
  unit?: TooltipPayloadItem["unit"],
) => Promise<string> | string;

export interface WithTooltipFormatters<TData> {
  /**
   * A formatter function for the lines in the tooltip. Can be used for purposes
   * like translations.
   */
  formatter?: TooltipLineFormatter<TData>;
  /**
   * A formatter function for the heading of the tooltip. Can be used for
   * purposes like translations.
   */
  headingFormatter?: TooltipHeadingFormatter<TData>;
  /**
   * A formatter function for the progressBar of the tooltip. Can be used for
   * purposes like translations.
   */
  progressBarFormatter?: TooltipLProgressBarFormatter<TData>;
}

export interface ChartTooltipProps<TData = ChartDataValue>
  extends
    Pick<
      TooltipProps<ValueType, NameType>,
      "wrapperClassName" | "allowEscapeViewBox"
    >,
    WithTooltipFormatters<TData> {
  /** Show progress bar for stacked areas @default "true" */
  showProgressBar?: boolean;
}

/** @flr-generate all */
export const ChartTooltip: FC<ChartTooltipProps> = (props) => {
  const {
    headingFormatter,
    formatter,
    showProgressBar = true,
    ...rest
  } = props;

  return (
    <Tooltip
      {...rest}
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
                showProgressBar={showProgressBar}
              />
            </Suspense>
          </div>
        );
      }}
    />
  );
};

export const TypedChartTooltip = <T = ChartDataValue,>() =>
  ChartTooltip as ComponentType<ChartTooltipProps<T>>;

export default ChartTooltip;
