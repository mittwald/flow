import styles from "@/components/ProgressBar/ProgressBar.module.scss";
import React, { type FC } from "react";
import type { ProgressBarProps } from "@/components/ProgressBar";
import { getCategoricalColorValue } from "@/lib/tokens/getCategoricalColorValue";

interface Props extends Pick<ProgressBarProps, "segments"> {
  percentage?: number;
  segmentsTotalValue?: number;
}

export const ProgressBarBar: FC<Props> = (props) => {
  const { segments, segmentsTotalValue, percentage } = props;

  return (
    <div className={styles.bar}>
      <div className={styles.fill} style={{ width: percentage + "%" }}>
        {segments &&
          segmentsTotalValue &&
          segments.map((s) => (
            <div
              aria-hidden
              style={{
                backgroundColor: getCategoricalColorValue(s.color),
                width: (segmentsTotalValue / 100) * s.value + "%",
                height: "100%",
              }}
            />
          ))}
      </div>
    </div>
  );
};
