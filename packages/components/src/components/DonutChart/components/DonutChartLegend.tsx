import styles from "../DonutChart.module.scss";
import { type FC } from "react";
import { useNumberFormatter } from "react-aria";
import { percentFormatOptions } from "@/lib/numbers/percentFormatOptions";
import { Legend, LegendItem } from "@/components/Legend";
import { getCategoricalColorByIndex } from "@/lib/tokens/getCategoricalColorByIndex";
import type { DonutChartProps } from "@/components/DonutChart";

type Props = Pick<DonutChartProps, "segments" | "showLegend" | "formatOptions">;

export const DonutChartLegend: FC<Props> = (props) => {
  const { segments, showLegend, formatOptions } = props;

  const formatter = useNumberFormatter(formatOptions ?? percentFormatOptions);

  if (!segments || !showLegend) {
    return null;
  }

  return (
    <Legend className={styles.legend}>
      {segments.map((s, i) => (
        <LegendItem
          key={s.title}
          color={s.color ?? getCategoricalColorByIndex(i)}
        >{`${s.title} (${s.valueText ?? formatter.format(s.value)})`}</LegendItem>
      ))}
    </Legend>
  );
};
