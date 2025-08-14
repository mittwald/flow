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
  const {
    showMaxValue,
    maxValue,
    value = 0,
    formatOptions,
    valueLabel,
  } = props;

  const formatter = useNumberFormatter(formatOptions);

  const stringFormatter = useLocalizedStringFormatter(locales);

  const maxValueText =
    !showMaxValue || !maxValue
      ? undefined
      : formatOptions
        ? formatter.format(maxValue)
        : `${maxValue} %`;

  const valueText = formatOptions ? formatter.format(value) : `${value} %`;

  const textWithMaxValue = `${valueText} ${stringFormatter.format("progressBar.of")} ${maxValueText}`;

  return (
    <span className={styles.value}>
      {valueLabel ?? (maxValueText ? textWithMaxValue : valueText)}
    </span>
  );
};
