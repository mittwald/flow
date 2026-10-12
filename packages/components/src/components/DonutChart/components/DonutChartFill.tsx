import type { CSSProperties, FC } from "react";
import styles from "@/components/DonutChart/DonutChart.module.scss";
import type { DonutChartProps } from "@/components/DonutChart";
import { getCategoricalColorByIndex } from "@/lib/tokens/getCategoricalColorByIndex";
import { isCategoricalColor } from "@/lib/tokens/isCategoricalColor";

interface Props extends Pick<DonutChartProps, "segments"> {
  center: number;
  value?: number;
  radius: number;
  maxValue: number;
}

/**
 * `pathLength="100"` measures the stroke in percent, so the stylesheet draws
 * and rotates each circle from its share and its offset alone – and the load-in
 * keyframes can grow every segment out of 12 o'clock.
 */
const fillStyle = (percent: number, offsetPercent: number): CSSProperties => ({
  "--donut-chart--percent": percent,
  "--donut-chart--offset": offsetPercent,
});

export const DonutChartFill: FC<Props> = (props) => {
  const { center, value = 0, radius, segments, maxValue } = props;

  const percent = (100 / maxValue) * value;

  if (!segments) {
    return (
      <circle
        className={styles.fill}
        cx={center}
        cy={center}
        r={radius}
        pathLength={100}
        style={fillStyle(percent, 0)}
      />
    );
  }

  let offsetPercent = 0;

  return segments.map((s, i) => {
    const segmentPercent = (100 / maxValue) * s.value;

    const currentOffsetPercent = offsetPercent;

    offsetPercent = offsetPercent + segmentPercent;

    const color =
      !s.color || isCategoricalColor(s.color)
        ? `var(--color--categorical--${s.color ?? getCategoricalColorByIndex(i)})`
        : s.color;

    // Index keys: a segment added after mount animates alone out of 12 o'clock,
    // over the segments already there.
    return (
      <circle
        key={i}
        className={styles.segment}
        cx={center}
        cy={center}
        r={radius}
        pathLength={100}
        stroke={color}
        style={fillStyle(segmentPercent, currentOffsetPercent)}
      />
    );
  });
};
