import styles from "../DonutChart.module.scss";
import React, { type FC } from "react";
import { useNumberFormatter } from "react-aria";
import type { DonutChartProps } from "@/components/DonutChart";

interface Props extends Pick<DonutChartProps, "formatOptions"> {
  value?: number;
  valueText?: string;
}

export const DonutChartValue: FC<Props> = (props) => {
  const { value = 0, formatOptions, valueText } = props;

  const formatter = useNumberFormatter(formatOptions);

  const formattedValue =
    valueText ?? (formatOptions ? formatter.format(value) : `${value} %`);

  const valueAndUnit = formattedValue.trim().match(/^([\d.,]+)\s*([a-zA-Z]+)$/);

  if (
    formattedValue.includes("%") ||
    !valueAndUnit ||
    !valueAndUnit[1] ||
    !valueAndUnit[2]
  ) {
    return (
      <span className={styles.value}>
        <b>{formattedValue}</b>
      </span>
    );
  }

  return (
    <span className={styles.value}>
      <b>{valueAndUnit[1]}</b>
      <small>{valueAndUnit[2]}</small>
    </span>
  );
};
