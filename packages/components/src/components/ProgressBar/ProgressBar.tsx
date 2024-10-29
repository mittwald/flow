import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./ProgressBar.module.scss";
import clsx from "clsx";
import { useLocalizedStringFormatter, useNumberFormatter } from "react-aria";
import type { PropsWithStatus } from "@/lib/types/props";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import locales from "./locales/*.locale.json";

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
  );

  const stringFormatter = useLocalizedStringFormatter(locales);

  const formatter = useNumberFormatter(props.formatOptions);

  const maxValueText =
    showMaxValue && props.maxValue
      ? formatter.format(props.maxValue)
      : undefined;

  const propsContext: PropsContext = {
    Label: {
      className: styles.label,
      unstyled: true,
    },
  };

  return (
    <Aria.ProgressBar className={rootClassName} {...rest}>
      {({ percentage, valueText }) => (
        <PropsContextProvider props={propsContext}>
          {children}
          <span className={styles.value}>
            {maxValueText
              ? `${valueText} ${stringFormatter.format("progressBar.of")} ${maxValueText}`
              : valueText}
          </span>
          <div className={styles.bar}>
            <div className={styles.fill} style={{ width: percentage + "%" }} />
          </div>
        </PropsContextProvider>
      )}
    </Aria.ProgressBar>
  );
};

export default ProgressBar;
