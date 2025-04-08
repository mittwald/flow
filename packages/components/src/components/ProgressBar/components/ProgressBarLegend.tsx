import styles from "@/components/ProgressBar/ProgressBar.module.scss";
import React, { type FC } from "react";
import { useNumberFormatter } from "react-aria";
import type { ProgressBarProps } from "@/components/ProgressBar";
import { Legend, LegendItem } from "@/components/Legend";

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
      {segments.map((s) => (
        <LegendItem
          color={s.color}
        >{`${s.title} (${formatOptions ? formatter.format(s.value) : `${s.value} %`})`}</LegendItem>
      ))}
    </Legend>
  );
};
