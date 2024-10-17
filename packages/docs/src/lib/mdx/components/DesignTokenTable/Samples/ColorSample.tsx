import type { FC } from "react";
import clsx from "clsx";
import styles from "./Sample.module.scss";

interface ColorSampleProps {
  value: string;
}

export const ColorSample: FC<ColorSampleProps> = (props) => {
  const { value } = props;

  return (
    <div
      className={clsx(styles.box)}
      style={{
        backgroundColor: value,
      }}
    />
  );
};
