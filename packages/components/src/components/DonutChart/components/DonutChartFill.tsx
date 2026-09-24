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
 * The rotation is a custom property instead of a `transform` attribute so that
 * the load-in keyframes can animate it – growing every segment out of 12
 * o'clock instead of leaving gaps between them. They need the circumference,
 * too, to animate out of an empty circle.
 */
const fillStyle = (rotation: number, circumference: number) =>
  ({
    "--donut-chart--fill-rotation": `${rotation}deg`,
    "--donut-chart--circumference": circumference,
  }) as CSSProperties;

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
        style={fillStyle(-90, circumference)}
      />
    );
  }

  let rotationOffset = 0;

  return segments.map((s, i) => {
    const segmentPercent = (100 / maxValue) * s.value;

    const currentRotationOffset = rotationOffset;

    rotationOffset = rotationOffset + (360 / 100) * segmentPercent;

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
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={
          circumference - (segmentPercent / 100) * circumference
        }
        stroke={color}
        style={fillStyle(-90 + currentRotationOffset, circumference)}
      />
    );
  });
};
