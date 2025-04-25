import styles from "@/components/ProgressBar/ProgressBar.module.scss";
import React from "react";
import type { FC } from "react";
import { useLocalizedStringFormatter, useNumberFormatter } from "react-aria";
import locales from "../locales/*.locale.json";
import type { ProgressBarProps } from "@/components/ProgressBar";

interface Props
  extends Pick<
    ProgressBarProps,
    "showMaxValue" | "maxValue" | "formatOptions"
  > {
  valueText?: string;
}

export const ProgressBarValue: FC<Props> = (props) => {
  const { showMaxValue, maxValue, valueText, formatOptions } = props;

  const formatter = useNumberFormatter(formatOptions);

  const stringFormatter = useLocalizedStringFormatter(locales);

  const maxValueText =
    showMaxValue && maxValue ? formatter.format(maxValue) : undefined;

  return (
    <span className={styles.value}>
      {maxValueText
        ? `${valueText} ${stringFormatter.format("progressBar.of")} ${maxValueText}`
        : valueText}
    </span>
  );
};
