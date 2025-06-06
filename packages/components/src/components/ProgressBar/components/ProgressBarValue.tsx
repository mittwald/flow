import styles from "@/components/ProgressBar/ProgressBar.module.scss";
import React, { type FC } from "react";
import { useLocalizedStringFormatter, useNumberFormatter } from "react-aria";
import locales from "../locales/*.locale.json";
import type { ProgressBarProps } from "@/components/ProgressBar";

interface Props
  extends Pick<
    ProgressBarProps,
    "showMaxValue" | "maxValue" | "formatOptions"
  > {
  value?: number;
}

export const ProgressBarValue: FC<Props> = (props) => {
  const { showMaxValue, maxValue, value, formatOptions } = props;

  const formatter = formatOptions
    ? useNumberFormatter(formatOptions)
    : undefined;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const maxValueText =
    showMaxValue && maxValue && formatter
      ? formatter.format(maxValue)
      : showMaxValue && maxValue
        ? `${maxValue} %`
        : undefined;

  const valueText =
    value && formatter
      ? formatter.format(value)
      : value
        ? `${value} %`
        : undefined;

  return (
    <span className={styles.value}>
      {maxValueText
        ? `${value} ${stringFormatter.format("progressBar.of")} ${maxValueText}`
        : valueText}
    </span>
  );
};
