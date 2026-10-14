import styles from "@/components/ProgressBar/ProgressBar.module.scss";
import { type FC } from "react";
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

  const formatValue = (value: number) =>
    formatOptions ? formatter.format(value) : `${value} %`;

  return (
    <Legend className={styles.legend}>
      {segments.map((segment, index) => (
        <LegendItem
          key={segment.title}
          color={segment.color ?? getCategoricalColorByIndex(index)}
        >
          {`${segment.title} (${segment.valueText ?? formatValue(segment.value)})`}
        </LegendItem>
      ))}
    </Legend>
  );
};
