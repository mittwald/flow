import type { FC } from "react";
import clsx from "clsx";
import styles from "./Sample.module.scss";

interface SampleProps {
  value: string;
}

export const LineHeightSample: FC<SampleProps> = (props) => {
  const { value } = props;

  return (
    <div
      className={clsx(styles.lineHeight)}
      style={{
        lineHeight: value,
      }}
    >
      Aa
    </div>
  );
};
