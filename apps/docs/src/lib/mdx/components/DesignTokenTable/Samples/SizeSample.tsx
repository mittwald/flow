import type { FC } from "react";
import clsx from "clsx";
import styles from "./Sample.module.scss";

interface SampleProps {
  value: string;
}

export const SizeSample: FC<SampleProps> = (props) => {
  const { value } = props;

  return (
    <div
      className={clsx(styles.box, styles.filled)}
      style={{
        width: value,
      }}
    />
  );
};
