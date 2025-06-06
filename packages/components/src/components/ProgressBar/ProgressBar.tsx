import * as Aria from "react-aria-components";
import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./ProgressBar.module.scss";
import clsx from "clsx";
import type { PropsWithStatus } from "@/lib/types/props";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { ProgressBarValue } from "@/components/ProgressBar/components/ProgressBarValue";
import { ProgressBarBar } from "@/components/ProgressBar/components/ProgressBarBar";
import { ProgressBarLegend } from "@/components/ProgressBar/components/ProgressBarLegend";
import type { CategoricalColors } from "@/lib/tokens/CategoricalColors";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface ProgressBarProps
  extends PropsWithChildren<Omit<Aria.ProgressBarProps, "children">>,
    PropsWithStatus,
    FlowComponentProps {
  /** Whether the max value should be displayed. */
  showMaxValue?: boolean;
  /** The size variant of the progress bar. @default "m" */
  size?: "s" | "m" | "l";
  /** Divides the fill of the progress bar into segments */
  segments?: { value: number; title: string; color?: CategoricalColors }[];
  /**
   * Whether the legend component is shown when segments are used. @default:
   * true
   */
  showLegend?: boolean;
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const ProgressBar = flowComponent("ProgressBar", (props) => {
  const {
    children,
    className,
    status = "info",
    showMaxValue,
    size = "m",
    segments,
    value,
    formatOptions,
    showLegend = true,
    maxValue,
    ...rest
  } = props;

  const rootClassName = clsx(
    className,
    styles.progressBar,
    styles[`size-${size}`],
    styles[status],
  );

  const propsContext: PropsContext = {
    Label: {
      className: styles.label,
      unstyled: true,
    },
  };

  const segmentsTotalValue = segments
    ? segments.map((s) => s.value).reduce((a, b) => a + b, 0)
    : undefined;

  return (
    <>
      <Aria.ProgressBar
        className={rootClassName}
        value={segmentsTotalValue ?? value}
        formatOptions={formatOptions}
        maxValue={maxValue}
        {...rest}
      >
        {({ percentage }) => (
          <PropsContextProvider props={propsContext}>
            {children}

            <ProgressBarValue
              showMaxValue={showMaxValue}
              maxValue={maxValue}
              formatOptions={formatOptions}
              value={segmentsTotalValue ?? value}
            />

            <ProgressBarBar
              percentage={percentage}
              segmentsTotalValue={segmentsTotalValue}
              segments={segments}
            />

            <ProgressBarLegend
              showLegend={showLegend}
              segments={segments}
              formatOptions={formatOptions}
            />
          </PropsContextProvider>
        )}
      </Aria.ProgressBar>
    </>
  );
});

export default ProgressBar;
