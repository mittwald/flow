import React, { type FC, Suspense } from "react";
import { Tooltip, type TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { TooltipContent } from "@/components/CartesianChart/components/ChartTooltip/TooltipContent";
import clsx from "clsx";
import styles from "./ChartTooltip.module.scss";
import LoadingSpinnerView from "@/views/LoadingSpinnerView";
import type { ChartDataValue } from "@/components/CartesianChart/types";
import type { WithTooltipFormatters } from "@/components/CartesianChart/components/ChartTooltip/types";

export { TypedChartTooltip } from "./types";

export interface ChartTooltipProps<
  TData extends ChartDataValue = ChartDataValue,
  XAxisDataKey extends keyof TData = keyof TData,
>
  extends
    Pick<
      TooltipProps<ValueType, NameType>,
      "wrapperClassName" | "allowEscapeViewBox"
    >,
    WithTooltipFormatters<TData, XAxisDataKey> {
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

export default ChartTooltip;
