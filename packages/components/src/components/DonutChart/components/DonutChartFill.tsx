import type { FC } from "react";
import styles from "@/components/DonutChart/DonutChart.module.scss";
import type { DonutChartProps } from "@/components/DonutChart";
import { getCategoricalColorByIndex } from "@/lib/tokens/getCategoricalColorByIndex";

interface Props extends Pick<DonutChartProps, "segments"> {
  center: number;
  value?: number;
  radius: number;
  maxValue: number;
}

export const DonutChartFill: FC<Props> = (props) => {
  const { center, value = 0, radius, segments, maxValue } = props;

  const circumference = 2 * radius * Math.PI;

  const percent = (100 / maxValue) * value;

  if (!segments) {
    return (
      <circle
        className={styles.fill}
        cx={center}
        cy={center}
        r={radius}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={circumference - (percent / 100) * circumference}
        transform={`rotate(-90 ${center} ${center})`}
      />
    );
  }

  let rotationOffset = 0;

  return segments.map((s, i) => {
    const segmentPercent = (100 / maxValue) * s.value;

    const currentRotationOffset = rotationOffset;

    rotationOffset = rotationOffset + (360 / 100) * segmentPercent;

    return (
      <circle
        key={i}
        cx={center}
        cy={center}
        r={radius}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={
          circumference - (segmentPercent / 100) * circumference
        }
        stroke={`var(--color--categorical--${s.color ?? getCategoricalColorByIndex(i)})`}
        transform={`rotate(${-90 + currentRotationOffset} ${center} ${center})`}
      />
    );
  });
};
