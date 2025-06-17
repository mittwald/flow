import type { FC, ReactNode } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./DonutChart.module.scss";
import type { PropsWithStatus } from "@/lib/types/props";
import type { CategoricalColors } from "@/lib/tokens/CategoricalColors";
import { DonutChartValue } from "@/components/DonutChart/components/DonutChartValue";
import { Donut } from "@/components/DonutChart/components/Donut";
import { Wrap } from "@/components/Wrap";
import { DonutChartLegend } from "@/components/DonutChart/components/DonutChartLegend";

export interface DonutChartSegment {
  value: number;
  title: string;
  color?: CategoricalColors;
  valueText?: string;
}

export interface DonutChartProps
  extends Omit<Aria.ProgressBarProps, "children" | "valueLabel">,
    PropsWithStatus {
  /** The size variant of the donut chart. @default "m" */
  size?: "m" | "l";
  /** Divides the fill of the donut chart into segments */
  segments?: DonutChartSegment[];
  /** An optional text to be displayed instead of the formatted value */
  valueText?: ReactNode;
  /**
   * Whether the legend component is shown when segments are used. @default:
   * true
   */
  showLegend?: boolean;
  /** The position of the legend. @default "right" */
  legendPosition?: "top" | "left" | "bottom" | "right";
}

/** @flr-generate all */
export const DonutChart: FC<DonutChartProps> = (props) => {
  const {
    size = "m",
    status = "info",
    className,
    value,
    segments,
    maxValue,
    formatOptions,
    valueText,
    showLegend = true,
    legendPosition = "right",
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.donutChart,
    size === "l" && styles["size-l"],
    styles[status],
    className,
  );

  const segmentsTotalValue = segments
    ? segments.map((s) => s.value).reduce((a, b) => a + b, 0)
    : undefined;

  return (
    <Wrap if={showLegend && segments}>
      <div className={clsx(styles.donutChartContainer, styles[legendPosition])}>
        <Aria.ProgressBar
          className={rootClassName}
          value={segmentsTotalValue ?? value}
          {...rest}
        >
          <Donut
            value={segmentsTotalValue ?? value}
            segments={segments}
            size={size}
            maxValue={maxValue}
          />
          <DonutChartValue
            value={segmentsTotalValue ?? value}
            formatOptions={formatOptions}
            valueText={valueText}
          />
        </Aria.ProgressBar>

        {showLegend && segments && (
          <DonutChartLegend
            showLegend={showLegend}
            segments={segments}
            formatOptions={formatOptions}
          />
        )}
      </div>
    </Wrap>
  );
};

export default DonutChart;
