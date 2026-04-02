import styles from "@/components/ProgressBar/ProgressBar.module.scss";
import React, { type FC } from "react";
import type { ProgressBarProps } from "@/components/ProgressBar";
import { getCategoricalColorByIndex } from "@/lib/tokens/getCategoricalColorByIndex";
import { isCategoricalColor } from "@/lib/tokens/isCategoricalColor";

interface Props extends Pick<ProgressBarProps, "segments"> {
  percentage?: number;
  segmentsTotalValue?: number;
}

export const ProgressBarBar: FC<Props> = (props) => {
  const { segments, segmentsTotalValue, percentage } = props;

  const segmentFill =
    segmentsTotalValue && segments && segments?.length > 0
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
              style={{
                backgroundColor,
                width: (100 / segmentsTotalValue) * s.value + "%",
                height: "100%",
              }}
            />
          );
        })
      : null;

  return (
    <div className={styles.bar}>
      <div className={styles.fill} style={{ width: percentage + "%" }}>
        {segmentFill}
      </div>
    </div>
  );
};
