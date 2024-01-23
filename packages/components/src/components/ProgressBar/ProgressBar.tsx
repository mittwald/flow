import * as Aria from "react-aria-components";
import React, { FC, PropsWithChildren } from "react";
import styles from "./ProgressBar.module.css";
import clsx from "clsx";
import { StatusVariantProps } from "@/lib/types/props";
import { useNumberFormatter } from "react-aria";

export interface ProgressBarProps
  extends PropsWithChildren<Omit<Aria.ProgressBarProps, "children">>,
    StatusVariantProps {}

export const ProgressBar: FC<ProgressBarProps> = (props) => {
  const { children, className, variant = "info", ...rest } = props;

  const rootClassName = clsx(className, styles.root, styles[variant]);

  const formatter = useNumberFormatter(props.formatOptions);

  const maxValueText = props.maxValue
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
