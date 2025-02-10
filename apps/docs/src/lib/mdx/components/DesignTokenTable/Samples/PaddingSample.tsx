import type { FC } from "react";
import clsx from "clsx";
import styles from "./Sample.module.scss";

interface SampleProps {
  value: string;
}

export const PaddingSample: FC<SampleProps> = (props) => {
  const { value } = props;

  return (
    <div
      className={clsx(styles.wrapper, styles.padding)}
      style={{
        padding: value,
      }}
    >
      <div className={clsx(styles.content, styles.padding)}>Content</div>
    </div>
  );
};
