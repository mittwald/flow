import styles from "@/components/ProgressBar/ProgressBar.module.scss";
import type { CSSProperties, FC } from "react";
import type { ProgressBarProps } from "@/components/ProgressBar";
import { getCategoricalColorByIndex } from "@/lib/tokens/getCategoricalColorByIndex";
import { isCategoricalColor } from "@/lib/tokens/isCategoricalColor";

interface Props extends Pick<ProgressBarProps, "segments"> {
  percentage?: number;
}

export const ProgressBarBar: FC<Props> = (props) => {
  const { segments, percentage } = props;

  const segmentFill =
    segments && segments.length > 0
      ? segments.map((s, i) => {
          const backgroundColor = !s.color
            ? `var(--color--categorical--${getCategoricalColorByIndex(i)})`
            : isCategoricalColor(s.color)
              ? `var(--color--categorical--${s.color})`
              : s.color;

          return (
            <div
              key={s.title}
              aria-hidden
              className={styles.segment}
              style={
                {
                  backgroundColor,
                  "--progress-bar--segment-value": s.value,
                } as CSSProperties
              }
            />
          );
        })
      : null;

  return (
    <div className={styles.bar}>
      <div
        className={styles.fill}
        style={{ "--progress-bar--percentage": percentage } as CSSProperties}
      >
        {segmentFill}
      </div>
    </div>
  );
};
