import styles from "../DonutChart.module.scss";
import { Children, type FC } from "react";
import { useNumberFormatter } from "react-aria";
import type { DonutChartProps } from "@/components/DonutChart";
import { Text } from "@/components/Text";

interface Props extends Pick<DonutChartProps, "formatOptions" | "children"> {
  value?: number;
}

/* `Text` lets a props context, like the content color of an `AccentBox`, reach
   the value. */
export const DonutChartValue: FC<Props> = (props) => {
  const { value = 0, formatOptions, children } = props;

  const formatter = useNumberFormatter(formatOptions);

  if (Children.toArray(children).length > 0) {
    return <Text className={styles.value}>{children}</Text>;
  }

  const formattedValue = formatOptions ? formatter.format(value) : `${value} %`;

  return (
    <Text className={styles.value}>
      <strong>{formattedValue}</strong>
    </Text>
  );
};
