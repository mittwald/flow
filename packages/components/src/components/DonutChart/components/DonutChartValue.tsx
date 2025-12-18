import styles from "../DonutChart.module.scss";
import React, { type FC } from "react";
import { useNumberFormatter } from "react-aria";
import type { DonutChartProps } from "@/components/DonutChart";

interface Props extends Pick<DonutChartProps, "formatOptions" | "children"> {
  value?: number;
}

export const DonutChartValue: FC<Props> = (props) => {
  const { value = 0, formatOptions, children } = props;

  const formatter = useNumberFormatter(formatOptions);

  if (children) {
    return <span className={styles.value}>{children}</span>;
  }

  const formattedValue = formatOptions ? formatter.format(value) : `${value} %`;

  return (
    <span className={styles.value}>
      <strong>{formattedValue}</strong>
    </span>
  );
};
