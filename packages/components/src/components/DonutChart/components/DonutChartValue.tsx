import styles from "../DonutChart.module.scss";
import { Children, type FC } from "react";
import { useNumberFormatter } from "react-aria";
import { percentFormatOptions } from "@/lib/numbers/percentFormatOptions";
import type { DonutChartProps } from "@/components/DonutChart";

interface Props extends Pick<DonutChartProps, "formatOptions" | "children"> {
  value?: number;
}

export const DonutChartValue: FC<Props> = (props) => {
  const { value = 0, formatOptions, children } = props;

  const formatter = useNumberFormatter(formatOptions ?? percentFormatOptions);

  if (Children.toArray(children).length > 0) {
    return <span className={styles.value}>{children}</span>;
  }

  const formattedValue = formatter.format(value);

  return (
    <span className={styles.value}>
      <strong>{formattedValue}</strong>
    </span>
  );
};
