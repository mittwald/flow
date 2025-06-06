import styles from "@/components/ProgressBar/ProgressBar.module.scss";
import React, { type FC, type ReactNode } from "react";
import { useLocalizedStringFormatter, useNumberFormatter } from "react-aria";
import locales from "../locales/*.locale.json";
import type { ProgressBarProps } from "@/components/ProgressBar";

interface Props
  extends Pick<
    ProgressBarProps,
    "showMaxValue" | "maxValue" | "formatOptions"
  > {
  value?: number;
  valueLabel?: ReactNode;
}

export const ProgressBarValue: FC<Props> = (props) => {
  const { showMaxValue, maxValue, value, formatOptions, valueLabel } = props;

  const formatter = formatOptions
    ? useNumberFormatter(formatOptions)
    : undefined;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const maxValueText =
    !showMaxValue || !maxValue
      ? undefined
      : formatter
        ? formatter.format(maxValue)
        : `${maxValue} %`;

  const valueText = !value
    ? undefined
    : formatter
      ? formatter.format(value)
      : `${value} %`;

  const textWithMaxValue = `${value} ${stringFormatter.format("progressBar.of")} ${maxValueText}`;

  return (
    <span className={styles.value}>
      {valueLabel ?? (maxValueText ? textWithMaxValue : valueText)}
    </span>
  );
};
