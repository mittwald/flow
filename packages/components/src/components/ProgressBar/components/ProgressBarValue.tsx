import styles from "@/components/ProgressBar/ProgressBar.module.scss";
import { type FC, type ReactNode } from "react";
import { useNumberFormatter } from "react-aria";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import { percentFormatOptions } from "@/lib/numbers/percentFormatOptions";
import locales from "../locales/*.locale.json";
import type { ProgressBarProps } from "@/components/ProgressBar";

interface Props extends Pick<
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

  const formatter = useNumberFormatter(formatOptions ?? percentFormatOptions);

  const stringFormatter = useLocalizedStringFormatter(locales, "ProgressBar");

  const maxValueText =
    showMaxValue && maxValue ? formatter.format(maxValue) : undefined;

  const valueText = formatter.format(value);

  const textWithMaxValue = `${valueText} ${stringFormatter.format("progressBar.of")} ${maxValueText}`;

  return (
    <span className={styles.value}>
      {valueLabel ?? (maxValueText ? textWithMaxValue : valueText)}
    </span>
  );
};
