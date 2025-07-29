import styles from "@/components/ProgressBar/ProgressBar.module.scss";
import React, { type FC } from "react";
import type { ProgressBarProps } from "@/components/ProgressBar";
import { getCategoricalColorByIndex } from "@/lib/tokens/getCategoricalColorByIndex";

interface Props extends Pick<ProgressBarProps, "segments"> {
  percentage?: number;
  segmentsTotalValue: number;
}

export const ProgressBarBar: FC<Props> = (props) => {
  const { segments, segmentsTotalValue, percentage } = props;

  const segmentFill =
    segments?.map((s, i) => (
      <div
        key={s.title}
        aria-hidden
        style={{
          backgroundColor: `var(--color--categorical--${s.color ?? getCategoricalColorByIndex(i)})`,
          width: (100 / segmentsTotalValue) * s.value + "%",
          height: "100%",
        }}
      />
    )) ?? 0;

  return (
    <div className={styles.bar}>
      <div className={styles.fill} style={{ width: percentage + "%" }}>
        {segmentFill}
      </div>
    </div>
  );
};
