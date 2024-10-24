import type { FC } from "react";
import clsx from "clsx";
import styles from "./Sample.module.scss";

interface SampleProps {
  value: string;
}

export const MarginSample: FC<SampleProps> = (props) => {
  const { value } = props;

  return (
    <div
      className={clsx(styles.wrapper, styles.margin)}
      style={{
        padding: value,
      }}
    >
      <div className={clsx(styles.content, styles.margin)} />
    </div>
  );
};
