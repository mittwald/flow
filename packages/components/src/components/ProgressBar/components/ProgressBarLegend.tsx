import styles from "@/components/ProgressBar/ProgressBar.module.scss";
import React, { type FC } from "react";
import { useNumberFormatter } from "react-aria";
import type { ProgressBarProps } from "@/components/ProgressBar";
import { Legend, LegendItem } from "@/components/Legend";
import { getCategoricalColorByIndex } from "@/lib/tokens/getCategoricalColorByIndex";

type Props = Pick<
  ProgressBarProps,
  "segments" | "showLegend" | "formatOptions"
>;

export const ProgressBarLegend: FC<Props> = (props) => {
  const { segments, showLegend, formatOptions } = props;

  const formatter = useNumberFormatter(formatOptions);

  if (!segments || !showLegend) {
    return null;
  }

  return (
    <Legend className={styles.legend}>
      {segments.map((s, i) => (
        <LegendItem
          color={s.color ?? getCategoricalColorByIndex(i)}
        >{`${s.title} (${s.textValue ?? (formatOptions ? formatter.format(s.value) : `${s.value} %`)})`}</LegendItem>
      ))}
    </Legend>
  );
};
