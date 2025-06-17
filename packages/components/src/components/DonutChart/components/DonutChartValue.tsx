import styles from "../DonutChart.module.scss";
import React, { type FC, type ReactNode } from "react";
import { useNumberFormatter } from "react-aria";
import type { DonutChartProps } from "@/components/DonutChart";

interface Props extends Pick<DonutChartProps, "formatOptions"> {
  value?: number;
  valueText?: ReactNode;
}

export const DonutChartValue: FC<Props> = (props) => {
  const { value = 0, formatOptions, valueText } = props;

  const formatter = useNumberFormatter(formatOptions);

  if (valueText) {
    return <span className={styles.value}>{valueText}</span>;
  }

  const formattedValue = formatOptions ? formatter.format(value) : `${value} %`;

  return (
    <span className={styles.value}>
      <b>{formattedValue}</b>
    </span>
  );
};
