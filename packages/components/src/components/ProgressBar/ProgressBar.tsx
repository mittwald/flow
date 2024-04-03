import * as Aria from "react-aria-components";
import React, { FC, PropsWithChildren } from "react";
import styles from "./ProgressBar.module.scss";
import clsx from "clsx";
import { useNumberFormatter } from "react-aria";
import { PropsWithStatus } from "@/lib/types/props";

export interface ProgressBarProps
  extends PropsWithChildren<Omit<Aria.ProgressBarProps, "children">>,
    PropsWithStatus {
  showMaxValue?: boolean;
  /** @default "m" */
  size?: "s" | "m";
}

export const ProgressBar: FC<ProgressBarProps> = (props) => {
  const {
    children,
    className,
    status = "info",
    showMaxValue,
    size = "m",
    ...rest
  } = props;

  const rootClassName = clsx(
    className,
    styles.progressBar,
    styles[`size-${size}`],
    styles[status],
    styles[`size-${size}`],
  );

  const formatter = useNumberFormatter(props.formatOptions);

  const maxValueText =
    showMaxValue && props.maxValue
      ? formatter.format(props.maxValue)
      : undefined;

  return (
    <Aria.ProgressBar className={rootClassName} {...rest}>
      {({ percentage, valueText }) => (
        <>
          {children}
          <span className={styles.value}>
            {maxValueText ? `${valueText} of ${maxValueText}` : valueText}
          </span>
          <div className={styles.bar}>
            <div className={styles.fill} style={{ width: percentage + "%" }} />
          </div>
        </>
      )}
    </Aria.ProgressBar>
  );
};

export default ProgressBar;
