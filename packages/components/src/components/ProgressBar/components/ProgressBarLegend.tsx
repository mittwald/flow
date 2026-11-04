import styles from "@/components/ProgressBar/ProgressBar.module.scss";
import { type FC } from "react";
import { useNumberFormatter } from "react-aria";
import { percentFormatOptions } from "@/lib/numbers/percentFormatOptions";
import type { ProgressBarProps } from "@/components/ProgressBar";
import { Legend, LegendItem } from "@/components/Legend";
import { getCategoricalColorByIndex } from "@/lib/tokens/getCategoricalColorByIndex";

type Props = Pick<
  ProgressBarProps,
  "segments" | "showLegend" | "formatOptions"
>;

export const ProgressBarLegend: FC<Props> = (props) => {
  const { segments, showLegend, formatOptions } = props;

  const formatter = useNumberFormatter(formatOptions ?? percentFormatOptions);

  if (!segments || !showLegend) {
    return null;
  }

  return (
    <Legend className={styles.legend}>
      {segments.map((segment, index) => (
        <LegendItem
          key={segment.title}
          color={segment.color ?? getCategoricalColorByIndex(index)}
        >
          {`${segment.title} (${segment.valueText ?? formatter.format(segment.value)})`}
        </LegendItem>
      ))}
    </Legend>
  );
};
