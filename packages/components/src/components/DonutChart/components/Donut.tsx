import type { FC } from "react";
import styles from "@/components/DonutChart/DonutChart.module.scss";
import { DonutChartFill } from "@/components/DonutChart/components/DonutChartFill";
import { DonutChartValue } from "@/components/DonutChart/components/DonutChartValue";
import type { DonutChartProps } from "@/components/DonutChart";

interface Props
  extends Pick<
    DonutChartProps,
    "segments" | "formatOptions" | "size" | "maxValue" | "valueText"
  > {
  value?: number;
}

export const Donut: FC<Props> = (props) => {
  const {
    value = 0,
    segments,
    formatOptions,
    size,
    maxValue,
    valueText,
  } = props;

  const strokeWidth = 0.5;
  const fillWidth = size === "m" ? 8 : 12;
  const center = fillWidth * 4;
  const radius = center - fillWidth / 2;

  return (
    <>
      <svg
        width={center * 4}
        height={center * 4}
        viewBox={`0 0 ${center * 2} ${center * 2}`}
        fill="none"
        strokeWidth={fillWidth}
      >
        <circle
          className={styles.background}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={fillWidth}
        />
        <circle
          className={styles.border}
          cx={center}
          cy={center}
          r={center - strokeWidth / 2}
          strokeWidth={strokeWidth}
        />
        <circle
          className={styles.border}
          cx={center}
          cy={center}
          r={center - fillWidth + strokeWidth / 2}
          strokeWidth={strokeWidth}
        />

        <DonutChartFill
          radius={radius}
          center={center}
          value={value}
          segments={segments}
          maxValue={maxValue ?? 100}
        />
      </svg>
      <DonutChartValue
        value={value}
        formatOptions={formatOptions}
        valueText={valueText}
      />
    </>
  );
};
